'use client';

import { Transaction } from '@/types/finance';
import { calculateTrends } from '@/utils/financeCalculations';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { useCurrency } from '@/hooks/useCurrency';

export function TrendsChart({ transactions }: { transactions: Transaction[] }) {
    const data = calculateTrends(transactions);
    const { currency } = useCurrency();
    const symbol = currency === 'NGN' ? '₦' : currency;

    return (
        <div className="h-[350px] w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none transition-all">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Financial Trends</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Income vs Expenses (Last 6 Months)</p>
                </div>
            </div>
            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" dark-stroke="#1e293b" />
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
                    <Legend iconType="circle" />
                    <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                        strokeWidth={3}
                        animationDuration={1500}
                    />
                    <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#f43f5e"
                        fillOpacity={1}
                        fill="url(#colorExpenses)"
                        strokeWidth={3}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
