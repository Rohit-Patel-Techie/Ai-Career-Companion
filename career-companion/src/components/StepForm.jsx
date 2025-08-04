import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FiUser, FiMail, FiMapPin, FiBookOpen, FiPercent, FiAward, FiLayers, FiTarget, FiClock, FiEdit2 } from "react-icons/fi";
import ReviewStep from "./ReviewStep";

const gradeOptions = [
    "Highschool(9-10)",
    "Higher Secondary(11-12th)",
    "college(1st Year)",
    "college(2nd Year)",
    "college(3rd Year)",
    "college(4th Year)",
    "college(5th Year)",
];

const lastClassPercentageOptions = [
    "90-100%",
    "80-90%",
    "70-80%",
    "60-70%",
    "50-60%",
    "40-50%",
    "Less than 40%",
];

const interestsOptions = [
    "Programming",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Cybersecurity",
    "Cloud Computing",
    "Finance",
    "Marketing",
    "Designing",
    "Writing",
    "Project Management",
    "Sales",
    "Education",
    "Healthcare",
    "Gaming",
    "Blockchain",
    "DevOps",
    "Networking",
];

const usedAIToolOptions = ["Yes", "A little", "No"];

const learningTimeOptions = [
    "Less than 2 hours",
    "2-4 hours",
    "4-6 hours",
    "6-8 hours",
    "8-10 hours",
    "10 or more",
];

const learningStyleOptions = [
    "Reading/Writing",
    "Videos",
    "Solving Problems",
    "Discussion",
    "Projects",
];

// SkillInput component for tag-style skill entry
function SkillInput({ skills, setSkills }) {
    const [input, setInput] = React.useState("");

    const addSkill = () => {
        const trimmed = input.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]);
        }
        setInput("");
    };
    const removeSkill = (idx) => {
        setSkills(skills.filter((_, i) => i !== idx));
    };
    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill, idx) => (
                    <span key={idx} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(idx)}
                            className="ml-2 text-green-600 hover:text-red-600 font-bold text-base"
                            aria-label="Remove skill"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    className="flex-grow p-2 border rounded"
                    placeholder="Add a new skill and press Enter"
                />
                <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-green-600 text-white rounded min-w-[100px]"
                >
                    Add Skill
                </button>
            </div>
        </div>
    );
}

export default function StepForm({ step, nextStep, prevStep }) {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        currentlyLiving: "",
        gradeOrYear: "",
        subjects: [],
        lastClassPercentageOrCGPA: "",
        currentCourse: "",
        lastYearCGPA: "",
        skills: [],
        interests: [],
        usedAIToolBefore: "",
        experience: "",
        mainGoal: "",
        learningTime: "",
        learningStyle: "",
        longTermCareerGoal: "",
        biggestCareerChallenge: "",
    });
    const [subjectInput, setSubjectInput] = useState("");
    const [errors, setErrors] = useState({});
    const totalSteps = 6;

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setLoading(false);
            return;
        }

        const savedFormData = localStorage.getItem("profileFormData");
        const savedStep = localStorage.getItem("profileStep");

        if (savedFormData) {
            const parsed = JSON.parse(savedFormData);
            if (!gradeOptions.includes(parsed.gradeOrYear)) parsed.gradeOrYear = "";
            setFormData(parsed);
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/user-profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log("Fetched profile data:", data);
                    setFormData((prev) => ({
                        ...prev,
                        fullName: data.fullName || "",
                        email: data.email || "",
                        currentlyLiving: data.currentlyLiving || "",
                        gradeOrYear: gradeOptions.includes(data.gradeOrYear) ? data.gradeOrYear : "",
                        subjects: data.subjects || [],
                        lastClassPercentageOrCGPA: data.lastClassPercentageOrCGPA || "",
                        currentCourse: data.currentCourse || "",
                        lastYearCGPA: data.lastYearCGPA || "",
                        experience: data.experience || "",
                        skills: data.skills || [],
                        interests: data.interests || [],
                        usedAIToolBefore: data.usedAIToolBefore || "",
                        mainGoal: data.mainGoal || "",
                        learningTime: data.learningTime || "",
                        learningStyle: data.learningStyle || "",
                        longTermCareerGoal: data.longTermCareerGoal || "",
                        biggestCareerChallenge: data.biggestCareerChallenge || "",
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (name, value) => {
        if (name === "fullName") {
            const lastChar = value.slice(-1);
            if (/[^a-zA-Z\s]/.test(lastChar)) {
                toast.error("Only letters and spaces are allowed in name", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    theme: "colored",
                });
                return;
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addSubject = () => {
        const trimmed = subjectInput.trim();
        if (trimmed === "") return;
        if (formData.subjects.includes(trimmed)) {
            toast.error("Subject already added!", { position: "top-right" });
            return;
        }
        setFormData((prev) => ({ ...prev, subjects: [...prev.subjects, trimmed] }));
        setSubjectInput("");
        toast.success("Subject added!", { position: "top-right" });
    };

    const updateSubject = (index, value) => {
        const newSubjects = [...formData.subjects];
        newSubjects[index] = value;
        setFormData((prev) => ({ ...prev, subjects: newSubjects }));
    };

    const removeSubject = (index) => {
        const newSubjects = [...formData.subjects];
        const removed = newSubjects.splice(index, 1);
        setFormData((prev) => ({ ...prev, subjects: newSubjects }));
        toast.info("Subject removed!", { position: "top-right" });
    };

    const addSkill = () => {
        setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
    };

    const updateSkill = (index, value) => {
        const newSkills = [...formData.skills];
        newSkills[index] = value;
        setFormData((prev) => ({ ...prev, skills: newSkills }));
    };

    const removeSkill = (index) => {
        const newSkills = [...formData.skills];
        newSkills.splice(index, 1);
        setFormData((prev) => ({ ...prev, skills: newSkills }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch("http://localhost:8000/api/submit-profile/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    skills: formData.skills.filter((s) => s.trim() !== ""),
                    subjects: formData.subjects.filter((s) => s.trim() !== ""),
                }),
            });
            if (res.ok) {
                alert("Profile updated successfully");
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            alert("Network error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <p>Loading profile...</p>
            </div>
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Step validation functions
    const validateStep = () => {
        let stepErrors = {};
        if (step === 0) {
            if (!formData.fullName.trim()) stepErrors.fullName = "Full Name is required";
            if (!formData.email.trim()) {
                stepErrors.email = "Email is required";
            } else if (!emailRegex.test(formData.email.trim())) {
                stepErrors.email = "Enter a valid email address";
            }
            if (!formData.currentlyLiving.trim()) stepErrors.currentlyLiving = "City is required";
        }
        if (step === 1) {
            if (!formData.gradeOrYear) stepErrors.gradeOrYear = "Grade or Year is required";
            if (
                formData.gradeOrYear === "Highschool(9-10)" ||
                formData.gradeOrYear === "Higher Secondary(11-12th)"
            ) {
                if (formData.subjects.length === 0) stepErrors.subjects = "At least one subject is required";
                if (formData.subjects.some((s) => s.trim() === "")) stepErrors.subjects = "Subject cannot be empty";
                if (!formData.lastClassPercentageOrCGPA) stepErrors.lastClassPercentageOrCGPA = "Percentage/CGPA is required";
            }
            if ((formData.gradeOrYear || "").startsWith("college")) {
                if (!formData.currentCourse.trim()) stepErrors.currentCourse = "Current course is required";
                if (!formData.lastYearCGPA.trim()) stepErrors.lastYearCGPA = "Last year CGPA is required";
            }
        }
        if (step === 2) {
            if (!formData.interests.length) stepErrors.interests = "At least one interest is required";
            if (formData.skills.some((s) => s.trim() === "")) stepErrors.skills = "Skill cannot be empty";
        }
        if (step === 3) {
            if (!formData.usedAIToolBefore) stepErrors.usedAIToolBefore = "This field is required";
            if (!formData.mainGoal.trim()) stepErrors.mainGoal = "Main goal is required";
        }
        if (step === 4) {
            if (!formData.learningTime) stepErrors.learningTime = "Learning time is required";
            if (!formData.learningStyle) stepErrors.learningStyle = "Learning style is required";
        }
        if (step === 5) {
            if (!formData.longTermCareerGoal.trim()) stepErrors.longTermCareerGoal = "This field is required";
            if (!formData.biggestCareerChallenge.trim()) stepErrors.biggestCareerChallenge = "This field is required";
        }
        return stepErrors;
    };

    const handleNext = () => {
        const stepErrors = validateStep();
        setErrors(stepErrors);
        if (Object.keys(stepErrors).length > 0) {
            toast.error("Please fill all required fields.", { position: "top-right" });
            return;
        }
        nextStep();
    };

    return (
        <>
            {/* Toast Notification */}
            <ToastContainer />
            {step === 0 && (
                <div className="space-y-5 relative bg-  p-6 md:p-6 ">
                    <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-4 md:mt-[-2rem]">Personal Information</h2>
                    <label className="block font-semibold flex items-center gap-2"><FiUser className="text-blue-500" /> Full Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="e.g. Rohit Patel"
                    />
                    {errors.fullName && <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>}
                    <label className="block font-semibold flex items-center gap-2"><FiMail className="text-blue-500" /> Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="e.g. example@gmail.com"
                    />
                    {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                    <label className="block font-semibold flex items-center gap-2"><FiMapPin className="text-blue-500" /> Currently Living <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="currentlyLiving"
                        value={formData.currentlyLiving}
                        onChange={(e) => handleChange("currentlyLiving", e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all ${errors.currentlyLiving ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="e.g. New York"
                    />
                    {errors.currentlyLiving && <div className="text-red-500 text-sm mt-1">{errors.currentlyLiving}</div>}
                </div>
            )}
            {step === 1 && (
                <div className="space-y-4">
                    <label className="block font-semibold flex items-center gap-2"><FiBookOpen className="text-blue-500" /> Grade or Year <span className="text-red-500">*</span></label>
                    <select
                        name="gradeOrYear"
                        value={formData.gradeOrYear}
                        onChange={(e) => handleChange("gradeOrYear", e.target.value)}
                        className={`w-full p-2 border rounded ${errors.gradeOrYear ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select Grade or Year</option>
                        {gradeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {errors.gradeOrYear && <div className="text-red-500 text-sm">{errors.gradeOrYear}</div>}
                    {(formData.gradeOrYear === "Highschool(9-10)" ||
                        formData.gradeOrYear === "Higher Secondary(11-12th)") && (
                            <>
                                <label className="block font-semibold flex items-center gap-2"><FiLayers className="text-blue-500" /> Subjects <span className="text-red-500">*</span></label>
                                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={subjectInput}
                                        onChange={(e) => setSubjectInput(e.target.value)}
                                        className="flex-grow p-2 border rounded"
                                        placeholder="Enter subject"
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubject(); } }}
                                    />
                                    <button
                                        type="button"
                                        onClick={addSubject}
                                        className="px-4 py-2 bg-blue-600 text-white rounded min-w-[120px]"
                                    >
                                        Add Subject
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.subjects.map((subject, index) => (
                                        <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1">
                                            <span className="mr-2 text-sm break-all">{subject}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSubject(index)}
                                                className="text-red-500 hover:text-red-700 text-lg font-bold px-1"
                                                aria-label="Remove subject"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {errors.subjects && <div className="text-red-500 text-sm">{errors.subjects}</div>}
                                <label className="block font-semibold mt-4 flex items-center gap-2"><FiPercent className="text-blue-500" /> Last Class Percentage or CGPA <span className="text-red-500">*</span></label>
                                <select
                                    name="lastClassPercentageOrCGPA"
                                    value={formData.lastClassPercentageOrCGPA}
                                    onChange={(e) => handleChange("lastClassPercentageOrCGPA", e.target.value)}
                                    className={`w-full p-2 border rounded ${errors.lastClassPercentageOrCGPA ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Select Percentage or CGPA</option>
                                    {lastClassPercentageOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                {errors.lastClassPercentageOrCGPA && <div className="text-red-500 text-sm">{errors.lastClassPercentageOrCGPA}</div>}
                            </>
                        )}
                    {(formData.gradeOrYear || "").startsWith("college") && (
                        <>
                            <label className="block font-semibold mt-4 flex items-center gap-2"><FiBookOpen className="text-blue-500" /> What Course Currently Doing <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="currentCourse"
                                value={formData.currentCourse}
                                onChange={(e) => handleChange("currentCourse", e.target.value)}
                                className={`w-full p-2 border rounded ${errors.currentCourse ? 'border-red-500' : ''}`}
                                placeholder="e.g. BTech CS, BSc"
                            />
                            {errors.currentCourse && <div className="text-red-500 text-sm">{errors.currentCourse}</div>}
                            <label className="block font-semibold mt-4 flex items-center gap-2"><FiPercent className="text-blue-500" /> CGPA of Last Year (or Class 12th marks if 1st year) <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="lastYearCGPA"
                                value={formData.lastYearCGPA}
                                onChange={(e) => handleChange("lastYearCGPA", e.target.value)}
                                className={`w-full p-2 border rounded ${errors.lastYearCGPA ? 'border-red-500' : ''}`}
                                placeholder="e.g. 8.5 CGPA"
                            />
                            {errors.lastYearCGPA && <div className="text-red-500 text-sm">{errors.lastYearCGPA}</div>}
                        </>
                    )}
                </div>
            )}
            {step === 2 && (
                <div className="space-y-6">
                    <label className="block font-semibold text-lg flex items-center gap-2"><FiTarget className="text-blue-500" /> Select Your Interests <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-2">
                        {interestsOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    let newInterests;
                                    if (formData.interests.includes(option)) {
                                        newInterests = formData.interests.filter((i) => i !== option);
                                    } else {
                                        newInterests = [...formData.interests, option];
                                    }
                                    handleChange("interests", newInterests);
                                }}
                                className={`px-4 py-2 rounded-full border transition-all duration-150 text-sm font-medium
                                    ${formData.interests.includes(option)
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                        : 'bg-white text-blue-700 border-blue-400 hover:bg-blue-50'}`}
                                style={{ minWidth: 120 }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {errors.interests && <div className="text-red-500 text-sm mt-1">{errors.interests}</div>}
                    <div className="mt-2">
                        <span className="font-semibold">Selected Interests:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {formData.interests.length === 0 && <span className="text-gray-400">None selected</span>}
                            {formData.interests.map((interest) => (
                                <span key={interest} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                    <label className="block font-semibold text-lg mt-4 flex items-center gap-2"><FiAward className="text-blue-500" /> Add Your Skills <span className="text-red-500">*</span></label>
                    <SkillInput
                        skills={formData.skills}
                        setSkills={(skills) => handleChange("skills", skills)}
                    />
                    {errors.skills && <div className="text-red-500 text-sm mt-1">{errors.skills}</div>}
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <label className="block font-semibold flex items-center gap-2"><FiEdit2 className="text-blue-500" /> Have You Used Any AI Tool Before?<span className="text-red-500">*</span></label>
                    <select
                        name="usedAIToolBefore"
                        value={formData.usedAIToolBefore}
                        onChange={(e) => handleChange("usedAIToolBefore", e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select an option</option>
                        {usedAIToolOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {errors.usedAIToolBefore && <div className="text-red-500 text-sm mt-1">{errors.usedAIToolBefore}</div>}
                    <label className="block font-semibold mt-4 flex items-center gap-2"><FiTarget className="text-blue-500" /> What Are Your Main Goals Right Now?<span className="text-red-500">*</span></label>
                    <textarea
                        name="mainGoal"
                        value={formData.mainGoal}
                        onChange={(e) => handleChange("mainGoal", e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Describe your main goals"
                    />
                    {errors.mainGoal && <div className="text-red-500 text-sm mt-1">{errors.mainGoal}</div>}
                    <label className="block font-semibold mt-4 flex items-center gap-2"><FiTarget className="text-blue-500" /> Any Work Experience?</label>
                    <textarea
                        name="mainGoal"
                        value={formData.experience}
                        onChange={(e) => handleChange("experience", e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Describe your Experience in Which Field and How Much...?"
                    />
                    {errors.experience && <div className="text-red-500 text-sm mt-1">{errors.experience}</div>}
                </div>
            )}
            {step === 4 && (
                <div className="space-y-4">
                    <label className="block font-semibold flex items-center gap-2"><FiClock className="text-blue-500" /> How Much Time Can You Spend Learning New Things or Skills?<span className="text-red-500">*</span></label>
                    <select
                        name="learningTime"
                        value={formData.learningTime}
                        onChange={(e) => handleChange("learningTime", e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select an option</option>
                        {learningTimeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {errors.learningTime && <div className="text-red-500 text-sm mt-1">{errors.learningTime}</div>}
                    <label className="block font-semibold mt-4 flex items-center gap-2"><FiBookOpen className="text-blue-500" /> How Do You Learn Best?<span className="text-red-500">*</span></label>
                    <select
                        name="learningStyle"
                        value={formData.learningStyle}
                        onChange={(e) => handleChange("learningStyle", e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select an option</option>
                        {learningStyleOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {errors.learningStyle && <div className="text-red-500 text-sm mt-1">{errors.learningStyle}</div>}
                </div>
            )}
            {step === 5 && (
                <div className="space-y-4">
                    <label className="block font-semibold flex items-center gap-2"><FiTarget className="text-blue-500" /> What Long Term Career Goal Do You Want to Make?<span className="text-red-500">*</span></label>
                    <textarea
                        name="longTermCareerGoal"
                        value={formData.longTermCareerGoal}
                        onChange={(e) => handleChange("longTermCareerGoal", e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Describe your long term career goal"
                    />
                    {errors.longTermCareerGoal && <div className="text-red-500 text-sm mt-1">{errors.longTermCareerGoal}</div>}
                    <label className="block font-semibold mt-4 flex items-center gap-2"><FiEdit2 className="text-blue-500" /> Biggest Career Challenge You Think You Have<span className="text-red-500">*</span></label>
                    <textarea
                        name="biggestCareerChallenge"
                        value={formData.biggestCareerChallenge}
                        onChange={(e) => handleChange("biggestCareerChallenge", e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Describe your biggest career challenge"
                    />
                    {errors.biggestCareerChallenge && <div className="text-red-500 text-sm mt-1">{errors.biggestCareerChallenge}</div>}
                </div>
            )}
            {step === totalSteps && (
                <ReviewStep
                    formData={formData}
                    prevStep={prevStep}
                    handleSubmit={handleSubmit}
                />
            )}
            {(step < totalSteps) && (
                <div className="flex justify-between mt-4">
                    {step > 0 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Prev
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleNext}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
}
