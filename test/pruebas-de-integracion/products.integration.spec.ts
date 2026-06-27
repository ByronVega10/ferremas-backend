/*
  Descripcion:
  Esta prueba revisa consultas principales del catálogo de productos,
  usando mocks de Prisma para no depender de una base real.
  Se asegura de que la categoría venga incluida,
  porque es información que el frontend usa de forma frecuente.

  Resultado esperado:
  findAll debe retornar productos con categoría,
  y findOne debe retornar un producto por id también con categoría.
  La estructura de datos debe mantenerse para evitar fallas en vistas del catálogo.
*/

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../src/products/products.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('ProductsService integration', () => {
  let prismaService: any;
  let productsService: ProductsService;

  beforeEach(async () => {
    // Mock de Prisma para aislar la logica de productos.
    prismaService = {
      product: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
    };

    // Crea el modulo de prueba con el servicio de productos.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  it('devuelve todos los productos con su categoria', async () => {
    prismaService.product.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'Martillo',
        category: { id: 1, name: 'Herramientas' },
      },
    ]);

    const result = await productsService.findAll();

    expect(result).toHaveLength(1);
    expect(prismaService.product.findMany).toHaveBeenCalledWith({
      include: { category: true },
    });
  });

  it('busca un producto por id con su categoria', async () => {
    prismaService.product.findUnique.mockResolvedValue({
      id: 1,
      name: 'Martillo',
      category: { id: 1, name: 'Herramientas' },
    });

    const result = await productsService.findOne(1);

    expect(result.id).toBe(1);
    expect(prismaService.product.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { category: true },
    });
  });
});