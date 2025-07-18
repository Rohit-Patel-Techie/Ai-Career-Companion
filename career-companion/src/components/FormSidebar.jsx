import React from "react";

const titles = [
    "Tell us about yourself",
    "What do you know?",
    "Let’s talk interests",
    "Where are you heading?",
    "Review & Submit",
];

export default function FormSidebar({ step, mobile = false }) {
    const title = titles[step];

    if (mobile) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-sm opacity-90 max-w-xs mx-auto">
                    Complete these steps to get matched with the perfect tech career.
                </p>
            </div>
        );
    }

    return (
        <div className="text-center w-full">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-sm opacity-90 max-w-xs mx-auto">
                Complete these steps to get matched with the perfect tech career.
            </p>
            <img
                src="https://www.bharatplus.ai/wp-content/uploads/2024/01/Careers-800x313.webp"
                alt="Career Form Illustration"
                className="w-full mt-8 max-w-sm mx-auto"
            />
        </div>
    );
}