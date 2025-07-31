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
  const [careerSuggestions, setCareerSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Update page title when sidebar navigation link is clicked
  const handlePageTitleChange = (title) => {
    setPageTitle(title);
  };

  useEffect(() => {
    fetch("http://192.168.1.3:8000/api/dashboard-data/")
      .then((res) => res.json())
      .then((data) => {
        const { fullName, currentSkills, suggestion } = data;

        let suggestions = [];

        try {
          const cleaned = suggestion
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          const parsed = JSON.parse(cleaned);
          suggestions = parsed.career_paths || [];
        } catch (err) {
          console.error("Failed to parse suggestion JSON:", err);
        }

        setUserData({
          fullName: fullName || "User",
          skills: currentSkills || [],
        });

        setCareerSuggestions(suggestions.slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div
      className={`flex min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-50 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
    >
      {/* Sidebar fixed, always present on lg and above */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleCollapse}
        userName={userData.fullName}
        onPageTitleChange={handlePageTitleChange}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "blur-sm pointer-events-none" : ""
          } ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}
      >
        <TopNavbar toggleSidebar={toggleSidebar} pageTitle={pageTitle} />

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md p-6 sm:p-8 transition-all duration-300 ease-in-out">
              <p className="text-gray-800 dark:text-gray-100 text-lg sm:text-xl font-medium leading-relaxed tracking-tight">
                <span className="inline-block text-2xl sm:text-3xl mr-2">👋</span>
                Welcome back,&nbsp;
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline decoration-indigo-400/60 dark:decoration-indigo-300 underline-offset-4 decoration-2 transition-colors duration-200">
                  {userData.fullName || "User"}
                </span>
                !<br className="block sm:hidden" />
                <span className="block mt-1 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Here's your personalized career dashboard.
                </span>
              </p>
            </div>

            <CareerProgressChart skills={userData.skills} />

            <div>
              <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-6">
                Based on your profile, {userData.fullName}, here are your top
                career paths:
              </h2>

              {loading ? (
                <p className="text-gray-600 dark:text-gray-300">
                  Loading suggestions...
                </p>
              ) : careerSuggestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {careerSuggestions.map((suggestion, index) => (
                    <CareerSuggestionCard key={index} data={suggestion} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No suggestions available.
                </p>
              )}
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
