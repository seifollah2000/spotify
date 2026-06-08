import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL || "file:./prisma/dev.db"
  const adapter = new PrismaBetterSqlite3({ url: connectionString })
  return new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

export default prisma

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
