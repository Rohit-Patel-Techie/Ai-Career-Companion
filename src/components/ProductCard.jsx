import React from "react";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  AcademicCapIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

const features = [
  {
    title: "AI Career Suggestions",
    description:
      "Instantly get role recommendations like Data Analyst, Web Developer, or ML Engineer based on your skills.",
    icon: BriefcaseIcon,
    bg: "bg-[var(--color-primary)]",
    iconColor: "text-white",
  },
  {
    title: "Skill Roadmaps",
    description:
      "Personalized step-by-step skill paths tailored to your career goals and current strengths.",
    icon: AcademicCapIcon,
    bg: "bg-[var(--color-primary-dark)]",
    iconColor: "text-white",
  },
  {
    title: "Progress Tracking",
    description:
      "Visually track your roadmap completion with percentages and unlock badges as you learn.",
    icon: SparklesIcon,
    bg: "bg-[var(--color-muted)]",
    iconColor: "text-[var(--color-primary-dark)]",
  },
];

export default function WhyChooseUs() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-[var(--color-bg)] text-[var(--color-text)] py-20 px-6 sm:px-10 md:px-20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-4">
            Explore What You Get
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-80">
            Our AI-powered tools help you find your ideal career path and guide you every step of the way.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-[var(--color-muted)] hover:bg-[var(--color-accent)] transition-all border border-[var(--color-accent)] rounded-2xl shadow-md hover:shadow-lg p-8 text-center"
            >
              <div
                className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-6 ${feature.bg}`}
              >
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-sm opacity-80 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}