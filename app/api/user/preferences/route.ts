import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { preferredCurrency, themePreference } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: {
                preferredCurrency: preferredCurrency,
                themePreference: themePreference,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Failed to update preferences:', error);
        return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }
}
