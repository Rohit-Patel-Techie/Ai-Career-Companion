import React from "react";
import {
    FiUser, FiMail, FiMapPin, FiBookOpen, FiPercent, FiAward, FiLayers, FiTarget, FiClock, FiEdit2
} from "react-icons/fi";

const fieldIcons = {
    fullName: <FiUser className="inline mr-1 text-blue-500" />,
    email: <FiMail className="inline mr-1 text-blue-500" />,
    currentlyLiving: <FiMapPin className="inline mr-1 text-blue-500" />,
    gradeOrYear: <FiBookOpen className="inline mr-1 text-blue-500" />,
    subjects: <FiLayers className="inline mr-1 text-blue-500" />,
    lastClassPercentageOrCGPA: <FiPercent className="inline mr-1 text-blue-500" />,
    currentCourse: <FiBookOpen className="inline mr-1 text-blue-500" />,
    lastYearCGPA: <FiPercent className="inline mr-1 text-blue-500" />,
    experience: <FiAward className="inline mr-1 text-blue-500" />,
    skills: <FiAward className="inline mr-1 text-blue-500" />,
    interests: <FiTarget className="inline mr-1 text-blue-500" />,
    usedAIToolBefore: <FiEdit2 className="inline mr-1 text-blue-500" />,
    mainGoal: <FiTarget className="inline mr-1 text-blue-500" />,
    learningTime: <FiClock className="inline mr-1 text-blue-500" />,
    learningStyle: <FiBookOpen className="inline mr-1 text-blue-500" />,
    longTermCareerGoal: <FiTarget className="inline mr-1 text-blue-500" />,
    biggestCareerChallenge: <FiEdit2 className="inline mr-1 text-blue-500" />,
};

export default function ReviewStep({ formData, prevStep, handleSubmit }) {
    const fieldLabels = {
        fullName: "Full Name",
        email: "Email",
        currentlyLiving: "City",
        gradeOrYear: "Grade/Year",
        subjects: "Subjects",
        lastClassPercentageOrCGPA: "Last Class %/CGPA",
        currentCourse: "Current Course",
        lastYearCGPA: "Last Year CGPA",
        experience: "Experience",
        skills: "Skills",
        interests: "Interests",
        usedAIToolBefore: "Used AI Tool Before",
        mainGoal: "Main Goal",
        learningTime: "Learning Time",
        learningStyle: "Learning Style",
        longTermCareerGoal: "Long Term Career Goal",
        biggestCareerChallenge: "Biggest Career Challenge",
    };

    const formatValue = (key, value) => {
        if (key === 'skills') {
            if (!Array.isArray(value) || value.length === 0) return <span className="text-gray-400">None</span>;
            const toLabel = (s) => {
                if (s && typeof s === 'object') {
                    const name = (s.name || '').trim();
                    const prof = Math.max(0, Math.min(100, Number(s.proficiency) || 0));
                    return name ? `${name} (${prof}/100)` : '';
                }
                if (typeof s === 'string') {
                    if (s.includes(':')) {
                        const [n, p] = s.split(':');
                        const prof = parseInt(p, 10);
                        return `${(n || '').trim()} (${isNaN(prof) ? 0 : Math.max(0, Math.min(100, prof))}/100)`;
                    }
                    const match = s.match(/\((\d{1,3})\s*\/\s*100\)/);
                    const prof = match ? parseInt(match[1], 10) : undefined;
                    return prof !== undefined ? `${s.replace(/\(.*\)/, '').trim()} (${Math.max(0, Math.min(100, prof))}/100)` : s;
                }
                return String(s);
            };
            const labels = value.map(toLabel).filter(Boolean);
            return labels.length ? labels.join(', ') : <span className="text-gray-400">None</span>;
        }
        if (Array.isArray(value)) {
            return value.length ? value.join(', ') : <span className="text-gray-400">None</span>;
        }
        if (!value) return <span className="text-gray-400">None</span>;
        return value;
    };

    const isSchool = formData.gradeOrYear === "Highschool(9-10)" || formData.gradeOrYear === "Higher Secondary(11-12th)";
    const isCollege = (formData.gradeOrYear || "").toLowerCase().includes("college");

    const alwaysFields = [
        "fullName", "email", "currentlyLiving", "gradeOrYear", "skills", "interests", "usedAIToolBefore",
        "mainGoal", "experience", "learningTime", "learningStyle", "longTermCareerGoal", "biggestCareerChallenge"
    ];
    const schoolFields = ["subjects", "lastClassPercentageOrCGPA"];
    const collegeFields = ["currentCourse", "lastYearCGPA"];

    let fieldsToShow = [...alwaysFields];
    if (isSchool) fieldsToShow = [...fieldsToShow, ...schoolFields];
    if (isCollege) fieldsToShow = [...fieldsToShow, ...collegeFields];
    fieldsToShow = Array.from(new Set(fieldsToShow));

    return (
        <div className="p-2 md:p-6 max-w-3xl mx-auto">
            <div className="mb-8 flex flex-col items-center">
                <div className="rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-4 shadow-lg mb-2">
                    <FiAward className="text-white text-3xl" />
                </div>
                <h3 className="text-3xl font-extrabold text-blue-700 mb-1 tracking-tight">Review Your Answers</h3>
                <p className="text-gray-500 text-lg">Please confirm your details before submitting.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fieldsToShow.map((key) => (
                    <div
                        key={key}
                        className="bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-2"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{fieldIcons[key]}</span>
                            <span className="text-gray-700 font-semibold">{fieldLabels[key] || key}</span>
                        </div>
                        <div className="text-base text-gray-900 pl-7">
                            {formatValue(key, formData[key])}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4 mt-12">
                <button
                    onClick={prevStep}
                    className="px-8 py-3 rounded-xl border border-blue-600 text-blue-700 bg-white hover:bg-blue-50 font-semibold transition-all shadow"
                >
                    Back
                </button>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-10 py-3 bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-bold shadow-lg transition-all"
                >
                    Submit Form
                </button>
            </div>
        </div>
    );
}