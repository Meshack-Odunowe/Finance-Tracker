"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Menu, Wallet } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function DashboardHeader() {
    const router = useRouter();
    const { toggleMobileMenu } = useUIStore();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch the logged in user's profile info
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/me");
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Failed to fetch user context", error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (response.ok) {
                toast.success('Logged out successfully');
                router.push('/auth/login');
                router.refresh();
            }
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const userInitials = user?.name
        ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
        : "?";

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8 shrink-0 transition-colors">

            {/* Mobile Title - Hidden on Desktop since Sidebar has it */}
            <div className="flex items-center md:hidden">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 shadow-sm shadow-indigo-200 dark:shadow-indigo-900">
                    <Wallet className="h-4 w-4 text-white" />
                </div>
                <span className="ml-3 text-[15px] font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Capital</span>
            </div>

            <div className="hidden md:flex flex-1" />

            {/* Right Actions / Profile */}
            <div className="flex items-center space-x-4">

                <ThemeToggle />

                {/* Profile Dropdown */}
                <div className="relative inline-block text-left z-50" ref={menuRef}>
                    <div>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-3 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 p-1 pr-3 transition-colors outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-semibold text-sm ring-1 ring-slate-200/50 dark:ring-slate-700">
                                {userInitials}
                            </div>
                            <div className="hidden sm:flex flex-col items-start">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-none">
                                    {user?.name || "Loading..."}
                                </span>
                            </div>
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-slate-100 dark:divide-slate-800 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg ring-1 ring-black/5 focus:outline-none overflow-hidden animate-in fade-in slide-in-from-top-2 duration-100">
                            <div className="px-4 py-3">
                                <p className="text-sm truncate font-medium text-slate-900 dark:text-white">
                                    {user?.name}
                                </p>
                                <p className="text-xs truncate text-slate-500 dark:text-slate-400 mt-0.5">
                                    {user?.email}
                                </p>
                            </div>

                            <div className="p-1">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        router.push('/auth/change-password');
                                    }}
                                    className="group flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                    <User className="mr-3 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                                    Account Settings
                                </button>
                            </div>

                            <div className="p-1">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="group flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
                                >
                                    <LogOut className="mr-3 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={toggleMobileMenu}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden shrink-0"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
