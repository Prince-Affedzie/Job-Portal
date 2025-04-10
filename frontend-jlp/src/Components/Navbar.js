import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaBell } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    "New job posted: React Developer",
    "Interview request from Tech Innovations Inc.",
    "Your application was viewed by a recruiter",
  ]);
  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <Link to="/" className="logo">
        JobPortal
      </Link>

      {/* Center: Nav Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>

      <li>
          <Link to="/mini_task/listings">Mini Tasks</Link>
          </li>
          <li>
          <Link to="/job/listings">Regular Jobs</Link>
          </li>
        <li
          className="dropdown-parent"
          onMouseEnter={() => setJobsDropdownOpen(true)}
          onMouseLeave={() => setJobsDropdownOpen(false)}
        >
          {/*<Link to="/job/listings" onClick={() => setMenuOpen(false)}>
            Find Jobs
          </Link>*/}

           

          {/* Dropdown for Mini Tasks & Normal Jobs */}
          {/*<ul className={`dropdown-menu ${jobsDropdownOpen ? "visible" : ""}`}>
            <li>
              
            </li>
            <li>
             
            </li>
          </ul>*/}
        </li>
        <li>
          <Link to="/post/mini_task" onClick={() => setMenuOpen(false)}>
            Post a Mini Task
          </Link>
        </li>
        <li>
          <Link to="/categories" onClick={() => setMenuOpen(false)}>
            Categories
          </Link>
        </li>
      </ul>

      {/* Right: Notifications, Profile & Menu Toggle */}
      <div className="nav-icons">
        {/* Notification Bell */}
        <div className="notification-container">
          <FaBell className="notification-icon" onClick={() => setShowNotifications(!showNotifications)} />
          {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
          {showNotifications && (
            <div className="notification-dropdown">
              {notifications.length > 0 ? (
                notifications.map((note, index) => <p key={index}>{note}</p>)
              ) : (
                <p>No new notifications</p>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <Link to={"/h1/dashboard"}>
          <FaUserCircle className="profile-icon" />
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
