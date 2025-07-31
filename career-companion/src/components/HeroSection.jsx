import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Typewriter from "typewriter-effect";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-[var(--color-muted)] text-[var(--color-text)] min-h-screen flex flex-col justify-center items-center px-6 md:px-12 transition-colors duration-300">
      <div className="max-w-6xl w-full text-center pt-24">
        {/* Headline with Typewriter */}
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
          Unlock Your Future with<br />
          <span className="text-[var(--color-primary)] inline-block mt-2">
            <Typewriter
              options={{
                strings: [
                  "AI Career Companion",
                  "Personalized Skill Roadmaps",
                  "Smart Career Suggestions",
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
              }}
            />
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-[var(--color-primary-dark)] mb-10 max-w-2xl mx-auto">
          Discover your ideal tech career path and get a tailored learning plan powered by AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[var(--color-primary-dark)] transition-all duration-300 flex items-center justify-center gap-2"
            onClick={() => navigate("/HomePage")}
          >
            Get Started
            <ArrowRightIcon className="w-5 h-5" />
          </button>
          <button className="border border-[var(--color-primary-dark)] px-6 py-3 rounded-xl text-[var(--color-primary-dark)] hover:bg-[var(--color-accent)] transition-all font-medium">
            Learn More
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="mt-16 w-full max-w-4xl px-4">
        <img
          src="https://leonardo.ai/wp-content/uploads/2024/07/ai-graphic-design-vector-art-1024x768.webp"
          alt="AI Illustration"
          className="w-full h-auto object-contain rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}