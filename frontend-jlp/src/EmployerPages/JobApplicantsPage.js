import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaFileAlt, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../Styles/JobApplicantsPage.css'

import Sidebar from "../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import ProfileModal from "../Components/EmployerDashboard/ApplicantsProfileModal";
import InterviewInviteModal from "../Components/EmployerDashboard/InterviewInviteModal";
import BulkStatusModal from "../Components/EmployerDashboard/BulkStatusUpdateModal";
import { getSpecificJobApplications, modifyApplication } from "../APIS/API";

// Import components
import JobDetailsSummary from "../Components/EmployerDashboard/JobSummary";
import { ApplicantActionBar } from "../Components/EmployerDashboard//ApplicantsCard";
import ApplicantsControls from "../Components/EmployerDashboard//ApplicantsControl";
import StatusStats from "../Components/EmployerDashboard/StatusStats";
import ApplicantCard from "../Components/EmployerDashboard/ApplicantsCard";
import Pagination from "../Components/EmployerDashboard/Pagination";

// Custom hook for applicants management
const useApplicantsManager = (jobId) => {
  const [loading, setLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    fetchApplicantsData();
  }, [jobId]);

  const fetchApplicantsData = async () => {
    try {
      setLoading(true);
      const response = await getSpecificJobApplications(jobId);
      
      if (response.status === 200) {
        // Set job details
        if (response.data.length > 0) {
          const firstApp = response.data[0];
          setJobDetails({
            id: firstApp.job._id,
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
          userId: app.user._id,
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

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  // Status change handler
  const handleAppStatusChange = async (payload) => {
    try {
      const response = await modifyApplication(payload);
      
      if (response.status === 200) {
        toast.success(`Application state modified successfully`);
       /* setApplicants(prev => prev.map(app => 
         Ids.includes(app.id) ? { ...app, status: status.status } : app
        ));
        
        if (selectedApplicant && Ids.includes(selectedApplicant.id)) {
          setSelectedApplicant(prev => ({ ...prev, status: status.status }));
        }*/
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  // Toggle applicant selection
  const toggleApplicant = (userId, applicationId) => {
  setSelectedApplicants((prev) => {
    const exists = prev.find((a) => a.userId === userId);
    if (exists) {
      return prev.filter((a) => a.userId !== userId);
    } else {
      return [...prev, { userId, applicationId }];
    }
  });
};


  // Handle profile view
  const handleViewProfile = (applicant) => {
    setSelectedApplicant(applicant);
  };

  return {
    loading,
    jobDetails,
    applicants,
    selectedApplicant,
    setSelectedApplicant,
    setSelectedApplicants, 
    selectedApplicants,
    handleAppStatusChange,
    toggleApplicant,
    handleViewProfile
  };
};



// Custom hook for filtering and pagination
const useApplicantsFiltering = (applicants) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("dateApplied");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 10;

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

  // Filter and sort applicants
  const filteredApplicants = applicants
    .filter(applicant => 
      (filterStatus === "all" || applicant.status.toLowerCase() === filterStatus.toLowerCase()) &&
      (applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       applicant.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "dateApplied") {
        comparison = new Date(a.dateApplied) - new Date(b.dateApplied);
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "matchScore") {
        comparison = a.matchScore - b.matchScore;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Pagination
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);
  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    statusCounts: getStatusCounts(),
    filteredApplicants,
    currentApplicants,
    totalPages
  };
};


// Main component
const JobApplicantsPage = () => {
  const { Id } = useParams();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isBulkStatusModalOpen, setIsBulkStatusModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  
  // Use custom hooks
  const {
    loading,
    jobDetails,
    applicants,
    selectedApplicant,
    setSelectedApplicants,
    selectedApplicants,
    handleAppStatusChange,
    toggleApplicant,
    handleViewProfile
  } = useApplicantsManager(Id);

  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    statusCounts,
    filteredApplicants,
    currentApplicants,
    totalPages
  } = useApplicantsFiltering(applicants);

  // View profile handler with modal management
  const onViewProfile = (applicant) => {
    handleViewProfile(applicant);
    setShowProfileModal(true);
    setNotes(""); // Reset notes
  };
  
  // Open interview invite modal
  const openInviteModal = () => {
    if (selectedApplicants.length === 0) {
      toast.warning("Select at least one applicant");
      return;
    }
    setIsInterviewModalOpen(true);
  };

   const openBulkStatusModal = () => {
  if (!selectedApplicants.length) {
    toast.warning("Select at least one applicant");
    return;
  }
  console.log(selectedApplicants)
  setIsBulkStatusModalOpen(true);
};

const handleBulkStatusChange = async (newStatus) => {
  if (!selectedApplicants.length) return;

  const payload = {
    status: newStatus,
    applicants: selectedApplicants, // contains both userId & applicationId
  };

  await handleAppStatusChange(payload);
  setSelectedApplicants([]);
};



  const clearSelection = () => setSelectedApplicants([]);


  const sendBulkInvites = () => openInviteModal();

  return (
    <div className="job-applicants-container">
      <EmployerNavbar />
      <div style={{ display: window.innerWidth >= 768 ? 'block' : 'none' }}>
          <Sidebar />
        </div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      
      <div className="employer-dashboard-container">
       
        <div className="employer-dashboard-content job-applicants-page">
          <div className="applicants-page-header">
            <h2>Applicants for This {jobDetails?.title} Job</h2>
            <button
              onClick={openInviteModal}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Send Interview Invite
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
           <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
             <p className="text-sm">Loading  Applications...</p>
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
                      onStatusChange={handleAppStatusChange}
                      onViewProfile={onViewProfile}
                      selectedApplicants={selectedApplicants}
                      toggleApplicant={toggleApplicant}
                    />
                  ))}

                  <ApplicantActionBar
                  selectedApplicants={selectedApplicants}
                  onSendInvite={sendBulkInvites}
                  onBulkStatusChange={openBulkStatusModal}
                  clearSelection={clearSelection}
                 />

                 <BulkStatusModal
                 isOpen={isBulkStatusModalOpen}
                 onClose={() => setIsBulkStatusModalOpen(false)}
                 onSubmit={handleBulkStatusChange}
                />

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
      {isInterviewModalOpen && (
        <InterviewInviteModal
          isOpen={isInterviewModalOpen}
          onClose={() => setIsInterviewModalOpen(false)}
          selectedApplicants={selectedApplicants}
          jobId={jobDetails?.id || ""}
        />
      )}
    </div>
  );
};

export default JobApplicantsPage;