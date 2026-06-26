import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../../src/orders/orders.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('OrdersService integration', () => {
  let prismaService: any;
  let ordersService: OrdersService;

  beforeEach(async () => {
    // Mock de Prisma para simular carrito, ordenes y productos.
    prismaService = {
      cart: {
        findUnique: jest.fn(),
      },
      order: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    // Crea el modulo de prueba con el servicio de ordenes.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('crea una orden desde el carrito cuando hay stock suficiente', async () => {
    prismaService.cart.findUnique.mockResolvedValue({
      id: 1,
      userId: 4,
      items: [
        {
          productId: 10,
          quantity: 1,
          product: { name: 'Martillo', stock: 10, price: 5000 },
        },
      ],
    });

    prismaService.order.create.mockResolvedValue({ id: 77 });

    const result = await ordersService.checkout(4);

    expect(prismaService.order.create).toHaveBeenCalled();
    expect(result).toEqual({ orderId: 77, total: 5000 });
  });

  it('devuelve una orden cuando pertenece al usuario autenticado', async () => {
    prismaService.order.findUnique.mockResolvedValue({
      id: 77,
      userId: 4,
      total: 5000,
      items: [],
    });

    const result = await ordersService.findOne(77, 4);

    expect(result.id).toBe(77);
    expect(prismaService.order.findUnique).toHaveBeenCalledWith({
      where: { id: 77, userId: 4 },
      include: { items: { include: { product: true } } },
    });
  });
});