import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/MiniTaskForm.css";
import { postMiniTask } from "../APIS/API";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const PostMiniTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    locationType: "remote",
    category:"",
    subcategory:"",
    address: { region: "", city: "", suburb: "" },
    skillsRequired: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [charCount, setCharCount] = useState(0);

  const categories = {
    "Creative Tasks":["Graphic Design","Video Editing","Flyer Design","Poster Design","Logo Design","Voice Over"],
    "Delivery & Errands": ["Package Delivery", "Grocery Shopping", "Laundry","Line Waiting"],
    "Digital Services": ["Data Entry", "Virtual Assistant", "Social Media Help","Online Research",],
    "Event Support": ["Decoration", "Photography", "Setup Assistance"],
    "Home Services":["Cleaning","Home Repair","Plumbing","Electrical","Painting","Gardening","Furniture Assembly"],
    "Learning & Tutoring": ["Online Tutoring", "Homework Help", "Language Teaching","Career Mentoring"],
    "Writing & Assistance": ["Blog Writing", "Copywriting", "Content Writing","Resume/CV Writing","Transcription","Survey Participation"],
    "Others":["Miscellaneous","Miscellaneous"]
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

  // 📌 Handle adding skills
  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, skillInput.trim()] });
      setSkillInput(""); // Clear input after adding
    }
  };

  // 📌 Remove skill from list
  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter((s) => s !== skill),
    });
  };

  // 📌 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent posting if budget is invalid
    if (formData.budget <= 0) {
      toast.error("Budget must be a positive number.");
      return;
    }

    try {
      const response = await postMiniTask(formData);

      if (response.status === 200) {
        toast.success("Mini Task Posted Successfully");
        navigate("/job/listings");
      } else {
        toast.error("Couldn't Post Mini Task");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="post-task-container">
      <h2 className="post-task-title">Post a Mini Task</h2>
      <form onSubmit={handleSubmit} className="post-task-form">
        {/* Title */}
        <label className="post-task-label">Task Title <span className="hint">(E.g., Fix Leaking Pipe, Install CCTV)</span></label>
        <input type="text" name="title" className="post-task-input" placeholder="Enter task title..." value={formData.title} onChange={handleChange} required />

        {/* Description */}
        <label className="post-task-label">Description <span className="hint">(Provide a clear task explanation)</span></label>
        <textarea
          name="description"
          className="post-task-textarea"
          placeholder="Describe the task in detail..."
          value={formData.description}
          onChange={(e) => {
            setCharCount(e.target.value.length);
            handleChange(e);
          }}
          required
        />
        <p className="char-count">{charCount}/500 characters</p>

        {/* Budget */}
        <label className="post-task-label">Budget ($) <span className="hint">(E.g., 50, 100, 200)</span></label>
        <input
          type="number"
          name="budget"
          className="post-task-input"
          placeholder="Enter budget..."
          value={formData.budget}
          onChange={handleChange}
          min="1"
          required
        />

        {/* Deadline */}
        <label className="post-task-label">Deadline <span className="hint">(Choose a future date)</span></label>
        <input
          type="date"
          name="deadline"
          className="post-task-input"
          value={formData.deadline}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]} // Prevents past dates
          required
        />

        {/* Category */}
      <label className="post-task-label">Category</label>
      <select
       name="category"
       className="post-task-select"
       value={formData.category}
       onChange={handleCategoryChange}
      required
      >
     <option value="">-- Select Category --</option>
     {Object.keys(categories).map((cat, idx) => (
     <option key={idx} value={cat}>{cat}</option>
     ))}
     </select>

     {/* Subcategory */}
    {formData.category && (
     <>
    <label className="post-task-label">Subcategory</label>
    <select
      name="subcategory"
      className="post-task-select"
      value={formData.subcategory}
      onChange={handleSubcategoryChange}
      required
     >
      <option value="">-- Select Subcategory --</option>
      {categories[formData.category].map((sub, idx) => (
        <option key={idx} value={sub}>{sub}</option>
      ))}
    </select>
   </>
   )}


        {/* Location Type */}
        <label className="post-task-label">Location Type</label>
        <select name="locationType" className="post-task-select" value={formData.locationType} onChange={handleChange} required>
          <option value="remote">Remote</option>
          <option value="on-site">On-Site</option>
        </select>

        {/* 📍 Address Fields (Only if on-site) */}
        {formData.locationType === "on-site" && (
          <div className="post-task-address">
            <label className="post-task-label">Region</label>
            <input type="text" name="region" className="post-task-input" placeholder="E.g., Greater Accra" value={formData.address.region} onChange={handleAddressChange} required />

            <label className="post-task-label">City</label>
            <input type="text" name="city" className="post-task-input" placeholder="E.g., Accra" value={formData.address.city} onChange={handleAddressChange} required />

            <label className="post-task-label">Suburb</label>
            <input type="text" name="suburb" className="post-task-input" placeholder="E.g., Madina" value={formData.address.suburb} onChange={handleAddressChange} required />
          </div>
        )}

        {/* Skills */}
        <label className="post-task-label">Skills Required <span className="hint">(Add at least one skill)</span></label>
        <div className="post-task-skills-input">
          <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} className="post-task-input" placeholder="E.g., Plumbing, Electrical Wiring..." />
          <button type="button" onClick={handleAddSkill} className="post-task-button">Add</button>
        </div>
        {/* Skills List */}
        <div className="post-task-skills-list">
          {formData.skillsRequired.map((skill, index) => (
            <span key={index} className="post-task-skill-tag">
              {skill}
              <button type="button" onClick={() => handleRemoveSkill(skill)} className="post-task-remove-skill">×</button>
            </span>
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit" className="post-task-button">Post Task</button>
      </form>
    </div>
    <Footer/>
    </div>
  );
};

export default PostMiniTask;
