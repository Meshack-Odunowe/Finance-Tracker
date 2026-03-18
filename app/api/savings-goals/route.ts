import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const goals = await prisma.savingsGoal.findMany({
            where: { userId: session.userId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(goals);
    } catch (error) {
        console.error('Failed to fetch savings goals:', error);
        return NextResponse.json({ error: 'Failed to fetch savings goals' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, targetAmount, currentAmount, deadline } = await request.json();
        console.log('Prisma keys:', Object.keys(prisma).filter(k => !k.startsWith('_')));

        const goal = await prisma.savingsGoal.create({
            data: {
                userId: session.userId,
                name,
                targetAmount,
                currentAmount: currentAmount || 0,
                deadline: deadline ? new Date(deadline) : null,
            },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                userId: session.userId,
                type: 'GOAL_CREATED',
                description: `Created savings goal: ${name}`,
            },
        });

        return NextResponse.json(goal);
    } catch (error) {
        console.error('Failed to create savings goal:', error);
        return NextResponse.json({ error: 'Failed to create savings goal' }, { status: 500 });
    }
}
