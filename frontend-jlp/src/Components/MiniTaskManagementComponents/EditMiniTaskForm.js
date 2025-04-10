import React from "react";
import { FaTimes } from "react-icons/fa";
import "./minitaskmanagementcss/EditMiniTask.css";

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

const EditMiniTaskForm = ({ task, onUpdate, onClose, isOpen }) => {
  const [formData, setFormData] = React.useState({
    ...task,
    address: task.address || { region: "", city: "", suburb: "" },
    skillsRequired: task.skillsRequired || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["region", "city", "suburb"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "category" && { subcategory: "" }) // Reset subcategory when category changes
      }));
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({ ...prev, skillsRequired: skills }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData || !formData._id) {
      console.error("❌ formData or _id is missing:", formData);
      return;
    }

    console.log("✅ Sending update:", formData);
    onUpdate(formData);
    onClose(); // Close the panel after updating
  };

  return (
    <div className={`edit-minitask-panel ${isOpen ? "show" : ""}`}>
      <button className="edit-minitask-close-btn" onClick={onClose}>
        <FaTimes />
      </button>

      <h3>Edit Task</h3>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Budget</label>
        <input name="budget" type="number" value={formData.budget} onChange={handleChange} required />

        <label>Deadline</label>
        <input name="deadline" type="date" value={formData.deadline?.split("T")[0]} onChange={handleChange} required />

        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select category</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>Subcategory</label>
        <select name="subcategory" value={formData.subcategory} onChange={handleChange} required>
          <option value="">Select subcategory</option>
          {formData.category &&
            categories[formData.category]?.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
        </select>

        <label>Location Type</label>
        <select name="locationType" value={formData.locationType} onChange={handleChange} required>
          <option value="">Select location type</option>
          <option value="remote">Remote</option>
          <option value="on-site">On-site</option>
        </select>

        <label>Region</label>
        <input className="input" name="region" value={formData.address.region} onChange={handleChange} />

        <label>City</label>
        <input className="input" name="city" value={formData.address.city} onChange={handleChange} />

        <label>Suburb</label>
        <input  className="input" name="suburb" value={formData.address.suburb} onChange={handleChange} />

        <label>Skills Required (comma-separated)</label>
        <input className="input"
          type="text"
          name="skillsRequired"
          value={formData.skillsRequired.join(", ")}
          onChange={handleSkillsChange}
        />

        <button className="edit-mini-task-submit-button" type="submit">Update</button>
        <button type="button" onClick={onClose} className="edit-modal-close-btn">Cancel</button>
      </form>
    </div>
  );
};

export default EditMiniTaskForm;
