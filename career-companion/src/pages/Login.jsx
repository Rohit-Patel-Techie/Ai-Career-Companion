import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  };

  const validateIdentifier = (id) => {
    // Allow email or username (letters only)
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const usernameRegex = /^[A-Za-z]+$/;
    return emailRegex.test(id) || usernameRegex.test(id);
  };

  const validatePassword = (password) => {
    return password.length >= 4;
  };

  const loginUser = async () => {
    setLoading(true);
    setError("");

    if (!validateIdentifier(identifier)) {
      setError("Enter a valid email or username");
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 4 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Login successful");
        if (data.access) {
          localStorage.setItem("access_token", data.access);
        }
        if (data.refresh) {
          localStorage.setItem("refresh_token", data.refresh);
        }
        navigate("/profile");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    alert("Google login not implemented yet");
  };

  return (
    <>
      <Header />
      <div className="min-h-[90vh] flex items-center justify-center px-4 bg-[var(--color-bg)] text-[var(--color-text)] transition-colors">
        <div className="bg-white dark:bg-[#1e293b] shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full">
          <div className="hidden md:flex items-center justify-center bg-[var(--color-primary)] dark:bg-[var(--color-muted)] p-8">
            <img
              src="/images/login-illustration.jpg"
              alt="Login"
              className="max-w-sm"
            />
          </div>
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-4">Log in to your Account</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Use email or continue with Google:
            </p>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg py-2 mb-6 hover:shadow-md transition bg-white dark:bg-[#2c394f]"
            >
              <FcGoogle className="text-xl" />
              <span className="font-medium text-black dark:text-white">
                Continue with Google
              </span>
            </button>
            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <button
              onClick={loginUser}
              disabled={!identifier || !password || loading}
              className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            {error && (
              <p className="text-red-500 mt-2 text-center font-semibold">{error}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Don't have an account?{" "}
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
