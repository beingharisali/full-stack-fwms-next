"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10B981", "#F97316", "#EF4444"];

export default function VehicleChart({ data }: any) {
  const filteredData = data.filter((d: any) => d.value > 0);

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={filteredData}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={90}
          >
            {filteredData.map((_: any, index: number) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
