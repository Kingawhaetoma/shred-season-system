import prisma from "@/lib/prisma";

export async function getAllLogs() {
  return prisma.dailyLog.findMany({
    orderBy: {
      date: "asc",
    },
  });
}
