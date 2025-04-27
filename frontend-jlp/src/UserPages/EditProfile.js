import { useState, useEffect, useContext } from "react";
import { FaEdit, FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import { userContext } from "../Context/FetchUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/EditProfile.css";
import { modifyProfile } from "../APIS/API";
import Navbar from "../Components/MyComponents/Navbar";
import Footer from "../Components/MyComponents/Footer";
import ProcessingOverlay from "../Components/MyComponents/ProcessingOverLay";

const EditProfile = () => {
  const { user, setUser, fetchUserInfo, loading, setLoading } = useContext(userContext);
  const [editSection, setEditSection] = useState(null); // 'basic', 'skills', 'education', 'experience'
  const [previewImage, setPreviewImage] = useState(null);
  const [isProcessing,setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    skills: [],
    education: [],
    workExperience: [],
    profileImage: "",
    Bio: "",
    location: { region: "", city: "", town: "", street: "" },
    businessName: "",
    businessRegistrationProof: "",
  });

  // For modals
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'skills', 'education', 'work'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: "", index: null });
  
  // Initialize profile data from user context when available
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (fetchUserInfo) {
          await fetchUserInfo();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        ...user,
        location: { ...prev.location, ...user.location },
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleAddItem = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleSaveModalData = (data) => {
    if (modalType === "work") {
      setFormData(prev => ({
        ...prev,
        workExperience: [...prev.workExperience, data],
      }));
    } else if (modalType === "education") {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, data],
      }));
    } else if (modalType === "skills") {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, data],
      }));
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = (type, index) => {
    setDeleteTarget({ type, index });
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (deleteTarget.index !== null) {
      setFormData((prev) => ({
        ...prev,
        [deleteTarget.type]: prev[deleteTarget.type].filter((_, i) => i !== deleteTarget.index),
      }));
    }
    setDeleteModalOpen(false);
  };

  const saveChanges = async () => {
    try {
      setIsProcessing(true)
      const response = await modifyProfile(formData);
      if (response.status === 200) {
        toast.success("Profile Update Successful");
        setEditSection(null);
      } else {
        toast.error("An error occurred. Please try again later");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    }finally{
      setIsProcessing(false)
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="emp-profile__loading">
      <div className="emp-profile__loading-spinner">
        <FaSpinner className="emp-profile__spinner-icon" />
      </div>
      <p className="emp-profile__loading-text">Loading profile information...</p>
    </div>
  );

  // Error display component
  const ErrorDisplay = () => (
    <div className="emp-profile__error">
      <p>There was an error loading your profile. Please try again later.</p>
      <button 
        className="emp-profile__retry-btn" 
        onClick={() => fetchUserInfo && fetchUserInfo()}
      >
        Retry
      </button>
    </div>
  );

  // Modal component
  const Modal = ({ type, onClose, onSave }) => {
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

  if (loading) {
    return (
      <div className="emp-profile__page">
        <Navbar />
        <div className="emp-profile__container">
          <h2 className="emp-profile__title">Edit Profile</h2>
          <LoadingSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  // If user data failed to load or is empty
  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="emp-profile__page">
        <Navbar />
        <div className="emp-profile__container">
          <h2 className="emp-profile__title">Edit Profile</h2>
          <ErrorDisplay />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="emp-profile__page">
      <ToastContainer />
      <Navbar />

      <div className="emp-profile__container">
        <h2 className="emp-profile__title">Edit Profile</h2>

        {/* Profile Image */}
        <div className="emp-profile__image-section">
          <img
            src={
              previewImage ||
              (formData.profileImage ? formData.profileImage : '/default-avatar.png')
            }
            alt="Profile"
            className="emp-profile__avatar"
            onError={(e) => {
              e.target.src = '/default-avatar.png'; // Fallback image on error
              e.target.onerror = null; // Prevent infinite loop
            }}
          />
          <div className="emp-profile__upload-wrapper">
            <input 
              type="file" 
              id="profile-image" 
              className="emp-profile__file-input" 
              accept="image/*" 
              onChange={handleProfileImageChange} 
            />
            <label htmlFor="profile-image" className="emp-profile__upload-btn">
              Change Profile Picture
            </label>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="emp-profile__sections-wrapper">
          {/* Basic Info Section */}
          <div className="emp-profile__section">
            <div className="emp-profile__section-header">
              <h3 className="emp-profile__section-title">Basic Info</h3>
              {editSection !== "basic" ? (
                <FaEdit onClick={() => setEditSection("basic")} className="emp-profile__edit-icon" />
              ) : (
                <div className="emp-profile__action-icons">
                  <FaSave onClick={saveChanges} className="emp-profile__save-icon" />
                  <FaTimes onClick={() => setEditSection(null)} className="emp-profile__cancel-icon" />
                </div>
              )}
            </div>

            <div className="emp-profile__section-content">
              {editSection === "basic" ? (
                <div className="emp-profile__form-group">
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="emp-profile__input" 
                      value={formData.name || ""} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Email</label>
                    <input 
                      type="email" 
                      className="emp-profile__input emp-profile__input--disabled" 
                      value={formData.email || ""} 
                      disabled 
                    />
                  </div>
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Phone</label>
                    <input 
                      type="text" 
                      name="phone" 
                      className="emp-profile__input" 
                      value={formData.phone || ""} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Bio</label>
                    <textarea 
                      name="Bio" 
                      className="emp-profile__textarea" 
                      value={formData.Bio || ""} 
                      onChange={handleChange}
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="emp-profile__details">
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Name:</span> 
                    <span className="emp-profile__detail-value">{formData.name || "N/A"}</span>
                  </p>
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Email:</span> 
                    <span className="emp-profile__detail-value">{formData.email || "N/A"}</span>
                  </p>
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Phone:</span> 
                    <span className="emp-profile__detail-value">{formData.phone || "N/A"}</span>
                  </p>
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Bio:</span> 
                    <span className="emp-profile__detail-value">{formData.Bio || "N/A"}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Location Info Section */}
          <div className="emp-profile__section">
            <div className="emp-profile__section-header">
              <h3 className="emp-profile__section-title">Location</h3>
              {editSection !== "location" ? (
                <FaEdit onClick={() => setEditSection("location")} className="emp-profile__edit-icon" />
              ) : (
                <div className="emp-profile__action-icons">
                  <FaSave onClick={saveChanges} className="emp-profile__save-icon" />
                  <FaTimes onClick={() => setEditSection(null)} className="emp-profile__cancel-icon" />
                </div>
              )}
            </div>

            <div className="emp-profile__section-content">
              {editSection === "location" ? (
                <div className="emp-profile__form-group">
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Region</label>
                    <input
                      type="text"
                      className="emp-profile__input"
                      value={formData.location?.region || ""}
                      onChange={(e) => handleLocationChange("region", e.target.value)}
                      placeholder="Region"
                    />
                  </div>
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">City</label>
                    <input
                      type="text"
                      className="emp-profile__input"
                      value={formData.location?.city || ""}
                      onChange={(e) => handleLocationChange("city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Street</label>
                    <input
                      type="text"
                      className="emp-profile__input"
                      value={formData.location?.street || ""}
                      onChange={(e) => handleLocationChange("street", e.target.value)}
                      placeholder="Street"
                    />
                  </div>
                  <div className="emp-profile__input-group">
                    <label className="emp-profile__label">Town</label>
                    <input
                      type="text"
                      className="emp-profile__input"
                      value={formData.location?.town || ""}
                      onChange={(e) => handleLocationChange("town", e.target.value)}
                      placeholder="Town"
                    />
                  </div>
                </div>
              ) : (
                <div className="emp-profile__details">
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Region:</span> 
                    <span className="emp-profile__detail-value">{formData.location?.region || "N/A"}</span>
                  </p>
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">City:</span> 
                    <span className="emp-profile__detail-value">{formData.location?.city || "N/A"}</span>
                  </p>
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Street:</span> 
                    <span className="emp-profile__detail-value">{formData.location?.street || "N/A"}</span>
                  </p>
                  <p className="emp-profile__detail-item">
                    <span className="emp-profile__detail-label">Town:</span> 
                    <span className="emp-profile__detail-value">{formData.location?.town || "N/A"}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="emp-profile__section">
            <div className="emp-profile__section-header">
              <h3 className="emp-profile__section-title">Skills</h3>
              {editSection !== "skills" ? (
                <FaEdit onClick={() => setEditSection("skills")} className="emp-profile__edit-icon" />
              ) : (
                <div className="emp-profile__action-icons">
                  <FaSave onClick={saveChanges} className="emp-profile__save-icon" />
                  <FaTimes onClick={() => setEditSection(null)} className="emp-profile__cancel-icon" />
                </div>
              )}
            </div>

            <div className="emp-profile__section-content">
              {editSection === "skills" ? (
                <div className="emp-profile__form-group">
                  <div className="emp-profile__skills-list">
                    {formData.skills && formData.skills.length > 0 ? (
                      formData.skills.map((skill, index) => (
                        <div key={index} className="emp-profile__skill-item">
                          <span className="emp-profile__skill-text">{skill}</span>
                          <button 
                            type="button"
                            className="emp-profile__skill-remove" 
                            onClick={() => handleConfirmDelete("skills", index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="emp-profile__no-items">No skills added yet.</p>
                    )}
                  </div>
                  <button 
                    type="button"
                    className="emp-profile__add-btn" 
                    onClick={() => handleAddItem("skills")}
                  >
                    + Add Skill
                  </button>
                </div>
              ) : (
                <div className="emp-profile__details">
                  {formData.skills && formData.skills.length > 0 ? (
                    <div className="emp-profile__skills-display">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="emp-profile__skill-badge">{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="emp-profile__no-items">No skills added yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="emp-profile__section">
            <div className="emp-profile__section-header">
              <h3 className="emp-profile__section-title">Education</h3>
              {editSection !== "education" ? (
                <FaEdit onClick={() => setEditSection("education")} className="emp-profile__edit-icon" />
              ) : (
                <div className="emp-profile__action-icons">
                  <FaSave onClick={saveChanges} className="emp-profile__save-icon" />
                  <FaTimes onClick={() => setEditSection(null)} className="emp-profile__cancel-icon" />
                </div>
              )}
            </div>

            <div className="emp-profile__section-content">
              {editSection === "education" ? (
                <div className="emp-profile__form-group">
                  <div className="emp-profile__education-list">
                    {formData.education && formData.education.length > 0 ? (
                      formData.education.map((edu, index) => (
                        <div key={index} className="emp-profile__education-item">
                          <div className="emp-profile__education-details">
                            <strong>{edu.degree}</strong> at {edu.institution} ({edu.yearOfCompletion})
                          </div>
                          <button 
                            type="button"
                            className="emp-profile__education-remove" 
                            onClick={() => handleConfirmDelete("education", index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="emp-profile__no-items">No education added yet.</p>
                    )}
                  </div>
                  <button 
                    type="button"
                    className="emp-profile__add-btn" 
                    onClick={() => handleAddItem("education")}
                  >
                    + Add Education
                  </button>
                </div>
              ) : (
                <div className="emp-profile__details">
                  {formData.education && formData.education.length > 0 ? (
                    formData.education.map((edu, index) => (
                      <div key={index} className="emp-profile__detail-card">
                        <p className="emp-profile__detail-title">{edu.degree}</p>
                        <p className="emp-profile__detail-subtitle">{edu.institution}</p>
                        <p className="emp-profile__detail-meta">{edu.yearOfCompletion}</p>
                      </div>
                    ))
                  ) : (
                    <p className="emp-profile__no-items">No education history available.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="emp-profile__section">
            <div className="emp-profile__section-header">
              <h3 className="emp-profile__section-title">Work Experience</h3>
              {editSection !== "experience" ? (
                <FaEdit onClick={() => setEditSection("experience")} className="emp-profile__edit-icon" />
              ) : (
                <div className="emp-profile__action-icons">
                  <FaSave onClick={saveChanges} className="emp-profile__save-icon" disabled={isProcessing} />
                  <FaTimes onClick={() => setEditSection(null)} className="emp-profile__cancel-icon" />
                </div>
              )}
            </div>

            <div className="emp-profile__section-content">
              {editSection === "experience" ? (
                <div className="emp-profile__form-group">
                  <div className="emp-profile__work-list">
                    {formData.workExperience && formData.workExperience.length > 0 ? (
                      formData.workExperience.map((work, index) => (
                        <div key={index} className="emp-profile__work-item">
                          <div className="emp-profile__work-details">
                            <strong>{work.jobTitle}</strong> at {work.company}
                            <div className="emp-profile__work-dates">
                              {new Date(work.startDate).toLocaleDateString()} - 
                              {work.endDate ? new Date(work.endDate).toLocaleDateString() : "Present"}
                            </div>
                          </div>
                          <button 
                            type="button"
                            className="emp-profile__work-remove" 
                            onClick={() => handleConfirmDelete("workExperience", index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="emp-profile__no-items">No work experience added yet.</p>
                    )}
                  </div>
                  <button 
                    type="button"
                    className="emp-profile__add-btn" 
                    onClick={() => handleAddItem("work")}
                  >
                    + Add Work Experience
                  </button>
                </div>
              ) : (
                <div className="emp-profile__details">
                  {formData.workExperience && formData.workExperience.length > 0 ? (
                    formData.workExperience.map((work, index) => (
                      <div key={index} className="emp-profile__detail-card">
                        <p className="emp-profile__detail-title">{work.jobTitle}</p>
                        <p className="emp-profile__detail-subtitle">{work.company}</p>
                        <p className="emp-profile__detail-meta">
                          {new Date(work.startDate).toLocaleDateString()} - 
                          {work.endDate ? new Date(work.endDate).toLocaleDateString() : "Present"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="emp-profile__no-items">No work experience available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Adding Skills, Education, or Experience */}
      {isModalOpen && (
        <Modal 
          type={modalType} 
          onClose={() => setModalOpen(false)} 
          onSave={handleSaveModalData}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="emp-profile__modal-overlay">
          <div className="emp-profile__delete-modal">
            <p className="emp-profile__delete-message">Are you sure you want to delete this item?</p>
            <div className="emp-profile__delete-actions">
              <button 
                className="emp-profile__delete-confirm" 
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button 
                className="emp-profile__delete-cancel" 
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ProcessingOverlay show={isProcessing} message="Submitting your Changes..." />
      <Footer />
    </div>
  );
};

export default EditProfile;