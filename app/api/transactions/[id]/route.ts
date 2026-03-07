import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const transaction = await prisma.transaction.findFirst({
            where: { id, userId: session.userId },
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json(transaction);
    } catch (error) {
        console.error('Failed to fetch transaction:', error);
        return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
    }
}

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
        const existing = await prisma.transaction.findFirst({
            where: { id, userId: session.userId },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Transaction not found or unauthorized' }, { status: 404 });
        }

        const body = await request.json();
        const { amount, type, category, description, date } = body;

        const transaction = await prisma.transaction.update({
            where: { id },
            data: {
                amount,
                type,
                category,
                description,
                date: date ? new Date(date) : undefined,
            },
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error('Failed to update transaction:', error);
        return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
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
        const existing = await prisma.transaction.findFirst({
            where: { id, userId: session.userId },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Transaction not found or unauthorized' }, { status: 404 });
        }

        await prisma.transaction.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
    }
}

