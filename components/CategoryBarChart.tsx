'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from 'next-themes';
import { useHydration } from '@/hooks/useHydration';

interface CategoryBarChartProps {
  data: { name: string; value: number }[];
}

// Light mode COLORS
const LIGHT_COLORS = [
  '#64748b', // Slate 500
  '#475569', // Slate 600
  '#334155', // Slate 700
  '#1e293b', // Slate 800
];

// Dark mode COLORS
const DARK_COLORS = [
  '#94a3b8', // Slate 400
  '#cbd5e1', // Slate 300
  '#e2e8f0', // Slate 200
  '#f1f5f9', // Slate 100
];

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  const { resolvedTheme } = useTheme();
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  const isDark = resolvedTheme === 'dark';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
        <p className="text-sm text-slate-500 dark:text-slate-400">No spending data available</p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full transition-colors duration-300">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* Subtle grid lines */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            cursor={{ fill: isDark ? '#1e293b' : '#f8f9fb' }}
            formatter={(value: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))}
            contentStyle={{
              borderRadius: '12px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              fontSize: '12px',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: isDark ? '#f8fafc' : '#0f172a'
            }}
          />
          <Bar dataKey="value" barSize={32} radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
