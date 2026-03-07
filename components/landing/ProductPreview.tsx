"use client";

import { motion } from "framer-motion";

export function ProductPreview() {
    return (
        <section id="product-preview" className="bg-slate-900 py-24 sm:py-32 relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-indigo-500/10 to-transparent" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-[15px] font-semibold tracking-wide uppercase text-indigo-400 mb-3">
                        Dashboard Preview
                    </h2>
                    <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Clarity at a glance.
                    </p>
                    <p className="mt-4 text-lg text-slate-400">
                        A beautiful, intuitive dashboard designed to help you quickly understand your financial health right when you log in.
                    </p>
                </div>

                {/* Dashboard Mockup Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mx-auto max-w-5xl rounded-2xl bg-slate-800/40 p-2 sm:p-4 border border-slate-700/50 shadow-2xl backdrop-blur-xl"
                >
                    <div className="overflow-hidden rounded-xl bg-[#fbfbfc] ring-1 ring-slate-900/10 h-auto sm:h-[600px] flex flex-col shadow-inner">

                        {/* Mock Header */}
                        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-6 shrink-0 bg-white">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-indigo-600" />
                                <div className="h-4 w-20 rounded bg-slate-200" />
                            </div>
                            <div className="h-8 w-8 rounded-full bg-slate-200" />
                        </div>

                        {/* Mock Content area */}
                        <div className="flex-1 p-6 md:p-8 space-y-6 flex flex-col">

                            {/* Header Texts */}
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <div className="h-6 w-32 rounded bg-slate-800 mb-2" />
                                    <div className="h-4 w-48 rounded bg-slate-400" />
                                </div>
                                <div className="h-9 w-32 rounded bg-indigo-600 hidden sm:block" />
                            </div>

                            {/* Top Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="hidden sm:flex h-32 rounded-xl bg-white border border-slate-200 p-5 flex-col justify-between">
                                        <div className="h-4 w-24 rounded bg-slate-200" />
                                        <div className="h-8 w-32 rounded bg-slate-800" />
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Layout Split */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">

                                {/* Left Charts Placeholder */}
                                <div className="hidden sm:flex md:col-span-2 rounded-xl bg-white border border-slate-200 p-5 flex-col">
                                    <div className="h-4 w-32 rounded bg-slate-800 mb-6" />
                                    <div className="flex-1 rounded-lg bg-slate-50 border border-slate-100 flex items-end justify-around p-4 pb-0">
                                        {[35, 65, 40, 80, 50, 95, 70].map((height, i) => (
                                            <div key={i} className="w-8 rounded-t-sm bg-indigo-200/50" style={{ height: `${height}%` }} />
                                        ))}
                                    </div>
                                </div>

                                {/* Right List Placeholder */}
                                <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col">
                                    <div className="h-4 w-32 rounded bg-slate-800 mb-6" />
                                    <div className="space-y-4 flex-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100" />
                                                    <div className="h-3 w-20 rounded bg-slate-300" />
                                                </div>
                                                <div className="h-3 w-12 rounded bg-slate-400" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Subtle reflection at the bottom container */}
                    <div className="absolute inset-x-8 -bottom-4 h-4 bg-indigo-500/20 blur-xl" />
                </motion.div>

                {/* Feature Captions Underneath */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                    <div>
                        <h3 className="text-white font-semibold mb-2">Visualize Expenses</h3>
                        <p className="text-slate-400 text-sm">Instantly see where your money goes each month using clear bar and pie charts.</p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-2">Category Budgets</h3>
                        <p className="text-slate-400 text-sm">Track how close you are to spending your allocated budget limits.</p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-2">Quick Transactions</h3>
                        <p className="text-slate-400 text-sm">Add or review your latest activities with the built-in mini ledger.</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
