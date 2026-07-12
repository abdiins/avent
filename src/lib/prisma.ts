// src/lib/prisma.ts
// Singleton Prisma Client untuk menghindari pembuatan koneksi berlebihan
// saat hot-reload di development mode Next.js.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
