import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Limpiar tablas (opcional pero recomendado en desarrollo)

  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Crear categorías

  const manuales = await prisma.category.create({
    data: {
      name: 'Herramientas Manuales',
      description: 'Martillos, destornilladores y llaves',
    },
  });

  const electricas = await prisma.category.create({
    data: {
      name: 'Herramientas Eléctricas',
      description: 'Taladros, sierras y lijadoras',
    },
  });

  const seguridad = await prisma.category.create({
    data: {
      name: 'Seguridad',
      description: 'Cascos, guantes y protección',
    },
  });

  // Crear productos

  await prisma.product.createMany({
    data: [

      // MANUALES

      {
        sku: 'MAN-001',
        name: 'Martillo Stanley',
        brand: 'Stanley',
        description: 'Martillo profesional de acero',
        price: 12990,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1581147036324-c1c7598a2c93',
        categoryId: manuales.id,
      },

      {
        sku: 'MAN-002',
        name: 'Destornillador Philips',
        brand: 'Bosch',
        description: 'Destornillador punta cruz',
        price: 5990,
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c',
        categoryId: manuales.id,
      },

      // ELECTRICAS

      {
        sku: 'ELE-001',
        name: 'Taladro Bosch',
        brand: 'Bosch',
        description: 'Taladro eléctrico industrial',
        price: 49990,
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
        categoryId: electricas.id,
      },

      {
        sku: 'ELE-002',
        name: 'Sierra Circular Makita',
        brand: 'Makita',
        description: 'Sierra circular profesional',
        price: 89990,
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1513467655676-561b7d489a88',
        categoryId: electricas.id,
      },

      // SEGURIDAD

      {
        sku: 'SEG-001',
        name: 'Casco de Seguridad',
        brand: '3M',
        description: 'Casco resistente para construcción',
        price: 15990,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b',
        categoryId: seguridad.id,
      },

      {
        sku: 'SEG-002',
        name: 'Guantes de Trabajo',
        brand: 'Redline',
        description: 'Guantes anticorte',
        price: 7990,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
        categoryId: seguridad.id,
      },
    ],
  });

  console.log('Seed ejecutado correctamente');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });