import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const logs = await prisma.activityLog.findMany({
            where: { userId: session.userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Failed to fetch activity logs:', error);
        return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
    }
}
