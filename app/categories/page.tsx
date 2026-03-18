'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useHydration } from '@/hooks/useHydration';
import { Plus, Tag, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/utils/categoryHelpers';

export default function CategoriesPage() {
    const isHydrated = useHydration();
    const { categories, fetchData } = useFinanceStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', type: 'expense' });

    if (!isHydrated) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!newCat.name.trim()) throw new Error('Category name required');

            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCat),
            });

            if (!res.ok) throw new Error('Failed to create category');

            toast.success('Custom category added!');
            setIsAdding(false);
            setNewCat({ name: '', type: 'expense' });
            fetchData(); // Reload categories in store
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            toast.success('Category deleted');
            fetchData();
        } catch (error) {
            toast.error('Could not delete category');
        }
    };

    const systemCategories = [
        ...INCOME_CATEGORIES.map(name => ({ name, type: 'income', isSystem: true })),
        ...EXPENSE_CATEGORIES.map(name => ({ name, type: 'expense', isSystem: true })),
    ];

    const userCategories = categories.map(c => ({ ...c, isSystem: false }));
    const allCurrent = [...systemCategories, ...userCategories];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl transition-colors">
                        Categories
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">
                        Organize your finances with custom labels.
                    </p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="mt-4 sm:ml-16 sm:mt-0 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-500 transition-all active:scale-95"
                >
                    <Plus className="h-4 w-4" /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Income Categories */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Income</h2>
                    </div>

                    <div className="grid gap-3">
                        {allCurrent.filter(c => c.type === 'income').map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all group hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                                        <Tag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
                                    {cat.isSystem && (
                                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">Default</span>
                                    )}
                                </div>
                                {!cat.isSystem && (
                                    <button
                                        onClick={() => handleDelete((cat as any).id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Expense Categories */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowDownCircle className="h-5 w-5 text-rose-500" />
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Expenses</h2>
                    </div>

                    <div className="grid gap-3">
                        {allCurrent.filter(c => c.type === 'expense').map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all group hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg">
                                        <Tag className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
                                    {cat.isSystem && (
                                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded">Default</span>
                                    )}
                                </div>
                                {!cat.isSystem && (
                                    <button
                                        onClick={() => handleDelete((cat as any).id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Create New Category</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newCat.name}
                                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Type</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewCat({ ...newCat, type: 'income' })}
                                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${newCat.type === 'income' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                                    >
                                        Income
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewCat({ ...newCat, type: 'expense' })}
                                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${newCat.type === 'expense' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                                    >
                                        Expense
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-6">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 font-bold shadow-lg shadow-indigo-100">Create</button>
                                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl py-2.5 font-bold">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
