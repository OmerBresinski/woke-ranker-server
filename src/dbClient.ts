import { PrismaClient } from "../generated/client";

export const createPrismaClient = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
};

export const prismaClient = createPrismaClient();
