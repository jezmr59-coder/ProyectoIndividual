// src/config/prisma.js
import { PrismaClient } from "../../generated/prisma/index.js"; // Importa el cliente Prisma generado automáticamente
import { PrismaPg } from "@prisma/adapter-pg"; // Importa el adaptador PostgreSQL para Prisma

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL }); // Crea el adaptador con la URL de la base de datos
const prisma = new PrismaClient({ adapter }); // Crea la instancia de Prisma con el adaptador configurado

export default prisma; // Exporta la instancia Prisma para consultas a la base de datos
