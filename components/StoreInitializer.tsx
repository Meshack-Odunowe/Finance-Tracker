'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { usePathname } from 'next/navigation';


export function StoreInitializer() {
    const fetchData = useFinanceStore((state) => state.fetchData);
    const pathname = usePathname();

    useEffect(() => {
        const isAuthPage = pathname.startsWith('/auth');
        if (!isAuthPage) {
            fetchData().catch(() => {
                // Ignore error if unauthorized, middleware will handle redirect
            });
        }
    }, [fetchData, pathname]);

    return null;
}

