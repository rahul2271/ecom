import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. Initialize the connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10, // Recommended for serverless environments like Vercel
  idleTimeoutMillis: 30000 
});

const adapter = new PrismaPg(pool);

// 2. Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 3. Initialize Prisma with the Driver Adapter
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;