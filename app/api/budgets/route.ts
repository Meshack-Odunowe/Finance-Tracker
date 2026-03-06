import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const budgets = await prisma.budget.findMany();
        return NextResponse.json(budgets);
    } catch (error) {
        console.error('Failed to fetch budgets:', error);
        return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { category, limit } = body;

        const budget = await prisma.budget.upsert({
            where: { category },
            update: { limit },
            create: { category, limit },
        });

        return NextResponse.json(budget);
    } catch (error) {
        console.error('Failed to save budget:', error);
        return NextResponse.json({ error: 'Failed to save budget' }, { status: 500 });
    }
}
