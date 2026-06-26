import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../../src/payments/payments.service';
import { PrismaService } from '../../src/prisma/prisma.service';

jest.mock('mercadopago', () => ({
  MercadoPagoConfig: jest.fn().mockImplementation(() => ({})),
  Preference: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({
      init_point: 'https://test.mercadopago.com/init-point',
    }),
  })),
}));

describe('PaymentsService integration', () => {
  let prismaService: any;
  let paymentsService: PaymentsService;

  beforeEach(async () => {
    // Mock de Prisma para pagos, ordenes y productos.
    prismaService = {
      order: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    process.env.MERCADOPAGO_ACCESS_TOKEN = 'test-token';
    process.env.FRONTEND_URL = 'http://localhost:4200';
    process.env.BACKEND_URL = 'http://localhost:3001';

    // Crea el modulo de prueba con el servicio de pagos.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  it('actualiza stock y marca la orden como pagada cuando el webhook llega aprobado', async () => {
    const order = {
      id: 88,
      status: 'PENDING',
      items: [{ productId: 10, quantity: 2 }],
    };

    prismaService.order.findUnique.mockResolvedValue(order);
    prismaService.product.findUnique.mockResolvedValue({ id: 10, stock: 10 });
    prismaService.product.update.mockResolvedValue({ id: 10, stock: 8 });
    prismaService.order.update.mockResolvedValue({ ...order, status: 'PAID' });

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        status: 'approved',
        external_reference: '88',
      }),
    } as any);

    const result = await paymentsService.handleWebhook('pay_123');

    expect(prismaService.product.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { stock: 8 },
    });
    expect(prismaService.order.update).toHaveBeenCalledWith({
      where: { id: 88 },
      data: { status: 'PAID' },
    });
    expect(result).toEqual({ received: true });
  });

  it('crea una preferencia de pago para una orden existente', async () => {
    prismaService.order.findUnique.mockResolvedValue({
      id: 55,
      items: [
        {
          productId: 10,
          quantity: 1,
          price: 5000,
        },
      ],
    });

    const result = await paymentsService.createPayment(55);

    expect(result.init_point).toBeDefined();
    expect(prismaService.order.findUnique).toHaveBeenCalledWith({
      where: { id: 55 },
      include: { items: true },
    });
  });
});