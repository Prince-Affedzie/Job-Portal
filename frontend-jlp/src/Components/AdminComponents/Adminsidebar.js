// components/AdminSidebar.jsx
import { NavLink } from "react-router-dom";
import { PieChart, Users, Briefcase, FileText, BarChart2, Settings } from "lucide-react";

const sidebarItems = [
  { path: "/admin/dashboard", icon: PieChart, label: "Overview" },
  { path: "/admin/usermanagement", icon: Users, label: "Users" },
  { path: "/admin/jobmanagement", icon: Briefcase, label: "Jobs" },
  { path: "/admin/get_employers/list", icon: FileText, label: "Recruiters" },
  { path: "/admin/applications", icon: FileText, label: "Applications" },
  { path: "/admin/reports", icon: BarChart2, label: "Reports" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
  
];

export default function AdminSidebar() {
  return (
    <aside className="hidden md:block w-56 bg-white shadow-sm h-screen p-4">
      <div className="space-y-1">
        {sidebarItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            to={path}
            key={path}
            className={({ isActive }) =>
              `w-full block text-left px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
