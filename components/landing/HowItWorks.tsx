"use client";

import { motion } from "framer-motion";
import { UserPlus, PlusCircle, LineChart } from "lucide-react";

export function HowItWorks() {
    const steps = [
        {
            id: "01",
            name: "Create an account",
            description: "Sign up securely in seconds. We use a simple OTP email verification to keep your data private.",
            icon: UserPlus,
        },
        {
            id: "02",
            name: "Add your income and expenses",
            description: "Log your daily transactions and assign them to custom categories to build your ledger.",
            icon: PlusCircle,
        },
        {
            id: "03",
            name: "Understand your financial habits",
            description: "Review automated charts and budget trackers to see exactly where your money goes.",
            icon: LineChart,
        },
    ];

    return (
        <section id="how-it-works" className="bg-white dark:bg-slate-900 py-24 sm:py-32 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-[15px] font-semibold tracking-wide uppercase text-indigo-600 dark:text-indigo-400 mb-3">
                        Getting Started
                    </h2>
                    <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Three simple steps to financial clarity.
                    </p>
                </div>

                <div className="mt-16 lg:mt-24">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8 relative">

                        {/* Connecting line for desktop */}
                        <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-slate-100 dark:bg-slate-800 z-0 transition-colors"></div>

                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center"
                            >
                                <div className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white dark:bg-slate-800 border-[6px] border-[#fbfbfc] dark:border-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 transition-colors">
                                    <step.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                                </div>

                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                    <span className="text-indigo-600 dark:text-indigo-400 mr-2 text-sm">{step.id}.</span>
                                    {step.name}
                                </h3>

                                <p className="text-slate-500 dark:text-slate-400 max-w-xs">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
