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

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", to: "/HomePage", icon: <HomeIcon className="w-5 h-5" /> },
        { name: "Profile", to: "/profile", icon: <UserCircleIcon className="w-5 h-5" /> },
        { name: "Roadmap", to: "/roadmap", icon: <ChartBarIcon className="w-5 h-5" /> },
        { name: "Back to Landing", to: "/", icon: <ArrowRightIcon className="w-5 h-5" /> },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-sm shadow-md" : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    {/* <Link to="/" className="flex items-center gap-2">
                        <svg
                            className="w-8 h-8 text-[#3373b0]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2L19 21H5L12 2Z" />
                        </svg>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-sans">
                            <span className="text-[#3373b0]">AI</span>{" "}
                            <span className="text-[#1c2127]">Career</span>{" "}
                            <span className="text-[#0b385f]">Companion</span>
                        </h1>
                    </Link> */}
                    {/* image-logo */}
                    <Link to="/" className="flex items-center gap-2">
                       <img src={image} alt="Description of the image" className="h-[1.7rem]" /> 
                    </Link>
                    
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex space-x-8 text-[#1c2127] text-[1.1rem] font-medium">
                        {navItems.slice(0, 3).map((item) => (
                            <Link
                                key={item.name}
                                to={item.to}
                                className="hover:text-[#3373b0] transition"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4 ml-6">
                        <Link
                            to="/login"
                            className="px-4 py-2 border border-[#0b385f] text-[#0b385f] rounded-lg hover:bg-[#e7f1fb] transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 bg-[#3373b0] hover:bg-[#0b385f] text-white font-semibold rounded-lg transition"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Icon */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu}>
                            <Bars3Icon className="w-7 h-7 text-[#1c2127]" />
                        </button>
                    </div>
                </div>
            </header>


            {/* Mobile Sidebar (unchanged) */}
            < AnimatePresence >
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
                            className="fixed top-0 right-0 h-full w-[85%] sm:w-[400px] bg-white text-[#1c2127] z-50 shadow-2xl flex flex-col justify-between"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-semibold">Navigation</h3>
                                    <button onClick={closeMenu}>
                                        <XMarkIcon className="w-6 h-6 text-[#1c2127] hover:text-red-500 transition" />
                                    </button>
                                </div>

                                <nav className="space-y-4">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.to}
                                            onClick={closeMenu}
                                            className="flex items-center justify-between bg-[#e7f1fb] hover:bg-[#bed4e9] transition-all px-4 py-3 rounded-lg group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-[#0b385f]">{item.icon}</span>
                                                <span className="text-[#1c2127] font-medium">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <motion.div
                                                className="text-[#3373b0] group-hover:translate-x-1 transition-transform"
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                            >
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </motion.div>
                                        </Link>
                                    ))}
                                </nav>

                                <div className="mt-10 space-y-3">
                                    <Link
                                        to="/login"
                                        onClick={closeMenu}
                                        className="block text-center border border-[#0b385f] text-[#0b385f] py-2 rounded-lg hover:bg-[#e7f1fb] transition"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={closeMenu}
                                        className="block text-center bg-[#3373b0] text-white py-2 rounded-lg font-semibold hover:bg-[#0b385f] transition"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 text-sm text-center text-gray-500">
                                © {new Date().getFullYear()} AI Career Companion. All rights reserved.
                            </div>
                        </motion.div>
                    </>
                )
                }
            </AnimatePresence >
        </>
    );
}
