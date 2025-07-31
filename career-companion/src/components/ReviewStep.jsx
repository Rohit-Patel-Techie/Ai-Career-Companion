import React from "react";
import { FiUser, FiMail, FiMapPin, FiBookOpen, FiPercent, FiAward, FiLayers, FiTarget, FiClock, FiEdit2 } from "react-icons/fi";

const fieldIcons = {
    fullName: <FiUser className="inline mr-1 text-blue-500" />,
    email: <FiMail className="inline mr-1 text-blue-500" />,
    currentlyLiving: <FiMapPin className="inline mr-1 text-blue-500" />,
    gradeOrYear: <FiBookOpen className="inline mr-1 text-blue-500" />,
    subjects: <FiLayers className="inline mr-1 text-blue-500" />,
    lastClassPercentageOrCGPA: <FiPercent className="inline mr-1 text-blue-500" />,
    currentCourse: <FiBookOpen className="inline mr-1 text-blue-500" />,
    lastYearCGPA: <FiPercent className="inline mr-1 text-blue-500" />,
    education: <FiAward className="inline mr-1 text-blue-500" />,
    experience: <FiAward className="inline mr-1 text-blue-500" />,
    skills: <FiAward className="inline mr-1 text-blue-500" />,
    interests: <FiTarget className="inline mr-1 text-blue-500" />,
    usedAIToolBefore: <FiEdit2 className="inline mr-1 text-blue-500" />,
    goals: <FiTarget className="inline mr-1 text-blue-500" />,
    mainGoal: <FiTarget className="inline mr-1 text-blue-500" />,
    preferredField: <FiBookOpen className="inline mr-1 text-blue-500" />,
    learningTime: <FiClock className="inline mr-1 text-blue-500" />,
    learningStyle: <FiBookOpen className="inline mr-1 text-blue-500" />,
    longTermCareerGoal: <FiTarget className="inline mr-1 text-blue-500" />,
    challenges: <FiEdit2 className="inline mr-1 text-blue-500" />,
    biggestCareerChallenge: <FiEdit2 className="inline mr-1 text-blue-500" />,
};

export default function ReviewStep({ formData, prevStep, handleSubmit }) {
    // Map camelCase keys to readable labels
    const fieldLabels = {
        fullName: "Full Name",
        email: "Email",
        currentlyLiving: "City",
        gradeOrYear: "Grade/Year",
        subjects: "Subjects",
        lastClassPercentageOrCGPA: "Last Class %/CGPA",
        currentCourse: "Current Course",
        lastYearCGPA: "Last Year CGPA",
        education: "Education",
        experience: "Experience",
        skills: "Skills",
        interests: "Interests",
        usedAIToolBefore: "Used AI Tool Before",
        goals: "Career Goals",
        mainGoal: "Main Goal",
        preferredField: "Preferred Field",
        learningTime: "Learning Time",
        learningStyle: "Learning Style",
        longTermCareerGoal: "Long Term Career Goal",
        challenges: "Challenges",
        biggestCareerChallenge: "Biggest Career Challenge",
    };

    // Format array values as comma separated strings
    const formatValue = (value) => {
        if (Array.isArray(value)) {
            return value.length ? value.join(", ") : <span className="text-gray-400">None</span>;
        }
        if (!value) return <span className="text-gray-400">None</span>;
        return value;
    };

    return (
        <div className="p-2 md:p-2  max-w-3xl mx-auto  ">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 border-b-2 pb-2 text-blue-700">Review Your Answers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="py-2 border-b border-gray-100">
                        <div className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-2">
                            {fieldIcons[key]}{fieldLabels[key] || key}
                        </div>
                        <div className="text-base text-gray-800 break-words">{formatValue(value)}</div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4 mt-10">
                <button
                    onClick={prevStep}
                    className="px-6 py-3 rounded-xl border border-blue-600 text-blue-700 bg-white hover:bg-blue-50 font-semibold transition-all shadow-sm"
                >
                    Back
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-all"
                >
                    Submit Form
                </button>
            </div>
        </div>
    );
}
