import { PrismaClient } from "@prisma/client";
import { buildSampleLogs } from "./sampleLogs";

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
      "isSample" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const columns = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
    `PRAGMA table_info("DailyLog")`,
  );

  if (!columns.some((column) => column.name === "isSample")) {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "DailyLog"
      ADD COLUMN "isSample" BOOLEAN NOT NULL DEFAULT false
    `);
  }

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "DailyLog_date_key"
    ON "DailyLog"("date")
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "DailyLog_date_idx"
    ON "DailyLog"("date")
  `);

  const sampleLogs = buildSampleLogs();

  for (const sampleLog of sampleLogs) {
    await prisma.dailyLog.updateMany({
      where: {
        date: sampleLog.date,
        weight: sampleLog.weight,
        calories: sampleLog.calories,
        protein: sampleLog.protein,
        steps: sampleLog.steps,
        water: sampleLog.water,
        fastingHours: sampleLog.fastingHours,
        stayedOnPlan: sampleLog.stayedOnPlan,
        noNightEating: sampleLog.noNightEating,
      },
      data: {
        isSample: true,
      },
    });
  }

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
