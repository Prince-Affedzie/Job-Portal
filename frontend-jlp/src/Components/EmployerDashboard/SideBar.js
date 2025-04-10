import { useState } from "react";
import { Link } from "react-router-dom";
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
import "../../Styles/EmployerSidebar.css";

const EmployerSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // for mobile
  const [desktopCollapsed, setDesktopCollapsed] = useState(false); // for desktop

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleDesktopCollapse = () => setDesktopCollapsed(!desktopCollapsed);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`employer-sidebar ${isOpen ? "open" : ""} ${
          desktopCollapsed ? "collapsed" : ""
        }`}
      >
        {/* Collapse Toggle (Desktop Only) */}
        <button
          className="employer-sidebar-toggle-desktop"
          onClick={toggleDesktopCollapse}
        >
          {desktopCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>

        {/* Close for mobile */}
        <button className="employer-close-btn" onClick={closeSidebar}>
          <FaTimes />
        </button>

        <div className="employer-sidebar-links">
          <Link to="/employer/dashboard" onClick={closeSidebar}>
            <FaHome className="employer-icon" />
            <span className="text-label">Dashboard</span>
          </Link>
          <Link to="/employer/jobs" onClick={closeSidebar}>
            <FaBriefcase className="employer-icon" />
            <span className="text-label">Jobs</span>
          </Link>
          <Link to="/employer/applicants" onClick={closeSidebar}>
            <FaUsers className="employer-icon" />
            <span className="text-label">Applicants</span>
          </Link>
          {/*<Link to="/employer/payments" onClick={closeSidebar}>
            <FaMoneyBill className="employer-icon" />
            <span className="text-label">Payments</span>
          </Link> */}
          <Link to="/employer/profile" onClick={closeSidebar}>
            <FaCog className="employer-icon" />
            <span className="text-label">Account Settings</span>
          </Link>
          <Link to="/logout" className="employer-logout" onClick={closeSidebar}>
            <FaSignOutAlt className="employer-icon" />
            <span className="text-label">Logout</span>
          </Link>
        </div>
      </div>

      {/* Mobile Toggle */}
      <button className="employer-menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {isOpen && (
        <div
          className="employer-sidebar-backdrop"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
};

export default EmployerSidebar;
