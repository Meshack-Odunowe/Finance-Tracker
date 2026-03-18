import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const categories = await prisma.category.findMany({
            where: { userId: session.userId }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, type } = body;

        const category = await prisma.category.create({
            data: {
                userId: session.userId,
                name,
                type,
            },
        });

        await prisma.activityLog.create({
            data: {
                userId: session.userId,
                type: 'TRANSACTION_ADDED', // Generic for now, or CUSTOM_LOG
                description: `Created new ${type} category: ${name}`,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Failed to create category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
