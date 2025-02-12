import { PrismaClient } from "@prisma/client";

let prismaService: PrismaClient;

prismaService = new PrismaClient();

export default prismaService;
