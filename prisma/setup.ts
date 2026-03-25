import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "DailyLog" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "date" TEXT NOT NULL,
      "weight" REAL NOT NULL,
      "calories" INTEGER NOT NULL,
      "protein" INTEGER NOT NULL,
      "steps" INTEGER NOT NULL,
      "water" REAL NOT NULL,
      "fastingHours" REAL NOT NULL,
      "stayedOnPlan" BOOLEAN NOT NULL DEFAULT false,
      "noNightEating" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "DailyLog_date_key"
    ON "DailyLog"("date")
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "DailyLog_date_idx"
    ON "DailyLog"("date")
  `);

  console.log("SQLite schema is ready.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
