import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  };

  const validateUsername = (username) => {
    const re = /^[A-Za-z]+$/;
    return re.test(username);
  };

  const validatePassword = (password) => {
    return password.length >= 4;
  };

  const requestOtp = async () => {
    setLoading(true);
    setError("");

    if (!validateUsername(username)) {
      setError("Username must contain only letters");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 4 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Signup successful, OTP sent to email");
        setOtpSent(true);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/auth/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp_code: otpCode }),
        credentials: "include", // to receive HttpOnly cookie
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP verified successfully");
        // Store tokens from response if any
        if (data.access) {
          localStorage.setItem("access_token", data.access);
        }
        if (data.refresh) {
          localStorage.setItem("refresh_token", data.refresh);
        }
        navigate("/profile");
      } else {
        setError(data.error || "Invalid OTP");
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
              alt="Signup"
              className="max-w-sm"
            />
          </div>
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-4">Create your Account</h2>
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
            {!otpSent ? (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 mb-2 border rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mb-2 border rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mb-4 border rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button
                  onClick={requestOtp}
                  disabled={!username || !email || !password || loading}
                  className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button
                  onClick={verifyOtp}
                  disabled={!otpCode || loading}
                  className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50"
                >
                  {loading ? "Verifying OTP..." : "Verify OTP"}
                </button>
              </>
            )}
            {error && (
              <p className="text-red-500 mt-2 text-center font-semibold">{error}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-[var(--color-primary)] font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
