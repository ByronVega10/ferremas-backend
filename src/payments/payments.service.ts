import { Injectable, NotFoundException } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private client: MercadoPagoConfig;
  private preference: Preference;

  constructor(private prisma: PrismaService) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    this.preference = new Preference(this.client);
  }

  async createPayment(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }0

    const response = await this.preference.create({
      body: {
        items: order.items.map(item => ({
          id: `product-${item.productId}`,
          title: `Producto ${item.productId}`,
          quantity: item.quantity,
          unit_price: Number(item.price),
          currency_id: 'CLP',
        })),
        back_urls: {
          success: `${process.env.FRONTEND_URL}/cart?status=success`,
          failure: `${process.env.FRONTEND_URL}/cart?status=failure`,
          pending: `${process.env.FRONTEND_URL}/cart?status=pending`,
        },
        //auto_return: 'approved',
        external_reference: String(order.id),

        notification_url:
          `${process.env.BACKEND_URL}/payments/webhook`,
      },
    });

    return {
      init_point: response.init_point,
    };
  }


  async handleWebhook(paymentId: string) {
    
    if (!paymentId) {
      return { received: true };
    }

    // consultar pago directamente desde la API de MercadoPago
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      },
    );

    const payment = await response.json();

    const status = payment.status;
    const orderId = payment.external_reference;

    if (!orderId) return { received: true };

    const order = await this.prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { items: true },
    });

    if (!order) return { received: true };

    // evitar doble procesamiento
    if (order.status === 'PAID') {
      return { received: true };
    }

    if (status === 'approved') {
      for (const item of order.items) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (product) {
          
          if (product.stock < item.quantity) {
            throw new NotFoundException(
              `Stock insuficiente para ${item.productId}`,
            );
          }
          
          await this.prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: product.stock - item.quantity,
            },
          });
        }
      }

      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });
    }

    return { received: true };
  }
}