import { PrismaClient } from "@prisma/client";
import { buildSampleLogs } from "./sampleLogs";

const prisma = new PrismaClient();

async function main() {
  const logs = buildSampleLogs();

  await prisma.dailyLog.deleteMany();
  await prisma.dailyLog.createMany({
    data: logs,
  });
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
