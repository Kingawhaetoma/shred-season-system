"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/prisma";

const dailyLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weight: z.coerce.number().positive(),
  calories: z.coerce.number().int().nonnegative(),
  protein: z.coerce.number().int().nonnegative(),
  steps: z.coerce.number().int().nonnegative(),
  water: z.coerce.number().nonnegative(),
  fastingHours: z.coerce.number().min(0).max(24),
  stayedOnPlan: z.boolean(),
  noNightEating: z.boolean(),
});

export async function saveDailyLog(formData: FormData) {
  const parsed = dailyLogSchema.safeParse({
    date: formData.get("date"),
    weight: formData.get("weight"),
    calories: formData.get("calories"),
    protein: formData.get("protein"),
    steps: formData.get("steps"),
    water: formData.get("water"),
    fastingHours: formData.get("fastingHours"),
    stayedOnPlan: formData.get("stayedOnPlan") === "on",
    noNightEating: formData.get("noNightEating") === "on",
  });

  if (!parsed.success) {
    redirect("/?invalid=1");
  }

  const { date, ...values } = parsed.data;

  await prisma.dailyLog.upsert({
    where: { date },
    create: {
      date,
      isSample: false,
      ...values,
    },
    update: {
      ...values,
      isSample: false,
    },
  });

  revalidatePath("/");
  revalidatePath("/progress");
  revalidatePath("/review");

  redirect(`/?saved=${date}`);
}
