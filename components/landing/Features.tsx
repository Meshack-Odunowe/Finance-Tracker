"use client";

import { motion } from "framer-motion";
import { LineChart, BarChart2, ShieldCheck, Wallet, RefreshCw, Zap } from "lucide-react";

export function Features() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const features = [
        {
            name: "Track Income & Expenses",
            description: "Log your daily transactions effortlessly with our incredibly fast and intuitive interface.",
            icon: Wallet,
            color: "bg-blue-50 text-blue-600 ring-blue-100"
        },
        {
            name: "Visualize Spending",
            description: "Get a clear picture of where your money goes with beautiful, interactive charts.",
            icon: PieChartIcon,
            color: "bg-indigo-50 text-indigo-600 ring-indigo-100"
        },
        {
            name: "Set Category Budgets",
            description: "Create custom budgets for specific categories and monitor your progress instantly.",
            icon: BarChart2,
            color: "bg-violet-50 text-violet-600 ring-violet-100"
        },
        {
            name: "Instant Insights",
            description: "The dashboard calculates your remaining balances and category totals automatically.",
            icon: Zap,
            color: "bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-100"
        },
        {
            name: "Clean Transaction History",
            description: "Search, filter, and review all your historical financial data securely in one place.",
            icon: LineChart,
            color: "bg-emerald-50 text-emerald-600 ring-emerald-100"
        },
        {
            name: "Secure Account System",
            description: "Your financial data is protected by industry-standard encryption and secure OTP login.",
            icon: ShieldCheck,
            color: "bg-slate-50 text-slate-600 ring-slate-100"
        }
    ];

    return (
        <section id="features" className="bg-[#fbfbfc] py-24 sm:py-32 border-t border-slate-100 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-[15px] font-semibold tracking-wide uppercase text-indigo-600 mb-3">
                        Everything you need
                    </h2>
                    <p className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-pretty">
                        Powerful features to manage your wealth.
                    </p>
                    <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
                        We stripped away the clutter to give you the exact tools you need to build better financial habits.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
                >
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <motion.div key={feature.name} variants={item} className="flex flex-col group p-6 bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow hover:border-slate-300">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-inset ${feature.color} transition-colors`}>
                                        <feature.icon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto text-[15px] text-slate-500">{feature.description}</p>
                                </dd>
                            </motion.div>
                        ))}
                    </dl>
                </motion.div>
            </div>
        </section>
    );
}

// Temporary internal component for standard PieChart icon missing in standard import array
function PieChartIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
    )
}
