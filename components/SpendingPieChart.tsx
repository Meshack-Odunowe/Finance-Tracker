'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SpendingPieChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  '#6366f1', // Indigo 500
  '#4f46e5', // Indigo 600
  '#4338ca', // Indigo 700
  '#3730a3', // Indigo 800
  '#312e81', // Indigo 900
  '#1e1b4b', // Indigo 950
  '#94a3b8', // Slate 400
  '#2C3E50', // Darker Blue/Grey
  '#34495E', // Slightly lighter
  '#4A6572', // Muted Blue
  '#5B7F8D', // Lighter Muted Blue
  '#708090', // Slate Gray
  '#8D9CA7', // Lighter Slate Gray
  '#AAB8C2', // Even lighter
  '#CFD8DC', // Very light grey/blue
];

export function SpendingPieChart({ data }: SpendingPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
        <p className="text-sm text-gray-500">No spending data available</p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
