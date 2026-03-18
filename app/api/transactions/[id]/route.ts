import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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
        const { amount, type, category, description, date, isRecurring, recurrenceType } = body;

        const transaction = await prisma.transaction.update({
            where: { id },
            data: {
                amount,
                type,
                category,
                description,
                date: date ? new Date(date) : undefined,
                isRecurring,
                recurrenceType,
            },
        });

        await prisma.activityLog.create({
            data: {
                userId: session.userId,
                type: 'TRANSACTION_UPDATED',
                description: `Updated transaction: ${description || category}`,
                metadata: { transactionId: id } as Prisma.InputJsonValue,
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

        await prisma.activityLog.create({
            data: {
                userId: session.userId,
                type: 'TRANSACTION_DELETED',
                description: `Deleted transaction: ${existing.description || existing.category}`,
                metadata: { transactionId: id } as Prisma.InputJsonValue,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
    }
}

