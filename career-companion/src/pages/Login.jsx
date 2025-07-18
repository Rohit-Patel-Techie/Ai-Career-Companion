import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FcGoogle } from "react-icons/fc";
import illustration from "../images/login-illustration.jpg";

export default function Login() {
    return (
        <>
            <Header />
            <div className="min-h-[90vh] flex items-center justify-center px-4 bg-[var(--color-bg)] text-[var(--color-text)] transition-colors">
                <div className="bg-white dark:bg-[#1e293b] shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full">
                    <div className="hidden md:flex items-center justify-center bg-[var(--color-primary)] dark:bg-[var(--color-muted)] p-8">
                        <img src={illustration} alt="Login" className="max-w-sm" />
                    </div>
                    <div className="p-8 md:p-12">
                        <h2 className="text-2xl font-bold mb-4">Log in to your Account</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Use email or continue with Google:
                        </p>
                        <button className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg py-2 mb-6 hover:shadow-md transition bg-white dark:bg-[#2c394f]">
                            <FcGoogle className="text-xl" />
                            <span className="font-medium text-black dark:text-white">Continue with Google</span>
                        </button>
                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-2 border rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-2 border rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                            <button
                                type="submit"
                                className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition"
                            >
                                Log In
                            </button>
                        </form>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                            Don’t have an account?{" "}
                            <Link to="/signup" className="text-[var(--color-primary)] font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}