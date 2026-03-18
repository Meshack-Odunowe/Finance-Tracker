import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'json';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const where: any = { userId: session.userId };
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
        });

        if (format === 'csv') {
            const headers = ['Date', 'Amount', 'Type', 'Category', 'Description'];
            const rows = transactions.map((t) => [
                t.date.toISOString().split('T')[0],
                t.amount,
                t.type,
                t.category,
                t.description,
            ]);
            const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename=transactions.csv',
                },
            });
        }

        return NextResponse.json(transactions, {
            headers: {
                'Content-Disposition': 'attachment; filename=transactions.json',
            },
        });
    } catch (error) {
        console.error('Failed to export data:', error);
        return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
    }
}
