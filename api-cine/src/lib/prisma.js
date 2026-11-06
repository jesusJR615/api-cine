import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
// 1. Configuramos el adaptador de SQLite pasando la URL de la base de datos
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db"
});

// 3. Evitamos múltiples instancias de Prisma en modo desarrollo (hot-reload)
const globalForPrisma = globalThis;

// 4. Pasamos el adaptador a PrismaClient
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;