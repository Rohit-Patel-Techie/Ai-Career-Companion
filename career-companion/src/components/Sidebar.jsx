import { FaHome, FaUser, FaCodeBranch, FaBriefcase, FaCog } from "react-icons/fa";

const Sidebar = () => (
  <aside className="bg-indigo-600 text-white w-64 min-h-screen flex flex-col justify-between p-4 fixed">
    <div>
      <h2 className="text-xl font-bold mb-6">AI Career Companion</h2>
      <nav className="space-y-4">
        <NavItem icon={<FaHome />} label="Dashboard" active />
        <NavItem icon={<FaUser />} label="My Profile" />
        <NavItem icon={<FaCodeBranch />} label="Learning Path" />
        <NavItem icon={<FaBriefcase />} label="Job Matches" />
        <NavItem icon={<FaCog />} label="Settings" />
      </nav>
    </div>
    <div className="mt-10">
      <p className="text-sm">Alex Johnson</p>
      <a href="#" className="text-xs underline text-purple-200">View Profile</a>
    </div>
  </aside>
);

const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center px-3 py-2 rounded-md ${active ? 'bg-white text-indigo-600' : 'hover:bg-indigo-500'}`}>
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </div>
);

export default Sidebar;