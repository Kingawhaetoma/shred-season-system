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
import { formatInteger } from "@/lib/format";

type CalorieChartDatum = {
  date: string;
  caloriesIn: number;
};

type CalorieChartProps = {
  data: CalorieChartDatum[];
};

export function CalorieChart({ data }: CalorieChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: -14, bottom: 0 }}>
          <CartesianGrid stroke="#E7DFD6" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#9A948C", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "#9A948C", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "#F3EFE8" }}
            formatter={(value, name) => [`${formatInteger(Number(value))} kcal`, name]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E7DFD6",
              background: "#FBFAF7",
              boxShadow: "0 8px 18px rgba(17,17,17,0.05)",
            }}
          />
          <ReferenceArea y1={CALORIE_RANGE.min} y2={CALORIE_RANGE.max} fill="#EDF3F0" />
          <Bar
            dataKey="caloriesIn"
            name="Calories In"
            fill="#6B6B6B"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
