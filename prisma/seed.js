"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=seed.js.map