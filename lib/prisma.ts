import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Use a fallback for build time
const connectionString = process.env.DATABASE_URL || "postgres://dummy:5432";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Using 'globalThis' is the standard for Prisma 7
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;