import React from "react";

const steps = [
    "Tell us about yourself",
    "What you have done?",
    "Add Preferable interests",
    "Basic Question?",
    "How do you learn?",
    "Goal and Challenge ?",
    "Review & Submit",
];

export default function FormSidebar({ step, mobile = false }) {
    if (mobile) {
        return (
            <div className="text-center p-4 border-b border-gray-200 bg-white/80 rounded-t-xl shadow-md">
                <h2 className="text-xl font-semibold text-blue-700">{steps[step]}</h2>
                <p className="text-sm opacity-90 max-w-xs mx-auto mt-1 text-gray-500">
                    Complete these steps to get matched with the perfect tech career.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full p-6 mt-20 bg-white/90 rounded-2xl shadow-lg flex flex-col items-center border border-blue-400">
            <h2 className="text-2xl font-bold mb-2 text-blue-700"><span className="text-green-400">AI</span> Career Companion</h2>
            <p className="text-xs opacity-90 max-w-xs mx-auto mb-6 text-gray-500">
                Complete these steps to get matched with the perfect tech career.
            </p>
            <ol className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                {steps.map((title, idx) => (
                    <li key={title} className="flex items-center gap-3 group">
                        <span
                            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-150
                                ${idx === step
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-110'
                                    : idx < step
                                        ? 'bg-green-500 text-white border-green-500'
                                        : 'bg-white text-blue-600 border-blue-200 group-hover:border-blue-400'}
                            `}
                        >
                            {idx + 1}
                        </span>
                        <span className={`text-sm font-medium transition-colors duration-150 ${idx === step ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-600'}`}>{title}</span>
                    </li>
                ))}
            </ol>
            {/* <img
                src="https://i.postimg.cc/jCYLpMGV/Make-Your-Career-Decision-with-the-h-Help-of-I.png"
                alt="Career Form Illustration"
                className="w-full mt-8 max-w-xs mx-auto rounded-lg shadow-md border border-blue-50"
            /> */}
        </div>
    );
}
