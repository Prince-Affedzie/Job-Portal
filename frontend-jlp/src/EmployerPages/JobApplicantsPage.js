import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FaArrowLeft, FaSearch, FaUser, FaEnvelope, FaPhone, 
  FaCalendarAlt, FaFileAlt, FaCheckCircle, FaTimesCircle, 
  FaClock, FaDownload, FaEllipsisV, FaLinkedin 
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import { getSpecificJobApplications, modifyApplication } from "../APIS/API";
import "../Styles/JobApplicantsPage.css";
import ProfileModal from "../Components/EmployerDashboard/ApplicantsProfileModal";

// Utility Components
export const StatusBadge = ({ status }) => {
  const normalizedStatus = status.toLowerCase();
  const statusConfig = {
    new: { color: "#3b82f6", bgColor: "#dbeafe" },
    reviewing: { color: "#8b5cf6", bgColor: "#ede9fe" },
    shortlisted: { color: "#10b981", bgColor: "#d1fae5" },
    interviewing: { color: "#f59e0b", bgColor: "#fef3c7" },
    interview: { color: "#f59e0b", bgColor: "#fef3c7" },
    offered: { color: "#059669", bgColor: "#ecfdf5" },
    rejected: { color: "#ef4444", bgColor: "#fee2e2" }
  };
  
  const bestMatch = Object.keys(statusConfig).find(key => 
    normalizedStatus.includes(key) || key.includes(normalizedStatus)
  ) || "new";
  
  return (
    <span 
      className="applicant-status-badge" 
      style={{ backgroundColor: statusConfig[bestMatch].bgColor, color: statusConfig[bestMatch].color }}
    >
      {status}
    </span>
  );
};

 export const MatchScoreIndicator = ({ score }) => (
  <div className="match-score-container">
    <div className="match-score-circle" 
      style={{ backgroundColor: score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444" }}>
      {score}%
    </div>
  </div>
);

 export const ImageWithFallback = ({ src, alt }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/150?text=User";
  };

  const imageSrc = src?.startsWith("http") 
    ? src 
    : `${process.env.REACT_APP_BACKEND_URL}/uploads/${src}`;

  return <img src={imageSrc} alt={alt} onError={handleImageError} />;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch (e) {
    return 'Invalid date';
  }
};

// Main component parts
const JobDetailsSummary = ({ jobDetails }) => (
  <div className="job-details-summary">
    <div className="job-details-header">
      <h3>{jobDetails.title}</h3>
      <div className={`job-status ${jobDetails.status.toLowerCase()}`}>{jobDetails.status}</div>
    </div>
    <div className="job-details-meta">
      <div className="job-meta-item">
        <span className="meta-label">Location:</span>
        <span className="meta-value">{jobDetails.location}</span>
      </div>
      <div className="job-meta-item">
        <span className="meta-label">Salary:</span>
        <span className="meta-value">{jobDetails.salary}</span>
      </div>
      <div className="job-meta-item">
        <span className="meta-label">Posted:</span>
        <span className="meta-value">{formatDate(jobDetails.createdAt)}</span>
      </div>
      <div className="job-meta-item">
        <span className="meta-label">Total Applicants:</span>
        <span className="meta-value">{jobDetails.noOfApplicants}</span>
      </div>
    </div>
  </div>
);

const ApplicantsControls = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus, sortBy, setSortBy, sortOrder, setSortOrder }) => {
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="applicants-controls">
      <div className="search-box applicant-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name, email, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filter-controls">
        <div className="status-filter">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Applicants</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interviewing</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="sort-controls">
          <button 
            className={`sort-button ${sortBy === 'dateApplied' ? 'active' : ''}`}
            onClick={() => toggleSort('dateApplied')}
          >
            Date {sortBy === 'dateApplied' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`sort-button ${sortBy === 'matchScore' ? 'active' : ''}`}
            onClick={() => toggleSort('matchScore')}
          >
            Match {sortBy === 'matchScore' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
            onClick={() => toggleSort('name')}
          >
            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusStats = ({ statusCounts, filterStatus, setFilterStatus }) => {
  const statuses = [
    { status: "all", label: "All Applicants", count: statusCounts.all },
    { status: "reviewing", label: "Reviewing", count: statusCounts.reviewing },
    { status: "shortlisted", label: "Shortlisted", count: statusCounts.shortlisted },
    { status: "interview", label: "Interviewing", count: statusCounts.interviewing },
    { status: "offered", label: "Offered", count: statusCounts.offered },
    { status: "rejected", label: "Rejected", count: statusCounts.rejected }
  ];
  
  return (
    <div className="applicant-status-stats">
      {statuses.map((stat) => (
        <button 
          key={stat.status}
          className={`status-stat ${filterStatus === stat.status ? 'active' : ''}`}
          onClick={() => setFilterStatus(stat.status)}
        >
          {stat.label}
          <span className="status-count">{stat.count}</span>
        </button>
      ))}
    </div>
  );
};

const ApplicantCard = ({ applicant, onViewProfile }) => (
  <div className="emp-applicant-card">
    <div className="emp-applicant-header">
      <div className="emp-applicant-identity">
        <div className="emp-applicant-avatar">
          <ImageWithFallback src={applicant.profileImage} alt={applicant.name} />
        </div>
        <div className="emp-applicant-primary-info">
          <h4>{applicant.name}</h4>
          <p>{applicant.experience} • {applicant.location}</p>
        </div>
      </div>
      <StatusBadge status={applicant.status} />
    </div>

    <div className="emp-applicant-contact-info">
      <div className="emp-contact-item">
        <FaEnvelope />
        <span>{applicant.email}</span>
      </div>
      <div className="emp-contact-item">
        <FaPhone />
        <span>{applicant.phone}</span>
      </div>
    </div>

    <div className="emp-applicant-skills">
      {applicant.skills?.slice(0, 4).map((skill, index) => (
        <span key={index} className="emp-skill-tag">{skill}</span>
      ))}
      {applicant.skills?.length > 4 && (
        <span className="emp-more-skills">+{applicant.skills.length - 4}</span>
      )}
    </div>

    <div className="emp-applicant-metrics">
      <div className="emp-applicant-metric">
        <span className="emp-metric-label">Applied</span>
        <span className="emp-metric-value">
          <FaCalendarAlt /> {formatDate(applicant.dateApplied)}
        </span>
      </div>
      <div className="emp-applicant-metric">
        <span className="emp-metric-label">Last Activity</span>
        <span className="emp-metric-value">
          <FaClock /> {formatDate(applicant.lastActivity)}
        </span>
      </div>
    </div>

    <div className="emp-applicant-footer">
      <div className="emp-applicant-actions">
        <button className="emp-action-btn emp-view-profile-btn" onClick={() => onViewProfile(applicant)}>
          View Profile
        </button>
        {/* You can add more buttons here if needed */}
      </div>
    </div>
  </div>
);



// Main Component
const JobApplicantsPage = () => {
  const { Id } = useParams();
  const [loading, setLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("dateApplied");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notes, setNotes] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    fetchApplicantsData();
  }, [Id]);

  const fetchApplicantsData = async () => {
    try {
      setLoading(true);
      const response = await getSpecificJobApplications(Id);
      
      if (response.status === 200) {
        // Set job details
        if (response.data.length > 0) {
          const firstApp = response.data[0];
          setJobDetails({
            title: firstApp.job.title,
            status: firstApp.job.status, 
            location: firstApp.job.deliveryMode, 
            salary: firstApp.job.salary, 
            createdAt: firstApp.job.createdAt, 
            noOfApplicants: firstApp.job.noOfApplicants || response.data.length
          });
        }

        // Transform applications data
        const transformedApplicants = response.data.map(app => ({
          id: app._id,
          name: app.user.name,
          email: app.user.email || "Email not provided",
          phone: app.user.phone || "Phone not provided",
          profileImage: app.user.profileImage || "https://via.placeholder.com/150",
          skills: app.user.skills || [],
          workExperience: app.user.workExperience || [],
          experience: app.user.workExperience?.length > 0 
            ? `${app.user.workExperience.length} years` 
            : "No experience listed",
          location: app.user.location?.city || "Location not specified",
          educationList: app.user.education || [],
          coverLetter: app.coverLetter || "No cover letter provided",
          status: app.status || "New",
          dateApplied: app.createdAt,
          lastActivity: app.updatedAt,
          resume: app.resume || null,
          matchScore: Math.floor(Math.random() * 40) + 60, // Placeholder for real scoring
          linkedIn: app.user.linkedIn || ""
        }));

        setApplicants(transformedApplicants);
      } else {
        toast.error("Failed to load applicants data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while loading applicants");
    } finally {
      setLoading(false);
    }
  };

  // Status change handler
  const handleAppStatusChange = async (id, status) => {
    try {
      const response = await modifyApplication(id, status);
      
      if (response.status === 200) {
        toast.success(`Application ${status.status} successfully`);
        setApplicants(prev => prev.map(app => app.id === id ? { ...app, status: status.status } : app));
        if (selectedApplicant && selectedApplicant.id === id) {
          setSelectedApplicant(prev => ({ ...prev, status: status.status }));
        }
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  // Save notes handler
  const handleSaveNotes = () => {
    toast.success("Notes saved successfully");
  };

  // Filter and sort applicants
  const filteredApplicants = applicants
    .filter(applicant => 
      (filterStatus === "all" || applicant.status.toLowerCase() === filterStatus.toLowerCase()) &&
      (applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       applicant.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortBy === "dateApplied") {
        return sortOrder === "asc" 
          ? new Date(a.dateApplied) - new Date(b.dateApplied)
          : new Date(b.dateApplied) - new Date(a.dateApplied);
      } else if (sortBy === "matchScore") {
        return sortOrder === "asc" ? a.matchScore - b.matchScore : b.matchScore - a.matchScore;
      } else if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return 0;
    });

  // Handle profile view
  const handleViewProfile = (applicant) => {
    setSelectedApplicant(applicant);
    setShowProfileModal(true);
    setNotes(""); // Reset notes
  };
  
  // Get status counts for the filter tabs
  const getStatusCounts = () => {
    const statusMap = {
      all: applicants.length,
      new: 0,
      reviewing: 0,
      shortlisted: 0, 
      interviewing: 0,
      offered: 0,
      rejected: 0
    };
    
    applicants.forEach(applicant => {
      const normalizedStatus = applicant.status.toLowerCase();
      if (normalizedStatus === "new") statusMap.new++;
      else if (normalizedStatus.includes("review")) statusMap.reviewing++;
      else if (normalizedStatus.includes("shortlist")) statusMap.shortlisted++;
      else if (normalizedStatus.includes("interview")) statusMap.interviewing++;
      else if (normalizedStatus.includes("offer")) statusMap.offered++;
      else if (normalizedStatus.includes("reject")) statusMap.rejected++;
    });
    
    return statusMap;
  };
  
  const statusCounts = getStatusCounts();

  return (
    <div className="job-applicants-container">
      <EmployerNavbar />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="employer-dashboard-container">
        <Sidebar />
        <div className="employer-dashboard-content job-applicants-page">
          <div className="applicants-page-header">
            <Link to="/employer/dashboard" className="back-button">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h2>Applicants for Job</h2>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading applicants...</p>
            </div>
          ) : !jobDetails ? (
            <div className="no-data-container">
              <FaFileAlt className="no-data-icon" />
              <h3>No job data available</h3>
              <p>We couldn't find information for this job posting.</p>
              <Link to="/employer/dashboard" className="back-button">Return to Dashboard</Link>
            </div>
          ) : (
            <>
              <JobDetailsSummary jobDetails={jobDetails} />
              <ApplicantsControls 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
              <StatusStats 
                statusCounts={statusCounts} 
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
              {filteredApplicants.length === 0 ? (
                <div className="no-applicants">
                  <div className="empty-state-icon"><FaUser /></div>
                  <h4>No applicants found</h4>
                  <p>No applicants match your current filters. Try changing your search criteria.</p>
                </div>
              ) : (
                <div className="applicants-list">
                  {filteredApplicants.map((applicant) => (
                    <ApplicantCard 
                      key={applicant.id}
                      applicant={applicant} 
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedApplicant && (
        <ProfileModal 
          applicant={selectedApplicant}
          onClose={() => setShowProfileModal(false)}
          onStatusChange={handleAppStatusChange}
          onSaveNotes={handleSaveNotes}
          notes={notes}
          setNotes={setNotes}
        />
      )}
    </div>
  );
};

export default JobApplicantsPage;