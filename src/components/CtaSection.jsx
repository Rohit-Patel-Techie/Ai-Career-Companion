import React from "react";
import { motion } from "framer-motion";

export default function CtaSection() {
    return (
       <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
    className="bg-white py-12 pt-20 sm:py-18 px-6 sm:px-10 md:px-20"
>
    <div className="max-w-7xl mx-auto mt-[1.5rem] grid md:grid-cols-2 gap-10 items-center">
        {/* Left - Text Content */}
        <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1c2127] mb-4">
                Confused About Your <span className="text-[#3373b0] rounded-sm">Career?</span> Let AI Guide You to the Right Path.
            </h2>
            <p className="text-[#4a5664] text-lg mb-6">
                Get personalized career suggestions, skill roadmaps, and learning plans — just by entering your background and interests.
            </p>
            <div className="h-full flex justify-center md:justify-start md:items-center">
                <button className="bg-[#3373b0] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0b385f] transition-all duration-300">
                    Get Started Free
                </button>
            </div>
        </div>

        {/* Right - Image */}
        <div>
            <img
                src="https://cdni.iconscout.com/illustration/premium/preview/girls-doing-ai-study-together-illustration-download-in-svg-png-gif-file-formats--analysis-learning-artificial-intelligence-stem-education-pack-school-illustrations-10031344.png?f=webp&h=1400"
                alt="AI CTA Visual"
                className="w-full lg:[25rem] rounded-xl shadow-lg"
            />
        </div>
    </div>
</motion.section>

    );
}