import { useState, useEffect } from "react";
import { FaSearch, FaBriefcase, FaBuilding, FaCalendarAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import moment from "moment";
import "../Styles/ViewApplications.css";
import Navbar from "../Components/MyComponents/Navbar";
import { getRecentApplications } from "../APIS/API";
import Pagination from "../Components/MyComponents/Pagination";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(6);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
 

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [searchQuery, filter, sortBy, applications]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await getRecentApplications();
      if (response.status === 200) {
        setApplications(response.data);
        setFilteredApplications(response.data);
      } else {
        setApplications([]);
        setFilteredApplications([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortApplications = () => {
    let filtered = [...applications];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(app => 
        app.job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job?.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter(app => app.status.toLowerCase() === filter);
    }

    // Apply sorting
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "alphabetical") {
      filtered.sort((a, b) => {
        const titleA = a.job?.title || "";
        const titleB = b.job?.title || "";
        return titleA.localeCompare(titleB);
      });
    }

    setFilteredApplications(filtered);
    setCurrentPage(1);
  };

  // Get Status Badge Class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "status-badge status-pending";
      case "accepted": return "status-badge status-accepted";
      case "rejected": return "status-badge status-rejected";
      case "completed": return "status-badge status-completed";
      case "reviewing": return "status-badge status-reviewing";
      case "shortlisted": return "status-badge status-shortlisted";
      case "offered": return "status-badge status-offered";
      case "interview": return "status-badge status-interview";
      default: return "status-badge";
    }
  };
  

  // Pagination
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  const renderTimeAgo = (date) => {
    return moment(date).fromNow();
  };

  const toggleFilters = () => setIsFilterExpanded(!isFilterExpanded);

  return (
    <div className="app-view-container">
      <Navbar />
      <div className="applications-container">
        <header className="app-header">
          <h1>My Applications</h1>
          <p className="app-subtitle">Track and manage your job applications</p>
        </header>

        <div className="app-dashboard">
          <div className="app-stats">
            <div className="stat-card total">
              <span className="stat-number">{applications.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-card pending">
              <span className="stat-number">
                {applications.filter(app => app.status.toLowerCase() === "pending").length}
              </span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card accepted">
              <span className="stat-number">
                {applications.filter(app => app.status.toLowerCase() === "accepted").length}
              </span>
              <span className="stat-label">Accepted</span>
            </div>
            <div className="stat-card rejected">
              <span className="stat-number">
                {applications.filter(app => app.status.toLowerCase() === "rejected").length}
              </span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>

          <div className="app-controls">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button className="filter-toggle" onClick={toggleFilters}>
              Filters {isFilterExpanded ? "▲" : "▼"}
            </button>
          </div>

          {isFilterExpanded && (
            <div className="advanced-filters">
              <div className="filter-group">
                <label>Status:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>
          )}

          {loading ? (
            <div className="applications-loader">
              <div className="loader-spinner"></div>
              <p>Fetching your applications...</p>
            </div>
          ) : (
            <>
              <div className="applications-list">
                {currentApplications.length > 0 ? (
                  currentApplications.map((app) => (
                    <div key={app._id} className="application-card">
                      <div className="card-header">
                        <h3 className="app-title">
                          <FaBriefcase className="app-icon" />
                          {app.job?.title || "N/A"}
                        </h3>
                        
                        <span className={getStatusClass(app.status)}>{app.status}</span>
                      </div>
                      
                      <div className="app-info">
                        <p>
                          <FaBuilding className="info-icon" />
                          <span>Company: {app.job?.company || "N/A"}</span>
                        </p>
                        <p>
                          <FaBuilding className="info-icon" />
                          <span>Company Email: {app.job.companyEmail || "N/A"}</span>
                        </p>
                        <p>
                          <FaCalendarAlt className="info-icon" />
                          <span>Applied {renderTimeAgo(app.createdAt)}</span>
                        </p>
                      </div>
                      
                      <div className="card-footer">
                        <button 
                          className="view-details-btn" 
                          onClick={() => setSelectedApplication(app)}
                        >
                          View Details
                        </button>
                        <span className="application-date">
                          <FaClock /> {moment(app.createdAt).format("MMM DD, YYYY")}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-applications">
                    <img src="/images/no-applications.svg" alt="No applications found" className="no-data-image" />
                    <h3>No Applications Found</h3>
                    <p>Try adjusting your search filters or apply for new positions</p>
                  </div>
                )}
              </div>

               <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                          />
            </>
          )}
        </div>
      </div>

      {selectedApplication && (
        <div className="custom-modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="custom-close-btn" onClick={() => setSelectedApplication(null)}>
              &times;
            </button>
            
            <div className={`modal-status-ribbon status-${selectedApplication.status.toLowerCase()}`}>
              {selectedApplication.status}
            </div>
            
            <h2 className="modal-job-title">{selectedApplication.job?.title || "N/A"}</h2>
            <h3 className="modal-company">{selectedApplication.job?.company || "N/A"}</h3>
            
            <div className="modal-details">
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="info-label">Applied On</span>
                  <span className="info-value">{moment(selectedApplication.createdAt).format("MMMM DD, YYYY")}</span>
                </div>
                
                <div className="modal-info-item">
                  <span className="info-label">Job Status</span>
                  <span className={`badge badge-${selectedApplication.job?.status?.toLowerCase() || "pending"}`}>
                    {selectedApplication.job?.status || "N/A"}
                  </span>
                </div>
                
                <div className="modal-info-item">
                  <span className="info-label">Interview</span>
                  {selectedApplication.inviteForInterview ? (
                    <span className="badge badge-success">
                      <FaCheckCircle /> Invited
                    </span>
                  ) : (
                    <span className="badge badge-danger">Not Yet</span>
                  )}
                </div>
              </div>
              
              <div className="modal-section">
                <h4>Job Description</h4>
                <p className="job-description">
                  {selectedApplication.job?.description 
                    ? `${selectedApplication.job.description.slice(0, 100)}${selectedApplication.job.description.length > 300 ? "..." : ""}`
                    : "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;