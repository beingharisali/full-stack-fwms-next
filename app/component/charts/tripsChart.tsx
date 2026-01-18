"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10B981", "#EF4444", "#3B82F6"];

export default function TripsChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
 
  const filteredData = data.filter(d => d.value > 0);

  if (filteredData.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-gray-500">
        No trips data
      </div>
    );
  }

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
            {filteredData.map((_, index) => (
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
