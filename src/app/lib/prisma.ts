import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({ log: ["query"] });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalThisWithPrisma = globalThis as typeof globalThis & {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalThisWithPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThisWithPrisma.prisma = prisma;

export default prisma;
