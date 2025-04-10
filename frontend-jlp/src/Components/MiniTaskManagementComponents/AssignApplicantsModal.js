// components/AssignApplicantModal.js
import React, { useState } from "react";
import './minitaskmanagementcss/AssignApplicantModal.css';

const AssignApplicantModal = ({task, applicants, onAssign, isOpen, onClose }) => {
  const [selected, setSelected] = useState("");

  const handleAssign = () => {
    if (selected) {
      onAssign(selected);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="assign-modal-overlay">
      <div className="assign-modal-box">
        <h3>Assign Task to Applicant</h3>
        {/* Assigned info */}
        {task?.assignedTo ? (
          <div className="already-assigned-msg">
            <p>
              <strong>This task is already assigned to:</strong><br />
              {task.assignedTo.name} ({task.assignedTo.email})
            </p>
          </div>
        ) : (
          <p className="not-assigned-msg">No one has been assigned to this task yet.</p>
        )}
        <label htmlFor="applicantSelect">Select an applicant:</label>
        <select
          id="applicantSelect"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">-- Choose an applicant --</option>
          {applicants.map((user, i) => (
            <option key={i} value={user._id}>
              {user.name} {user.isVerified && "✔"}
            </option>
          ))}
        </select>

        <div className="assign-modal-buttons">
          <button
            onClick={handleAssign}
            disabled={!selected}
            className="assign-btn"
          >
            Assign
          </button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AssignApplicantModal;
