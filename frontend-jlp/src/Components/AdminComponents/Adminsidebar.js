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
import {
  UserAddOutlined, ShoppingOutlined, CheckCircleOutlined,
  WarningOutlined, ClockCircleOutlined, BellOutlined, ShopOutlined,
  FilterOutlined, MoreOutlined, SyncOutlined, CheckOutlined,
  EyeOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";

const sidebarItems = [
  { path: "/admin/dashboard", icon: PieChart, label: "Overview", color: "from-blue-500 to-cyan-500" },
  { path: "/admin/usermanagement", icon: Users, label: "Users", color: "from-green-500 to-emerald-500" },
  { path: "/admin/jobmanagement", icon: Briefcase, label: "Jobs", color: "from-purple-500 to-violet-500" },
  { path: "/admin/manage_minitasks", icon: ShoppingOutlined, label: "Micro Jobs", color: "from-orange-500 to-amber-500" },
  { path: "/admin/get_employers/list", icon:ShoppingOutlined, label: "Recruiters", color: "from-pink-500 to-rose-500" },
  { path: "/admin/applications", icon: FileText, label: "Applications", color: "from-indigo-500 to-blue-500" },
  { path: "/admin/view_all_reports", icon: BarChart2, label: "Reports", color: "from-teal-500 to-cyan-500" },
  { path: "/admin/settings", icon: Settings, label: "Settings", color: "from-gray-500 to-slate-500" },
];

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current active item from URL
  const activeItem = location.pathname;

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false); // Always expanded when mobile menu is open
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isMobileMenuOpen && !event.target.closest('.admin-sidebar') && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMobileMenuOpen]);

  const handleItemClick = (path) => {
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-sm text-blue-200">Management Console</p>
              </div>
            </div>
          )}
          
          {/* Desktop collapse button */}
          {!isMobile && (
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white hover:scale-105"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
          
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map(({ path, icon: Icon, label, color }) => {
          const isActive = activeItem === path;
          
          return (
            <button
              key={path}
              onClick={() => handleItemClick(path)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                ${isActive 
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }
                ${isCollapsed && !isMobile ? 'justify-center' : ''}
              `}
              title={isCollapsed && !isMobile ? label : ''}
            >
              {/* Active indicator */}
              {isActive && (
                <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${color} rounded-r-full`}></div>
              )}
              
              {/* Icon with gradient background when active */}
              <div className={`
                p-2 rounded-lg transition-all duration-300 flex-shrink-0
                ${isActive 
                  ? `bg-gradient-to-br ${color} shadow-lg` 
                  : 'group-hover:bg-white/10'
                }
              `}>
                <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-white' : ''}`} />
              </div>
              
              {/* Label */}
              {(!isCollapsed || isMobile) && (
                <span className={`font-medium transition-all duration-300 ${isActive ? 'text-white' : ''}`}>
                  {label}
                </span>
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {(!isCollapsed || isMobile) && (
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-blue-200">System Administrator</p>
              </div>
            </div>
          </div>
        )}
        
        {isCollapsed && !isMobile && (
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
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mobile-menu-button fixed top-2 left-2 sm:top-4 sm:left-4 z-[9999] p-2 sm:p-3 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 md:hidden safe-top safe-left"
          style={{
            top: 'max(0.5rem, env(safe-area-inset-top))',
            left: 'max(0.5rem, env(safe-area-inset-left))'
          }}
        >
          {isMobileMenuOpen ? (
            <X size={20} className="sm:w-6 sm:h-6" />
          ) : (
            <Menu size={20} className="sm:w-6 sm:h-6" />
          )}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" />
      )}

      {/* Sidebar */}
      <aside className={`
        admin-sidebar fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm border-r border-white/10 shadow-2xl z-50 transition-all duration-300 ease-in-out
        ${isMobile 
          ? `${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-80` 
          : `${isCollapsed ? 'w-20' : 'w-64'} translate-x-0 md:relative md:z-auto`
        }
      `}>
        <SidebarContent />
      </aside>
    </>
  );
}