import React from "react";

const SkillBox = ({ skills = [] }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Skills</h2>
            <div className="flex flex-wrap gap-2">
                {skills.length ? (
                    skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {skill}
                        </span>
                    ))
                ) : (
                    <p className="text-sm text-gray-400">No skills listed.</p>
                )}
            </div>
        </div>
    );
};

export default SkillBox;