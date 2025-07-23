import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";
import { notificationContext } from '../../Context/NotificationContext';
import "../../Styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { notifications, fetchNotifications } = useContext(notificationContext);
  const location = useLocation();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle menu toggle with proper body scroll management
  const toggleMenu = () => {
    const newMenuState = !menuOpen;
    setMenuOpen(newMenuState);
    
    // Prevent body scroll when menu is open
    if (newMenuState) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, []);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
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
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </Link>
            <Link 
              to="/h1/dashboard" 
              className="dashboard-icon"
              aria-label="Dashboard"
            >
              <TbLayoutDashboard size={20} />
            </Link>
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

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className={`mobile-menu ${menuOpen ? "open" : ""}`}
          onClick={(e) => {
            // Close menu when clicking on overlay (but not on menu content)
            if (e.target === e.currentTarget) {
              closeMenu();
            }
          }}
        >
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
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <FaBell size={18} />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="mobile-notification-badge">{unreadCount}</span>
                )}
              </Link>
              <Link 
                to="/h1/dashboard" 
                onClick={closeMenu}
                className="mobile-dashboard-icon"
                aria-label="Dashboard"
              >
                <TbLayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;