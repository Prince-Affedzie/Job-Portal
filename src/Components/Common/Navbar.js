import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { 
  FaBars, FaTimes, FaBell, FaChevronDown, FaChevronUp,
  FaBriefcase, FaComments, FaUser, FaHome, FaListAlt,
  FaEnvelope, FaUserCircle, FaTasks,FaSignOutAlt
} from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";
import { notificationContext } from '../../Context/NotificationContext';
import "../../Styles/Navbar.css";
import { logoutUser } from '../../APIS/API';
import { useAuth } from '../../Context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const { notifications, fetchNotifications } = useContext(notificationContext);
  const location = useLocation();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();


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

  const toggleDashboardDropdown = (e) => {
    e.preventDefault();
    setDashboardDropdownOpen(!dashboardDropdownOpen);
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
      if (e.key === 'Escape') {
        if (menuOpen) closeMenu();
        if (dashboardDropdownOpen) setDashboardDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen, dashboardDropdownOpen]);

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
                Micro Jobs
              </Link>
            </li>
           {/*<li>
              <Link 
                to="/job/listings" 
                className={`u-nav-link ${isActive('job/listings') ? 'active' : ''}`}
              >
                Regular Jobs
              </Link>
            </li>*/}
            <li>
              <Link 
                to="/messages" 
                className={`u-nav-link ${isActive('messages') ? 'active' : ''}`}
              >
                Chats
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
            
            {/* Desktop Dashboard Dropdown */}
            <div className="dashboard-dropdown-container" ref={dropdownRef}>
              <button 
                className="dashboard-dropdown-toggle"
                onClick={toggleDashboardDropdown}
                aria-label="Dashboard menu"
                aria-expanded={dashboardDropdownOpen}
              >
                <TbLayoutDashboard size={20} />
                {dashboardDropdownOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </button>
              
              {dashboardDropdownOpen && (
                <div className="dashboard-dropdown-menu">
                  <Link 
                    to="/h1/dashboard" 
                    className="dropdown-item"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    <FaHome className="dropdown-icon" />
                    Dashboard
                  </Link>
                  
                  <Link 
                    to="/mini_task/applications" 
                    className="dropdown-item"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    <FaListAlt className="dropdown-icon" />
                    Applications (Micro)
                  </Link>


                  {/*<Link 
                    to="/view/applied/jobs" 
                    className="dropdown-item"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    <FaListAlt className="dropdown-icon" />
                    Applications (Regular)
                  </Link>*/}

                  <Link 
                    to="/user/modify/profile" 
                    className="dropdown-item"
                    onClick={() => setDashboardDropdownOpen(false)}
                  >
                    <FaUserCircle className="dropdown-icon" />
                    My Profile
                  </Link>

                 
                  <Link
                  onClick={handleLogout}
                   className="dropdown-item"
                    >
                    <FaSignOutAlt className="dropdown-icon" />
                     Sign Out
                  </Link>
             
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
                  <FaBriefcase className="mobile-nav-icon" />
                  Micro Jobs
                </Link>
              </li>
              {/*<li>
                <Link 
                  to="/job/listings" 
                  onClick={closeMenu}
                  className={`mobile-nav-link ${isActive('job/listings') ? 'active' : ''}`}
                >
                  <FaTasks className="mobile-nav-icon" />
                  Regular Jobs
                </Link>
              </li>*/}
              <li>
                <Link 
                  to="/messages" 
                  onClick={closeMenu}
                  className={`mobile-nav-link ${isActive('messages') ? 'active' : ''}`}
                >
                  <FaComments className="mobile-nav-icon" />
                  Chats
                </Link>
              </li>
              
              {/* Mobile Dashboard Dropdown Items */}
              <li>
                <Link 
                  to="/mini_task/applications" 
                  onClick={closeMenu}
                  className="mobile-nav-link"
                >
                  <FaListAlt className="mobile-nav-icon" />
                  Applications (Micro)
                </Link>
              </li>

              {/*<li>
                <Link 
                  to="/view/applied/jobs" 
                  onClick={closeMenu}
                  className="mobile-nav-link"
                >
                  <FaListAlt className="mobile-nav-icon" />
                  Applications (Regular)
                </Link>
              </li>*/}

              <li>
             <Link 
              to="/view/all_notifications" 
              onClick={closeMenu}
              className="mobile-nav-link"
               aria-label={`Notifications (${unreadCount} unread)`}
            >
              <div className="flex items-center">
              <div className="relative">
             <FaBell className="mobile-nav-icon" />
             {unreadCount > 0 && (
              <span className="absolute -top-2 right-2 bg-red-500 text-white rounded-full text-xs min-w-[16px] h-4 flex items-center justify-center px-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
             )}
           </div>
            <span className="ml-3">Notifications</span>
           </div>
           </Link>
           </li>
              <li>
                <Link 
                  to="/h1/dashboard" 
                  onClick={closeMenu}
                  className="mobile-nav-link"
                >
                  <FaHome className="mobile-nav-icon" />
                  Dashboard
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/user/modify/profile" 
                  onClick={closeMenu}
                  className="mobile-nav-link"
                >
                  <FaUserCircle className="mobile-nav-icon" />
                  My Profile
                </Link>
              </li>
              <li>
                  <Link
                  onClick={handleLogout}
                   className="mobile-nav-link"
                    >
                    <FaSignOutAlt className="mobile-nav-icon" />
                     Sign Out
                  </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;