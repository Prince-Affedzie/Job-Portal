import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

   useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
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
    { 
      to: "/employer/dashboard", 
      icon: FaHome, 
      label: "Dashboard",
      gradient: "from-blue-500 to-cyan-400",
      hoverGradient: "from-blue-400 to-cyan-300",
      bgGradient: "from-blue-500/20 to-cyan-400/20"
    },
    { 
      to: "/employer/jobs", 
      icon: FaBriefcase, 
      label: "My Jobs",
      gradient: "from-purple-500 to-pink-400",
      hoverGradient: "from-purple-400 to-pink-300",
      bgGradient: "from-purple-500/20 to-pink-400/20"
    },
    { 
      to: "/employer/profile", 
      icon: FaCog, 
      label: "Account Settings",
      gradient: "from-emerald-500 to-teal-400",
      hoverGradient: "from-emerald-400 to-teal-300",
      bgGradient: "from-emerald-500/20 to-teal-400/20"
    },
  ];

  // Enhanced Icon Wrapper Component
  const EnhancedIcon = ({ icon: Icon, gradient, hoverGradient, isCollapsed, isActive }) => (
    <div className={`
      relative flex items-center justify-center
      ${isCollapsed ? 'w-10 h-10 mx-auto' : 'w-10 h-10 mr-3'}
      rounded-xl transition-all duration-300 group-hover:scale-110
      ${isActive ? `bg-gradient-to-br ${gradient} shadow-lg` : 'bg-slate-700/50'}
      group-hover:shadow-xl
      before:absolute before:inset-0 before:rounded-xl
      before:bg-gradient-to-br before:${hoverGradient} before:opacity-0
      group-hover:before:opacity-100 before:transition-opacity before:duration-300
      after:absolute after:inset-0 after:rounded-xl after:ring-2 after:ring-transparent
      group-hover:after:ring-white/20 after:transition-all after:duration-300
    `}>
      <Icon className={`
        relative z-10 text-lg transition-all duration-300
        ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}
        group-hover:drop-shadow-sm
      `} />
      
      {/* Glow effect */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
        bg-gradient-to-br ${gradient} blur-xl scale-75
        transition-all duration-500 -z-10
      `} />
    </div>
  );

  return (
    <>
      {/* Hamburger Menu Button - Only visible on small screens */}
      <button
        onClick={toggleMobileMenu}
        className="
          fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-slate-800 to-slate-700
          text-white rounded-xl shadow-lg border border-slate-600/50
          hover:from-slate-700 hover:to-slate-600 transition-all duration-200
          sm:hidden backdrop-blur-sm hidden
        "
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <FaTimes className="text-lg" />
        ) : (
          <FaBars className="text-lg" />
        )}
      </button>

      {/* Desktop Sidebar - Hidden on small screens */}
      <div
      style={{
      display: windowWidth >= 1024 ? 'block' : 'none',
    }}
  className={`
    fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
    shadow-2xl border-r border-slate-700/50 backdrop-blur-sm z-40
    transition-all duration-300 ease-in-out
    ${desktopCollapsed ? 'w-16' : 'w-64'}
   
  `}
>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          {!desktopCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaBriefcase className="text-white text-lg" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 blur-lg scale-75 opacity-50 -z-10" />
              </div>
              <h2 className="text-white font-bold text-lg bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Employer
              </h2>
            </div>
          )}
          
          <button
            onClick={toggleDesktopCollapse}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {desktopCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <div className="space-y-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={index}
                  to={item.to}
                  className={`
                    relative flex items-center px-3 py-4 text-slate-300 
                    hover:text-white rounded-xl transition-all duration-300 group overflow-hidden
                    ${isActive ? `bg-gradient-to-r ${item.bgGradient} text-white border border-white/10` : 'hover:bg-slate-700/30'}
                    before:absolute before:inset-0 before:bg-gradient-to-r before:${item.bgGradient}
                    before:translate-x-full before:transition-transform before:duration-500
                    hover:before:translate-x-0 before:opacity-0 hover:before:opacity-100
                  `}
                >
                  <EnhancedIcon 
                    icon={Icon}
                    gradient={item.gradient}
                    hoverGradient={item.hoverGradient}
                    isCollapsed={desktopCollapsed}
                    isActive={isActive}
                  />
                  
                  {!desktopCollapsed && (
                    <span className="relative z-10 font-medium truncate transition-all duration-300 group-hover:translate-x-1">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-l-full" />
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
              w-full flex items-center px-3 py-4 text-red-400 
              hover:text-red-300 hover:bg-red-500/10
              rounded-xl transition-all duration-300 group relative overflow-hidden
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/20 before:to-red-400/20
              before:translate-x-full before:transition-transform before:duration-500
              hover:before:translate-x-0
            "
          >
            <div className={`
              relative flex items-center justify-center
              ${desktopCollapsed ? 'w-10 h-10 mx-auto' : 'w-10 h-10 mr-3'}
              rounded-xl transition-all duration-300 group-hover:scale-110
              bg-red-500/20 group-hover:bg-red-500/30
              group-hover:shadow-lg group-hover:shadow-red-500/25
            `}>
              <FaSignOutAlt className="text-lg group-hover:text-red-300 transition-colors duration-200" />
            </div>
            
            {!desktopCollapsed && (
              <span className="relative z-10 font-medium transition-all duration-300 group-hover:translate-x-1">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Dropdown */}
      <div
        className={`
          fixed top-16 left-4 right-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          rounded-xl shadow-2xl border border-slate-700/50 backdrop-blur-sm z-50
          transform transition-all duration-300 ease-in-out sm:hidden
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="flex items-center space-x-3 px-4 py-4 border-b border-slate-700/50">
          <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaBriefcase className="text-white text-lg" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 blur-lg scale-75 opacity-50 -z-10" />
          </div>
          <h2 className="text-white font-bold text-lg bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Employer Menu
          </h2>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={index}
                  to={item.to}
                  onClick={() => {
                    closeMobileMenu();
                  }}
                  className={`
                    relative flex items-center px-3 py-3 text-slate-300 
                    hover:text-white rounded-xl transition-all duration-300 group overflow-hidden
                    ${isActive ? `bg-gradient-to-r ${item.bgGradient} text-white` : 'hover:bg-slate-700/30'}
                    before:absolute before:inset-0 before:bg-gradient-to-r before:${item.bgGradient}
                    before:translate-x-full before:transition-transform before:duration-500
                    hover:before:translate-x-0 before:opacity-0 hover:before:opacity-100
                  `}
                >
                  <EnhancedIcon 
                    icon={Icon}
                    gradient={item.gradient}
                    hoverGradient={item.hoverGradient}
                    isCollapsed={false}
                    isActive={isActive}
                  />
                  <span className="relative z-10 font-medium transition-all duration-300 group-hover:translate-x-1">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-slate-700/50 pt-4">
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="
              w-full flex items-center px-3 py-3 text-red-400 
              hover:text-red-300 hover:bg-red-500/10
              rounded-xl transition-all duration-300 group relative overflow-hidden
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/20 before:to-red-400/20
              before:translate-x-full before:transition-transform before:duration-500
              hover:before:translate-x-0
            "
          >
            <div className="
              relative flex items-center justify-center w-10 h-10 mr-3
              rounded-xl transition-all duration-300 group-hover:scale-110
              bg-red-500/20 group-hover:bg-red-500/30
              group-hover:shadow-lg group-hover:shadow-red-500/25
            ">
              <FaSignOutAlt className="text-lg group-hover:text-red-300 transition-colors duration-200" />
            </div>
            <span className="relative z-10 font-medium transition-all duration-300 group-hover:translate-x-1">
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default EmployerSidebar;