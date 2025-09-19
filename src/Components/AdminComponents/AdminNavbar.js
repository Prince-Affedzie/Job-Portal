import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom'
import { 
  Briefcase, 
  Bell, 
  Settings, 
  Search, 
  ChevronDown,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAdminContext } from "../../Context/AdminContext";

const AdminNavbar = ({ onMenuToggle, isSidebarOpen }) => {
  const { alerts } = useAdminContext();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (alerts.length > 0) {
      setUnreadCount(alerts.filter(a => !a.isRead).length);
    }
  }, [alerts]);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button 
                onClick={onMenuToggle}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            
            {/* Logo */}
            <Link to="/admin/dashboard" className="flex items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div className="ml-2 flex items-baseline">
                  <span className="text-xl font-bold text-gray-900">Worka</span>
                  <span className="text-xl font-bold text-blue-600">Flow</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Search Bar (visible on medium screens and up) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-sm transition-colors"
              />
            </div>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-3">
            {/* Search icon (visible on mobile) */}
            <button className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <Link 
                to="/admin/view_all_recent_activities" 
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors relative flex items-center justify-center"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </Link>
            </div>

            {/* Settings */}
            <Link 
              to="/admin/settings" 
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors hidden sm:flex items-center justify-center"
            >
              <Settings className="h-5 w-5" />
            </Link>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center border border-gray-200">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                  showDropdown ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">Admin User</div>
                    <div className="text-xs text-gray-500 truncate">admin@workaflow.com</div>
                  </div>
                  
                  <Link 
                    to="/admin/settings" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  
                  <Link 
                    to="/admin/help" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="mr-2">📚</span>
                    Help Center
                  </Link>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <Link 
                    to="/logout" 
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;