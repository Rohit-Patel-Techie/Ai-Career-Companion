import React, { useState, useEffect } from "react";
import FormSidebar from "../components/FormSidebar";
import StepForm from "../components/StepForm";
import ReviewStep from "../components/ReviewStep";
import Header from "../components/Header";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import axios from "axios";

const totalSteps = 5;
const FORM_KEY = "careerFormData";
const STEP_KEY = "careerFormStep";

export default function Profile() {
    const defaultFormData = {
        fullName: "",
        email: "",
        education: "",
        experience: "",
        skills: "",
        interests: "",
        goals: "",
        preferredField: "",
        learningStyle: "",
        challenges: "",
    };

    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem(FORM_KEY);
        return saved ? JSON.parse(saved) : defaultFormData;
    });

    const [step, setStep] = useState(() => {
        const savedStep = localStorage.getItem(STEP_KEY);
        return savedStep ? parseInt(savedStep) : 0;
    });

    useEffect(() => {
        localStorage.setItem(FORM_KEY, JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        localStorage.setItem(STEP_KEY, step.toString());
    }, [step]);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const API_URL = "http://localhost:8000/api/submit-profile/"; // ✅ Update to match your Django route

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(",").map((skill) => skill.trim()), // ✅ Convert comma-separated string to array
            };

            const response = await axios.post(API_URL, payload);

            toast.success("Submitted! Analyzing your career data...");

            const suggestionText =
                typeof response.data === "string"
                    ? response.data
                    : response.data.suggestions || response.data.result || "";

            const cleanSuggestion = suggestionText.trim();

            // ✅ Store for dashboard use
            localStorage.setItem("careerSuggestions", cleanSuggestion);
            localStorage.setItem("careerFormData", JSON.stringify(payload));

            // ✅ Redirect to dashboard
            window.location.href = "/dashboard";
        } catch (error) {
            toast.error("Submission failed");
            console.error("API Error:", error.response?.data || error.message);
        }
    };

    const resetForm = () => {
        localStorage.removeItem(FORM_KEY);
        localStorage.removeItem(STEP_KEY);
        setFormData(defaultFormData);
        setStep(0);
    };

    const progress = Math.round((step / (totalSteps - 1)) * 100);

    return (
        <>
            <Header />
            <div className="pt-20 md:pt-28 px-4 md:px-10 lg:px-20 bg-[var(--color-bg)] min-h-[calc(100vh-80px)] text-[var(--color-text)] transition-colors">
                <div className="max-w-6xl mx-auto shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row bg-white dark:bg-[#1e293b]">
                    {/* Sidebar (Desktop Only) */}
                    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-10">
                        <FormSidebar step={step} />
                    </div>

                    {/* Form Section */}
                    <div className="w-full md:w-1/2 p-0 sm:p-8">
                        <div className="block md:hidden w-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-t-xl p-6 mb-6">
                            <FormSidebar step={step} mobile />
                        </div>

                        <div className="p-5">
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-6">
                                <div
                                    className="bg-[var(--color-primary)] h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            {/* Form or Review Step */}
                            {step === totalSteps - 1 ? (
                                <ReviewStep
                                    formData={formData}
                                    prevStep={prevStep}
                                    handleSubmit={handleSubmit}
                                />
                            ) : (
                                <StepForm
                                    step={step}
                                    formData={formData}
                                    onChange={handleChange}
                                    nextStep={nextStep}
                                    prevStep={prevStep}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset Button */}
            <div className="text-center mt-6">
                <button
                    onClick={resetForm}
                    className="px-4 py-2 mb-5 text-sm text-red-600 border border-red-500 rounded-lg hover:bg-red-50 transition"
                >
                    Reset Form
                </button>
            </div>

            <Footer />
        </>
    );
}