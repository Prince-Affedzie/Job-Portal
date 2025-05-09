import React from "react";
import { FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import { ImageWithFallback, formatDate } from "./Utils";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from 'react-router-dom';


const ApplicantCard = ({ applicant, selectedApplicants, toggleApplicant, onStatusChange }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/employer/job/applicantprofile', { state: { applicant } });
  };

  return (
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
          <span className="emp-metric-label">Applied On</span>
          <span className="emp-metric-value">
            <FaCalendarAlt /> {formatDate(applicant.dateApplied)}
          </span>
        </div>
      </div>

      <div className="emp-applicant-footer">
        <div className="emp-applicant-actions">
          <button className="emp-action-btn emp-view-profile-btn" onClick={handleNavigation}>
            View More
          </button>
          <label className="emp-checkbox-label">
            <input
              type="checkbox"
              checked={selectedApplicants.includes(applicant.userId)}
              onChange={() => toggleApplicant(applicant.userId)}
            />
            <span className="emp-checkbox-text">Select to send Interview Invite</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;
