import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const monthStr = searchParams.get('month'); // e.g. "2026-03"
        const now = monthStr ? new Date(monthStr) : new Date();

        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);

        // Fetch everything in parallel
        const [transactions, budgets] = await Promise.all([
            prisma.transaction.findMany({
                where: {
                    date: {
                        gte: monthStart,
                        lte: monthEnd,
                    },
                },
            }),
            prisma.budget.findMany(),
        ]);

        const totalIncome = transactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const categories = [...new Set(transactions.map((t) => t.category))];
        const spendingByCategory = categories.map((cat) => ({
            name: cat,
            value: transactions
                .filter((t) => t.category === cat && t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0),
        }));

        const budgetProgress = budgets.map((budget) => {
            const spent = transactions
                .filter((t) => t.category === budget.category && t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                category: budget.category,
                limit: budget.limit,
                spent,
                percentage: budget.limit > 0 ? (spent / budget.limit) * 100 : 0,
            };
        });

        return NextResponse.json({
            summary: {
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses,
                transactionCount: transactions.length,
            },
            spendingByCategory,
            budgetProgress,
        });
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}
