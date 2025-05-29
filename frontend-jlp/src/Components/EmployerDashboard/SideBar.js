import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaUsers,
  FaMoneyBill,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { logoutUser } from '../../APIS/API';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const EmployerSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // for mobile
  const [desktopCollapsed, setDesktopCollapsed] = useState(false); // for desktop
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleDesktopCollapse = () => setDesktopCollapsed(!desktopCollapsed);

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.status === 200) {
        logout();
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { to: "/employer/dashboard", icon: FaHome, label: "Dashboard" },
    { to: "/employer/jobs", icon: FaBriefcase, label: "Jobs" },
    { to: "/employer/profile", icon: FaCog, label: "Account Settings" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
          shadow-2xl border-r border-slate-700/50 backdrop-blur-sm z-40
          transition-all duration-300 ease-in-out
          ${desktopCollapsed ? 'w-16' : 'w-64'}
          hidden lg:block
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          {!desktopCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaBriefcase className="text-white text-sm" />
              </div>
              <h2 className="text-white font-bold text-lg">Employer</h2>
            </div>
          )}
          
          <button
            onClick={toggleDesktopCollapse}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          >
            {desktopCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.to}
                  className="
                    flex items-center px-3 py-3 text-slate-300 
                    hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20
                    rounded-xl transition-all duration-200 group relative overflow-hidden
                    before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/10 before:to-purple-500/10 
                    before:translate-x-full before:transition-transform before:duration-300
                    hover:before:translate-x-0
                  "
                >
                  <Icon className={`${desktopCollapsed ? 'mx-auto' : 'mr-3'} text-lg group-hover:scale-110 transition-transform duration-200`} />
                  {!desktopCollapsed && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center px-3 py-3 text-red-400 
              hover:text-red-300 hover:bg-red-500/10
              rounded-xl transition-all duration-200 group
            "
          >
            <FaSignOutAlt className={`${desktopCollapsed ? 'mx-auto' : 'mr-3'} text-lg group-hover:scale-110 transition-transform duration-200`} />
            {!desktopCollapsed && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          shadow-2xl border-r border-slate-700/50 backdrop-blur-sm
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaBriefcase className="text-white text-sm" />
            </div>
            <h2 className="text-white font-bold text-lg">Employer</h2>
          </div>
          
          <button
            onClick={closeSidebar}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.to}
                  onClick={closeSidebar}
                  className="
                    flex items-center px-3 py-3 text-slate-300 
                    hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20
                    rounded-xl transition-all duration-200 group relative overflow-hidden
                    before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/10 before:to-purple-500/10 
                    before:translate-x-full before:transition-transform before:duration-300
                    hover:before:translate-x-0
                  "
                >
                  <Icon className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center px-3 py-3 text-red-400 
              hover:text-red-300 hover:bg-red-500/10
              rounded-xl transition-all duration-200 group
            "
          >
            <FaSignOutAlt className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="
          fixed top-4 left-4 z-40 p-3 bg-gradient-to-r from-slate-800 to-slate-700
          text-white rounded-xl shadow-lg border border-slate-600/50
          hover:from-slate-700 hover:to-slate-600 transition-all duration-200
          lg:hidden backdrop-blur-sm
        "
      >
        <FaBars className="text-lg" />
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
};

export default EmployerSidebar;