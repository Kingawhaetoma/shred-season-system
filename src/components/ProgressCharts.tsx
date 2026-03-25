"use client";

import dynamic from "next/dynamic";

const chartSkeleton = () => <div className="h-80 w-full rounded-[28px] bg-black/[0.03]" />;

const WeightChart = dynamic(
  () => import("@/components/WeightChart").then((mod) => mod.WeightChart),
  {
    ssr: false,
    loading: chartSkeleton,
  },
);

const CalorieChart = dynamic(
  () => import("@/components/CalorieChart").then((mod) => mod.CalorieChart),
  {
    ssr: false,
    loading: chartSkeleton,
  },
);

type WeightChartDatum = {
  date: string;
  weight: number;
  sevenDayAverage: number;
};

type CalorieChartDatum = {
  date: string;
  calories: number;
};

export function LazyWeightChart({ data }: { data: WeightChartDatum[] }) {
  return <WeightChart data={data} />;
}

export function LazyCalorieChart({ data }: { data: CalorieChartDatum[] }) {
  return <CalorieChart data={data} />;
}
