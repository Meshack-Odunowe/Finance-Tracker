import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const existing = await prisma.savingsGoal.findFirst({
            where: { id, userId: session.userId },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Savings goal not found or unauthorized' }, { status: 404 });
        }

        const body = await request.json();
        const { name, targetAmount, currentAmount, deadline } = body;

        const goal = await prisma.savingsGoal.update({
            where: { id },
            data: {
                name,
                targetAmount,
                currentAmount,
                deadline: deadline ? new Date(deadline) : undefined,
            },
        });

        return NextResponse.json(goal);
    } catch (error) {
        console.error('Failed to update savings goal:', error);
        return NextResponse.json({ error: 'Failed to update savings goal' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const existing = await prisma.savingsGoal.findFirst({
            where: { id, userId: session.userId },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Savings goal not found or unauthorized' }, { status: 404 });
        }

        await prisma.savingsGoal.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete savings goal:', error);
        return NextResponse.json({ error: 'Failed to delete savings goal' }, { status: 500 });
    }
}
