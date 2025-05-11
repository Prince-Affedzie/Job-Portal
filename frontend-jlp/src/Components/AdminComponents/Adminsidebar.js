// components/AdminSidebar.jsx
import { NavLink } from "react-router-dom";
import {
  PieChart,
  Users,
  Briefcase,
  FileText,
  BarChart2,
  Settings,
} from "lucide-react";
import "../../Styles/AdminSidebar.css"; // 👈 Import your custom CSS

const sidebarItems = [
  { path: "/admin/dashboard", icon: PieChart, label: "Overview" },
  { path: "/admin/usermanagement", icon: Users, label: "Users" },
  { path: "/admin/jobmanagement", icon: Briefcase, label: "Jobs" },
  { path: "/admin/manage_minitasks", icon: FileText, label: "Mini Jobs" },
  { path: "/admin/get_employers/list", icon: FileText, label: "Recruiters" },
  { path: "/admin/applications", icon: FileText, label: "Applications" },
  { path: "/admin/reports", icon: BarChart2, label: "Reports" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-items">
        {sidebarItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            to={path}
            key={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon className="sidebar-icon" />
            <span className="sidebar-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
