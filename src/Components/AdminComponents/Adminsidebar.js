import React, { useState, useEffect } from "react";
import {
  PieChart,
  Users,
  Briefcase,
  FileText,
  BarChart2,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ShoppingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";

const sidebarItems = [
  { path: "/admin/dashboard", icon: PieChart, label: "Overview", color: "from-blue-500 to-cyan-500" },
  { path: "/admin/usermanagement", icon: Users, label: "Users", color: "from-green-500 to-emerald-500" },
  { path: "/admin/jobmanagement", icon: Briefcase, label: "Jobs", color: "from-purple-500 to-violet-500" },
  { path: "/admin/manage_minitasks", icon: ShoppingOutlined, label: "Micro Jobs", color: "from-orange-500 to-amber-500" },
  { path: "/admin/get_employers/list", icon: ShoppingOutlined, label: "Recruiters", color: "from-pink-500 to-rose-500" },
  { path: "/admin/view_all_taskers", icon: FileText, label: "Taskers", color: "from-indigo-500 to-blue-500" },
  { path: "/admin/view_all_reports", icon: BarChart2, label: "Reports", color: "from-teal-500 to-cyan-500" },
  { path: "/admin/settings", icon: Settings, label: "Settings", color: "from-gray-500 to-slate-500" },
];

export default function AdminSidebar({ isOpen = false, onClose = () => {} }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const navigate = useNavigate();
  const location = useLocation();

  // Screen size detection
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('mobile');
      else if (width < 768) setScreenSize('tablet');
      else if (width < 1024) setScreenSize('laptop');
      else setScreenSize('desktop');
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Auto-collapse on medium screens
  useEffect(() => {
    if (screenSize === 'laptop') {
      setIsCollapsed(true);
    } else if (screenSize === 'desktop') {
      setIsCollapsed(false);
    }
  }, [screenSize]);

  // Close sidebar when isOpen prop changes to false
  useEffect(() => {
    if (!isOpen && screenSize === 'mobile') {
      // Ensure sidebar is closed on mobile when isOpen is false
    }
  }, [isOpen, screenSize]);

  const handleItemClick = (path) => {
    navigate(path);
    if (screenSize === 'mobile') {
      onClose(); // Close sidebar on mobile after navigation
    }
  };

  const toggleCollapse = () => {
    if (screenSize !== 'mobile') {
      setIsCollapsed(!isCollapsed);
    }
  };

  const getSidebarWidth = () => {
    if (screenSize === 'mobile') return 'w-64';
    return isCollapsed ? 'w-20' : 'w-64';
  };

  const handleMobileClose = () => {
    onClose(); // Use the provided onClose function
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header with close button */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        {(!isCollapsed || screenSize === 'mobile') && (
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white truncate">Admin Panel</h2>
              <p className="text-sm text-blue-200 truncate">Management Console</p>
            </div>
          </div>
        )}
        
        {/* Desktop collapse button */}
        {screenSize !== 'mobile' && (
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white hover:scale-105 flex-shrink-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
        
        {/* Mobile close button */}
        {screenSize === 'mobile' && (
          <button
            onClick={handleMobileClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white flex-shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map(({ path, icon: Icon, label, color }) => {
          const isActive = location.pathname === path;
          
          return (
            <button
              key={path}
              onClick={() => handleItemClick(path)}
              className={`
                w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                ${isActive 
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }
                ${isCollapsed && screenSize !== 'mobile' ? 'justify-center' : ''}
              `}
              title={isCollapsed && screenSize !== 'mobile' ? label : ''}
            >
              {/* Active indicator */}
              {isActive && (
                <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${color} rounded-r-full`}></div>
              )}
              
              {/* Icon */}
              <div className={`
                p-2 rounded-lg transition-all duration-300 flex-shrink-0
                ${isActive 
                  ? `bg-gradient-to-br ${color} shadow-lg` 
                  : 'group-hover:bg-white/10'
                }
              `}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
              </div>
              
              {/* Label */}
              {(!isCollapsed || screenSize === 'mobile') && (
                <span className={`font-medium ${isActive ? 'text-white' : ''} truncate`}>
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {(!isCollapsed || screenSize === 'mobile') ? (
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-blue-200 truncate">System Administrator</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 
          backdrop-blur-sm border-r border-white/10 shadow-2xl z-40 transition-all duration-300
          ${getSidebarWidth()}
          ${screenSize === 'mobile' ? 
            (isOpen ? 'translate-x-0' : '-translate-x-full') : 
            'translate-x-0'
          }
        `}
        style={{
          height: '100vh',
          height: '100dvh',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {screenSize === 'mobile' && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}

      {/* Content Spacer */}
      {screenSize !== 'mobile' && (
        <div 
          className={`transition-all duration-300 ${getSidebarWidth()}`}
          aria-hidden="true"
        />
      )}
    </>
  );
}