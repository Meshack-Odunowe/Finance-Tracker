"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart2, PieChart, ShieldCheck } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-[#fbfbfc] pt-[120px] pb-[80px] lg:pt-[180px] lg:pb-[140px]">

            {/* Background radial gradients */}
            <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl" aria-hidden="true">
                <div
                    className="aspect-[1200/800] w-[75rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-[0.15]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 mb-8"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                        <span className="text-[13px] font-medium text-slate-700">Capital Finance v1.0 is live</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]"
                    >
                        Take Control of <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                            Your Money
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Track your income, understand your spending, and stay on budget with a simple and powerful personal finance dashboard built for clarity.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/auth/register"
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3.5 text-[15px] font-medium text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                        >
                            Start Tracking for Free
                            <ArrowRight className="ml-2 h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#product-preview"
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-8 py-3.5 text-[15px] font-medium text-slate-700 hover:bg-slate-50 transition-all hover:border-slate-300"
                        >
                            View Demo
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500"
                    >
                        <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Encryption</div>
                        <div className="flex items-center gap-1.5"><BarChart2 className="w-4 h-4 text-indigo-500" /> Real-time Analytics</div>
                        <div className="hidden sm:flex items-center gap-1.5"><PieChart className="w-4 h-4 text-violet-500" /> Smart Categorization</div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
