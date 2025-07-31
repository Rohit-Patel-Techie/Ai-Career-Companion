import React, { useState, useEffect } from "react";
import { FiHome, FiSettings, FiUser, FiLogOut } from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarLink from "./SidebarLink";

const Sidebar = ({ isOpen, toggleSidebar, userName = "User", isCollapsed, toggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    alert("Logged out!");
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${isOpen ? "block" : "hidden"}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 shadow-lg z-50 transition-all duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${isCollapsed ? "w-16" : "w-64"} flex-shrink-0`}
        style={{
          width: isOpen ? "85%" : "",
          maxWidth: isOpen ? "85%" : "",
        }}
      >
        <div className="h-full flex flex-col justify-between overflow-y-auto min-h-screen">
          {/* Top Section */}
          <div>
            {/* Mobile Close Button */}
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-2xl lg:hidden z-50"
              aria-label="Close menu"
            >
              &times;
            </button>

            {/* Logo & Collapse */}
            <div className="flex items-center justify-between px-4 py-10">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[var(--color-primary)] text-white font-bold text-sm rounded-full flex items-center justify-center">
                  AI
                </div>
                {!isCollapsed && (
                  <h1 className="ml-2 text-1xl font-extrabold text-[var(--color-text)]">
                    CAREER COMPANION
                  </h1>
                )}
              </div>

            {/* Collapse Button */}
            <button
              onClick={toggleCollapse}
              className="absolute top-2 -right-3 w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-md hover:bg-gray-700 transition-all z-50 hidden lg:flex"
              aria-label="Collapse Sidebar"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                />
              </svg>
            </button>
            </div>

            {/* Navigation */}
            <nav
              className={`flex flex-col px-4 space-y-2 ${isCollapsed ? "items-center" : "items-start"}`}
              role="navigation"
              aria-label="Main Navigation"
            >
              <SidebarLink
                icon={<FiHome />}
                label="Dashboard"
                isCollapsed={isCollapsed}
                active={location.pathname === "/dashboard"}
                onClick={() => navigate("/dashboard")}
              />
              <SidebarLink
                icon={<HiOutlineLightBulb />}
                label="Suggestions"
                isCollapsed={isCollapsed}
                active={location.pathname === "/suggestions"}
                onClick={() => navigate("/suggestions")}
              />
              <SidebarLink
                icon={<MdWorkOutline />}
                label="Career Paths"
                isCollapsed={isCollapsed}
                active={location.pathname === "/career-paths"}
                onClick={() => navigate("/career-paths")}
              />
              <SidebarLink
                icon={<FiUser />}
                label="Profile"
                isCollapsed={isCollapsed}
                active={location.pathname === "/profile"}
                onClick={() => navigate("/profile")}
              />
              <SidebarLink
                icon={<FiSettings />}
                label="Settings"
                isCollapsed={isCollapsed}
                active={location.pathname === "/settings"}
                onClick={() => navigate("/settings")}
              />
            </nav>
          </div>

          {/* Bottom Logout */}
          <div className="p-4 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 text-red-500 hover:text-red-700 transition-all w-full"
              title="Logout"
            >
              <FiLogOut className="text-xl" />
              {!isCollapsed && <span className="text-md">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;