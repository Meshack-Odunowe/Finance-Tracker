"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "How it works", href: "#how-it-works" },
        { name: "Benefits", href: "#benefits" },
        { name: "Pricing", href: "#pricing" },
    ];

    return (
        <>
            <header
                className={clsx(
                    "fixed top-0 inset-x-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm py-3"
                        : "bg-transparent py-5"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                                    <Wallet className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-[17px] font-bold text-slate-900 tracking-tight">Capital</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <div className="flex items-center gap-6">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => {
                                            if (link.href.startsWith("#")) {
                                                e.preventDefault();
                                                const element = document.querySelector(link.href);
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }
                                        }}
                                        className="text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                                <Link
                                    href="/auth/login"
                                    className="text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-[14px] font-medium text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </nav>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>

                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-[60px] z-40 bg-white border-b border-slate-200 shadow-lg md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => {
                                        setIsMobileMenuOpen(false);
                                        if (link.href.startsWith("#")) {
                                            e.preventDefault();
                                            const element = document.querySelector(link.href);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }
                                    }}
                                    className="text-[15px] font-medium text-slate-700 py-2 border-b border-slate-100"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="flex flex-col gap-3 pt-2">
                                <Link
                                    href="/auth/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-3 text-[15px] font-medium text-slate-900 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/auth/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-[15px] font-medium text-white shadow-sm hover:bg-indigo-500 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
