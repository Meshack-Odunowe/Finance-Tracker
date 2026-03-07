'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from 'next-themes';
import { useHydration } from '@/hooks/useHydration';

interface SpendingPieChartProps {
  data: { name: string; value: number }[];
}

const LIGHT_COLORS = [
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
];

const DARK_COLORS = [
  '#818cf8', // Indigo 400
  '#a5b4fc', // Indigo 300
  '#c7d2fe', // Indigo 200
  '#e0e7ff', // Indigo 100
  '#6366f1', // Indigo 500
  '#4f46e5', // Indigo 600
  '#94a3b8', // Slate 400
  '#cbd5e1', // Slate 300
  '#e2e8f0', // Slate 200
  '#f1f5f9', // Slate 100
];

export function SpendingPieChart({ data }: SpendingPieChartProps) {
  const { resolvedTheme } = useTheme();
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  const isDark = resolvedTheme === 'dark';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
        <p className="text-sm text-slate-500 dark:text-slate-400">No spending data available</p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full transition-colors duration-300">
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
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(value))}
            contentStyle={{
              borderRadius: '12px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              fontSize: '12px',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: isDark ? '#f8fafc' : '#0f172a'
            }}
            itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
            labelStyle={{ color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: isDark ? '#cbd5e1' : '#64748b' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
