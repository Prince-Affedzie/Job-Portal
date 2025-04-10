import React, { useState } from "react";
import './minitaskmanagementcss/ApplicantsModal.css';
import ApplicantDetailModal from './ApplicantsDetailsModal';

const ApplicantsModal = ({ applicants, onClose, isOpen }) => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="applicants-modal-overlay">
      <div className="applicants-modal-box">
        <h3>Applicants</h3>
        {applicants.length > 0 ? (
          <ul>
            {applicants.map((applicant, idx) => (
              <li key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><strong>{applicant.name}</strong> — {applicant.email}</span>
                  {applicant.isVerified ? (
                  <span className="verified-badge">✔ Verified</span>
                    ) : (
                   <span className="not-verified-badge">✖ Not Verified</span>
                )}
                  <button 
                    className="view-details-btn" 
                    onClick={() => setSelectedApplicant(applicant)}
                  >
                    View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No applicants yet.</p>
        )}
        <button className="applicants-modal-close-btn" onClick={onClose}>Close</button>

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

export default ApplicantsModal;
