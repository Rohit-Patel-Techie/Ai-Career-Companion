import React from "react";

export default function ProgressBar({ step, totalSteps }) {
  let percent = Math.floor((step / totalSteps) * 100);
  if (percent > 100) percent = 100;
  if (percent < 0) percent = 0;

  return (
    <div className="w-full ">
      <div className="flex justify-between items-center text-xs md:text-sm mb-2 font-semibold text-blue-700">
        <span>Progress</span>
        <span>{percent}% Complete</span>
      </div>
      <div className="w-full bg-blue-100 rounded-full h-4 shadow-inner overflow-hidden">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-300 shadow-md"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
