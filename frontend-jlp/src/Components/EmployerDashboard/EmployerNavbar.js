import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaBriefcase, FaUsers, FaBell, FaUser } from "react-icons/fa";
import "../../Styles/EmployerNavbar.css"; // CSS File

const EmployerNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="employer-navbar">
      <div className="employer-logo">
        <Link to="/employer/dashboard">JobPortal</Link>
      </div>

      {/* Desktop Menu */}
      <ul className={menuOpen ? "nav-links active" : "nav-links"}>
        <li>
          <Link to="/employer/dashboard">
            <FaBriefcase /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/employer/jobs">
            <FaBriefcase /> Jobs
          </Link>
        </li>
        <li>
          <Link to="/employer/applicants">
            <FaUsers /> Applicants
          </Link>
        </li>
        <li>
          <Link to="/employer/notifications">
            <FaBell /> Notifications
          </Link>
        </li>
        <li>
          <Link to="/employer/profile">
            <FaUser /> Profile
          </Link>
        </li>
      </ul>

      {/* Mobile Menu Toggle */}
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
};

export default EmployerNavbar;
