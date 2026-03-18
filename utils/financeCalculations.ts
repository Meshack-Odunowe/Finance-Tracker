import { Transaction, Budget, SavingsGoal } from '@/types/finance';
import { subMonths, startOfMonth, endOfMonth, format, isWithinInterval, eachMonthOfInterval } from 'date-fns';

export function calculateTrends(transactions: Transaction[], months = 6) {
    const now = new Date();
    const intervalStart = startOfMonth(subMonths(now, months - 1));
    const monthsList = eachMonthOfInterval({ start: intervalStart, end: now });

    return monthsList.map((month) => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);

        const monthTransactions = transactions.filter((t) =>
            isWithinInterval(new Date(t.date), { start, end })
        );

        const income = monthTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            month: format(month, 'MMM'),
            income,
            expenses,
        };
    });
}

export function calculateCategoryTrends(transactions: Transaction[], months = 6) {
    const now = new Date();
    const intervalStart = startOfMonth(subMonths(now, months - 1));
    const monthsList = eachMonthOfInterval({ start: intervalStart, end: now });

    const categories = Array.from(new Set(transactions.map(t => t.category)));

    return monthsList.map((month) => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);

        const monthTransactions = transactions.filter((t) =>
            isWithinInterval(new Date(t.date), { start, end }) && t.type === 'expense'
        );

        const data: Record<string, any> = { month: format(month, 'MMM') };
        categories.forEach(cat => {
            data[cat] = monthTransactions
                .filter(t => t.category === cat)
                .reduce((sum, t) => sum + t.amount, 0);
        });

        return data;
    });
}

export function calculateHealthScore(transactions: Transaction[], budgets: Budget[]) {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const thisMonthTransactions = transactions.filter((t) =>
        isWithinInterval(new Date(t.date), { start, end })
    );

    const income = thisMonthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = thisMonthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    if (income === 0 && expenses === 0) return 100;

    // 1. Savings Rate (40%)
    const savingsRate = income > 0 ? (income - expenses) / income : 0;
    const savingsScore = Math.max(0, Math.min(savingsRate * 100, 100)) * 0.4;

    // 2. Budget Adherence (40%)
    let budgetScore = 0;
    if (budgets.length > 0) {
        const exceededCount = budgets.filter(b => {
            const catExpense = thisMonthTransactions
                .filter(t => t.category === b.category && t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            return catExpense > b.limit;
        }).length;
        budgetScore = ((budgets.length - exceededCount) / budgets.length) * 40;
    } else {
        budgetScore = 40; // No budgets set is slightly neutral but if expenses are fine, it's ok
    }

    // 3. Debt/Income or Expense/Income ratio (20%)
    const ratioScore = income > 0 ? (1 - (expenses / income)) * 20 : 0;

    const totalScore = Math.max(0, Math.min(Math.round(savingsScore + budgetScore + ratioScore), 100));
    return totalScore;
}

export function generateInsights(transactions: Transaction[], budgets: Budget[]) {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTransactions = transactions.filter((t) =>
        isWithinInterval(new Date(t.date), { start: thisMonthStart, end: thisMonthEnd })
    );

    const lastMonthTransactions = transactions.filter((t) =>
        isWithinInterval(new Date(t.date), { start: lastMonthStart, end: lastMonthEnd })
    );

    const insights: string[] = [];

    // Income vs Expenses
    const thisMonthIncome = thisMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const thisMonthExpenses = thisMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    if (thisMonthExpenses > thisMonthIncome && thisMonthIncome > 0) {
        insights.push(`You spent ${Math.round((thisMonthExpenses / thisMonthIncome) * 100)}% of your income this month.`);
    }

    // Budget exceeded
    budgets.forEach(b => {
        const catExpense = thisMonthTransactions
            .filter(t => t.category === b.category && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        if (catExpense > b.limit) {
            insights.push(`You exceeded your ${b.category} budget by ${Math.round(catExpense - b.limit)}`);
        }
    });

    // Increased spending
    const categories = Array.from(new Set(transactions.map(t => t.category)));
    categories.forEach(cat => {
        const thisMonthCat = thisMonthTransactions.filter(t => t.category === cat && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const lastMonthCat = lastMonthTransactions.filter(t => t.category === cat && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        if (lastMonthCat > 0 && thisMonthCat > lastMonthCat * 1.2) {
            insights.push(`Your ${cat} spending increased by ${Math.round(((thisMonthCat - lastMonthCat) / lastMonthCat) * 100)}% compared to last month.`);
        }
    });

    return insights;
}
