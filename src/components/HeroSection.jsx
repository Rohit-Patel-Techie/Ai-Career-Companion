import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Typewriter from "typewriter-effect";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#e9f0f7] text-[#1c2127] min-h-screen flex flex-col justify-center items-center px-6 md:px-12">
      <div className="max-w-5xl w-full text-center">
        {/* Headline with Typewriter */}
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
          Unlock Your Future with <br />
          <span className="text-[#287cc6]">
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
        <p className="text-lg md:text-xl text-[#2d5a85] mb-10">
          Discover your ideal tech career path and get a tailored learning plan powered by AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            className="bg-[#3373b0] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#0b385f] transition-all duration-300 flex items-center justify-center gap-2"
            onClick={() => navigate("/HomePage")}
          >
            Get Started
            <ArrowRightIcon className="w-5 h-5" />
          </button>
          <button className="border border-[#0b385f] px-6 py-3 rounded-xl text-[#0b385f] hover:bg-[#bed4e9] transition-all">
            Learn More
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="mt-16 w-full max-w-3xl">
        <img
          src="https://leonardo.ai/wp-content/uploads/2024/07/ai-graphic-design-vector-art-1024x768.webp"
          alt="AI Illustration"
          className="w-full h-[18rem] object-contain"
        />
      </div>
    </section>
  );
}
