import React from "react";
import { motion } from "framer-motion";
import { CheckBadgeIcon, GlobeAsiaAustraliaIcon, BoltIcon, ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/solid";

const reasons = [
    {
        title: "Built on Trust",
        description: "Your data and future are secure with us — always private, always protected.",
        icon: ShieldCheckIcon,
        color: "#0b385f",
    },
    {
        title: "Completely Free",
        description: "No hidden charges. Learn, grow, and roadmap your future — absolutely free.",
        icon: CheckBadgeIcon,
        color: "#3373b0",
    },
    {
        title: "Made for India",
        description: "Localized for the Indian market with relevant jobs, paths & upskilling tips.",
        icon: GlobeAsiaAustraliaIcon,
        color: "#1c2127",
    },
    {
        title: "AI-Driven Intelligence",
        description: "Smart AI matches you with ideal careers based on your strengths.",
        icon: BoltIcon,
        color: "#bed4e9",
    },
    {
        title: "Future Focused",
        description: "Stay ahead with career paths aligned to future-proof and in-demand tech roles.",
        icon: SparklesIcon,
        color: "#e7f1fb",
    },
];

export default function WhyChooseUs() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-[#f8fbfe] py-20 px-6 sm:px-10 md:px-20"
        >
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#3373b0] mb-6">
                    Why Choose Us?
                </h2>
                <p className="text-[#4a5664] text-lg mb-12 max-w-xl mx-auto">
                    We're not just a platform — we're your career companion.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-[#d5e6f3] shadow-md rounded-2xl p-6 text-left hover:shadow-xl transition"
                        >
                            <div
                                className="w-14 h-14 flex items-center justify-center rounded-full mb-4"
                                style={{ backgroundColor: reason.color }}
                            >
                                <reason.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#1c2127] mb-2">
                                {reason.title}
                            </h3>
                            <p className="text-[#4a5664] text-sm">{reason.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
         <div className=" h-full flex justify-center mt-[2rem]  md:items-center"> 
                <button className="bg-[#3373b0] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0b385f] transition-all duration-300">
                    Get Started Free
                </button>
            </div>
        </motion.section>

    );
}
