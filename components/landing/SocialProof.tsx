"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const MotionImage = motion(Image);

export function SocialProof() {
    const logos = [
        { name: "Stellar", src: "/logos/stellar.png" },
        { name: "Quantum", src: "/logos/quantum.png" },
        { name: "Nexus", src: "/logos/nexus.png" },
        { name: "Orbit", src: "/logos/orbit.png" },
        { name: "Zenith", src: "/logos/zenith.png" },
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
                    className="flex justify-center items-center gap-x-16 gap-y-10 flex-wrap opacity-60 dark:opacity-40 grayscale hover:grayscale-0 transition-all duration-700 hover:opacity-100 dark:hover:opacity-100 dark:invert contrast-125"
                >
                    {logos.map((logo, index) => (
                        <MotionImage
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="h-8 w-auto object-contain mix-blend-multiply dark:mix-blend-normal"
                            src={logo.src}
                            alt={logo.name}
                            width={120}
                            height={40}
                        />
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
