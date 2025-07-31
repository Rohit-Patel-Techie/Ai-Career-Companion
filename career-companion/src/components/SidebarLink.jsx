import React from "react";

const SidebarLink = ({ icon, label, isCollapsed, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center w-full px-4 py-3 rounded-lg
        ${active
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-white"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
        transition-all duration-200 ${isCollapsed ? "justify-center" : ""}`}
      title={isCollapsed ? label : ""}
    >
      <span className="text-xl">{icon}</span>
      {!isCollapsed && (
        <span className="ml-4 text-base font-medium whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
};

export default SidebarLink;