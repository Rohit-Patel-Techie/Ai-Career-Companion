import React from "react";
import { motion } from "framer-motion";
import { BriefcaseIcon, AcademicCapIcon, SparklesIcon } from "@heroicons/react/24/solid";

const features = [
  {
    title: "AI Career Suggestions",
    description:
      "Instantly get role recommendations like Data Analyst, Web Developer or ML Engineer based on your skills.",
    icon: BriefcaseIcon,
    bg: "bg-[#3373b0]",
  },
  {
    title: "Skill Roadmaps",
    description:
      "Personalized step-by-step skill paths tailored to your career goals and current strengths.",
    icon: AcademicCapIcon,
    bg: "bg-[#0b385f]",
  },
  {
    title: "Progress Tracking",
    description:
      "Visually track your roadmap completion with percentages and unlock badges as you learn.",
    icon: SparklesIcon,
    bg: "bg-[#bed4e9]",
  },
];

export default function HomePageCards() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-[#e7f1fb] py-20 px-6 sm:px-10 md:px-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c2127] mb-4">
            Explore What You Get
          </h2>
          <p className="text-[#3373b0] text-lg max-w-2xl mx-auto">
            Our AI-powered tools help you find your ideal career path and guide you every step of the way.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all border border-[#d5e6f3]"
            >
              <div
                className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-6 ${feature.bg}`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1c2127] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#4a5664] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
