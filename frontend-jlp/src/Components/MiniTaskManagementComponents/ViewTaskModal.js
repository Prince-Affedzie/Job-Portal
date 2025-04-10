// components/ViewTaskModal.js
import React from "react";
import { FaTimes } from "react-icons/fa";
import "./minitaskmanagementcss/ViewTaskModal.css"


const ViewTaskModal = ({ task, onClose,isOpen }) => {
  
  if (!isOpen) return null;

  if (!task) return null;

  return (
    <div className="view-task-modal-overlay" onClick={onClose}>
      <div className="view-task-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="view-task-modal-header">
          <h2>{task.title}</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Task Details */}
        <div className="view-task-modal-content">
          <p><strong>Description: </strong>{task.description}</p>
          <p><strong>Budget:</strong> ${task.budget}</p>
          <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Location Type:</strong> {task.locationType}</p>
          <p><strong>Applicants:</strong> {task.applicants.length}</p>


          {/* Skills Required */}
          <div className="view-task-skills">
            <strong>Skills Required:</strong>
            <ul>
              {task.skillsRequired.map((skill, index) => (
                <li key={index} className="view-skill-badge">{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;