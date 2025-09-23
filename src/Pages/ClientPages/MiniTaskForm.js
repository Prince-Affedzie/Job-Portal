import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postMiniTask } from "../../APIS/API";
import { ClientNavbar } from '../../Components/ClientComponents/ClientNavbar';
import { ClientSidebar } from '../../Components/ClientComponents/ClientSidebar';
import Footer from "../../Components/Common/Footer";
import ProcessingOverlay from "../../Components/Common/ProcessingOverLay";
import VerifyTooltip from "../../Components/Common/VerifyToolTip";
import { userContext } from "../../Context/FetchUser";

const PostMiniTask = () => {
  const { user } = useContext(userContext);
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
    biddingType: "fixed",
  });

  const [skillInput, setSkillInput] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      subcategory: "",
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

  const handleAddSkill = (e) => {
    e?.preventDefault();
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      handleAddSkill(e);
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
        toast.success("Task posted successfully!");
        setTimeout(() => navigate("/client/microtask_dashboard"), 1500);
      } else {
        toast.error(response.error || "Couldn't post task");
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
    <div className="flex h-screen bg-gray-50">
      <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      <div className="flex-1 overflow-auto">
        <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
        
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <ToastContainer position="top-center" autoClose={3000} />
          {user && <VerifyTooltip isVerified={user.isVerified} />}
          
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Post a New Task
              </h1>
              <p className="text-gray-600">
                Fill in the details below to find the perfect candidate
              </p>
            </div>
            
            {/* Form Container */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Task Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Website Redesign, Home Cleaning"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Description *
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      maxLength={500}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Describe your task in detail..."
                      value={formData.description}
                      onChange={(e) => {
                        setCharCount(e.target.value.length);
                        handleChange(e);
                      }}
                      required
                    />
                    <div className="absolute bottom-2 right-2">
                      <span className={`text-xs ${charCount > 450 ? 'text-red-600' : 'text-gray-500'}`}>
                        {charCount}/500
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bidding Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, biddingType: "fixed"})}
                      className={`px-4 py-3 border rounded-md text-sm font-medium ${
                        formData.biddingType === "fixed"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Fixed Budget
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, biddingType: "open-bid"})}
                      className={`px-4 py-3 border rounded-md text-sm font-medium ${
                        formData.biddingType === "open-bid"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Open for Bids
                    </button>
                  </div>
                </div>

                {/* Budget & Deadline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.biddingType === "fixed" ? "Budget (₵)" : "Expected Budget (₵)"} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₵</span>
                      </div>
                      <input
                        type="number"
                        id="budget"
                        name="budget"
                        min="1"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline *
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={formData.deadline}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      required
                    >
                      <option value="">Choose a category</option>
                      {Object.keys(categories).map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory *
                    </label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      value={formData.subcategory}
                      onChange={handleSubcategoryChange}
                      required
                      disabled={!formData.category}
                    >
                      <option value="">
                        {!formData.category ? "Select category first" : "Choose subcategory"}
                      </option>
                      {formData.category && categories[formData.category].map((sub, idx) => (
                        <option key={idx} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, locationType: "remote"})}
                      className={`px-4 py-3 border rounded-md text-sm font-medium ${
                        formData.locationType === "remote"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Remote Work
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, locationType: "on-site"})}
                      className={`px-4 py-3 border rounded-md text-sm font-medium ${
                        formData.locationType === "on-site"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      On-Site Work
                    </button>
                  </div>
                </div>

                {/* Address Fields (Conditional) */}
                {formData.locationType === "on-site" && (
                  <div className="bg-gray-50 p-4 rounded-md border">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Location Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="region" className="block text-xs font-medium text-gray-600 mb-1">
                          Region *
                        </label>
                        <input
                          type="text"
                          id="region"
                          name="region"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="e.g., Greater Accra"
                          value={formData.address.region}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-xs font-medium text-gray-600 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="e.g., Accra"
                          value={formData.address.city}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="suburb" className="block text-xs font-medium text-gray-600 mb-1">
                          Suburb *
                        </label>
                        <input
                          type="text"
                          id="suburb"
                          name="suburb"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="e.g., Madina"
                          value={formData.address.suburb}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills Input */}
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                    Required Skills (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="skills"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., React, Photoshop, Plumbing"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!skillInput.trim()}
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.skillsRequired.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.skillsRequired.map((skill, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isProcessing ? "Publishing..." : "Post Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <ProcessingOverlay show={isProcessing} message="Submitting your task..." />
      </div>
    </div>
  );
};

export default PostMiniTask;