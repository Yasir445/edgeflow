import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });
}

export const prisma: PrismaClient = (() => {
  if (typeof window !== "undefined") {
    throw new Error("Prisma cannot be used on the client side");
  }
  if (process.env.NODE_ENV === "production") {
    return createPrismaClient();
  }
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }
  return global.__prisma;
})();
