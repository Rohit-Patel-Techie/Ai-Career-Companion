const TopNavbar = ({ userName, toggleSidebar, pageTitle }) => (
    <div className="flex justify-between items-center py-4 px-6 shadow-md sticky top-0 bg-white dark:bg-gray-900 z-10">
        <div className="flex items-center space-x-4">
            <button
                onClick={toggleSidebar}
                className="text-indigo-600 text-xl font-bold px-3 py-2 rounded-md hover:bg-indigo-100 transition lg:hidden"
                aria-label="Toggle menu"
            >
                ☰
            </button>
            <h1
                className="text-3xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400 transition-colors duration-300"
                aria-label={pageTitle}
            >
                {pageTitle}
            </h1>
        </div>
        <div className="flex items-center space-x-4">
            {/* Notification button */}
            <button className="text-gray-600 text-2xl hover:text-indigo-600 transition" aria-label="Notifications">
                🔔
            </button>
            {/* User greeting */}
            {userName && (
                <span className="hidden sm:inline text-gray-700 dark:text-gray-300 font-medium">
                    Hello, {userName}
                </span>
            )}
        </div>
    </div>
);

export default TopNavbar;
