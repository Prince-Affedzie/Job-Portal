import React, { useState,useEffect,useMemo } from "react";

import { 
  Briefcase, 
  Users, 
  FileText, 
  DollarSign, 
  Bell, 
  Settings, 
  Search, 
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  PieChart,
  BarChart2,
  UserCheck,
  Calendar,
  Filter,
  
} from "lucide-react";
import {  Spin } from "antd";
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
import { useAdminContext } from "../Context/AdminContext";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import { useNavigate } from "react-router-dom";


const notifications = [
  { id: 1, text: "New application for Frontend Developer", time: "10 minutes ago" },
  { id: 2, text: "TechCorp posted a new job", time: "1 hour ago" },
  { id: 3, text: "Monthly report is ready", time: "3 hours ago" },
];

const userActivity = [
  { name: "Mon", users: 120 },
  { name: "Tue", users: 140 },
  { name: "Wed", users: 180 },
  { name: "Thu", users: 190 },
  { name: "Fri", users: 210 },
  { name: "Sat", users: 150 },
  { name: "Sun", users: 130 },
];



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
  const {loading,profile,users,jobs,fetchProfile,fetchAllUsers,fetchAllJobs} = useAdminContext()
  const [showNotifications, setShowNotifications] = useState(false);
  const [jobFilter, setJobFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [openActionsId, setOpenActionsId] = useState(null);
  const navigate = useNavigate()


  useEffect(()=>{
      if (!users || jobs){
        fetchAllUsers()
        fetchAllJobs()
      }
  },[])


  const statCards = [
    { title: "Total Users", count: users.length, trend: "+12%", icon: <Users className="text-blue-500 w-6 h-6" /> },
    { title: "Jobs Posted", count: jobs.length, trend: "+5%", icon: <Briefcase className="text-green-500 w-6 h-6" /> },
    { title: "Applications", count: 857, trend: "+18%", icon: <FileText className="text-yellow-500 w-6 h-6" /> },
    { title: "Earnings", count: "$24,500", trend: "+8%", icon: <DollarSign className="text-purple-500 w-6 h-6" /> },
  ];

 /* const jobCategories ={}

  jobs.forEach(job => {
    
    const category = job.category
    jobCategories[category] = ( jobCategories[category] || 0)+1

  });
  const jobCategoriesData = Object.entries(jobCategories).map(([name,value])=>({name,value}))
  console.log(jobCategoriesData)*/

  const jobCategoriesData = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
  
    return jobs.reduce((acc, job) => {
      const category = job.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }, [jobs]);
  
  const formattedJobCategories = useMemo(() => {
    return Object.entries(jobCategoriesData).map(([name, value]) => ({ name, value }));
  }, [jobCategoriesData]);
  
  console.log(formattedJobCategories);


  const filteredJobs = jobFilter === "all" 
    ? jobs 
    : jobs.filter(job => job.status === jobFilter);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <Spin tip="Loading employer profile..." size="large" />
        </div>
      );
    }
    
  return (
    <div className="bg-white min-h-screen">
      {/* Navigation */}
      
      <div className="flex">
        {/* Sidebar */}
         <AdminSidebar/>
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-500">Welcome back, Admin</p>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Today</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <h2 className="text-2xl font-bold mt-1">{card.count}</h2>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <ChevronUp className="w-3 h-3 mr-1" />
                    {card.trend} this month
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {card.icon}
                </div>
              </div>
            ))}
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Line Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">User Activity</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userActivity}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Job Categories</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPieChart>
                    <Pie
                      data={formattedJobCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {formattedJobCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {formattedJobCategories.slice(0,10).map((item, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recent Jobs */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Recent Job Posts</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center space-x-1 text-sm"
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              <Filter className="w-4 h-4" />
              <span>Filter: {jobFilter.charAt(0).toUpperCase() + jobFilter.slice(1)}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg z-10 border">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                  onClick={() => {
                    setJobFilter("all");
                    setFilterOpen(false);
                  }}
                >
                  All
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                  onClick={() => {
                    setJobFilter("Opened");
                    setFilterOpen(false);
                  }}
                >
                  Active
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                  onClick={() => {
                    setJobFilter("Closed");
                    setFilterOpen(false);
                  }}
                >
                  Closed
                </button>
              </div>
            )}
          </div>
          <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 text-sm">
            <Briefcase className="w-4 h-4" />
            <span>New Job</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="px-4 py-3 text-left rounded-l-lg">Job Title</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Date Posted</th>
              <th className="px-4 py-3 text-center">Applicants</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredJobs.slice(0,10).map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{job.title}</div>
                </td>
                <td className="px-4 py-3 text-gray-500">{job.company}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(job.createdAt).toDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <UserCheck className="w-4 h-4 text-blue-500" />
                    <span>{job.noOfApplicants}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      job.status.toLowerCase() === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-gray-400 hover:text-gray-600"
                   onClick={() =>
                    setOpenActionsId(openActionsId === job._id ? null : job._id)
                  }
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {openActionsId === job._id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-md z-20">
                   <button
                   className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                     onClick={() => {
                 // handle view
                     setOpenActionsId(null);
                  }}
               >
               View
               </button>
              <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => {
             // handle edit
           setOpenActionsId(null);
            }}
           >
           Edit
        </button>
           <button
             className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          onClick={() => {
          // handle delete
           setOpenActionsId(null);
              }}
              >
                Delete
              </button>
          </div>
             )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       <div className="mt-4 text-center">
        <button onClick={()=>navigate('/admin/jobmanagement')} className="text-blue-600 hover:underline text-sm font-medium">
          View All Jobs
        </button>
      </div>
     </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onClick={()=>navigate('/admin/usermanagement')} className="bg-blue-600 text-white px-4 py-3 rounded-xl shadow hover:bg-blue-700 flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Manage Users</span>
            </button>
            <button onClick={()=>navigate('/admin/jobmanagement')} className="bg-green-600 text-white px-4 py-3 rounded-xl shadow hover:bg-green-700 flex items-center justify-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Manage Jobs</span>
            </button>
            <button onClick={()=>navigate('/admin/get_employers/list')} className="bg-purple-600 text-white px-4 py-3 rounded-xl shadow hover:bg-purple-700 flex items-center justify-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Manage Recruiters</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}