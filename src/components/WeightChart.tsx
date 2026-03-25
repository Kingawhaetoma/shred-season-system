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
  sevenDayAverage: number | null;
};

type WeightChartProps = {
  data: WeightChartDatum[];
};

export function WeightChart({ data }: WeightChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 8, left: -14, bottom: 0 }}>
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
            domain={["dataMin - 1", "dataMax + 1"]}
          />
          <Tooltip
            cursor={{ stroke: "#E7DFD6", strokeWidth: 1 }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E7DFD6",
              background: "#FBFAF7",
              boxShadow: "0 8px 18px rgba(17,17,17,0.05)",
            }}
          />
          <Legend wrapperStyle={{ color: "#6B6B6B" }} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#111111"
            strokeWidth={2.5}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
            name="Weight"
          />
          <Line
            type="monotone"
            dataKey="sevenDayAverage"
            stroke="#2F5D50"
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
