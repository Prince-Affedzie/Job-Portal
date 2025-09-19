import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaFileAlt, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../Styles/JobApplicantsPage.css'

import Sidebar from "../../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../../Components/EmployerDashboard/EmployerNavbar";

import InterviewInviteModal from "../../Components/EmployerDashboard/InterviewInviteModal";
import BulkStatusModal from "../../Components/EmployerDashboard/BulkStatusUpdateModal";

// Import components
import JobDetailsSummary from "../../Components/EmployerDashboard/JobSummary";
import { ApplicantActionBar } from "../../Components/EmployerDashboard//ApplicantsCard";
import ApplicantsControls from "../../Components/EmployerDashboard//ApplicantsControl";
import StatusStats from "../../Components/EmployerDashboard/StatusStats";
import ApplicantCard from "../../Components/EmployerDashboard/ApplicantsCard";
import Pagination from "../../Components/EmployerDashboard/Pagination";
import { useApplicantsFiltering } from "../../Components/EmployerDashboard/ApplicantFiltering";
import { useApplicantsManager } from "../../Components/EmployerDashboard/useApplicantsManager";


// Main component
const JobApplicantsPage = () => {
  const { Id } = useParams();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isBulkStatusModalOpen, setIsBulkStatusModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  
  // custom hooks
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
    scoreFilters, 
    setScoreFilters,
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
                scoreFilters={ scoreFilters}
                setScoreFilters={setScoreFilters}
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