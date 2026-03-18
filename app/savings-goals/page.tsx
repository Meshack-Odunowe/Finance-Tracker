'use client';

import { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useHydration } from '@/hooks/useHydration';
import { SavingsGoalProgress } from '@/components/SavingsGoalProgress';
import { Plus, Target, Trash2, Edit2, Wallet, Calendar } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { toast } from 'sonner';

export default function SavingsGoalsPage() {
    const isHydrated = useHydration();
    const { savingsGoals, addSavingsGoal, deleteSavingsGoal, updateSavingsGoal } = useFinanceStore();
    const { format, currency } = useCurrency();
    const [isAdding, setIsAdding] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: '', targetAmount: 0, currentAmount: 0, deadline: '' });

    if (!isHydrated) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (newGoal.targetAmount <= 0) throw new Error('Target amount must be positive');
            await addSavingsGoal({
                ...newGoal,
                deadline: newGoal.deadline || undefined,
            });
            toast.success('Savings goal added!');
            setIsAdding(false);
            setNewGoal({ name: '', targetAmount: 0, currentAmount: 0, deadline: '' });
        } catch (error: any) {
            toast.error(error.message || 'Failed to add savings goal');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight transition-colors">
                        Savings Goals
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 transition-colors font-medium">
                        Plan and track your future milestones.
                    </p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="mt-4 sm:ml-16 sm:mt-0 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-500 transition-all active:scale-95"
                >
                    <Plus className="h-4 w-4" /> New Goal
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isAdding && (
                    <form
                        onSubmit={handleSubmit}
                        className="p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 animate-in slide-in-from-top-4 duration-300"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                                <Target className="h-4 w-4 text-indigo-500" />
                            </div>
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[11px]">New Goal</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider block">Goal Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. New Macbook Pro"
                                    value={newGoal.name}
                                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider block">Target ({currency === 'NGN' ? '₦' : currency})</label>
                                    <input
                                        type="number"
                                        required
                                        value={newGoal.targetAmount || ''}
                                        onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider block">Saved ({currency === 'NGN' ? '₦' : currency})</label>
                                    <input
                                        type="number"
                                        value={newGoal.currentAmount || ''}
                                        onChange={(e) => setNewGoal({ ...newGoal, currentAmount: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider block">Target Date (Optional)</label>
                                <input
                                    type="date"
                                    value={newGoal.deadline}
                                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-bold shadow-md shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-500 transition-all active:scale-95"
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl py-2.5 text-sm font-bold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {savingsGoals.map((goal) => (
                    <div key={goal.id} className="relative group p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/20">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <Wallet className="h-5 w-5 text-indigo-500" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => deleteSavingsGoal(goal.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{goal.name}</h3>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-1.5 uppercase tracking-widest">
                            <Calendar className="h-3 w-3" />
                            {goal.deadline ? new Date(goal.deadline).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'No deadline'}
                        </p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Saved</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{format(goal.currentAmount)}</p>
                                </div>
                                <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg">
                                    {Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)}%
                                </p>
                            </div>

                            <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-1000 ease-out rounded-full"
                                    style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                                />
                            </div>

                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-400">Goal: {format(goal.targetAmount)}</span>
                                <span className="text-emerald-500">{format(Math.max(goal.targetAmount - goal.currentAmount, 0))} remaining</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                            <button
                                onClick={() => {
                                    const amt = prompt('Add amount to savings:');
                                    if (amt) updateSavingsGoal(goal.id, { currentAmount: goal.currentAmount + parseFloat(amt) });
                                }}
                                className="w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-[13px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                            >
                                Contribute Funds
                            </button>
                        </div>
                    </div>
                ))}

                {savingsGoals.length === 0 && !isAdding && (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                            <Target className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Start your first goal</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2">
                            Save for a house, car, or a rainy day. Track your progress here.
                        </p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-500 transition-all"
                        >
                            <Plus className="h-4 w-4" /> Create Goal
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
