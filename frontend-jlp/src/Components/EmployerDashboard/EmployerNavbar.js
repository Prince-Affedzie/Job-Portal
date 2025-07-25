import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaBriefcase, FaUsers, FaBell, FaUser } from "react-icons/fa";
import { notificationContext } from "../../Context/NotificationContext";
import "../../Styles/EmployerNavbar.css";

const EmployerNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications } = useContext(notificationContext);

  return (
    <nav className="employer-navbar">
      <div className="employer-logo">
        <Link to="/employer/dashboard" className="text-2xl font-serif font-extrabold tracking-tight group transition-all duration-300">
          <span className="text-slate-800 group-hover:text-slate-900 transition-colors duration-300">Worka</span>
          <span className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">Flow</span>
        </Link>
      </div>

      {/* Desktop/Mobile Nav Links */}
      <ul className={menuOpen ? "nav-links active" : "nav-links"}>
        <li>
          <Link to="/employer/dashboard"><FaBriefcase /> Dashboard</Link>
        </li>
        <li>
          <Link to="/employer/jobs"><FaBriefcase />My Jobs</Link>
        </li>
        {/*<li>
          <Link to="/employer/applicants"><FaUsers /> Applicants</Link>
        </li>*/}
      </ul>

      {/* Right Fixed Icons (Outside Menu) */}
      <div className="navbar-right-section">
        <Link 
          to="/employer/notifications" 
          className="notification-wrapper" 
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <FaBell className="notification-icon" />
          {notifications && notifications.filter(n => !n.read).length > 0 && (
            <span className="notification-badge">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </Link>
        <Link to="/employer/profile" className="profile-link">
          <FaUser />
        </Link>
      </div>

      {/* Hamburger Toggle */}
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
};

export default EmployerNavbar;