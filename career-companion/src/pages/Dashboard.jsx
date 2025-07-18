import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import CareerProgressChart from "../components/CareerProgressChart";
import SkillBox from "../components/SkillBox";
import RecommendedSkills from "../components/RecommendedSkills";
import CareerSuggestionCard from "../components/CareerSuggestionCard";

const Dashboard = () => {
    const [userData, setUserData] = useState({
        fullName: "User",
        skills: [],
    });
    const [suggestionHeader, setSuggestionHeader] = useState("");
    const [careerSuggestions, setCareerSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8000/api/dashboard-data/")
            .then(res => res.json())
            .then(data => {
                const { fullName, currentSkills, suggestion } = data;

                // Split the full suggestion into two using delimiter
                const parts = suggestion.split('---').filter(Boolean).map(p => p.trim());

                const suggestions = parts.map((text, index) => ({
                    title: `Career Path ${index + 1}`,
                    short: text.substring(0, 200) + "...",  // short preview
                    full: text,
                }));

                setUserData({
                    fullName: fullName || "User",
                    skills: currentSkills || [],
                });

                setSuggestionHeader(
                    suggestion.split("\n")[0].replace("Based on your profile, ", "")
                );

                setCareerSuggestions(suggestions);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 w-full min-h-screen bg-gray-100 dark:bg-[#111827]">
                <TopNavbar />

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Section */}
                    <div className="col-span-2 space-y-6">
                        <div className="bg-white dark:bg-[#1f2937] shadow rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Welcome back, {userData.fullName || "User"}! Here's your career progress.
                            </p>
                        </div>

                        <CareerProgressChart skills={userData.skills} />

                        <div className="bg-white dark:bg-[#1f2937] shadow rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4 text-indigo-600">
                                Based on your profile, {userData.fullName}, here are two suitable career paths:
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {careerSuggestions.map((item, index) => (
                                    <CareerSuggestionCard key={index} data={item} />
                                ))}
                            </div>
                        </div>

                        <RecommendedSkills skills={userData.skills} />
                    </div>

                    {/* Right Section */}
                    <SkillBox skills={userData.skills} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;