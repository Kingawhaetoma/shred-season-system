"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CALORIE_RANGE } from "@/lib/constants";

type CalorieChartDatum = {
  date: string;
  calories: number;
};

type CalorieChartProps = {
  data: CalorieChartDatum[];
};

export function CalorieChart({ data }: CalorieChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: -14, bottom: 0 }}>
          <CartesianGrid stroke="rgba(19,32,47,0.08)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "rgba(95,103,114,1)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(95,103,114,1)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(19,32,47,0.04)" }}
            contentStyle={{
              borderRadius: "18px",
              border: "1px solid rgba(19,32,47,0.08)",
              background: "rgba(255,255,255,0.96)",
              boxShadow: "0 24px 80px rgba(19,32,47,0.08)",
            }}
          />
          <ReferenceArea
            y1={CALORIE_RANGE.min}
            y2={CALORIE_RANGE.max}
            fill="rgba(31,122,78,0.08)"
          />
          <Bar
            dataKey="calories"
            fill="rgba(19,32,47,0.78)"
            radius={[12, 12, 6, 6]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
