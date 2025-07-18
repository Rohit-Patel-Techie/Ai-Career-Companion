import React from "react";

export default function ReviewStep({ formData, prevStep, handleSubmit }) {
    // Map camelCase keys to readable labels
    const fieldLabels = {
        fullName: "Full Name",
        email: "Email",
        education: "Education",
        experience: "Experience",
        skills: "Skills",
        interests: "Interests",
        goals: "Career Goals",
        preferredField: "Preferred Field",
        learningStyle: "Learning Style",
        challenges: "Challenges",
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Review Your Answers</h3>
            <ul className="space-y-2">
                {Object.entries(formData).map(([key, value]) => (
                    <li key={key} className="text-sm border-b py-1">
                        <strong>{fieldLabels[key] || key}:</strong> {value}
                    </li>
                ))}
            </ul>

            <div className="flex justify-between mt-6">
                <button
                    onClick={prevStep}
                    className="px-4 py-2 rounded-lg border border-[var(--color-primary-dark)] text-[var(--color-primary-dark)] hover:bg-[var(--color-muted)]"
                >
                    Back
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg font-semibold"
                >
                    Submit Form
                </button>
            </div>
        </div>
    );
}