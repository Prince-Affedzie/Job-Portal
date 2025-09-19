import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaBriefcase,
  FaUsers,
  FaBell,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaRegCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaDollarSign,
  FaEye,
  FaEdit,
  FaEllipsisV,
  FaTimes
} from "react-icons/fa";
import Sidebar from "../../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../../Components/EmployerDashboard/EmployerNavbar";
import { jobsCreatedContext } from "../../Context/EmployerContext1";
import { notificationContext } from "../../Context/NotificationContext";
import { useEmployerProfileContext } from "../../Context/EmployerProfileContext";

const EmployerDashboard = () => {
  const { Jobs, loading } = useContext(jobsCreatedContext);
  const { notifications } = useContext(notificationContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    location: "all",
    applicantRange: "all"
  });

  useEffect(() => {
    if (Jobs) {
      let filtered = Jobs.filter((job) =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Apply filters
      if (filters.status !== "all") {
        filtered = filtered.filter(job => 
          job.status?.toLowerCase() === filters.status.toLowerCase()
        );
      }

      if (filters.dateRange !== "all") {
        const now = new Date();
        const filterDate = new Date();
        
        switch (filters.dateRange) {
          case "today":
            filterDate.setHours(0, 0, 0, 0);
            filtered = filtered.filter(job => 
              new Date(job.createdAt) >= filterDate
            );
            break;
          case "week":
            filterDate.setDate(now.getDate() - 7);
            filtered = filtered.filter(job => 
              new Date(job.createdAt) >= filterDate
            );
            break;
          case "month":
            filterDate.setMonth(now.getMonth() - 1);
            filtered = filtered.filter(job => 
              new Date(job.createdAt) >= filterDate
            );
            break;
            default:
              return
        }
      }

      if (filters.location !== "all") {
        filtered = filtered.filter(job => 
          job.location?.city?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.applicantRange !== "all") {
        filtered = filtered.filter(job => {
          const applicants = job.noOfApplicants || 0;
          switch (filters.applicantRange) {
            case "0": return applicants === 0;
            case "1-5": return applicants >= 1 && applicants <= 5;
            case "6-20": return applicants >= 6 && applicants <= 20;
            case "20+": return applicants > 20;
            default: return true;
          }
        });
      }

      setFilteredJobs(filtered);
    }
  }, [Jobs, searchTerm, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      dateRange: "all",
      location: "all",
      applicantRange: "all"
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== "all");

  // Calculate meaningful stats
  const stats = {
    jobsPosted: Jobs.length,
    totalApplicants: Jobs.reduce((total, job) => total + (job.noOfApplicants || 0), 0),
    activeJobs: Jobs.filter(job => job.status === "Opened").length,
    conversionRate: Jobs.length > 0 
      ? Math.round((Jobs.reduce((total, job) => total + (job.noOfApplicants || 0), 0) / Jobs.length) * 10) / 10
      : 0
  };

  const displayJobs = showAllJobs ? filteredJobs : filteredJobs.slice(0, 6);

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get unique locations for filter dropdown
  const uniqueLocations = [...new Set(Jobs.map(job => job.location?.city).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on small screens */}
       <EmployerNavbar/>
      <div className=" lg:block sm:hidden">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Navbar */}
       
       
        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8 pt-10 sm:pt-10 lg:pt-10 mt-0">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 sm:p-8 text-white mb-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, Employer!</h1>
                <p className="text-blue-100 text-sm sm:text-base">Dashboard overview for {currentDate}</p>
              </div>
              <Link 
                to="/v1/post_job/form" 
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md whitespace-nowrap"
              >
                <FaPlus className="text-sm" /> Post New Job
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {[
              {
                icon: <FaBriefcase />,
                value: stats.jobsPosted,
                label: "Total Jobs Posted",
                subtext: `${stats.activeJobs} currently active`,
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                icon: <FaUsers />,
                value: stats.totalApplicants,
                label: "Total Applicants",
                subtext: `${stats.conversionRate} applicants per job avg`,
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
                iconColor: "text-green-600",
              },
              {
                icon: <FaCheckCircle />,
                value: `${Math.round((stats.activeJobs / (stats.jobsPosted || 1)) * 100)}%`,
                label: "Job Activity Rate",
                subtext: stats.jobsPosted > 0 
                  ? `${stats.activeJobs} of ${stats.jobsPosted} jobs active` 
                  : "No jobs posted yet",
                color: "from-orange-500 to-orange-600",
                bgColor: "bg-orange-50",
                iconColor: "text-orange-600",
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${item.bgColor} ${item.iconColor} mb-4`}>
                      {item.icon}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{item.value}</h3>
                    <p className="text-gray-600 font-medium mb-1">{item.label}</p>
                    <span className="text-sm text-gray-500">{item.subtext}</span>
                  </div>
                  <div className="text-gray-400">
                    <FaChartLine />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Jobs Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Recent Jobs</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage your job postings</p>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => setShowFilterModal(true)}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors text-sm font-medium relative ${
                      hasActiveFilters 
                        ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" 
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <FaFilter className="text-xs" /> 
                    <span className="hidden sm:inline">Filter</span>
                    {hasActiveFilters && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (value === "all") return null;
                    return (
                      <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {key}: {value}
                        <button
                          onClick={() => handleFilterChange(key, "all")}
                          className="ml-1 hover:text-blue-900"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    );
                  })}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Filter Modal */}
            {showFilterModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 mt-10">
                <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Filter Jobs</h3>
                      <button
                        onClick={() => setShowFilterModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FaTimes className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="opened">Active</option>
                        <option value="closed">Closed</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Posted Date</label>
                      <select
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Past Week</option>
                        <option value="month">Past Month</option>
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <select
                        value={filters.location}
                        onChange={(e) => handleFilterChange("location", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Locations</option>
                        {uniqueLocations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {/* Applicant Range Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Applicants</label>
                      <select
                        value={filters.applicantRange}
                        onChange={(e) => handleFilterChange("applicantRange", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">Any Number</option>
                        <option value="0">No Applicants</option>
                        <option value="1-5">1-5 Applicants</option>
                        <option value="6-20">6-20 Applicants</option>
                        <option value="20+">20+ Applicants</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 flex gap-3">
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilterModal(false)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
                  <p className="text-sm">Loading your job listings...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center text-center py-16 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaBriefcase className="text-2xl text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h4>
                  <p className="text-gray-500 mb-6 max-w-md">
                    {searchTerm || hasActiveFilters
                      ? "No jobs match your search criteria. Try adjusting your search terms or filters."
                      : "You haven't posted any jobs yet. Create your first job posting to get started."
                    }
                  </p>
                  {!searchTerm && !hasActiveFilters && (
                    <Link 
                      to="/v1/post_job/form" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <FaPlus className="text-sm" /> Post Your First Job
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayJobs.map((job) => (
                      <div key={job._id} className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500 gap-4">
                              <span className="flex items-center gap-1">
                                <FaRegCalendarAlt className="text-xs" />
                                {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-600">
                              <FaUsers className="text-blue-500 text-xs" />
                              <span className="font-medium">{job.noOfApplicants || 0}</span> Applicants
                            </span>
                            <span className="flex items-center gap-2 text-gray-600">
                              <FaClock className="text-green-500 text-xs" />
                              {job.jobDuration || "Full-time"}
                            </span>
                          </div>

                          {job.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaMapMarkerAlt className="text-red-500 text-xs" />
                              {job.location.city}
                            </div>
                          )}

                          {job.salary && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaDollarSign className="text-yellow-500 text-xs" />
                              {job.salary}
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-600">Application Progress</span>
                            <span className="text-xs text-gray-500">
                              {job.noOfApplicants || 0} / {job.maxApplicants || '∞'}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                              style={{
                                width: `${Math.min((job.noOfApplicants || 0) * 10, 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === "Opened" || job.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : job.status === "Closed"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {job.status || "Active"}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/employer/edit_job/${job._id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Job"
                            >
                              <FaEdit className="text-sm" />
                            </Link>
                            <Link
                              to={`/employer/view_job/${job._id}`}
                              className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                            >
                              <FaEye className="text-xs" />
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Show More/Less Button */}
                  {filteredJobs.length > 6 && (
                    <div className="text-center mt-8 pt-6 border-t border-gray-100">
                      <button
                        onClick={() => setShowAllJobs(!showAllJobs)}
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                      >
                        {showAllJobs ? "Show Less" : `Show All ${filteredJobs.length} Jobs`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Notifications Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Recent Notifications</h3>
                  <p className="text-sm text-gray-500 mt-1">Stay updated on important events</p>
                </div>
                <Link 
                  to="/employer/notifications" 
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-colors"
                >
                  View All
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaBell className="text-2xl text-gray-400" />
                  </div>
                  <p className="text-gray-500">No new notifications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 4).map((note) => (
                    <div key={note.id} className={`flex items-start gap-4 p-4 rounded-lg border ${
                      note.isNew 
                        ? "bg-blue-50 border-blue-200" 
                        : "bg-gray-50 border-gray-200"
                    } hover:shadow-sm transition-shadow`}>
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          note.isNew ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                        }`}>
                          <FaBell className="text-sm" />
                        </div>
                        {note.isNew && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-sm font-medium">{note.message}</p>
                        <span className="text-xs text-gray-500">{note.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;