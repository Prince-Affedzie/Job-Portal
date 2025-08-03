import { useState, useRef, useEffect } from "react";
import {Link} from 'react-router-dom'
import { 
  Briefcase, 
  Bell, 
  Settings, 
  Search, 
  ChevronDown,
  User,
  LogOut
} from "lucide-react";
import { useAdminContext } from "../../Context/AdminContext";


const AdminNavbar = ( ) => {
    const {alerts} = useAdminContext();
    const [unreadCount,setUnreadCount] = useState(0)

    useEffect(()=>{
      if(alerts.length>0){
        setUnreadCount(alerts.filter(a => !a.isRead).length);
      }
    })
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            
            <span className="ml-2 text-xl font-semibold text-gray-900">Worka</span>
            <span className="text-xl font-semibold text-blue-600">Flow</span>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-4">
            {/* Search icon (visible on larger screens) */}
            <button className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-gray-50">
              <Search className="h-5 w-5 text-gray-500" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <Link to="/admin/view_all_recent_activities" className="p-2 rounded-full hover:bg-gray-50 relative">
                <Bell className="h-5 w-5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </Link>
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                  showDropdown ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">Admin User</div>
                    <div className="text-gray-500">admin@workaflow.com</div>
                  </div>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Settings
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Help Center
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </a>
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