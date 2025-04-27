import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaEye, FaEnvelope, FaBan } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import "../Styles/Applicants.css";
import { getAllApplications, modifyApplication, manageInterviewInvite } from '../APIS/API';
import ApplicantInfoModal from '../Components/EmployerDashboard/ApplicantsInfoModal';

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [paginationStates, setPaginationStates] = useState({});
  const applicantsPerPage = 5;

  const [currentJobPage, setCurrentJobPage] = useState(1);
  const jobsPerPage = 3;

  const openModal = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApplicant(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await getAllApplications();
        if (response.status === 200) {
          setApplications(response.data);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const modifyAppStatus = async (id, status) => {
    try {
      const response = await modifyApplication(id, status);
      if (response.status === 200) {
        toast.success(`Application ${status.status} successfully`);
        setApplications(prev =>
          prev.map(app => app._id === id ? { ...app, status: status.status } : app)
        );
      } else {
        toast.error(response.errorMessage || `Oops! Couldn't finish operation.`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  const sendInterviewInvite = async (applicant) => {
    try {
      const interviewState = applicant.inviteForInterview === true ? false : true;
      const response = await manageInterviewInvite(applicant._id, interviewState);
      if (response.status === 200) {
        toast.success(`${interviewState ? 'Interview invitation sent' : 'Invitation withdrawn'} successfully`);
        setApplications(prev =>
          prev.map(app => app._id === applicant._id ? { ...app, inviteForInterview: interviewState } : app)
        );
      } else {
        toast.error(response.error || "Oops! An unknown error occurred.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  const groupedByJob = applications.reduce((acc, app) => {
    const jobId = app.job?._id;
    if (!jobId) return acc;
    if (!acc[jobId]) {
      acc[jobId] = {
        jobTitle: app.job.title,
        applicants: [],
      };
    }
    acc[jobId].applicants.push(app);
    return acc;
  }, {});

  const handlePageChange = (jobId, newPage) => {
    setPaginationStates(prev => ({
      ...prev,
      [jobId]: newPage,
    }));
  };

  // Page-level (job section) pagination
  const groupedEntries = Object.entries(groupedByJob);
  const totalJobPages = Math.ceil(groupedEntries.length / jobsPerPage);
  const startJobIndex = (currentJobPage - 1) * jobsPerPage;
  const endJobIndex = startJobIndex + jobsPerPage;
  const visibleJobSections = groupedEntries.slice(startJobIndex, endJobIndex);

  return (
    <div className="applicants-container">
      <ToastContainer />
      <EmployerNavbar />
      <Sidebar />

      <div className="applicants-content">
        <h2 className="page-title">Job Applicants</h2>

        {loading ? (
          <p>Loading...</p>
        ) : groupedEntries.length === 0 ? (
          <p className="no-applicants">No applicants found.</p>
        ) : (
          visibleJobSections.map(([jobId, { jobTitle, applicants }]) => {
            const currentPage = paginationStates[jobId] || 1;
            const totalPages = Math.ceil(applicants.length / applicantsPerPage);
            const indexOfLast = currentPage * applicantsPerPage;
            const indexOfFirst = indexOfLast - applicantsPerPage;
            const currentApplicants = applicants.slice(indexOfFirst, indexOfLast);

            return (
              <div key={jobId} className="job-section">
                <h3 className="job-title">{jobTitle}</h3>

                <div className="applicants-table-container">
                  <table className="applicants-table">
                    <thead>
                      <tr>
                        <th>Applicant Name</th>
                        <th>Email</th>
                        <th>Resume</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentApplicants.map((app) => (
                        <tr key={app._id}>
                          <td>{app.user?.name}</td>
                          <td>{app.user?.email}</td>
                          <td>
                            <a
                              href={`https://your-cdn-url.com/${app.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="view-btn"
                            >
                              <FaEye /> View
                            </a>
                          </td>
                          <td>
                            <span className={`status-badge status-${app.status.toLowerCase()}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="action-buttons">
                            <button onClick={() => openModal(app)} className="btn info-btn">
                              <FaEye /> View Profile
                            </button>
                            <button
                              className={`btn accept-btn ${app.status === "Accepted" ? "disabled" : ""}`}
                              onClick={() =>
                                app.status !== "Accepted" &&
                                modifyAppStatus(app._id, { status: "Accepted" })
                              }
                              disabled={app.status === "Accepted"}
                            >
                              <FaCheck /> Accept
                            </button>
                            <button
                              className="btn reject-btn"
                              onClick={() => modifyAppStatus(app._id, { status: "Rejected" })}
                            >
                              <FaTimes /> Reject
                            </button>
                            <button
                              className={`btn ${app.inviteForInterview ? "withdraw-btn" : "invite-btn"}`}
                              onClick={() => sendInterviewInvite(app)}
                            >
                              {app.inviteForInterview ? (
                                <>
                                  <FaBan style={{ marginRight: "5px" }} /> Withdraw Invite
                                </>
                              ) : (
                                <>
                                  <FaEnvelope style={{ marginRight: "5px" }} /> Invite for Interview
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination for applicants inside job */}
                {totalPages > 1 && (
                  <div className="pagination-controls">
                    <button
                      className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
                      onClick={() => handlePageChange(jobId, currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
                      onClick={() => handlePageChange(jobId, currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Pagination for job sections */}
        {totalJobPages > 1 && (
          <div className="pagination-controls page-level">
            <button
              className={`pagination-btn ${currentJobPage === 1 ? "disabled" : ""}`}
              onClick={() => setCurrentJobPage(currentJobPage - 1)}
              disabled={currentJobPage === 1}
            >
              ← Previous Jobs
            </button>
            <span className="pagination-info">
              Page {currentJobPage} of {totalJobPages}
            </span>
            <button
              className={`pagination-btn ${currentJobPage === totalJobPages ? "disabled" : ""}`}
              onClick={() => setCurrentJobPage(currentJobPage + 1)}
              disabled={currentJobPage === totalJobPages}
            >
              Next Jobs →
            </button>
          </div>
        )}

        <ApplicantInfoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          applicant={selectedApplicant}
        />
      </div>
    </div>
  );
};

export default Applicants;
