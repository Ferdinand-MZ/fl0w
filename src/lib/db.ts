import { PrismaClient } from '@/generated/prisma';

// PrismaClient is expensive to create, so we create a single instance and reuse it across the app.
// This is especially important in development, where hot reloading can cause multiple instances to be created.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;