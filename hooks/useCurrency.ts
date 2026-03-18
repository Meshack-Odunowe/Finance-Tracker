'use client';

import { useFinanceStore } from '@/store/useFinanceStore';
import { useCallback } from 'react';
import { formatCurrency } from '@/utils/formatters';

export function useCurrency() {
    const currency = useFinanceStore(state => state.userPreferences?.preferredCurrency || 'NGN');

    const format = useCallback((amount: number) => {
        return formatCurrency(amount, currency);
    }, [currency]);

    return { format, currency };
}
