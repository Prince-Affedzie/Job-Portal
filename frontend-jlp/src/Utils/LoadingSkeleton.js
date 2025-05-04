import { FaEdit, FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import {useState} from 'react'

export const LoadingSkeleton = () => (
  <div className="emp-profile__loading">
    <div className="emp-profile__loading-spinner">
      <FaSpinner className="emp-profile__spinner-icon" />
    </div>
    <p className="emp-profile__loading-text">Loading profile information...</p>
  </div>
);


export  const Modal = ({ type, onClose, onSave }) => {
    const [formData, setFormData] = useState({});

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(type === "skills" ? formData.skill : formData);
    };

    return (
      <div className="emp-profile__modal-overlay">
        <div className="emp-profile__modal">
          <div className="emp-profile__modal-header">
            <h3>{type === "skills" ? "Add Skill" : type === "education" ? "Add Education" : "Add Work Experience"}</h3>
            <FaTimes onClick={onClose} className="emp-profile__modal-close" />
          </div>
          <form onSubmit={handleSubmit} className="emp-profile__modal-form">
            {type === "skills" && (
              <div className="emp-profile__modal-form-group">
                <label className="emp-profile__modal-label">Skill</label>
                <input
                  type="text"
                  name="skill"
                  className="emp-profile__modal-input"
                  placeholder="Enter skill"
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {type === "education" && (
              <>
                <div className="emp-profile__modal-form-group">
                  <label className="emp-profile__modal-label">Institution</label>
                  <input
                    type="text"
                    name="institution"
                    className="emp-profile__modal-input"
                    placeholder="Institution name"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="emp-profile__modal-form-group">
                  <label className="emp-profile__modal-label">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    className="emp-profile__modal-input"
                    placeholder="Degree obtained"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="emp-profile__modal-form-group">
                  <label className="emp-profile__modal-label">Year of Completion</label>
                  <input
                    type="text"
                    name="yearOfCompletion"
                    className="emp-profile__modal-input"
                    placeholder="Year completed"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}

            {type === "work" && (
              <>
                <div className="emp-profile__modal-form-group">
                  <label className="emp-profile__modal-label">Company</label>
                  <input
                    type="text"
                    name="company"
                    className="emp-profile__modal-input"
                    placeholder="Company name"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="emp-profile__modal-form-group">
                  <label className="emp-profile__modal-label">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    className="emp-profile__modal-input"
                    placeholder="Your position"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="emp-profile__modal-form-group">
                  <label className="emp-profile__modal-label">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    className="emp-profile__modal-input"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="emp-profile__modal-form-group">
                  <label className="emp-profile__modal-label">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    className="emp-profile__modal-input"
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            <div className="emp-profile__modal-actions">
              <button type="button" className="emp-profile__modal-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="emp-profile__modal-save">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
