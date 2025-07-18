import React from "react";

// Define all form fields step-wise
const stepFields = [
  [
    { name: "fullName", label: "Full Name", placeholder: "e.g. Rohit Patel", type: "text", pattern: /^[A-Za-z\s]+$/ },
    { name: "email", label: "Email", placeholder: "e.g. example@gmail.com", type: "email", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { name: "education", label: "Education Level", placeholder: "e.g. B.Tech CSE", type: "text" },
  ],
  [
    { name: "experience", label: "Any Work/Intern Experience?", placeholder: "e.g. Internship at TCS", type: "text" },
    { name: "skills", label: "List Your Skills", placeholder: "e.g. Python, React, SQL", type: "text" },
    { name: "interests", label: "What Are Your Interests?", placeholder: "e.g. AI, Web Dev", type: "text" },
  ],
  [
    { name: "goals", label: "Your Career Goals", placeholder: "e.g. Become a Data Scientist", type: "text" },
    { name: "preferredField", label: "Preferred Field", placeholder: "e.g. AI/ML, Web, Cybersecurity", type: "text" },
    { name: "learningStyle", label: "How Do You Learn Best?", placeholder: "e.g. Videos, Projects, Reading", type: "text" },
  ],
  [
    { name: "challenges", label: "Biggest Career Challenge?", placeholder: "e.g. Lack of roadmap or guidance", type: "text" },
  ],
];

export default function StepForm({ step, formData, onChange, nextStep, prevStep }) {
  const fields = stepFields[step];

  const isValid = fields.every((field) => {
    const value = (formData[field.name] || "").trim();
    if (!value) return false;
    if (field.pattern) return field.pattern.test(value);
    return true;
  });

  const handleInputChange = (e, name) => {
    onChange(name, e.target.value);
  };

  return (
    <form className="space-y-5">
      {fields.map((field) => {
        const value = formData[field.name] || "";
        const isError =
          !value.trim() || (field.pattern && !field.pattern.test(value));

        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium mb-1">
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(e, field.name)}
              className={`w-full px-4 py-2 rounded-lg border ${isError ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]`}
            />
            {isError && (
              <p className="text-xs text-red-600 mt-1">
                {field.name === "email"
                  ? "Please enter a valid email."
                  : field.name === "fullName"
                    ? "Name should contain only letters."
                    : "This field is required."}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex justify-between mt-8">
        {step > 0 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 rounded-lg border border-[var(--color-primary-dark)] text-[var(--color-primary-dark)] hover:bg-[var(--color-muted)]"
          >
            Back
          </button>
        )}

        <button
          type="button"
          onClick={nextStep}
          disabled={!isValid}
          className={`px-6 py-2 rounded-lg text-white font-semibold ${isValid
              ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Next
        </button>
      </div>
    </form>
  );
}