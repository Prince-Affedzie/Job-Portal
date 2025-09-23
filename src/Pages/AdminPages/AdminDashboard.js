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
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  MapPin,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminContext } from "../../Context/AdminContext";
import { useAdminMicroTaskContext } from "../../Context/AdminMicroJobsContext";
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
  Cell,
  AreaChart,
  Area
} from "recharts";
import {
  CheckCircleOutlined,
  WarningOutlined, 
} from '@ant-design/icons';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function AdminDashboard() {
  const { users, reports, alerts, fetchAllUsers, fetchAllReports, fetchRecentAlerts } = useAdminContext();
  const { 
    loading: dashboardLoading, 
    dashboardData, 
    refreshDashboard,
    error: dashboardError 
  } = useAdminMicroTaskContext();

  useEffect(()=>{
     console.log(dashboardData,)
  })
  
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!users || !reports) {
      fetchAllUsers();
      fetchAllReports();
      fetchRecentAlerts();
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshDashboard();
    setRefreshing(false);
  };

  // Use data from AdminMicroTaskContext instead of calculating locally
  const statCards = [
    { 
      title: "Total MicroJobs", 
      count: dashboardData.stats?.totalMicroJobs || 0, 
      trend: "+15%", 
      icon: <Briefcase className="text-blue-500" />,
      link: "/admin/manage_minitasks",
      description: "All microjobs created"
    },
    { 
      title: "Active MicroJobs", 
      count: dashboardData.stats?.openMicroJobs || 0, 
      trend: "+8%", 
      icon: <Activity className="text-green-500" />,
      link: "/admin/manage_minitasks?status=Open",
      description: "Currently open for applications"
    },
    { 
      title: "In Progress", 
      count: dashboardData.stats?.inProgressMicroJobs || 0, 
      trend: "+12%", 
      icon: <Clock className="text-yellow-500" />,
      link: "/admin/manage_minitasks?status=In-progress",
      description: "Microjobs being worked on"
    },
    { 
      title: "Completed", 
      count: dashboardData.stats?.completedMicroJobs || 0, 
      trend: "+20%", 
      icon: <CheckCircle className="text-purple-500" />,
      link: "/admin/manage_minitasks?status=Completed",
      description: "Successfully delivered"
    },
    { 
      title: "Total Applicants", 
      count: dashboardData.stats?.totalApplicants || 0, 
      trend: "+18%", 
      icon: <Users className="text-teal-500" />,
      link: "/admin/minitask_applicants_overview",
      description: "Across all microjobs"
    },
    { 
      title: "Platform Revenue", 
      count: `GHS ${(dashboardData.stats?.revenue || 0).toFixed(2)}`, 
      trend: "+25%", 
      icon: <DollarSign className="text-emerald-500" />,
      link: "/admin/financial_reports",
      description: "From completed microjobs"
    },
  ];


  if (dashboardError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">Error Loading Dashboard</div>
          <div className="text-gray-600 mb-4">{dashboardError}</div>
          <button 
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
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
            {dashboardLoading ? (
                <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
               </div>
               ):(
              <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MicroJobs Dashboard</h1>
                <p className="text-gray-600">Comprehensive overview of your microjob platform</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search microjobs, users..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setTimeRange('day')}
                    className={`px-3 py-1 rounded-md text-sm ${timeRange === 'day' ? 'bg-white shadow-sm' : ''}`}
                  >
                    Day
                  </button>
                  <button 
                    onClick={() => setTimeRange('week')}
                    className={`px-3 py-1 rounded-md text-sm ${timeRange === 'week' ? 'bg-white shadow-sm' : ''}`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setTimeRange('month')}
                    className={`px-3 py-1 rounded-md text-sm ${timeRange === 'month' ? 'bg-white shadow-sm' : ''}`}
                  >
                    Month
                  </button>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
              {statCards.map((card, index) => (
                <div 
                  key={index}
                  onClick={() => navigate(card.link)}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">{card.title}</p>
                      <h3 className="text-2xl font-bold mt-1 text-gray-900">{card.count}</h3>
                      <p className="text-xs text-gray-500 mt-1 truncate">{card.description}</p>
                    </div>
                    <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform ${
                      index === 0 ? 'bg-blue-50' : 
                      index === 1 ? 'bg-green-50' : 
                      index === 2 ? 'bg-yellow-50' : 
                      index === 3 ? 'bg-purple-50' :
                      index === 4 ? 'bg-teal-50' : 'bg-emerald-50'
                    }`}>
                      {React.cloneElement(card.icon, { className: "w-5 h-5" })}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className={`flex items-center ${card.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {card.trend.startsWith('+') ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {card.trend}
                    </span>
                    <span className="text-gray-500 ml-2">vs last week</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* MicroJob Activity */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-800">MicroJob Activity (7 days)</h2>
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
                    <AreaChart data={dashboardData.activity}>
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
                      <Area 
                        type="monotone" 
                        dataKey="microjobs" 
                        stackId="1"
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="applicants" 
                        stackId="2"
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">MicroJobs Posted</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Applicants</span>
                  </div>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-800">Category Distribution</h2>
                  <Link to="/admin/manage_minitasks" className="text-blue-600 text-sm font-medium">View All</Link>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPieChart>
                      <Pie
                        data={dashboardData.categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="_id"
                        label={({ _id, percent }) => `${_id} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {dashboardData.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Recent MicroJobs */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-800">Recent MicroJobs</h2>
                  <Link to="/admin/manage_minitasks" className="text-blue-600 text-sm font-medium">View All</Link>
                </div>
                <div className="space-y-4">
                  {dashboardData.recentMicroJobs.length > 0 ? (
                    dashboardData.recentMicroJobs.map((job) => (
                      <div key={job._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{job.title}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
                            <span className="flex items-center">
                              <Award className="w-3 h-3 mr-1" />
                              {job.category || "Uncategorized"}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              GHS {job.budget}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.locationType}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'In-progress' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No microjobs found
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-800">System Alerts</h2>
                  <Link to="/admin/view_all_recent_activities" className="text-blue-600 text-sm font-medium">View All</Link>
                </div>
                <div className="space-y-4">
                  {alerts.length > 0 ? (
                    alerts.slice(0, 4).map((alert) => (
                      <div key={alert.id} className="flex items-start">
                        <div className={`flex-shrink-0 mt-1 ${
                          alert.type === 'NEW_MICRO_JOB_POSTING' ? 'text-purple-500' : 
                          alert.type === 'MICRO_JOB_COMPLETION' ? 'text-teal-500' :
                          alert.type === 'MICRO_JOB_APPLICATION' ? 'text-blue-500' : 
                          alert.type === 'MICRO_JOB_BID' ? 'text-orange-500' : 
                          'text-gray-500'
                        }`}>
                          {alert.type === 'NEW_MICRO_JOB_POSTING' ? <Briefcase className="w-4 h-4" /> : 
                          alert.type === 'MICRO_JOB_COMPLETION' ? <CheckCircleOutlined className="w-4 h-4" /> :
                          alert.type === 'MICRO_JOB_APPLICATION' ? <UserCheck className="w-4 h-4" /> : 
                          alert.type === 'MICRO_JOB_BID' ? <DollarSign className="w-4 h-4" /> : 
                          <Activity className="w-4 h-4" />}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
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
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <button 
                  onClick={() => navigate('/admin/manage_minitasks')}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-blue-100 p-2 rounded-full mb-2">
                    <Briefcase className="text-blue-600 w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 text-center">Manage MicroJobs</span>
                </button>
                
                <button 
                  onClick={() => navigate('/admin/minitask_applicants_overview')}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-green-100 p-2 rounded-full mb-2">
                    <Users className="text-green-600 w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 text-center">View Applicants</span>
                </button>
                
                <button 
                  onClick={() => navigate('/admin/financial_reports')}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-yellow-100 p-2 rounded-full mb-2">
                    <DollarSign className="text-yellow-600 w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 text-center">Financial Reports</span>
                </button>
                
                <button 
                  onClick={() => navigate('/admin/view_all_reports')}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-purple-100 p-2 rounded-full mb-2">
                    <BarChart2 className="text-purple-600 w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 text-center">Platform Reports</span>
                </button>
                
                <button 
                  onClick={() => navigate('/admin/category_management')}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-teal-100 p-2 rounded-full mb-2">
                    <PieChart className="text-teal-600 w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 text-center">Categories</span>
                </button>
                
                <button 
                  onClick={() => navigate('/admin/user_verification')}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-orange-100 p-2 rounded-full mb-2">
                    <Shield className="text-orange-600 w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 text-center">Verifications</span>
                </button>
              </div>
            </div>
            </>)}
          </div>
        </main>
      </div>
    </div>
  );
}