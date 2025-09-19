import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Users, 
  FileText, 
  DollarSign, 
  Bell, 
  Search, 
  ChevronDown,
  ChevronUp,
  PieChart,
  BarChart2,
  UserCheck,
  Calendar,
  Filter,
  Mail,
  Shield,
  Settings,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminContext } from "../../Context/AdminContext";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import { useNavigate } from "react-router-dom";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartPieChart,
  Pie,
  Cell
} from "recharts";
import {
  CheckCircleOutlined,
  WarningOutlined, 
} from '@ant-design/icons';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
  const { loading, users, jobs,microJobs,reports, alerts, fetchAllUsers, fetchAllJobs,fetchAllMicroJobs,fetchAllReports,fetchRecentAlerts } = useAdminContext();

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  useEffect(() => {
    if (!users || !jobs ||!microJobs || !reports) {
      fetchAllUsers();
      fetchAllJobs();
      fetchAllMicroJobs();
      fetchAllReports()
    }
  }, []);

  // Must-have data sections
  const statCards = [
    { 
      title: "Total Users", 
      count: users?.length || 0, 
      trend: "+12%", 
      icon: <Users className="text-blue-500" />,
      link: "/admin/usermanagement"
    },
    { 
      title: "Active Jobs", 
      count: jobs?.filter(j => j.status === "Opened").length || 0, 
      trend: "+5%", 
      icon: <Briefcase className="text-green-500" />,
      link: "/admin/jobmanagement"
    },
    { 
      title: "Micro Jobs In Progress", 
      count: microJobs?.filter(j => j.status === "In-progress").length || 0, 
      trend: "+8%", 
      icon: <Briefcase className="text-green-500" />,
      link: "/admin/manage_minitasks"
    },
    { 
      title: "Opened Reports", 
      count: reports?.filter(j => j.status === "open").length || 0, 
      trend: "+18%", 
      icon: <FileText className="text-yellow-500" />,
      link: "/admin/view_all_reports"
    },
    
  ];

  const userActivityData = [
    { name: "Mon", users: 120 },
    { name: "Tue", users: 140 },
    { name: "Wed", users: 180 },
    { name: "Thu", users: 190 },
    { name: "Fri", users: 210 },
    { name: "Sat", users: 150 },
    { name: "Sun", users: 130 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Layout Structure */}
      <div className="flex">
        <AdminSidebar 
        isOpen={isSidebarOpen} 
       onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-y-auto">
        <AdminNavbar 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
         isSidebarOpen={isSidebarOpen} 
         />
          
           <NotificationCenter />

          {/* Dashboard Content */}
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
                <button className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50">
                  <Calendar className="text-gray-500" />
                  <span>Today</span>
                  <ChevronDown className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {statCards.map((card, index) => (
                <div 
                  key={index}
                  onClick={() => navigate(card.link)}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{card.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{card.count}</h3>
                    </div>
                    <div className={`p-3 rounded-lg ${index === 0 ? 'bg-blue-50' : index === 1 ? 'bg-green-50' : index === 2 ? 'bg-yellow-50' : 'bg-purple-50'}`}>
                      {card.icon}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className={`flex items-center ${card.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {card.trend.startsWith('+') ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {card.trend}
                    </span>
                    <span className="text-gray-500 ml-2">vs last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* User Activity */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-800">User Activity (7 days)</h2>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: '#3b82f6' }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-800">Recent Activities</h2>
                  <Link to="/admin/view_all_recent_activities" className="text-blue-600 text-sm font-medium">View All</Link>
                </div>
                <div className="space-y-4">
                  {alerts.length > 0 ? (
                  alerts.slice(0,5).map((alert) => (
             <div key={alert.id} className="flex items-start">
              <div className={`flex-shrink-0 mt-1 ${
             alert.type === 'NEW_JOB_POSTING' ? 'text-blue-500' : 
             alert.type === 'NEW_EMPLOYER_ACCOUNT' ? 'text-green-500' : 
             alert.type === 'NEW_MICRO_JOB_POSTING' ? 'text-purple-500' : 
             alert.type === 'MICRO_JOB_COMPLETION' ? 'text-teal-500' :
             alert.type === 'DISPUTE_RAISED' ? 'text-orange-500' : 
            'text-gray-500'
            }`}>
            {alert.type === 'NEW_JOB_POSTING' ? <Briefcase className="w-4 h-4" /> : 
             alert.type === 'NEW_EMPLOYER_ACCOUNT' ? <Users className="w-4 h-4" /> : 
             alert.type === 'NEW_MICRO_JOB_POSTING' ? <Briefcase className="w-4 h-4" /> : 
             alert.type === 'MICRO_JOB_COMPLETION' ? <CheckCircleOutlined className="w-4 h-4" /> :
             alert.type === 'DISPUTE_RAISED' ? <WarningOutlined className="w-4 h-4" /> : 
             <Activity className="w-4 h-4" />}
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${
              !alert.isRead ? 'text-gray-900 font-semibold' : 'text-gray-700'
            }`}>
              {alert.message}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(alert.createdAt).toLocaleString()}
            </p>
          </div>
          {!alert.isRead && (
            <div className="ml-auto w-2 h-2 rounded-full bg-blue-500"></div>
          )}
        </div>
      ))
    ) : (
      <div className="text-center py-4 text-sm text-gray-500">
        No recent activities found
      </div>
    )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate('/admin/usermanagement')}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:bg-gray-50 transition-colors"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <Users className="text-blue-600 w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900">User Management</span>
                <span className="text-xs text-gray-500 mt-1">Manage all users</span>
              </button>
              
              <button 
                onClick={() => navigate('/admin/jobmanagement')}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:bg-gray-50 transition-colors"
              >
                <div className="bg-green-100 p-3 rounded-full mb-3">
                  <Briefcase className="text-green-600 w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900">Job Management</span>
                <span className="text-xs text-gray-500 mt-1">View all jobs</span>
              </button>
              
              <button 
                onClick={() => navigate('/admin/approvals')}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:bg-gray-50 transition-colors"
              >
                <div className="bg-yellow-100 p-3 rounded-full mb-3">
                  <Shield className="text-yellow-600 w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900">Approvals</span>
                <span className="text-xs text-gray-500 mt-1">Pending actions</span>
              </button>
              
              <button 
                onClick={() => navigate('/admin/view_all_reports')}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center hover:bg-gray-50 transition-colors"
              >
                <div className="bg-purple-100 p-3 rounded-full mb-3">
                  <BarChart2 className="text-purple-600 w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900">Reports</span>
                <span className="text-xs text-gray-500 mt-1">Generate reports</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}