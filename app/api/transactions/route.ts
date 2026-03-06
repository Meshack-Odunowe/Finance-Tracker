import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const transactions = await prisma.transaction.findMany({
            where: {
                AND: [
                    search ? { description: { contains: search, mode: 'insensitive' } } : {},
                    category ? { category: { equals: category } } : {},
                    startDate ? { date: { gte: new Date(startDate) } } : {},
                    endDate ? { date: { lte: new Date(endDate) } } : {},
                ],
            },
            orderBy: { date: 'desc' },
        });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, type, category, description, date } = body;

        const transaction = await prisma.transaction.create({
            data: {
                amount,
                type,
                category,
                description,
                date: new Date(date),
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
