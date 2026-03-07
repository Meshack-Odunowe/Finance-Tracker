"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

export function Footer() {
    const navigation = {
        product: [
            { name: "Features", href: "#features" },
            { name: "Preview", href: "#product-preview" },
            { name: "How it works", href: "#how-it-works" },
            { name: "Benefits", href: "#benefits" },
            { name: "Pricing", href: "#" },
        ],
        legal: [
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
            { name: "Cookie Policy", href: "#" },
        ],
        account: [
            { name: "Log in", href: "/auth/login" },
            { name: "Sign Up", href: "/auth/register" },
            { name: "Forgot Password", href: "/auth/forgot-password" },
        ],
    };

    return (
        <footer className="bg-white border-t border-slate-200" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">

                    <div className="space-y-8 xl:col-span-1">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                                <Wallet className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-[17px] font-bold text-slate-900 tracking-tight">Capital</span>
                        </Link>
                        <p className="text-sm leading-6 text-slate-500 max-w-xs">
                            A modern personal finance tracker designed to help you understand and manage your money effectively.
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-slate-900">Product</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.product.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                onClick={(e) => {
                                                    if (item.href.startsWith("#")) {
                                                        e.preventDefault();
                                                        const element = document.querySelector(item.href);
                                                        if (element) {
                                                            element.scrollIntoView({ behavior: 'smooth' });
                                                        }
                                                    }
                                                }}
                                                className="text-sm leading-6 text-slate-500 hover:text-indigo-600 transition-colors"
                                            >
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-slate-900">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.legal.map((item) => (
                                        <li key={item.name}>
                                            <a href={item.href} className="text-sm leading-6 text-slate-500 hover:text-indigo-600 transition-colors">
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-1 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-slate-900">Account</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.account.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm leading-6 text-slate-500 hover:text-indigo-600 transition-colors">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-16 border-t border-slate-900/10 pt-8 sm:mt-20 lg:mt-24 flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-xs leading-5 text-slate-500">
                        &copy; {new Date().getFullYear()} Capital Finance. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}
