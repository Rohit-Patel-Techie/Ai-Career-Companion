import React from "react";
import { motion } from "framer-motion";
import { AcademicCapIcon, CpuChipIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const steps = [
    {
        title: "Step 1: Input Your Education & Skills",
        description: "Start by telling us what you’ve studied and what you already know.",
        icon: AcademicCapIcon,
        bg: "bg-[#bed4e9]",
    },
    {
        title: "Step 2: AI Suggests Best Career Options",
        description: "Our AI instantly analyzes your profile and recommends suitable tech careers.",
        icon: CpuChipIcon,
        bg: "bg-[#0b385f]",
    },
    {
        title: "Step 3: Follow Your Personalized Skill Roadmap",
        description: "Get a roadmap tailored to your career goal, and start progressing step-by-step.",
        icon: RocketLaunchIcon,
        bg: "bg-[#3373b0]",
    },
];

export default function HowItWorks() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white  px-6 pt-10 pb-20 sm:px-10 md:px-20"
        >
            <div className="max-w-6xl mx-auto mt-[-1rem]">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c2127] relative inline-block">
                        <span className="relative z-10 text-[#3373b0]">How It Works</span>
                    </h2>
                    <p className="text-[#4a5664] text-lg max-w-2xl mx-auto">
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
                            className="relative bg-[#e7f1fb] hover:bg-[#d5e6f3] transition-all border border-[#c6dcee] p-6 rounded-xl shadow-md text-center"
                        >
                            <div
                                className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-5 ${step.bg}`}
                            >
                                <step.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#1c2127] mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm text-[#4a5664]">{step.description}</p>

                            {/* Arrow between cards */}
                            {index < steps.length - 1 && (
                                <ArrowRightIcon
                                    className="hidden md:block absolute right-[-30px] top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#0b385f]"
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
