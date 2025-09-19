import React, { useState, useEffect } from "react";
import { 
  FaArrowLeft, FaSave, FaMapMarkerAlt, FaCalendarAlt, 
  FaMoneyBillWave, FaTags, FaList, FaGlobe, FaCog, 
  FaLightbulb, FaCheckCircle, FaInfoCircle, FaPlus, FaTimes
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { updateMiniTask } from "../../APIS/API";
import { useLocation } from "react-router-dom";
import { ClientNavbar } from '../../Components/ClientComponents/ClientNavbar';
import { ClientSidebar } from '../../Components/ClientComponents/ClientSidebar';

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

// Modern Skills Input Component
const SkillsInput = ({ skills, onSkillsChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      onSkillsChange([...skills, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
          >
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type a skill and press Enter or click + to add"
        />
        <button
          type="button"
          onClick={handleAddSkill}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
        >
          <FaPlus className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-sm text-gray-500">
        Type skills and press Enter or click the + button to add them
      </p>
    </div>
  );
};

const EditMiniTaskForm = ({ onUpdate, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const task = location.state?.task;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: "",
    subcategory: "",
    locationType: "",
    address: { region: "", city: "", suburb: "" },
    skillsRequired: [],
    biddingType: "fixed", // Added biddingType with default value
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Initialize form with task data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        budget: task.budget || "",
        deadline: task.deadline?.split("T")[0] || "",
        category: task.category || "",
        subcategory: task.subcategory || "",
        locationType: task.locationType || "",
        address: task.address || { region: "", city: "", suburb: "" },
        skillsRequired: task.skillsRequired || [],
        biddingType: task.biddingType || "fixed", // Initialize biddingType
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: "" }));
    
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

  const handleSkillsChange = (newSkills) => {
    setFormData((prev) => ({ ...prev, skillsRequired: newSkills }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!formData.budget || formData.budget <= 0) newErrors.budget = "Valid budget is required";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory) newErrors.subcategory = "Subcategory is required";
    if (!formData.locationType) newErrors.locationType = "Location type is required";
    if (!formData.biddingType) newErrors.biddingType = "Pricing type is required";
    
    if (formData.locationType === "on-site") {
      if (!formData.address?.region?.trim()) newErrors.region = "Region is required for on-site tasks";
      if (!formData.address?.city?.trim()) newErrors.city = "City is required for on-site tasks";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await updateMiniTask(task._id, formData);
      if (response.status === 200) {
        toast.success("Mini Task updated successfully");
        setSaveStatus("success");
        setTimeout(() => {
          if (onClose) onClose();
          else navigate(-1);
        }, 1500);
      } else {
        toast.error("Couldn't update task");
        setSaveStatus("error");
      }
    } catch (error) {
      toast.error("Couldn't update task");
      setSaveStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      <div className="flex-1 overflow-auto ">
        <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-8 mt-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back to Tasks
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Edit Task</h1>
                <p className="text-gray-600 mt-2">Update your task details to attract the right talent</p>
              </div>
              
              {saveStatus === "success" && (
                <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                  <FaCheckCircle className="mr-2" />
                  Changes saved successfully!
                </div>
              )}
              
              {saveStatus === "error" && (
                <div className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                  <FaInfoCircle className="mr-2" />
                  Failed to save changes
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white max-w-5xl mx-auto rounded-2xl shadow-lg overflow-hidden mb-8">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Title & Description Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaLightbulb className="w-5 h-5 mr-2 text-blue-500" />
                Basic Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter a clear and descriptive title"
                  />
                  {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Describe the task in detail. Include requirements, expectations, and any specific instructions..."
                  />
                  {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Pricing Type Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaTags className="w-5 h-5 mr-2 text-purple-500" />
                Pricing Type
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Pricing Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.biddingType === "fixed" 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input
                      type="radio"
                      name="biddingType"
                      value="fixed"
                      checked={formData.biddingType === "fixed"}
                      onChange={handleChange}
                      className="mr-4"
                    />
                    <div>
                      <span className="font-medium block">Fixed Budget</span>
                      <span className="text-sm text-gray-600">Set a fixed price for your task</span>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.biddingType === "open-bid" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input
                      type="radio"
                      name="biddingType"
                      value="open-bid"
                      checked={formData.biddingType === "open-bid"}
                      onChange={handleChange}
                      className="mr-4"
                    />
                    <div>
                      <span className="font-medium block">Open for Bids</span>
                      <span className="text-sm text-gray-600">Receive bids from freelancers</span>
                    </div>
                  </label>
                </div>
                {errors.biddingType && <p className="mt-2 text-sm text-red-600">{errors.biddingType}</p>}
              </div>
            </div>

            {/* Budget & Deadline Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaMoneyBillWave className="w-5 h-5 mr-2 text-green-500" />
                Budget & Timeline
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.biddingType === "fixed" ? "Budget (₵)" : "Expected Budget (₵)"} *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                     ₵
                    </span>
                    <input
                      name="budget"
                      type="number"
                      value={formData.budget}
                      onChange={handleChange}
                      min="1"
                      step="0.01"
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.budget ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.budget && <p className="mt-2 text-sm text-red-600">{errors.budget}</p>}
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.biddingType === "fixed" 
                      ? "Fair pricing attracts more qualified applicants" 
                      : "Provide a budget range to guide bidders"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <FaCalendarAlt />
                    </span>
                    <input
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.deadline ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.deadline && <p className="mt-2 text-sm text-red-600">{errors.deadline}</p>}
                </div>
              </div>
            </div>

            {/* Category Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaList className="w-5 h-5 mr-2 text-orange-500" />
                Category
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {Object.keys(categories).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory *
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    disabled={!formData.category}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.subcategory ? "border-red-500" : "border-gray-300"
                    } ${!formData.category ? "bg-gray-100" : ""}`}
                  >
                    <option value="">Select a subcategory</option>
                    {formData.category &&
                      categories[formData.category]?.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                  </select>
                  {errors.subcategory && <p className="mt-2 text-sm text-red-600">{errors.subcategory}</p>}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaGlobe className="w-5 h-5 mr-2 text-blue-500" />
                Location
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Location Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.locationType === "remote" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input
                      type="radio"
                      name="locationType"
                      value="remote"
                      checked={formData.locationType === "remote"}
                      onChange={handleChange}
                      className="mr-4"
                    />
                    <div>
                      <span className="font-medium block">Remote</span>
                      <span className="text-sm text-gray-600">Task can be done online</span>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.locationType === "on-site" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input
                      type="radio"
                      name="locationType"
                      value="on-site"
                      checked={formData.locationType === "on-site"}
                      onChange={handleChange}
                      className="mr-4"
                    />
                    <div>
                      <span className="font-medium block">On-site</span>
                      <span className="text-sm text-gray-600">Physical presence required</span>
                    </div>
                  </label>
                </div>
                {errors.locationType && <p className="mt-2 text-sm text-red-600">{errors.locationType}</p>}
              </div>

              {/* Address Fields (Conditional) */}
              {formData.locationType === "on-site" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-red-500" />
                    Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Region *
                      </label>
                      <input
                        name="region"
                        value={formData.address.region}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.region ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter region"
                      />
                      {errors.region && <p className="mt-2 text-sm text-red-600">{errors.region}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        name="city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter city"
                      />
                      {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Suburb
                      </label>
                      <input
                        name="suburb"
                        value={formData.address.suburb}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter suburb (optional)"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className="pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaCog className="w-5 h-5 mr-2 text-gray-500" />
                Skills & Requirements
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Required
                </label>
                <SkillsInput 
                  skills={formData.skillsRequired} 
                  onSkillsChange={handleSkillsChange} 
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <FaSave className="w-5 h-5 mr-2" />
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMiniTaskForm;