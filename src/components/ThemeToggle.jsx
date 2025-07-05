import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

const themes = [
  { name: "light", color: "#fde047", icon: <SunIcon className="w-4 h-4 text-black" /> },
  { name: "dark", color: "#0f172a", icon: <MoonIcon className="w-4 h-4 text-white" /> },
  { name: "theme-pink", color: "#ec4899" },
  { name: "theme-blue", color: "#3b82f6" },
  { name: "theme-indigo", color: "#6366f1" },
];

export default function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("light");
  const wrapperRef = useRef();

  // 🧠 Apply theme to root and save
  const applyTheme = (theme) => {
    const root = document.documentElement;
    root.classList.remove(...themes.map((t) => t.name), "dark");
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.add(theme);
    }
    setActiveTheme(theme);
    localStorage.setItem("theme", theme);
    setOpen(false);
  };

  // 🧠 On mount: load from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      applyTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // 🧠 Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeColor = themes.find((t) => t.name === activeTheme)?.color || "#fff";

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Toggle Button */}
      <button
        className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-500 flex items-center justify-center hover:scale-105 transition shadow-md"
        onClick={() => setOpen((prev) => !prev)}
        style={{ backgroundColor: activeColor }}
        aria-label="Theme Toggle"
      >
        <PaintBrushIcon className="w-5 h-5 text-white drop-shadow" />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl p-4 z-50 w-48 sm:w-56"
          >
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => applyTheme(theme.name)}
                  className="w-10 h-10 rounded-full border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500 transition transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: theme.color }}
                  title={theme.name}
                >
                  {theme.icon || ""}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}