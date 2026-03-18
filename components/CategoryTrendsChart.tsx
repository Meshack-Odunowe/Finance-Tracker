'use client';

import { Transaction } from '@/types/finance';
import { calculateCategoryTrends } from '@/utils/financeCalculations';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { useCurrency } from '@/hooks/useCurrency';

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#3b82f6'];

export function CategoryTrendsChart({ transactions }: { transactions: Transaction[] }) {
    const data = calculateCategoryTrends(transactions);
    const { currency } = useCurrency();
    const symbol = currency === 'NGN' ? '₦' : currency;
    const categories = Array.from(new Set(transactions.filter(t => t.type === 'expense').map(t => t.category)));

    return (
        <div className="h-[350px] w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none transition-all">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Spending by Category</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide uppercase">Monthly expense trend</p>
            </div>
            <ResponsiveContainer width="100%" height="80%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickFormatter={(value) => `${symbol}${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                        formatter={(value: any) => `${symbol}${value.toLocaleString()}`}
                    />
                    <Legend />
                    {categories.map((cat, index) => (
                        <Line
                            key={cat}
                            type="monotone"
                            dataKey={cat}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                            animationDuration={1500}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
