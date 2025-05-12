import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/MiniTaskForm.css";
import { postMiniTask } from "../APIS/API";
import Navbar from "../Components/MyComponents/Navbar";
import Footer from "../Components/MyComponents/Footer";
import ProcessingOverlay from "../Components/MyComponents/ProcessingOverLay";
import VerifyTooltip from "../Components/MyComponents/VerifyToolTip";
import { userContext } from "../Context/FetchUser";

const PostMiniTask = () => {
   const { user, fetchUserInfo, fetchRecentApplications, recentApplications, minitasks } = useContext(userContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    locationType: "remote",
    category: "",
    subcategory: "",
    address: { region: "", city: "", suburb: "" },
    skillsRequired: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = {
    "Creative Tasks": ["Graphic Design", "Video Editing", "Flyer Design", "Poster Design", "Logo Design", "Voice Over"],
    "Delivery & Errands": ["Package Delivery", "Grocery Shopping", "Laundry", "Line Waiting"],
    "Digital Services": ["Data Entry", "Virtual Assistant", "Social Media Help", "Online Research"],
    "Event Support": ["Decoration", "Photography", "Setup Assistance"],
    "Home Services": ["Cleaning", "Home Repair", "Plumbing", "Electrical", "Painting", "Gardening", "Furniture Assembly"],
    "Learning & Tutoring": ["Online Tutoring", "Homework Help", "Language Teaching", "Career Mentoring"],
    "Writing & Assistance": ["Blog Writing", "Copywriting", "Content Writing", "Resume/CV Writing", "Transcription", "Survey Participation"],
    "Others": ["Miscellaneous"]
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({
      ...formData,
      category: selectedCategory,
      subcategory: "", // reset subcategory
    });
  };
  
  const handleSubcategoryChange = (e) => {
    setFormData({
      ...formData,
      subcategory: e.target.value,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      address: { ...formData.address, [e.target.name]: e.target.value },
    });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, skillInput.trim()] });
      setSkillInput(""); // Clear input after adding
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.budget <= 0) {
      toast.error("Budget must be a positive number.");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await postMiniTask(formData);

      if (response.status === 200) {
        toast.success("Mini Task Posted Successfully");
        navigate("/mini_task/listings");
      } else {
        toast.error(response.error || "Couldn't Post Mini Task");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mtask-page-wrapper">
      <ToastContainer />
      <Navbar />
      {
              user && <VerifyTooltip isVerified ={user.isVerified}/>
               }
      <div className="mtask-primary-container">
         
        <div className="mtask-header-section">
          <h2 className="mtask-main-title">Post a Mini Task</h2>
          <p className="mtask-subtitle">Fill out the details below to post your task</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mtask-form-element">
          <div className="mtask-input-block">
            <label className="mtask-field-label">
              <span className="mtask-label-main">Task Title</span>
              <span className="mtask-label-helper">E.g., Fix Leaking Pipe, Design A Flyer</span>
            </label>
            <input 
              type="text" 
              name="title" 
              className="mtask-text-input"
              placeholder="Enter task title..." 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mtask-input-block">
            <label className="mtask-field-label">
              <span className="mtask-label-main">Description</span>
              <span className="mtask-label-helper">Provide a clear task explanation</span>
            </label>
            <textarea
              name="description"
              className="mtask-textarea-input"
              placeholder="Describe the task in detail..."
              value={formData.description}
              onChange={(e) => {
                setCharCount(e.target.value.length);
                handleChange(e);
              }}
              required
            />
            <div className="mtask-character-counter">
              <span className={charCount > 400 ? "mtask-count-warning" : ""}>{charCount}</span>/500 characters
            </div>
          </div>

          <div className="mtask-dual-columns">
            <div className="mtask-input-block">
              <label className="mtask-field-label">
                <span className="mtask-label-main">Budget (₵)</span>
                <span className="mtask-label-helper">E.g., 50, 100, 200</span>
              </label>
              <input
                type="number"
                name="budget"
                className="mtask-text-input"
                placeholder="Enter budget..."
                value={formData.budget}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="mtask-input-block">
              <label className="mtask-field-label">
                <span className="mtask-label-main">Deadline</span>
                <span className="mtask-label-helper">Choose a future date</span>
              </label>
              <input
                type="date"
                name="deadline"
                className="mtask-date-input"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div className="mtask-dual-columns">
            <div className="mtask-input-block">
              <label className="mtask-field-label">
                <span className="mtask-label-main">Category</span>
              </label>
              <select
                name="category"
                className="mtask-select-input"
                value={formData.category}
                onChange={handleCategoryChange}
                required
              >
                <option value="">-- Select Category --</option>
                {Object.keys(categories).map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mtask-input-block">
              <label className="mtask-field-label">
                <span className="mtask-label-main">Subcategory</span>
              </label>
              <select
                name="subcategory"
                className="mtask-select-input"
                value={formData.subcategory}
                onChange={handleSubcategoryChange}
                required
                disabled={!formData.category}
              >
                <option value="">-- Select Subcategory --</option>
                {formData.category && categories[formData.category].map((sub, idx) => (
                  <option key={idx} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mtask-input-block">
            <label className="mtask-field-label">
              <span className="mtask-label-main">Location Type</span>
            </label>
            <div className="mtask-toggle-container">
              <button 
                type="button" 
                className={`mtask-toggle-btn ${formData.locationType === "remote" ? "mtask-toggle-active" : ""}`}
                onClick={() => setFormData({...formData, locationType: "remote"})}
              >
                Remote
              </button>
              <button 
                type="button" 
                className={`mtask-toggle-btn ${formData.locationType === "on-site" ? "mtask-toggle-active" : ""}`}
                onClick={() => setFormData({...formData, locationType: "on-site"})}
              >
                On-Site
              </button>
            </div>
          </div>

          {formData.locationType === "on-site" && (
            <div className="mtask-address-container">
              <h3 className="mtask-section-title">Address Details</h3>
              <div className="mtask-dual-columns">
                <div className="mtask-input-block">
                  <label className="mtask-field-label">
                    <span className="mtask-label-main">Region</span>
                  </label>
                  <input 
                    type="text" 
                    name="region" 
                    className="mtask-text-input"
                    placeholder="E.g., Greater Accra" 
                    value={formData.address.region} 
                    onChange={handleAddressChange} 
                    required 
                  />
                </div>
                <div className="mtask-input-block">
                  <label className="mtask-field-label">
                    <span className="mtask-label-main">City</span>
                  </label>
                  <input 
                    type="text" 
                    name="city" 
                    className="mtask-text-input"
                    placeholder="E.g., Accra" 
                    value={formData.address.city} 
                    onChange={handleAddressChange} 
                    required 
                  />
                </div>
              </div>
              <div className="mtask-input-block">
                <label className="mtask-field-label">
                  <span className="mtask-label-main">Suburb</span>
                </label>
                <input 
                  type="text" 
                  name="suburb" 
                  className="mtask-text-input"
                  placeholder="E.g., Madina" 
                  value={formData.address.suburb} 
                  onChange={handleAddressChange} 
                  required 
                />
              </div>
            </div>
          )}

          <div className="mtask-input-block">
            <label className="mtask-field-label">
              <span className="mtask-label-main">Skills Required</span>
              <span className="mtask-label-helper">Add at least one skill</span>
            </label>
            <div className="mtask-skills-input-group">
              <input 
                type="text" 
                className="mtask-text-input" 
                value={skillInput} 
                onChange={(e) => setSkillInput(e.target.value)} 
                placeholder="E.g., Content Creation, Data Entry, Electrical Wiring..." 
              />
              <button type="button" onClick={handleAddSkill} className="mtask-add-skill-button">
                Add
              </button>
            </div>
            <div className="mtask-skills-tag-container">
              {formData.skillsRequired.length === 0 ? (
                <p className="mtask-no-skills-message">No skills added yet</p>
              ) : (
                formData.skillsRequired.map((skill, index) => (
                  <div key={index} className="mtask-skill-badge">
                    {skill}
                    <button type="button" className="mtask-remove-skill-btn" onClick={() => handleRemoveSkill(skill)}>×</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button type="submit" className="mtask-submit-button" disabled={isProcessing}>
            {isProcessing ? "Posting..." : "Post Task"}
          </button>
        </form>
      </div>
      <Footer/>
      <ProcessingOverlay show={isProcessing} message="Submitting your MiniTask Posting..." />
    </div>
  );
};

export default PostMiniTask;