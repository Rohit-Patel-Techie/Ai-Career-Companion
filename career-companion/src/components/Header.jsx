import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    UserCircleIcon,
    ChartBarIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import image from "../images/image.png";
import ThemeToggle from "./ThemeToggle"; 

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const navItems = [
        { name: "Home", to: "/HomePage", icon: <HomeIcon className="w-5 h-5" /> },
        { name: "Profile", to: "/profile", icon: <UserCircleIcon className="w-5 h-5" /> },
        { name: "Roadmap", to: "/roadmap", icon: <ChartBarIcon className="w-5 h-5" /> },
        { name: "Back to Landing", to: "/", icon: <ArrowRightIcon className="w-5 h-5" /> },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[var(--color-bg)] dark:bg-[var(--color-bg)] ${isScrolled ? "backdrop-blur-md shadow-md" : ""
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        {/* Optional Icon (can be replaced with an image or SVG) */}
                        <div className="w-8 h-8 bg-[var(--color-primary)] text-white font-bold text-lg rounded-full flex items-center justify-center group-hover:scale-105 transition">
                            AI
                        </div>

                        {/* Brand Text */}
                        <h1 className="text-md sm:text-2xl font-extrabold text-[var(--color-text)] leading-none group-hover:text-[var(--color-primary)] transition">
                            CAREER COMPANION
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8 text-[var(--color-text)] text-[1.1rem] font-medium">
                        {navItems.slice(0, 3).map((item) => (
                            <Link
                                key={item.name}
                                to={item.to}
                                className="hover:text-[var(--color-primary)] transition"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side: Theme Toggle + Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4 ml-4">
                        <ThemeToggle />
                        <Link
                            to="/login"
                            className="px-4 py-2 border border-[var(--color-primary-dark)] text-[var(--color-primary-dark)] rounded-lg hover:bg-[var(--color-muted)] transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-lg transition"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Menu Icon + ThemeToggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button onClick={toggleMenu}>
                            <Bars3Icon className="w-7 h-7 text-[var(--color-text)]" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-40 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMenu}
                        />
                        <motion.div
                            className="fixed top-0 right-0 h-full w-[85%] sm:w-[400px] bg-[var(--color-bg)] text-[var(--color-text)] z-50 shadow-2xl flex flex-col justify-between"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-semibold">Navigation</h3>
                                    <button onClick={closeMenu}>
                                        <XMarkIcon className="w-6 h-6 hover:text-red-500 transition" />
                                    </button>
                                </div>

                                <nav className="space-y-4">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.to}
                                            onClick={closeMenu}
                                            className="flex items-center justify-between bg-[var(--color-muted)] hover:bg-[var(--color-accent)] transition-all px-4 py-3 rounded-lg group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-[var(--color-primary-dark)]">{item.icon}</span>
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            <motion.div
                                                className="text-[var(--color-primary)] group-hover:translate-x-1 transition-transform"
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                            >
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </motion.div>
                                        </Link>
                                    ))}
                                </nav>

                                <div className="mt-8 space-y-3">
                                    <Link
                                        to="/login"
                                        onClick={closeMenu}
                                        className="block text-center border border-[var(--color-primary-dark)] text-[var(--color-primary-dark)] py-2 rounded-lg hover:bg-[var(--color-muted)] transition"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={closeMenu}
                                        className="block text-center bg-[var(--color-primary)] text-white py-2 rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition"
                                    >
                                        Sign Up
                                    </Link>
                                </div>

                                <div className="mt-6">
                                    <ThemeToggle />
                                </div>
                            </div>

                            <div className="p-6 text-sm text-center text-gray-500 dark:text-gray-400">
                                © {new Date().getFullYear()} AI Career Companion. All rights reserved.
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}