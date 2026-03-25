"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/prisma";

const emptyToNull = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const dailyLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weight: z.preprocess(emptyToNull, z.coerce.number().positive()),
  caloriesIn: z.preprocess(emptyToNull, z.coerce.number().int().nonnegative().nullable()),
  caloriesOut: z.preprocess(emptyToNull, z.coerce.number().int().nonnegative().nullable()),
  protein: z.preprocess(emptyToNull, z.coerce.number().int().nonnegative().nullable()),
  steps: z.preprocess(emptyToNull, z.coerce.number().int().nonnegative().nullable()),
  water: z.preprocess(emptyToNull, z.coerce.number().nonnegative().nullable()),
  fastingHours: z.preprocess(emptyToNull, z.coerce.number().min(0).max(24).nullable()),
  stayedOnPlan: z.boolean(),
  noNightEating: z.boolean(),
});

export async function saveDailyLog(formData: FormData) {
  const parsed = dailyLogSchema.safeParse({
    date: formData.get("date"),
    weight: formData.get("weight"),
    caloriesIn: formData.get("caloriesIn"),
    caloriesOut: formData.get("caloriesOut"),
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
