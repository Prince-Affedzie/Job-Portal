import React, { useState } from "react";
import {Link} from 'react-router-dom'
import './minitaskmanagementcss/ApplicantsPage.css';
import ApplicantDetailModal from './ApplicantsDetailsModal';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import { assignApplicantToTask } from "../../APIS/API";
import Navbar from "../Common/Navbar";
import ProcessingOverlay from "../Common/ProcessingOverLay";
import StartChatButton from "../MessagingComponents/StartChatButton";

const ApplicantsPage = () => {
  const { taskId } = useParams();
  const { state } = useLocation();
  const { applicants, assignedTo } = state || { applicants: [], assignedTo: null };

  const [assignedApplicant, setAssignedApplicant] = useState(assignedTo);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastApplicant = currentPage * itemsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - itemsPerPage;
  const currentApplicants = applicants.slice(indexOfFirstApplicant, indexOfLastApplicant);
  const totalPages = Math.ceil(applicants.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAssignApplicant = async (taskId, id, name) => {
    try {
      setIsProcessing(true);
      const updatedTask = await assignApplicantToTask(taskId, id);
      if (updatedTask.status === 200) {
        toast.success(`Mini Task Assigned To ${name}`);
        setAssignedApplicant(applicants.find(a => a._id === id));
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

  const handleReassign = () => {
    setAssignedApplicant(null);
    toast.info("You can now reassign the task to someone else.");
  };

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="applicants-page-container">
        <div className="mini-applicants-page-header">
          <h2>Applicants</h2>

          {assignedApplicant && (
            <div className="app-assigned-info">
              <p><strong>Task assigned to:</strong> {assignedApplicant.name}</p>
              <button className="app-reassign-btn" onClick={handleReassign}>Reassign</button>
            </div>
          )}
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
                    <div className="action-buttons">
                  {/* Assign button only shows if no one is assigned, or if reassignment is active */}

                  <Link 
                   to={`/applicants/${applicant._id}`}
                   state={{ applicant }} // Pass the full applicant data
                   className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition-colors"
                    >
                     View Profile
                 </Link>
                {!assignedApplicant && (
                 <button
                 className="assign-btn"
                 onClick={() => handleAssignApplicant(taskId, applicant._id, applicant.name)}
                 disabled={isProcessing}
                >
               Assign
              </button>
              )}
      
          {/* Chat button only shows for assigned applicant */}
                 { assignedTo && applicant._id.toString() === assignedTo._id.toString() && (
                <StartChatButton
                 userId2={applicant._id}
                 jobId={taskId}
                 className="chat-btn"
               />
              )}
             </div>

                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No applicants for this task yet. Check back later.</p>
        )}

        {/* Pagination Controls */}
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

        {/* Modal */}
        {selectedApplicant && (
          <ApplicantDetailModal
            applicant={selectedApplicant}
            onClose={() => setSelectedApplicant(null)}
          />
        )}
      </div>
       <ProcessingOverlay show={isProcessing} message="Assigning Applicant..." />
    </div>
  );
};

export default ApplicantsPage;
