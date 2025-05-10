import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaBell } from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";
import "./Navbar.css";
import { notificationContext } from '../../Context/NotificationContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, fetchNotifications } = useContext(notificationContext);
  
  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when clicking a link
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <Link to="/job/listings" className="text-2xl font-serif font-extrabold text-blue-600 tracking-tight">
        <span className="text-gray-100">Worka</span><span className="text-blue-300">Flow</span>
      </Link>

      {/* Desktop Nav Links */}
      <ul className="desktop-nav-links">
        <li>
          <Link to="/mini_task/listings">Mini Jobs</Link>
        </li>
        <li>
          <Link to="/job/listings">Regular Jobs</Link>
        </li>
        <li>
          <Link to="/post/mini_task">
            Post Mini Job
          </Link>
        </li>
      </ul>

      {/* Mobile Menu Toggle */}
      <button className="j-menu-toggle" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu - Contains both nav links and icons */}
      <div className={`mobile-menu-container ${menuOpen ? "open" : ""}`}>
        {/* Nav Links */}
        <ul className="j-nav-links">
          <li>
            <Link to="/mini_task/listings" onClick={closeMenu}>Mini Jobs</Link>
          </li>
          <li>
            <Link to="/job/listings" onClick={closeMenu}>Regular Jobs</Link>
          </li>
          <li>
            <Link to="/post/mini_task" onClick={closeMenu}>
              Post a Mini Task
            </Link>
          </li>
          
          {/* Mobile-only nav items (moved from nav-icons) */}
          <li className="mobile-only-nav-item">
            <Link to="/view/all_notifications" onClick={closeMenu} className="mobile-nav-icon">
              <FaBell className="icon" />
              <span className="icon-text">Notifications</span>
              {notifications && notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge mobile">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </Link>
          </li>
          <li className="mobile-only-nav-item">
            <Link to="/h1/dashboard" onClick={closeMenu} className="mobile-nav-icon">
              <TbLayoutDashboard className="icon" />
              <span className="icon-text">Dashboard</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Desktop-only: Right Icons */}
      <div className="nav-icons desktop-only">
        {/* Notification Bell */}
        <Link to="/view/all_notifications" className="notification-container">
          <FaBell className="notification-icon" />
          {notifications && notifications.filter(n => !n.read).length > 0 && (
            <span className="notification-badge">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </Link>

        {/* User Profile */}
        <Link to="/h1/dashboard">
          <TbLayoutDashboard className="profile-icon" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;