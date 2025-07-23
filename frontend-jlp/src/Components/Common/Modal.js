import { useState } from "react";
import "../Styles/Modal.css"; // Ensure you have styles for this modal

const Modal = ({ type, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    skill: "",
    degree: "",
    institution: "",
    yearOfCompletion: "",
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      if (type === "skills") {
        onSave(formData.skill); 
      } else {
        onSave(formData); 
      }
    }
    onClose(); // Close modal after saving
  };

  return (
    <div className="modify-modal-overlay">
      <div className="modify-modal-content">
        <h3>
          {type === "skills"
            ? "Add Skill"
            : type === "education"
            ? "Add Education"
            : "Add Work Experience"}
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Skill Input */}
          {type === "skills" && (
            <input className="input"
              type="text"
              name="skill"
              placeholder="Enter skill..."
              value={formData.skill}
              onChange={handleChange}
              required
            />
          )}

          {/* Education Inputs */}
          {type === "education" && (
            <>
              <input className="input"
                type="text"
                name="degree"
                placeholder="Degree (e.g., BSc Computer Science)"
                value={formData.degree}
                onChange={handleChange}
                required
              />
              <input className="input"
                type="text"
                name="institution"
                placeholder="Institution (e.g., Harvard University)"
                value={formData.institution}
                onChange={handleChange}
                required
              />
              <input className="input"
                type="number"
                name="yearOfCompletion"
                placeholder="Year of Completion"
                value={formData.yearOfCompletion}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* Work Experience Inputs */}
          {type === "work" && (
            <>
              <input className="input"
                type="text"
                name="jobTitle"
                placeholder="Job Title (e.g., Software Engineer)"
                value={formData.jobTitle}
                onChange={handleChange}
                required
              />
              <input className="input"
                type="text"
                name="company"
                placeholder="Company Name (e.g., Google)"
                value={formData.company}
                onChange={handleChange}
                required
              />
              <label>Start Date:</label>
              <input className="input"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <label>End Date (leave blank if current):</label>
              <input className="input"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </>
          )}

          <div className="modify-modal-actions">
            <button type="submit" className="modify-save-button">
              Save
            </button>
            <button type="button" className="modify-cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
