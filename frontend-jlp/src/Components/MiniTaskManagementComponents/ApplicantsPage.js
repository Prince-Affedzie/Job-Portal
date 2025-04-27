import React, { useState } from "react";
import './minitaskmanagementcss/ApplicantsPage.css'; // Your updated CSS file
import ApplicantDetailModal from './ApplicantsDetailsModal';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import { assignApplicantToTask } from "../../APIS/API";
import Navbar from "../MyComponents/Navbar";
import ProcessingOverlay from "../MyComponents/ProcessingOverLay";


const ApplicantsPage = () => {
  const {taskId} = useParams()
  const { state } = useLocation();
  const { applicants } = state || { applicants: [] }; 
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of applicants to display per page

  // Get the index of the first and last item on the current page
  const indexOfLastApplicant = currentPage * itemsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - itemsPerPage;
  const currentApplicants = applicants.slice(indexOfFirstApplicant, indexOfLastApplicant);

  // Calculate the total number of pages
  const totalPages = Math.ceil(applicants.length / itemsPerPage);

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAssignApplicant = async (taskId, id, name) => {
      try {
        setIsProcessing(true);
        const updatedTask = await assignApplicantToTask(taskId, id);
        if (updatedTask.status === 200) {
          toast.success(`Mini Task Assigned To ${name}`);
          
        } else {
          toast.error("Couldn't Assign Task. Please Try Again");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "An unexpected error occurred. Please try again.";
        console.log(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    };
  

  return (
    <div>
      <ToastContainer/>
       <Navbar/>
    <div className="applicants-page-container">
     
      <div className="applicants-page-header">
        <h2>Applicants</h2>
      </div>

      {currentApplicants && currentApplicants.length > 0 ? (
        <div className="mini-list">
          {currentApplicants.map((applicant, idx) => (
            <div key={idx} className="mini-list-item">
              <div className="applicant-info">
                <div className="applicant-header">
                  <img
                    src={applicant.profileImage || "/default-profile.png"}
                    alt="Profile"
                    className="applicant-image"
                  />
                  <div>
                    <strong>{applicant.name}</strong> — {applicant.phone}
                  </div>
                  <div>
                    <strong>Skills:</strong>
                    <div className="skills-list">
                      {applicant.skills && applicant.skills.length > 0 ? (
                        applicant.skills.map((skill, i) => (
                          <span key={i} className="skill-tag">{skill}</span>
                        ))
                      ) : (
                        <span className="skill-tag">None listed</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="applicant-location">
                  <strong>Location:</strong> {applicant.location?.region || 'N/A'}, {applicant.location?.city || 'N/A'}, {applicant.location?.town || 'N/A'}, {applicant.location?.street || 'N/A'}
                </div>
                <div className="verification-status">
                  {applicant.isVerified ? (
                    <span className="verified-badge">Verified</span>
                  ) : (
                    <span className="not-verified-badge">Not Verified</span>
                  )}
                   <div class="assign-button-wrapper">
                  <button class="assign-btn" 
                    onClick={()=>handleAssignApplicant(taskId,applicant._id,applicant.name)}
                    disabled={isProcessing}
                   >
                    Assign
                    </button>
                  </div>
                  <ProcessingOverlay show={isProcessing} message=" Assigning Applicant..." />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No applicants for this task yet. Check back later.</p>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <span className="page-number">Page {currentPage} of {totalPages}</span>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {selectedApplicant && (
        <ApplicantDetailModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
        />
      )}
    </div>
    
    </div>
  );
};

export default ApplicantsPage;