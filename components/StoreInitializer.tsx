'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';

export function StoreInitializer() {
    const fetchData = useFinanceStore((state) => state.fetchData);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return null;
}
