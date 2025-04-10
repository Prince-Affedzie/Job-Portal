// components/Modals/ApplicantInfoModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../Styles/ApplicantInfoModal.css"; // create this file

const ApplicantInfoModal = ({ isOpen, onClose, applicant }) => {
  const navigate = useNavigate()

  const handleViewProfile = (user) => {
    navigate("/employer/applicant-profile", { state: { user } });
  };

  if (!isOpen || !applicant) return null;

  const { user, resume, _id } = applicant;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <h2>{user?.name}</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Skills:</strong> {user?.skills?.join(", ") || "Not provided"}</p>
        <p><strong>Education:</strong></p>
        <ul>
          {user?.education?.map((edu, idx) => (
            <li key={idx}>
              {edu.degree} from {edu.institution} ({edu.year})
            </li>
          )) || <li>Not provided</li>}
        </ul>

        <p><strong>Work Experience:</strong></p>
        <ul>
          {user?.workExperience?.map((exp, idx) => (
            <li key={idx}>
              {exp.role} at {exp.company} ({exp.duration})
            </li>
          )) || <li>Not provided</li>}
        </ul>

        <button className="view-profile-btn" onClick={() => handleViewProfile(user)}>
         <FaEye /> View Full Profile
        </button>
      </div>
    </div>
  );
};

export default ApplicantInfoModal;
