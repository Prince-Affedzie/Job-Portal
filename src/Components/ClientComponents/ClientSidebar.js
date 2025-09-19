import React, { useState, useEffect } from 'react';
import { 
  FaBriefcase, 
  FaComments, 
  FaMoneyBillWave, 
  FaBell, 
  FaSearch, 
  FaUser, 
  FaBars, 
  FaTimes,
  FaHome,
  FaPlus,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../APIS/API';
import { useAuth } from '../../Context/AuthContext';


// Sidebar Component
export const ClientSidebar = ({ isOpen, toggleSidebar }) => {
  const [activeItem, setActiveItem] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const menuItems = [
    { path: '/client/microtask_dashboard', id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/manage/mini_tasks', id: 'tasks', label: 'My Tasks', icon: <FaBriefcase /> },
    { path: '/messages', id: 'chats', label: 'Chats', icon: <FaComments /> },
    { path: '/view/all_notifications', id: 'notifications', label: 'Notifications', icon: < FaBell /> },
    //{ path: '/client/payments', id: 'payments', label: 'Payments', icon: <FaMoneyBillWave /> },
    { path: '/post/mini_task', id: 'post', label: 'Post Task', icon: <FaPlus /> },
    { path: '/client/profile', id: 'profile', label: 'Profile', icon: <FaCog /> },
  ];

  // Set active item based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenuItem = menuItems.find(item => 
      currentPath === item.path || currentPath.startsWith(item.path + '/')
    );
    
    if (activeMenuItem) {
      setActiveItem(activeMenuItem.id);
    } else {
      // Fallback for nested routes
      if (currentPath.includes('edit_task')) {
        setActiveItem('tasks');
      } else if (currentPath.includes('view/mini_task')) {
        setActiveItem('tasks');
      }
    }
  }, [location.pathname]);

  const handleItemClick = (path, id) => {
    setActiveItem(id);
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        lg:relative lg:translate-x-0 lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header with close button for mobile */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Worka<span className="text-blue-600">Flow</span></h1>
          
          {/* Close button for mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500"
            aria-label="Close sidebar"
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        {/* Menu Items */}
        <nav className="mt-6">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.path, item.id)}
              className={`
                flex items-center w-full px-5 py-3 text-left transition-colors duration-200
                ${activeItem === item.id 
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* User Section */}
        <div className="absolute bottom-0 w-full p-5 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              <FaUser size={16} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">Client Account</p>
              <p className="text-xs text-gray-500">Task Poster</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center mt-4 text-gray-600 hover:text-gray-800 text-sm w-full"
          >
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};