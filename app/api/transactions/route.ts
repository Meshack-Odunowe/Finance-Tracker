import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        console.log('Fetching transactions for user:', session.userId);
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: session.userId,
                AND: [
                    search ? { description: { contains: search, mode: 'insensitive' } } : {},
                    category ? { category: { equals: category } } : {},
                    startDate ? { date: { gte: new Date(startDate) } } : {},
                    endDate ? { date: { lte: new Date(endDate) } } : {},
                ],
            },
            orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { amount, type, category, description, date, isRecurring, recurrenceType } = body;

        const transaction = await prisma.transaction.create({
            data: {
                userId: session.userId,
                amount,
                type,
                category,
                description,
                date: new Date(date),
                isRecurring,
                recurrenceType,
            },
        });

        await prisma.activityLog.create({
            data: {
                userId: session.userId,
                type: 'TRANSACTION_ADDED',
                description: `Added ${type}: ${description || category} for ₦${amount.toLocaleString()}`,
                metadata: { transactionId: transaction.id } as Prisma.InputJsonValue,
            },
        });

        return NextResponse.json(transaction);
    } catch (error: any) {
        console.error('Failed to create transaction:', error);
        return NextResponse.json({
            error: 'Failed to create transaction',
            details: error.message,
            code: error.code
        }, { status: 500 });
    }
}

