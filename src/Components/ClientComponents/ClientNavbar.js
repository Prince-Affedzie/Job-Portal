import React, { useState, useEffect, useContext } from 'react';
import { 
  FaBriefcase, 
  FaComments, 
  FaMoneyBillWave, 
  FaBell, 
  FaSearch, 
  FaUser, 
  FaBars, 
  FaTimes,
  FaHome,
  FaPlus,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import "../../Styles/Navbar.css";
import { TbLayoutDashboard } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { notificationContext } from '../../Context/NotificationContext';

import "../../Styles/Navbar.css";
export const ClientNavbar = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const { notifications, fetchNotifications } = useContext(notificationContext);
  const location = useLocation();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowProfileMenu(false);
      setDashboardDropdownOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="bg-blue-700 shadow-sm z-30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-white hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Toggle sidebar"
            >
              <FaBars className="h-6 w-6 mr-4" />
            </button>
            
           <Link to="/client/microtask_dashboard" className="navbar-logo">
                     <span className="logo-part-1">Worka</span>
                     <span className="logo-part-2">Flow</span>
          </Link>
          </div>

          {/* Desktop Navigation */}
         <div style={{
             display: windowWidth >= 768 ? 'flex' : 'none',
            }} className="md:items-center md:space-x-6 lg:space-x-8">

            <div className="flex space-x-8">
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
              <Link 
                to="/post/mini_task" 
                className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Post Micro Job
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                    setDashboardDropdownOpen(false);
                  }}
                  className="p-2 rounded-full text-white hover:text-gray-100 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
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
                        to="/client/view/all_notifications" 
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
              <div className="relative">
                <button 
                  className="flex items-center p-2 rounded-full text-white hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDashboardDropdownOpen(!dashboardDropdownOpen);
                    setShowNotifications(false);
                    setShowProfileMenu(false);
                  }}
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
                      to="/client/microtask_dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDashboardDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/manage/mini_tasks" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDashboardDropdownOpen(false)}
                    >
                      My Micro Jobs
                    </Link>
                    <Link 
                      to="/user/modify/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDashboardDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button (for right side) */}
          <div className="lg:hidden flex items-center">
            {/* Notifications for mobile */}
            <div className="relative mr-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                  setDashboardDropdownOpen(false);
                }}
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
            </div>
            
            {/* Dashboard dropdown for mobile */}
            <div className="relative">
              <button 
                className="flex items-center p-2 rounded-full text-white hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setDashboardDropdownOpen(!dashboardDropdownOpen);
                  setShowNotifications(false);
                  setShowProfileMenu(false);
                }}
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
                    to="/client/microtask_dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/manage/mini_tasks" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    My Micro Jobs
                  </Link>
                  <Link 
                    to="/user/modify/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};