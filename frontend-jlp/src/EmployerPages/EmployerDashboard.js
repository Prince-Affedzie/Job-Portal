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
  FaCheckCircle
} from "react-icons/fa";
import Sidebar from "../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import "../Styles/EmployerDashboard.css";
import { jobsCreatedContext } from "../Context/EmployerContext1";
import { notificationContext } from "../Context/NotificationContext";
import { useEmployerProfileContext } from "../Context/EmployerProfileContext";

const EmployerDashboard = () => {
  const { Jobs, loading } = useContext(jobsCreatedContext);
 
  const { notifications } = useContext(notificationContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showAllJobs, setShowAllJobs] = useState(false);

  useEffect(() => {
    if (Jobs) {
      setFilteredJobs(
        Jobs.filter((job) =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [Jobs, searchTerm]);

  // Calculate meaningful stats
  const stats = {
    jobsPosted: Jobs.length,
    totalApplicants: Jobs.reduce((total, job) => total + (job.noOfApplicants || 0), 0),
    activeJobs: Jobs.filter(job => job.status === "Opened").length,
    conversionRate: Jobs.length > 0 
      ? Math.round((Jobs.reduce((total, job) => total + (job.noOfApplicants || 0), 0) / Jobs.length) * 10) / 10
      : 0
  };

  const displayJobs = showAllJobs ? filteredJobs : filteredJobs.slice(0, 3);

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div>
      <EmployerNavbar />
      <div className="employer-dashboard-container">
        <Sidebar />
        <div className="employer-dashboard-content">
          {/* Welcome Banner with Current Date */}
          <div className="employer-dashboard-welcome">
            <div className="welcome-text">
              <h2>Welcome back, Employer!</h2>
              <p>Dashboard overview for {currentDate}</p>
            </div>
            <Link to="/v1/post_job/form" className="employer-post-job-btn">
              <FaPlus /> Post New Job
            </Link>
          </div>

          {/* Summary Cards - Removed Profile Views and Payments Processed */}
          <div className="employer-dashboard-summary">
            {[
              {
                icon: <FaBriefcase />,
                value: stats.jobsPosted,
                label: "Total Jobs Posted",
                subtext: `${stats.activeJobs} currently active`,
                color: "#4f46e5",
              },
              {
                icon: <FaUsers />,
                value: stats.totalApplicants,
                label: "Total Applicants",
                subtext: `${stats.conversionRate} applicants per job avg`,
                color: "#10b981",
              },
              {
                icon: <FaCheckCircle />,
                value: `${stats.activeJobs}/${stats.jobsPosted}`,
                label: "Job Activity Rate",
                subtext: stats.jobsPosted > 0 
                  ? `${Math.round((stats.activeJobs / stats.jobsPosted) * 100)}% of jobs active` 
                  : "No jobs posted yet",
                color: "#f59e0b",
              }
            ].map((item, index) => (
              <div className="employer-card" key={index}>
                <div className="employer-card-content">
                  <div className="employer-dashboard-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="employer-card-text">
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                    <span className="employer-card-subtext">{item.subtext}</span>
                  </div>
                </div>
                <div className="employer-card-chart">
                  <FaChartLine />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Jobs Section */}
          <div className="w-full bg-white rounded-xl shadow-md p-6 mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
             <h3 className="text-xl font-semibold text-gray-800">Recent Jobs</h3>
         <p className="text-sm text-gray-500">Manage your job postings</p>
           </div>
          <div className="flex gap-2 items-center">
           <div className="relative">
           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
          type="text"
          placeholder="Search jobs..."
          className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition">
        <FaFilter /> <span className="hidden sm:inline">Filter</span>
      </button>
     </div>
        </div>

   {loading ? (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
      <p>Loading your job listings...</p>
    </div>
   ) : filteredJobs.length === 0 ? (
    <div className="flex flex-col items-center text-center py-20 text-gray-500">
      <img src="/api/placeholder/200/200" alt="No jobs" className="w-32 h-32 mb-4" />
      <h4 className="text-lg font-semibold mb-1">No jobs found</h4>
      <p className="mb-4">You haven't posted any jobs yet or none match your search criteria.</p>
      <Link to="/v1/post_job/form" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        <FaPlus /> Post Your First Job
      </Link>
    </div>
  ) : (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayJobs.map((job) => (
          <div key={job._id} className="bg-gray-50 border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-medium text-gray-800">{job.title}</h4>
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <FaRegCalendarAlt /> {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently added"}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1 mb-3">
              <div className="flex items-center gap-2">
                <FaUsers className="text-gray-500" />
                <span>{job.noOfApplicants || 0} Applicants</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-gray-500" />
                <span>{job.jobDuration || "Full-time"}</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full`}
                  style={{
                    width: `${job.noOfApplicants ? Math.min(job.noOfApplicants * 10, 100) : 5}%`,
                    backgroundColor: job.status === "Active" ? "#10b981" : "#9ca3af",
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {job.noOfApplicants
                  ? `${job.noOfApplicants} applicant${job.noOfApplicants !== 1 ? "s" : ""} so far`
                  : "Awaiting applicants"}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${job.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {job.status || "Active"}
              </span>
              <Link
                to={`/employer/job/applicants/${job._id}`}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View Applicants
              </Link>
            </div>
          </div>
        ))}
      </div>
      {filteredJobs.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAllJobs(!showAllJobs)}
            className="text-blue-600 font-medium hover:underline"
          >
            {showAllJobs ? "Show Less" : `Show All (${filteredJobs.length})`}
          </button>
        </div>
      )}
    </>
  )}
</div>

          {/* Notifications Section - Enhanced */}
          <div className="employer-notifications">
            <div className="section-header">
              <div className="section-header-left">
                <h3>Recent Notifications</h3>
                <span className="section-subtitle">Stay updated on important events</span>
              </div>
              <Link to="/employer/notifications" className="view-all-link">
                View All
              </Link>
            </div>
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <FaBell className="empty-notification-icon" />
                <p>No new notifications</p>
              </div>
            ) : (
              <ul className="notification-list">
                {notifications.slice(0,4).map((note) => (
                  <li key={note.id} className={note.isNew ? "new-notification" : ""}>
                    <div className="notification-icon-container">
                      <FaBell className="employer-notification-icon" />
                      {note.isNew && <span className="employer-notification-badge"></span>}
                    </div>
                    <div className="notification-content">
                      <p>{note.message}</p>
                      <span className="notification-time">{note.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;