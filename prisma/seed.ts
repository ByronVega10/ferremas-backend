import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'Herramientas Manuales', description: 'Martillos, destornilladores' },
      { name: 'Herramientas Eléctricas', description: 'Taladros, sierras' },
      { name: 'Seguridad', description: 'Cascos, guantes' },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });