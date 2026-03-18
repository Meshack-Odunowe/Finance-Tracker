import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const widgets = await prisma.dashboardWidget.findMany({
            where: { userId: session.userId },
            orderBy: { order: 'asc' }
        });

        // If no widgets exist yet, return a default list (but don't save yet to avoid side effects on GET)
        if (widgets.length === 0) {
            return NextResponse.json([
                { name: 'Summary', isVisible: true, order: 0 },
                { name: 'HealthScore', isVisible: true, order: 1 },
                { name: 'Insights', isVisible: true, order: 2 },
                { name: 'Trends', isVisible: true, order: 3 },
                { name: 'CategoryTrends', isVisible: true, order: 4 },
                { name: 'SpendingSplit', isVisible: true, order: 5 },
                { name: 'CategoryComparison', isVisible: true, order: 6 },
                { name: 'RecentTransactions', isVisible: true, order: 7 },
                { name: 'ActivityLog', isVisible: true, order: 8 },
                { name: 'SavingsGoals', isVisible: true, order: 9 },
                { name: 'BudgetProgress', isVisible: true, order: 10 },
            ]);
        }

        return NextResponse.json(widgets);
    } catch (error) {
        console.error('Failed to fetch widgets:', error);
        return NextResponse.json({ error: 'Failed to fetch widgets' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, isVisible, order } = body;

        const widget = await prisma.dashboardWidget.upsert({
            where: {
                userId_name: {
                    userId: session.userId,
                    name,
                }
            },
            update: {
                isVisible: isVisible !== undefined ? isVisible : undefined,
                order: order !== undefined ? order : undefined,
            },
            create: {
                userId: session.userId,
                name,
                isVisible: isVisible !== undefined ? isVisible : true,
                order: order !== undefined ? order : 0,
            },
        });

        return NextResponse.json(widget);
    } catch (error) {
        console.error('Failed to update widget:', error);
        return NextResponse.json({ error: 'Failed to update widget' }, { status: 500 });
    }
}
