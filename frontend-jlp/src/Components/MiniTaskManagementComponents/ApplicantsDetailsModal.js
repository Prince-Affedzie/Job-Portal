import React from "react";
import './minitaskmanagementcss/ApplicantsModal.css';

const ApplicantDetailModal = ({ applicant, onClose }) => {
  return (
    <div className="applicants-modal-overlay">
      <div className="applicants-modal-box">
        <h3>Applicant Details</h3>
        <p><strong>Name:</strong> {applicant.name}</p>
        <p><strong>Email:</strong> {applicant.email}</p>
        <p><strong>Phone:</strong> {applicant.phone}</p>
        {applicant.Bio && <p><strong>Bio:</strong> {applicant.Bio}</p>}
        {applicant.skills && (
          <p><strong>Skills:</strong> {applicant.skills.join(", ")}</p>
        )}
        {applicant.resume && (
          <p>
            <strong>Resume:</strong>{" "}
            <a href={applicant.resume} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </p>
        )}
        {applicant.dateApplied && (
          <p><strong>Applied On:</strong> {new Date(applicant.dateApplied).toLocaleDateString()}</p>
        )}

        <button className="applicants-modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ApplicantDetailModal;
