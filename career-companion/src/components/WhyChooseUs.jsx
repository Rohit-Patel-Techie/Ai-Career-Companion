import React from "react";
import { motion } from "framer-motion";
import {
    CheckBadgeIcon,
    GlobeAsiaAustraliaIcon,
    BoltIcon,
    ShieldCheckIcon,
    SparklesIcon,
} from "@heroicons/react/24/solid";

const reasons = [
    {
        title: "Built on Trust",
        description: "Your data and future are secure with us — always private, always protected.",
        icon: ShieldCheckIcon,
        bg: "bg-[var(--color-primary-dark)]",
        iconColor: "text-white",
    },
    {
        title: "Completely Free",
        description: "No hidden charges. Learn, grow, and roadmap your future — absolutely free.",
        icon: CheckBadgeIcon,
        bg: "bg-[var(--color-primary)]",
        iconColor: "text-white",
    },
    {
        title: "Made for India",
        description: "Localized for the Indian market with relevant jobs, paths & upskilling tips.",
        icon: GlobeAsiaAustraliaIcon,
        bg: "bg-[var(--color-text)]",
        iconColor: "text-white",
    },
    {
        title: "AI-Driven Intelligence",
        description: "Smart AI matches you with ideal careers based on your strengths.",
        icon: BoltIcon,
        bg: "bg-[var(--color-muted)]",
        iconColor: "text-[var(--color-primary-dark)]",
    },
    {
        title: "Future Focused",
        description: "Stay ahead with career paths aligned to future-proof and in-demand tech roles.",
        icon: SparklesIcon,
        bg: "bg-[var(--color-accent)]",
        iconColor: "text-[var(--color-primary-dark)]",
    },
];

export default function WhyChooseUs() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-[var(--color-bg)] text-[var(--color-text)] py-20 px-6 sm:px-10 md:px-20 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-6">
                    Why Choose Us?
                </h2>
                <p className="text-lg opacity-80 mb-12 max-w-xl mx-auto">
                    We're not just a platform — we're your career companion.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[var(--color-muted)] hover:bg-[var(--color-accent)] border border-[var(--color-accent)] shadow-md rounded-2xl p-6 text-left hover:shadow-xl transition-colors duration-300"
                        >
                            <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-4 ${reason.bg}`}>
                                <reason.icon className={`w-7 h-7 ${reason.iconColor}`} />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                {reason.title}
                            </h3>
                            <p className="text-sm opacity-80">{reason.description}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center mt-12">
                    <button className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)] transition-all duration-300">
                        Get Started Free
                    </button>
                </div>
            </div>
        </motion.section>
    );
}