import React from "react";
import { motion } from "framer-motion";

export default function CtaSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="pt-[6.5rem] py-16 px-6 sm:px-10 md:px-20 bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                {/* Left: Text Content */}
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
                        Confused About Your <span className="text-[var(--color-primary)]">Career?</span>
                        <br />
                        <span className="text-[var(--color-text)]">Let AI Guide You to the Right Path.</span>
                    </h2>
                    <p className="text-lg text-[var(--color-text)]/80 mb-6">
                        Get personalized career suggestions, skill roadmaps, and learning plans — just by entering your background and interests.
                    </p>
                    <div className="flex justify-center md:justify-start">
                        <button className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl font-semibold transition-all duration-300">
                            Get Started Free
                        </button>
                    </div>
                </div>

                {/* Right: Image */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/preview/girls-doing-ai-study-together-illustration-download-in-svg-png-gif-file-formats--analysis-learning-artificial-intelligence-stem-education-pack-school-illustrations-10031344.png?f=webp&h=1400"
                        alt="AI Career Help"
                        className="w-full max-w-[25rem] mx-auto rounded-xl shadow-xl"
                    />
                </motion.div>
            </div>
        </motion.section>
    );
}