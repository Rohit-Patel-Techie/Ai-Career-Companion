import React from "react";

export default function ProgressBar({ step, totalSteps }) {
  const percent = Math.floor((step / (totalSteps - 1)) * 100);

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm mb-1 font-medium">
        <span>{percent}% Complete</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-3">
        <div
          className="bg-[var(--color-primary)] h-3 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}