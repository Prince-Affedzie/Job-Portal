import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";
import { notificationContext } from '../../Context/NotificationContext';
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { notifications, fetchNotifications } = useContext(notificationContext);
  const location = useLocation();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = menuOpen ? 'auto' : 'hidden';
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo with proper spacing */}
        <Link to="/job/listings" className="navbar-logo">
          <span className="logo-part-1">Worka</span>
          <span className="logo-part-2">Flow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <ul className="u-nav-links">
            <li>
              <Link 
                to="/mini_task/listings" 
                className={`u-nav-link ${isActive('mini_task') ? 'active' : ''}`}
              >
                Mini Jobs
              </Link>
            </li>
            <li>
              <Link 
                to="/job/listings" 
                className={`u-nav-link ${isActive('job/listings') ? 'active' : ''}`}
              >
                Regular Jobs
              </Link>
            </li>
            <li>
              <Link 
                to="/messages" 
                className={`u-nav-link ${isActive('messages') ? 'active' : ''}`}
              >
                Chats
              </Link>
            </li>
            <li>
              <Link 
                to="/post/mini_task" 
                className="cta-link"
              >
                Post Mini Job
              </Link>
            </li>
          </ul>

          <div className="nav-icons">
            <Link 
              to="/view/all_notifications" 
              className="u-notification-icon"
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </Link>
            <Link 
              to="/h1/dashboard" 
              className="dashboard-icon"
              aria-label="Dashboard"
            >
              <TbLayoutDashboard />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button - positioned correctly */}
        <button 
          className="mobile-menu-button" 
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          <ul className="mobile-nav-links">
            <li>
              <Link 
                to="/mini_task/listings" 
                onClick={closeMenu}
                className={`mobile-nav-link ${isActive('mini_task') ? 'active' : ''}`}
              >
                Mini Jobs
              </Link>
            </li>
            <li>
              <Link 
                to="/job/listings" 
                onClick={closeMenu}
                className={`mobile-nav-link ${isActive('job/listings') ? 'active' : ''}`}
              >
                Regular Jobs
              </Link>
            </li>
            <li>
              <Link 
                to="/messages" 
                onClick={closeMenu}
                className={`mobile-nav-link ${isActive('messages') ? 'active' : ''}`}
              >
                Chats
              </Link>
            </li>
            <li>
              <Link 
                to="/post/mini_task" 
                onClick={closeMenu}
                className="mobile-cta-link"
              >
                Post Mini Job
              </Link>
            </li>
          </ul>

          <div className="mobile-nav-icons">
            <Link 
              to="/view/all_notifications" 
              onClick={closeMenu}
              className="mobile-notification-icon"
            >
              <FaBell size={20} />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="mobile-notification-badge">{unreadCount}</span>
              )}
            </Link>
            <Link 
              to="/h1/dashboard" 
              onClick={closeMenu}
              className="mobile-dashboard-icon"
            >
              <TbLayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;