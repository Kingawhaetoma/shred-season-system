-- CreateTable
CREATE TABLE "DailyLog" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "caloriesIn" INTEGER NOT NULL,
    "caloriesOut" INTEGER NOT NULL DEFAULT 0,
    "protein" INTEGER NOT NULL,
    "steps" INTEGER NOT NULL,
    "water" DOUBLE PRECISION NOT NULL,
    "fastingHours" DOUBLE PRECISION NOT NULL,
    "stayedOnPlan" BOOLEAN NOT NULL DEFAULT false,
    "noNightEating" BOOLEAN NOT NULL DEFAULT false,
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_date_key" ON "DailyLog"("date");

-- CreateIndex
CREATE INDEX "DailyLog_date_idx" ON "DailyLog"("date");
