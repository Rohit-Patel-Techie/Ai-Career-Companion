import React from "react";
import { FiHeart, FiTag } from "react-icons/fi";

function UserInterest({ interests = [] }) {
  const clean = Array.isArray(interests)
    ? interests.filter(Boolean).map((i) => (typeof i === "string" ? i.trim() : String(i))).filter((s) => s.length)
    : [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md p-6 sm:p-8 transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 p-2">
          <FiHeart />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Interests</h2>
      </div>

      {clean.length ? (
        <div className="flex flex-wrap gap-2">
          {clean.map((interest, idx) => (
            <span
              key={`${interest}-${idx}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <FiTag className="text-indigo-500" />
              {interest}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">No interests added yet. Add them in your profile to see them here.</p>
      )}
    </div>
  );
}

export default UserInterest;
