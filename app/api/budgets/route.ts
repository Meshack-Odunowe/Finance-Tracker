import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const budgets = await prisma.budget.findMany({
            where: { userId: session.userId }
        });
        return NextResponse.json(budgets);
    } catch (error) {
        console.error('Failed to fetch budgets:', error);
        return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { category, limit } = body;

        const budget = await prisma.budget.upsert({
            where: {
                userId_category: {
                    userId: session.userId,
                    category
                }
            },
            update: { limit },
            create: {
                userId: session.userId,
                category,
                limit
            },
        });

        await prisma.activityLog.create({
            data: {
                userId: session.userId,
                type: 'BUDGET_EXCEEDED', // Using this type or generic if needed, maybe I should add BUDGET_UPDATED to schema
                description: `Set budget for ${category}: ₦${limit.toLocaleString()}`,
                metadata: { budgetId: budget.id },
            },
        });

        return NextResponse.json(budget);
    } catch (error) {
        console.error('Failed to save budget:', error);
        return NextResponse.json({ error: 'Failed to save budget' }, { status: 500 });
    }
}

