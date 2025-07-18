import React from "react";

const RecommendedSkills = ({ skills }) => {
    const recommendations = [];

    if (skills.includes("python")) {
        recommendations.push({
            title: "Machine Learning",
            description: "Python opens the door to AI/ML tools.",
            relevance: "92%",
        });
    }

    if (skills.includes("html") || skills.includes("css")) {
        recommendations.push({
            title: "Frontend Development",
            description: "You're ready to master React or Vue.",
            relevance: "85%",
        });
    }

    if (skills.includes("sql")) {
        recommendations.push({
            title: "Data Analytics",
            description: "SQL is foundational for data jobs.",
            relevance: "88%",
        });
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recommended Skills</h2>
            {recommendations.length ? (
                recommendations.map((rec, idx) => (
                    <div key={idx} className="mb-4">
                        <h3 className="font-semibold text-indigo-700">{rec.title}</h3>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                        <p className="text-xs mt-1 text-gray-500">Relevance: {rec.relevance}</p>
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500">No dynamic recommendations yet.</p>
            )}
        </div>
    );
};

export default RecommendedSkills;