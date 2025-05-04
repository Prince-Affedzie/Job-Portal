import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaFileAlt, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import ProfileModal from "./JobApplicantsPageComponents/ApplicantsProfileModal";
import InterviewInviteModal from "../Components/EmployerDashboard/InterviewInviteModal";
import { getSpecificJobApplications, modifyApplication } from "../APIS/API";
import "../Styles/JobApplicantsPage.css";

// Import the component files
import JobDetailsSummary from "./JobApplicantsPageComponents/JobSummary";
import ApplicantsControls from "./JobApplicantsPageComponents/ApplicantsControl";
import StatusStats from "./JobApplicantsPageComponents/StatusStats";
import ApplicantCard from "./JobApplicantsPageComponents/ApplicantsCard";
import Pagination from "./JobApplicantsPageComponents/Pagination";

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
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 10;

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
            id:firstApp.job._id,
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
          userId:app.user._id,
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

  // Filter applicants
  const filteredApplicants = applicants
    .filter(applicant => 
      (filterStatus === "all" || applicant.status.toLowerCase() === filterStatus.toLowerCase()) &&
      (applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       applicant.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );

  // Pagination
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);
  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Toggle applicant selection
  const toggleApplicant = (id) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Open interview invite modal
  const openInviteModal = () => {
    if (selectedApplicants.length === 0) {
      alert("Select at least one applicant.");
      return;
    }
    setIsModalOpen(true);
  };

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
               <h2>Applicants for This Job</h2>
               <button
                  onClick={openInviteModal}
                 className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                  >
                  Send Interview Invite
             </button>
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
                  {currentApplicants.map((applicant) => (
                    <ApplicantCard 
                      key={applicant.id}
                      applicant={applicant} 
                      onViewProfile={handleViewProfile}
                      selectedApplicants={selectedApplicants}
                      toggleApplicant={toggleApplicant}
                    />
                  ))}
                  
                </div>
              )}
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage} 
                />
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
          notes={notes}
          setNotes={setNotes}
        />
      )}
      
      {/* Interview Invite Modal */}
      {isModalOpen && (
        <InterviewInviteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedApplicants={selectedApplicants}
          jobId={jobDetails?.id || ""}
        />
      )}
    </div>
  );
};

export default JobApplicantsPage;