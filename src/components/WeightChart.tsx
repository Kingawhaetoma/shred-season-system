"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type WeightChartDatum = {
  date: string;
  weight: number;
  sevenDayAverage: number;
};

type WeightChartProps = {
  data: WeightChartDatum[];
};

export function WeightChart({ data }: WeightChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 8, left: -14, bottom: 0 }}>
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
            domain={["dataMin - 1", "dataMax + 1"]}
          />
          <Tooltip
            cursor={{ stroke: "rgba(19,32,47,0.12)", strokeWidth: 1 }}
            contentStyle={{
              borderRadius: "18px",
              border: "1px solid rgba(19,32,47,0.08)",
              background: "rgba(255,255,255,0.96)",
              boxShadow: "0 24px 80px rgba(19,32,47,0.08)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="rgba(19,32,47,0.7)"
            strokeWidth={2.5}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
            name="Weight"
          />
          <Line
            type="monotone"
            dataKey="sevenDayAverage"
            stroke="rgba(31,122,78,1)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4 }}
            name="7-day average"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
