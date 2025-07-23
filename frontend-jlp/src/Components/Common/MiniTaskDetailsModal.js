import React from "react";
import { FaTimes } from "react-icons/fa";
import moment from "moment";
import "../../Styles/MiniTaskDetailsModal.css";

const MiniTaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null; // Ensure the modal does not render without a task

  return (
    <div className="mini-task-modal-overlay" onClick={onClose}>
      <div className="mini-task-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mini-task-modal-header">
          <h2>{task.title}</h2>
          <button className="mini-task-modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Task Details */}
        <div className="mini-task-modal-content">
          <p className="task-description"><strong>Description: </strong>{task.description}</p>
          <p><strong>Employer:</strong> {task.employer.name}</p>
          <p><strong>Phone:</strong> {task.employer.phone}</p>
          <p><strong>Budget:</strong> ₵{task.budget}</p>
          <p><strong>Deadline:</strong> {moment(task.deadline).format("MMMM DD, YYYY")}</p>
          <p><strong>Status:</strong> {task.status}</p>

          {/* Location Type & Address */}
          <p><strong>Location Type:</strong> {task.locationType || 'N/A'}</p>
          {task.address && (
            <div className="task-address">
              <p><strong>Region:</strong> {task.address.region || "N/A"}</p>
              <p><strong>City:</strong> {task.address.city || "N/A"}</p>
              <p><strong>Suburb:</strong> {task.address.suburb || "N/A"}</p>
            </div>
          )}
          {/* Skills Required */}
          {task.skillsRequired && task.skillsRequired.length > 0 ? (
            <div className="mini-task-skills">
              <strong>Skills Required:</strong>
              <ul>
                {task.skillsRequired.map((skill, index) => (
                  <li key={index} className="mini-skill-badge">{skill}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p><strong>Skills Required:</strong> None specified</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniTaskDetailsModal;
