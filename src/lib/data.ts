import prisma from "@/lib/prisma";

export async function getAllLogs() {
  return prisma.dailyLog.findMany({
    where: {
      isSample: false,
    },
    orderBy: {
      date: "asc",
    },
  });
}
