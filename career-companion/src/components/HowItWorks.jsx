import React from "react";
import { motion } from "framer-motion";
import {
    AcademicCapIcon,
    CpuChipIcon,
    RocketLaunchIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const steps = [
    {
        title: "Step 1: Input Your Education & Skills",
        description: "Start by telling us what you’ve studied and what you already know.",
        icon: AcademicCapIcon,
        bg: "bg-[var(--color-muted)]",
        iconColor: "text-[var(--color-primary-dark)]",
    },
    {
        title: "Step 2: AI Suggests Best Career Options",
        description: "Our AI instantly analyzes your profile and recommends suitable tech careers.",
        icon: CpuChipIcon,
        bg: "bg-[var(--color-primary-dark)]",
        iconColor: "text-white",
    },
    {
        title: "Step 3: Follow Your Personalized Skill Roadmap",
        description: "Get a roadmap tailored to your career goal, and start progressing step-by-step.",
        icon: RocketLaunchIcon,
        bg: "bg-[var(--color-primary)]",
        iconColor: "text-white",
    },
];

export default function HowItWorks() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[var(--color-bg)] text-[var(--color-text)] px-6 pt-20 pb-24 sm:px-10 md:px-20 transition-colors duration-300"
        >
            <div className="max-w-6xl mx-auto">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)]">
                        How It Works
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto text-[var(--color-text)] opacity-80">
                        A simple 3-step process to launch your career with AI-guided support.
                    </p>
                </div>

                {/* Step Cards */}
                <div className="relative grid gap-10 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="relative bg-[var(--color-muted)] hover:bg-[var(--color-accent)] border border-[var(--color-accent)] p-6 rounded-xl shadow-sm transition-all text-center"
                        >
                            <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-5 ${step.bg}`}>
                                <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                            </div>

                            <h3 className="text-lg font-semibold mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm opacity-80">{step.description}</p>

                            {/* Arrow between cards */}
                            {index < steps.length - 1 && (
                                <ArrowRightIcon
                                    className="hidden md:block absolute right-[-1.6rem] top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary-dark)]"
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}