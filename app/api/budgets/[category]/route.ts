import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
