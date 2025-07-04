import { PrismaClient } from '@prisma/client';

type GlobalForPrisma = typeof globalThis & {
  prisma: PrismaClient | undefined;
};

const globalForPrisma: GlobalForPrisma = globalThis as unknown as GlobalForPrisma;

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
