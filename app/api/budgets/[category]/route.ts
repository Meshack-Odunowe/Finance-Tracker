import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ category: string }> }
) {
    try {
        const { category } = await params;
        const budget = await prisma.budget.findUnique({
            where: { category },
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
        const { category } = await params;
        const body = await request.json();
        const { limit } = body;

        const budget = await prisma.budget.update({
            where: { category },
            data: { limit },
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
        const { category } = await params;
        await prisma.budget.delete({
            where: { category },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete budget:', error);
        return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
    }
}
