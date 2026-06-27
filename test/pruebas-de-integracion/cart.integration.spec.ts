/*
  Descripcion:
  Esta prueba valida operaciones importantes del carrito,
  como crear el carrito cuando no existe y calcular subtotales.
  Se apoya en mocks de Prisma para revisar el comportamiento
  de lectura y escritura sin usar base de datos real.

  Resultado esperado:
  Cuando no hay carrito, el servicio debe crearlo y luego agregar el item,
  y el subtotal debe coincidir con precios y cantidades esperadas.
  La respuesta final debe conservar el formato que esperan otros módulos.
*/

import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../../src/cart/cart.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('CartService integration', () => {
  let prismaService: any;
  let cartService: CartService;

  beforeEach(async () => {
    // Mock de Prisma para cubrir los casos del carrito sin usar la base real.
    prismaService = {
      cart: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      cartItem: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
      },
    };

    // Arma el modulo de prueba con el servicio y el mock de Prisma.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
  });

  it('crea el carrito y agrega un producto cuando el usuario no tiene carrito', async () => {
    prismaService.cart.findUnique.mockResolvedValue(null);
    prismaService.cart.create.mockResolvedValue({ id: 20, userId: 3 });
    prismaService.cartItem.findFirst.mockResolvedValue(null);
    prismaService.cartItem.create.mockResolvedValue({
      id: 99,
      cartId: 20,
      productId: 5,
      quantity: 2,
    });

    const result = await cartService.addToCart({
      userId: 3,
      productId: 5,
      quantity: 2,
    } as any);

    expect(prismaService.cart.create).toHaveBeenCalledWith({
      data: { userId: 3 },
    });
    expect(prismaService.cartItem.create).toHaveBeenCalledWith({
      data: {
        cartId: 20,
        productId: 5,
        quantity: 2,
      },
    });
    expect(result).toEqual({
      id: 99,
      cartId: 20,
      productId: 5,
      quantity: 2,
    });
  });

  it('devuelve el carrito con subtotal calculado', async () => {
    prismaService.cart.findUnique.mockResolvedValue({
      id: 1,
      userId: 4,
      items: [
        {
          quantity: 2,
          product: { price: 5000 },
        },
      ],
    });

    const result = await cartService.getCart(4);

    expect(result.subtotal).toBe(10000);
  });
});