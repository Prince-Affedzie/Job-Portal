import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaBell, FaChevronDown, FaChevronUp, FaBriefcase, FaUsers, FaUser } from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";
import { notificationContext } from '../../Context/NotificationContext';
import "../../Styles/EmployerNavbar.css";

const EmployerNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const { notifications, fetchNotifications } = useContext(notificationContext);
  const location = useLocation();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDashboardDropdownOpen(false);
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
    setDashboardDropdownOpen(!dashboardDropdownOpen);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (menuOpen) closeMenu();
        if (dashboardDropdownOpen) setDashboardDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen, dashboardDropdownOpen]);

  const isActive = (path) => location.pathname === path || location.pathname.includes(path);

  return (
    <nav className="navbar employer-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/employer/dashboard" className="navbar-logo">
          <span className="logo-part-1">Worka</span>
          <span className="logo-part-2">Flow</span>
          <span className="employer-badge">Employer</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <ul className="u-nav-links">
            <li>
              <Link 
                to="/employer/dashboard" 
                className={`u-nav-link ${isActive('/employer/dashboard') ? 'active' : ''}`}
              >
                <FaBriefcase className="nav-icon" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/employer/jobs" 
                className={`u-nav-link ${isActive('/employer/jobs') ? 'active' : ''}`}
              >
                <FaBriefcase className="nav-icon" />
                My Jobs
              </Link>
            </li>
           {/* <li>
              <Link 
                to="/employer/applicants" 
                className={`u-nav-link ${isActive('/employer/applicants') ? 'active' : ''}`}
              >
                <FaUsers className="nav-icon" />
                Applicants
              </Link>
            </li>*/}
            <li>
              <Link 
                to="/v1/post_job/form" 
                className="cta-link"
              >
                Post a Job
              </Link>
            </li>
          </ul>

          <div className="nav-icons">
            <Link 
              to="/employer/notifications" 
              className="u-notification-icon"
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </Link>
            
            {/* Desktop Dashboard Dropdown */}
            <div className="dashboard-dropdown-container" ref={dropdownRef}>
              <button 
                className="dashboard-dropdown-toggle"
                onClick={toggleDashboardDropdown}
                aria-label="Dashboard menu"
                aria-expanded={dashboardDropdownOpen}
              >
                <FaUser size={20} />
                {dashboardDropdownOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </button>
              
              {dashboardDropdownOpen && (
                <div className="dashboard-dropdown-menu">
                  <Link 
                    to="/employer/profile" 
                    className="dropdown-item"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    <FaUser className="dropdown-icon" />
                    My Profile
                  </Link>
                  
                 {/*<Link 
                    to="/employer/settings" 
                    className="dropdown-item"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    <TbLayoutDashboard className="dropdown-icon" />
                    Settings
                  </Link>*/}

                 {/* <Link 
                    to="/employer/subscription" 
                    className="dropdown-item"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    <FaBriefcase className="dropdown-icon" />
                    Subscription
                  </Link>*/}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button" 
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Menu Sidebar */}
      <div className={`mobile-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="mobile-sidebar-header">
          <Link to="/employer/dashboard" className="mobile-sidebar-logo" onClick={closeMenu}>
            <span className="logo-part-1">Worka</span>
            <span className="logo-part-2">Flow</span>
            <span className="employer-badge">Employer</span>
          </Link>
          <button 
            className="mobile-sidebar-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mobile-sidebar-content">
          <ul className="mobile-nav-links">
            <li>
              <Link 
                to="/employer/dashboard" 
                onClick={closeMenu}
                className={`mobile-nav-link ${isActive('/employer/dashboard') ? 'active' : ''}`}
              >
                <FaBriefcase className="nav-icon" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/employer/jobs" 
                onClick={closeMenu}
                className={`mobile-nav-link ${isActive('/employer/jobs') ? 'active' : ''}`}
              >
                <FaBriefcase className="nav-icon" />
                My Jobs
              </Link>
            </li>
            {/*<li>
              <Link 
                to="/employer/applicants" 
                onClick={closeMenu}
                className={`mobile-nav-link ${isActive('/employer/applicants') ? 'active' : ''}`}
              >
                <FaUsers className="nav-icon" />
                Applicants
              </Link>
            </li> */}
            
            {/* Mobile Dashboard Dropdown Items */}
            <li>
              <Link 
                to="/employer/profile" 
                onClick={closeMenu}
                className="mobile-nav-link"
              >
                <FaUser className="nav-icon" />
                My Profile
              </Link>
            </li>

            <li>
              <Link 
                to="/employer/profile" 
                onClick={closeMenu}
                className="mobile-nav-link"
              >
                <TbLayoutDashboard className="nav-icon" />
                Settings
              </Link>
            </li>

            {/*<li>
              <Link 
                to="/employer/subscription" 
                onClick={closeMenu}
                className="mobile-nav-link"
              >
                <FaBriefcase className="nav-icon" />
                Subscription
              </Link>
            </li>*/}

            <li>
              <Link 
                to="/employer/notifications" 
                onClick={closeMenu}
                className="mobile-nav-link"
              >
                <div className="mobile-notification-item">
                  <FaBell className="nav-icon" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="mobile-notification-badge">{unreadCount}</span>
                  )}
                </div>
              </Link>
            </li>
          </ul>

          <div className="mobile-sidebar-footer">
            <Link 
              to="/v1/post_job/form" 
              onClick={closeMenu}
              className="mobile-cta-link"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={closeMenu}
        />
      )}
    </nav>
  );
};

export default EmployerNavbar;