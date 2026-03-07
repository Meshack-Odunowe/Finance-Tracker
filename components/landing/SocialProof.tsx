"use client";

import { motion } from "framer-motion";

export function SocialProof() {
    const logos = [
        { name: "Tuple", src: "https://tailwindui.com/plus/img/logos/158x48/tuple-logo-gray-400.svg" },
        { name: "Reform", src: "https://tailwindui.com/plus/img/logos/158x48/reform-logo-gray-400.svg" },
        { name: "SavvyCal", src: "https://tailwindui.com/plus/img/logos/158x48/savvycal-logo-gray-400.svg" },
        { name: "Statamic", src: "https://tailwindui.com/plus/img/logos/158x48/statamic-logo-gray-400.svg" },
    ];

    return (
        <section className="bg-white dark:bg-slate-900/50 py-12 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <p className="text-center text-[13px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-8">
                    Designed for clarity and simplicity
                </p>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center items-center gap-x-12 gap-y-6 flex-wrap opacity-50 dark:opacity-40 grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100 dark:hover:opacity-100 dark:invert"
                >
                    {logos.map((logo, index) => (
                        <img
                            key={index}
                            className="col-span-2 max-h-8 w-full object-contain sm:col-start-2 lg:col-span-1"
                            src={logo.src}
                            alt={logo.name}
                        />
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
