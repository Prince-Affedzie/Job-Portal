import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaBars, FaTimes, FaBell, FaChevronDown, FaChevronUp,
  FaBriefcase, FaComments, FaUser, FaHome, FaListAlt,
  FaEnvelope, FaUserCircle, FaTasks, FaSignOutAlt
} from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";
import { notificationContext } from '../../Context/NotificationContext';
import { logoutUser } from '../../APIS/API';
import { useAuth } from '../../Context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, fetchNotifications } = useContext(notificationContext);
  const location = useLocation();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDashboardDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle menu toggle with proper body scroll management
  const toggleMenu = () => {
    const newMenuState = !menuOpen;
    setMenuOpen(newMenuState);
    
    // Prevent body scroll when menu is open
    if (newMenuState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  const toggleDashboardDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDashboardDropdownOpen(!dashboardDropdownOpen);
    setShowNotifications(false);
  };

  const toggleNotifications = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    setDashboardDropdownOpen(false);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle escape key to close mobile menu and dropdowns
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (menuOpen) closeMenu();
        if (dashboardDropdownOpen) setDashboardDropdownOpen(false);
        if (showNotifications) setShowNotifications(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen, dashboardDropdownOpen, showNotifications]);

  const isActive = (path) => location.pathname.includes(path);

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

  return (
    <nav className="bg-blue-700 shadow-sm z-30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Mobile menu button */}
          <div className="flex-shrink-0 flex items-center md:hidden">
            <button 
              className="p-2 rounded-md text-white hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex flex-1 justify-center md:justify-start">
            <Link to="/job/listings" className="flex items-center">
              <span className="text-white font-bold text-xl">Worka</span>
              <span className="text-blue-300 font-bold text-xl">Flow</span>
            </Link>
          </div>

          {/* Right: Notification and dashboard icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={toggleNotifications}
                className="p-2 rounded-full text-white hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <FaBell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full text-xs min-w-[16px] h-4 flex items-center justify-center px-1 transform translate-x-1/2 -translate-y-1/2">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications && notifications.length > 0 ? (
                      notifications.slice(0, 5).map(notification => (
                        <div 
                          key={notification.id} 
                          className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                          <p className="text-sm text-gray-800">{notification.message || notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.timestamp || new Date()).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <Link 
                      to="/view/all_notifications" 
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => setShowNotifications(false)}
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Dashboard Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                className="flex items-center p-2 rounded-full text-white hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={toggleDashboardDropdown}
                aria-label="Dashboard menu"
                aria-expanded={dashboardDropdownOpen}
              >
                <TbLayoutDashboard className="h-5 w-5" />
                {dashboardDropdownOpen ? (
                  <FaChevronUp className="ml-1 h-3 w-3" />
                ) : (
                  <FaChevronDown className="ml-1 h-3 w-3" />
                )}
              </button>
              
              {dashboardDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link 
                    to="/h1/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/mini_task/applications" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    Applications (Micro)
                  </Link>
                  <Link 
                    to="/user/modify/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setDashboardDropdownOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
          onClick={closeMenu}
        >
          <div 
            className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <span className="text-blue-700 font-bold text-xl">Worka</span>
                <span className="text-blue-500 font-bold text-xl">Flow</span>
              </div>
              <button 
                onClick={closeMenu}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/mini_task/listings" 
                onClick={closeMenu}
                className={`group flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive('mini_task') 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                <FaBriefcase className="mr-3 h-5 w-5" />
                Micro Jobs
              </Link>
              
              <Link 
                to="/messages" 
                onClick={closeMenu}
                className={`group flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive('messages') 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                <FaComments className="mr-3 h-5 w-5" />
                Chats
              </Link>
              
              <Link 
                to="/mini_task/applications" 
                onClick={closeMenu}
                className="group flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
              >
                <FaListAlt className="mr-3 h-5 w-5" />
                Applications (Micro)
              </Link>
              
              <Link 
                to="/view/all_notifications" 
                onClick={closeMenu}
                className="group flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
              >
                <div className="relative mr-3">
                  <FaBell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs min-w-[16px] h-4 flex items-center justify-center px-1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                Notifications
              </Link>
              
              <Link 
                to="/h1/dashboard" 
                onClick={closeMenu}
                className="group flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
              >
                <FaHome className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              
              <Link 
                to="/user/modify/profile" 
                onClick={closeMenu}
                className="group flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
              >
                <FaUserCircle className="mr-3 h-5 w-5" />
                My Profile
              </Link>
              
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="group w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
              >
                <FaSignOutAlt className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:block bg-blue-700 border-t border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start space-x-8">
            <Link 
              to="/mini_task/listings" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('mini_task') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-white hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Micro Jobs
            </Link>
            <Link 
              to="/messages" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('messages') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-white hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Chats
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;