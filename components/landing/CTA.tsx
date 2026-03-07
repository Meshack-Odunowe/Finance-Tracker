"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
    return (
        <section className="relative overflow-hidden bg-slate-900 py-32 rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-16 shadow-2xl">

            {/* Background radial gradients */}
            <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform-gpu blur-3xl" aria-hidden="true">
                <div
                    className="aspect-[1000/600] w-[60rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">

                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6"
                >
                    Start tracking your finances today.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl leading-8 text-slate-300 max-w-2xl mx-auto mb-10 text-pretty"
                >
                    Join and take control of your financial future. It takes less than 30 seconds to set up your account.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/auth/register"
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-[15px] font-medium text-slate-900 shadow-sm hover:bg-indigo-50 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                    >
                        Create Free Account
                        <ArrowRight className="ml-2 h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/auth/login"
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-transparent border border-slate-600 px-8 py-3.5 text-[15px] font-medium text-white hover:bg-slate-800 transition-all hover:border-slate-500"
                    >
                        Log in to Dashboard
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
