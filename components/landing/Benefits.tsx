"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function Benefits() {
    const benefits = [
        "Gain clarity over your finances",
        "Stay within your personalized budget",
        "Make smarter daily spending decisions",
        "Build long-term positive financial habits",
        "Securely access data from any device",
        "Save money by identifying useless subscriptions"
    ];

    return (
        <section id="benefits" className="bg-[#f8fafc] dark:bg-slate-900/50 py-24 sm:py-32 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">

                        {/* Left Image Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="relative max-w-lg lg:max-w-none mx-auto w-full aspect-[4/3] bg-indigo-50 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700 flex items-center justify-center p-8 transition-colors"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-white/50 dark:from-slate-800 dark:to-slate-900/50" />
                            <div className="relative z-10 w-full h-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col justify-end transition-colors">
                                <div className="h-4/5 w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg overflow-hidden flex items-end justify-center space-x-4 p-4 transition-colors">
                                    <div className="w-12 bg-indigo-200 dark:bg-indigo-900/40 rounded-t-sm h-1/4" />
                                    <div className="w-12 bg-indigo-300 dark:bg-indigo-800/40 rounded-t-sm h-1/2" />
                                    <div className="w-12 bg-indigo-400 dark:bg-indigo-600/60 rounded-t-sm h-3/4" />
                                    <div className="w-12 bg-indigo-500 dark:bg-indigo-500 rounded-t-sm h-full" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mx-auto max-w-xl text-left"
                        >
                            <h2 className="text-[15px] font-semibold tracking-wide uppercase text-indigo-600 dark:text-indigo-400 mb-3">
                                Why use Capital?
                            </h2>
                            <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl text-pretty mb-6">
                                A tracker that works as hard as you do.
                            </p>
                            <p className="text-lg leading-8 text-slate-600 dark:text-slate-400 mb-8">
                                Stop guessing where your money went at the end of every month. Start tracking. Capital brings peace of mind to your financial life.
                            </p>

                            <dl className="mt-10 max-w-xl space-y-4 text-base leading-7 text-slate-600 dark:text-slate-400 lg:max-w-none">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={benefit}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                        className="relative pl-9"
                                    >
                                        <dt className="inline font-medium text-slate-900 dark:text-slate-300">
                                            <CheckCircle2 className="absolute left-1 top-1 h-5 w-5 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
                                            {benefit}
                                        </dt>
                                    </motion.div>
                                ))}
                            </dl>
                        </motion.div>

                    </div>
                </div>

            </div>
        </section>
    );
}
