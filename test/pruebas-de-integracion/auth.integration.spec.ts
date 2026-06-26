import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('AuthService integration', () => {
  let prismaService: any;
  let authService: AuthService;

  beforeEach(async () => {
    // Mock minimo de Prisma para aislar la logica del servicio.
    prismaService = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
      cart: {
        create: jest.fn(),
      },
    };

    // Crea el modulo de prueba con Prisma y JWT mockeados.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registra un usuario y crea el carrito asociado', async () => {
    const createdUser = {
      id: 1,
      name: 'Ana',
      lastname: 'Garcia',
      email: 'ana@test.com',
      password: 'hashed-password',
      role: 'CUSTOMER',
    };

    // Simula la creacion del usuario y del carrito.
    prismaService.user.create.mockResolvedValue(createdUser);
    prismaService.cart.create.mockResolvedValue({ id: 10, userId: 1 });

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);

    const result = await authService.register({
      name: 'Ana',
      lastname: 'Garcia',
      email: 'ana@test.com',
      password: '123456',
    } as any);

    expect(prismaService.user.create).toHaveBeenCalled();
    expect(prismaService.cart.create).toHaveBeenCalledWith({
      data: { userId: createdUser.id },
    });
    expect(result.user.email).toBe('ana@test.com');
  });

  it('inicia sesion y devuelve un token JWT valido', async () => {
    // Simula un usuario existente con password ya hasheado.
    prismaService.user.findUnique.mockResolvedValue({
      id: 2,
      email: 'admin@test.com',
      password: 'hashed-password',
      role: 'ADMIN',
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await authService.login({
      email: 'admin@test.com',
      password: '123456',
    } as any);

    expect(result.access_token).toBeDefined();
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'admin@test.com' },
    });
  });
});