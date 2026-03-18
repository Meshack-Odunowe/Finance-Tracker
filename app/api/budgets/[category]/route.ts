import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ category: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { category } = await params;
        const budget = await prisma.budget.findUnique({
            where: {
                userId_category: {
                    userId: session.userId,
                    category
                }
            },
        });

        if (!budget) {
            return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
        }

        return NextResponse.json(budget);
    } catch (error) {
        console.error('Failed to fetch budget:', error);
        return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ category: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { category } = await params;
        const body = await request.json();
        const { limit } = body;

        const budget = await prisma.budget.update({
            where: {
                userId_category: {
                    userId: session.userId,
                    category
                }
            },
            data: { limit },
        });

        await prisma.activityLog.create({
            data: {
                userId: session.userId,
                type: 'BUDGET_EXCEEDED',
                description: `Updated ${category} budget limit to ₦${limit.toLocaleString()}`,
                metadata: { budgetId: budget.id },
            },
        });

        return NextResponse.json(budget);
    } catch (error) {
        console.error('Failed to update budget:', error);
        return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ category: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { category } = await params;
        await prisma.budget.delete({
            where: {
                userId_category: {
                    userId: session.userId,
                    category
                }
            },
        });

        await prisma.activityLog.create({
            data: {
                userId: session.userId,
                type: 'BUDGET_EXCEEDED',
                description: `Deleted budget for ${category}`,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete budget:', error);
        return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
    }
}

