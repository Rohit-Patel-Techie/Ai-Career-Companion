const TopNavbar = ({ userName }) => (
    <div className="flex justify-between items-center py-4 px-6 shadow-sm sticky top-0 bg-white z-10">
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {userName}! Here's your career progress</p>
        </div>
        <div className="flex items-center space-x-4">
            <input type="text" placeholder="Search..." className="border px-3 py-2 rounded-md" />
            <button className="text-gray-600">
                🔔
            </button>
        </div>
    </div>
);

export default TopNavbar;