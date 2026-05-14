import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(data: any) {
    let cart = await this.prisma.cart.findUnique({
      where: {
        userId: data.userId,
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId: data.userId,
        },
      });
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: data.productId,
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + data.quantity,
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
      },
    });
  }

  async getCart(userId: number) {
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

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const subtotal = cart.items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);

    return {
      ...cart,
      subtotal,
    };
  }

  async updateQuantity(itemId: number, quantity: number) {
    return this.prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
      },
    });
  }

  async removeItem(itemId: number) {
    return this.prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });
  }
}
