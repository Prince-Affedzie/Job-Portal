import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Eye, 
  Edit, 
  Trash2, 
  User,
  Briefcase,
  Users,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  BarChart3,
  Building
} from "lucide-react";
import { useAdminContext } from "../../Context/AdminContext";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import "../../Styles/AdminLayout.css";

const AdminJobManagementDashboard = () => {
  const navigate = useNavigate();
  const { loading, jobs, fetchAllJobs } = useAdminContext();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  
  const totalJobs = jobs.length;
  const openedJobs = jobs.filter((job) => job.status === "Opened");
  const closedJobs = jobs.filter((job) => job.status === "Closed");
  const filledJobs = jobs.filter((job) => job.status === "Filled");

  useEffect(() => {
    if (!jobs || jobs.length === 0) fetchAllJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs || [];
    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "All") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }
    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, jobs]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Opened":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Closed":
        return "bg-red-100 text-red-800 border-red-200";
      case "Filled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const paginatedData = filteredJobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredJobs.length / pageSize);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center space-x-2">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {trend && (
              <div className="flex items-center text-emerald-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend}
              </div>
            )}
          </div>
        </div>
        <div className={`${color} p-3 rounded-xl`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const CustomDropdown = ({ value, onChange, options, placeholder }) => (
    <div className="relative">
      <button
        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <span className="text-gray-700">{value === "All" ? placeholder : value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      {showFilterDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setShowFilterDropdown(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const Pagination = () => (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
      <div className="flex items-center text-sm text-gray-700">
        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredJobs.length)} of {filteredJobs.length} results
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
     

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
       
          <AdminSidebar 
                 isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
                 />
                 
          <NotificationCenter/>
       

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
            <AdminNavbar 
              onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
               isSidebarOpen={isSidebarOpen} 
               />
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage and monitor all job postings across your platform
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Jobs"
                value={totalJobs}
                icon={Building}
                color="bg-blue-100 text-blue-600"
                trend="+12%"
              />
              <StatCard
                title="Open Positions"
                value={openedJobs.length}
                icon={Briefcase}
                color="bg-emerald-100 text-emerald-600"
                trend="+8%"
              />
              <StatCard
                title="Closed Jobs"
                value={closedJobs.length}
                icon={Clock}
                color="bg-red-100 text-red-600"
              />
              <StatCard
                title="Filled Positions"
                value={filledJobs.length}
                icon={Users}
                color="bg-purple-100 text-purple-600"
                trend="+5%"
              />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search jobs by title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <CustomDropdown
                      value={statusFilter}
                      onChange={setStatusFilter}
                      placeholder="All Statuses"
                      options={[
                        { value: "All", label: "All Statuses" },
                        { value: "Opened", label: "Opened" },
                        { value: "Closed", label: "Closed" },
                        { value: "Filled", label: "Filled" }
                      ]}
                    />
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Filter className="w-4 h-4 mr-2" />
                  {filteredJobs.length} results found
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Job Details
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type & Category
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applicants
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Deadline
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((job, index) => (
                          <tr key={job._id || index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <Link to={`/admin/${job._id}/job_details`} className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                  <div className="text-sm text-gray-500 flex items-center mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {job.deliveryMode|| 'Remote'}
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{job.company}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{job.jobType}</div>
                              <div className="text-sm text-gray-500">{job.category}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">{job.noOfApplicants}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center text-sm text-gray-900">
                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                {new Date(job.deadLine).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => navigate(`/admin/${job._id}/job_details`)}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobManagementDashboard;