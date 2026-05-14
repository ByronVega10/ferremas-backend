import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException(
        'El carrito está vacío',
      );
    }

    let total = 0;

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new BadRequestException(
          `Stock insuficiente para ${item.product.name}`,
        );
      }

      total += item.quantity * item.product.price;
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
      },
    });

    for (const item of cart.items) {
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });

      await this.prisma.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: item.product.stock - item.quantity,
        },
      });
    }

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return {
      message: 'Compra realizada correctamente',
      orderId: order.id,
      total,
    };
  }

  async findOrdersByUser(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOne(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(
        'Orden no encontrada',
      );
    }

    return order;
  }
}