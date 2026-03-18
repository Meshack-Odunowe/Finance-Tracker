'use client';

import { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Moon,
    Sun,
    Languages,
    CreditCard,
    LogOut,
    Download,
    Trash2,
    CheckCircle2,
    LayoutDashboard
} from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { useFinanceStore } from '@/store/useFinanceStore';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { userPreferences, updatePreferences, widgets, toggleWidget } = useFinanceStore();
    const [isExporting, setIsExporting] = useState(false);

    const currency = userPreferences?.preferredCurrency || 'NGN';

    const handleExport = async (format: 'csv' | 'json') => {
        setIsExporting(true);
        try {
            const response = await fetch(`/api/export?format=${format}`);
            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `finance_data_${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success('Data exported successfully');
        } catch (error) {
            toast.error('Failed to export data');
        } finally {
            setIsExporting(false);
        }
    };

    const savePreferences = async (updates: any) => {
        try {
            await updatePreferences(updates);
            if (updates.themePreference) {
                setTheme(updates.themePreference);
            }
            toast.success('Preferences saved');
        } catch (error) {
            toast.error('Failed to save preferences');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your account and app preferences.</p>
            </header>

            <div className="space-y-8">
                {/* Visual Preferences */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                            <Sun className="h-5 w-5 text-indigo-500" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Appearance</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Theme Mode</Label>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                                <button
                                    onClick={() => { savePreferences({ themePreference: 'light' }); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Sun className="h-4 w-4" /> Light
                                </button>
                                <button
                                    onClick={() => { savePreferences({ themePreference: 'dark' }); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-slate-900 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}
                                >
                                    <Moon className="h-4 w-4" /> Dark
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Preferred Currency</Label>
                            <Select value={currency} onValueChange={(val) => { savePreferences({ preferredCurrency: val }); }}>
                                <SelectTrigger className="w-full h-11 bg-slate-50/50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                    <SelectItem value="NGN">NGN (₦)</SelectItem>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                    <SelectItem value="GBP">GBP (£)</SelectItem>
                                    <SelectItem value="CAD">CAD ($)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                {/* Dashboard Customization */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                            <LayoutDashboard className="h-5 w-5 text-amber-500" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dashboard Layout</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { id: 'Summary', label: 'Summary Cards' },
                            { id: 'HealthScore', label: 'Health Score' },
                            { id: 'Insights', label: 'Financial Insights' },
                            { id: 'Trends', label: 'Income/Expense Trends' },
                            { id: 'CategoryTrends', label: 'Category Trends' },
                            { id: 'SpendingSplit', label: 'Spending Pie Chart' },
                            { id: 'CategoryComparison', label: 'Category Comparison' },
                            { id: 'RecentTransactions', label: 'Recent Transactions' },
                            { id: 'ActivityLog', label: 'Activity Timeline' },
                            { id: 'SavingsGoals', label: 'Savings Goals' },
                            { id: 'BudgetProgress', label: 'Budget Progress' },
                        ].map((widgetItem) => {
                            const widgetData = widgets.find(w => w.name === widgetItem.id);
                            const isVisible = widgetData ? widgetData.isVisible : true;

                            return (
                                <div key={widgetItem.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{widgetItem.label}</span>
                                    <button
                                        onClick={() => toggleWidget(widgetItem.id, !isVisible)}
                                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${isVisible ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${isVisible ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Data Management */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                            <Download className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Data & Export</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => handleExport('csv')}
                            disabled={isExporting}
                            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold group"
                        >
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Export as CSV</span>
                            </div>
                            <Download className="h-4 w-4 text-slate-400" />
                        </button>
                        <button
                            onClick={() => handleExport('json')}
                            disabled={isExporting}
                            className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold group"
                        >
                            <div className="flex items-center gap-3">
                                <Shield className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Export as JSON</span>
                            </div>
                            <Download className="h-4 w-4 text-slate-400" />
                        </button>
                    </div>
                </section>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to delete your account? This action is permanent.')) {
                                toast.error('This feature is disabled for safety during the showcase.');
                            }
                        }}
                        className="flex items-center gap-2 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold text-sm transition-colors"
                    >
                        <Trash2 className="h-4 w-4" /> Delete Account
                    </button>

                    <button
                        onClick={() => {
                            window.location.href = '/api/logout'; // Should use proper NextAuth signOut or similar
                        }}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold text-sm transition-colors"
                    >
                        <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
