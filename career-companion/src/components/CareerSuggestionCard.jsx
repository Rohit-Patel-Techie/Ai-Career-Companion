import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CareerSuggestionCard = ({ data }) => {
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);
    const navigate = useNavigate();

    const handleViewRoadmap = () => {
        try {
            navigate('/roadmap', {
                state: {
                    career: {
                        title: data?.title,
                        skills: data?.skills || [],
                        resources: data?.resources || [],
                        description: data?.description || '',
                        icon: data?.icon || '',
                    }
                }
            });
        } catch (e) {
            console.error('Navigation to roadmap failed:', e);
        }
    };

    // if (!data) return null;

    const {
        title,
        description,
        skills,
        icon,
        reason,
        labor_market,
        resources,
    } = data;

    // Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showModal && modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showModal]);

    if (!data) {
        return (
            <div className="text-gray-500 dark:text-gray-300 p-4 italic">
                No suggestion available.
            </div>
        );
    }

    // The rest of your component rendering with data.title, etc.


return (
    <>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col justify-between min-h-[300px]">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {icon} {title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleViewRoadmap}
                    className="w-full sm:w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-semibold transition-colors"
                >
                    View Roadmap
                </button>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-1/2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-all duration-300"
                >
                    Read More
                </button>
            </div>
        </div>

        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div
                    ref={modalRef}
                    className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-lg shadow-lg p-6 relative"
                >
                    <button
                        className="text-[2rem] absolute top-3 right-4 text-gray-500 hover:text-red-800 dark:hover:text-white text-lg"
                        onClick={() => setShowModal(false)}
                    >
                        &times;
                    </button>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {icon} {title}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
                        <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-4">
                            {reason}
                        </p>

                        {/* Skills */}
                        {skills && skills.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Required Skills:</h4>
                                <ul className="flex flex-wrap gap-2">
                                    {skills.map((skill, idx) => (
                                        <li
                                            key={idx}
                                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                                        >
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Labor Market Info */}
                        {labor_market && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Job Market Insights:</h4>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                    <li><strong>Demand:</strong> {labor_market.job_demand}</li>
                                    <li><strong>Salary Range:</strong> {labor_market.salary_range}</li>
                                    <li><strong>Growth:</strong> {labor_market.industry_growth}</li>
                                    <li><strong>Future Scope:</strong> {labor_market.future_scope}</li>
                                </ul>
                            </div>
                        )}

                        {/* Resources */}
                        {resources && resources.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Learning Resources:</h4>
                                <ul className="list-disc ml-5 text-sm text-blue-600 dark:text-blue-400 space-y-1">
                                    {resources.map((res, idx) => (
                                        <li key={idx}>
                                            <a
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                {res.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleViewRoadmap}
                                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-colors"
                            >
                                View Roadmap
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-semibold transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
);
};

export default CareerSuggestionCard;