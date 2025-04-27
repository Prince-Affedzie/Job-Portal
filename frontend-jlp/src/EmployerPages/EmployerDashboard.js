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
          <div className="employer-recent-jobs">
            <div className="section-header">
              <div className="section-header-left">
                <h3>Recent Jobs</h3>
                <span className="section-subtitle">Manage your job postings</span>
              </div>
              <div className="job-search-tools">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="filter-btn">
                  <FaFilter /> Filter
                </button>
              </div>
            </div>

            {loading ? (
              <div className="employer-job-list-loading">
                <div className="loading-spinner"></div>
                <p>Loading your job listings...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="employer-job-list-empty">
                <img 
                  src="/api/placeholder/200/200" 
                  alt="No jobs" 
                  className="empty-state-image"
                />
                <h4>No jobs found</h4>
                <p>You haven't posted any jobs yet or none match your search criteria.</p>
                <Link to="/v1/post_job/form" className="employer-post-job-btn">
                  <FaPlus /> Post Your First Job
                </Link>
              </div>
            ) : (
              <>
                <div className="employer-job-list-d">
                  {displayJobs.map((job) => (
                    <div className="employer-job-card-d" key={job._id}>
                      <div className="job-card-header">
                        <h4>{job.title}</h4>
                        <span className="job-date">
                          <FaRegCalendarAlt /> {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently added"}
                        </span>
                      </div>
                      <div className="job-card-details">
                        <div className="job-detail-item">
                          <FaUsers className="job-detail-icon" />
                          <span>{job.noOfApplicants || 0} Applicants</span>
                        </div>
                        <div className="job-detail-item">
                          <FaClock className="job-detail-icon" />
                          <span>{job.jobDuration || "Full-time"}</span>
                        </div>
                      </div>
                      <div className="job-activity-indicator">
                        <div className="activity-bar">
                          <div 
                            className="activity-progress" 
                            style={{ 
                              width: `${job.noOfApplicants ? Math.min(job.noOfApplicants * 10, 100) : 5}%`,
                              backgroundColor: job.status === "Active" ? "#10b981" : "#9ca3af" 
                            }}
                          ></div>
                        </div>
                        <span className="activity-text">
                          {job.noOfApplicants 
                            ? `${job.noOfApplicants} applicant${job.noOfApplicants !== 1 ? 's' : ''} so far` 
                            : "Awaiting applicants"}
                        </span>
                      </div>
                      <div className="job-card-footer">
                        <div className={`job-status ${job.status === "Active" ? "active" : "inactive"}`}>
                          {job.status || "Active"}
                        </div>
                        <Link
                          to={`/employer/job/applicants/${job._id}`}
                          className="employer-view-applicants-btn"
                        >
                          View Applicants
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredJobs.length > 3 && (
                  <div className="show-more-container">
                    <button 
                      className="show-more-btn"
                      onClick={() => setShowAllJobs(!showAllJobs)}
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