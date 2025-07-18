import React from "react";
// import bannerImg from "../images/form-banner.svg"; // Replace with your SVG/PNG

export default function Banner() {
  return (
    <div className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-muted)] p-8 rounded-xl shadow-md text-center md:text-left">
      <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)]">
        Shape Your Future
      </h2>
      <p className="text-sm text-[var(--color-text)]">
        Answer a few quick questions and we’ll match you with the most relevant career path.
      </p>
      <img
        src="https://www.bharatplus.ai/wp-content/uploads/2024/01/Careers-800x313.webp"
        alt="Career banner"
        className="mt-6 w-48 mx-auto md:mx-0 md:w-60"
      />
    </div>
  );
}