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
    biddingType: "fixed", // Default to fixed bidding
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
        setTimeout(() => navigate("/mini_task/listings"), 1500);
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
     
      
      <main className=" py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
       <ToastContainer position="top-center" autoClose={3000} />
        {user && <VerifyTooltip isVerified={user.isVerified} />}
       
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="text-center mb-8 lg:mb-12">

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Post a New <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Task</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Fill in the details below to find the perfect candidate for your project
            </p>
          </div>
          
          {/* Enhanced Form Container */}
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl max-w-5xl mx-auto  border border-white/20 overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Task Title Section */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="block w-full rounded-xl border-2 border-gray-200 pl-4 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300 bg-white/70"
                      placeholder="e.g., Website Redesign, Home Cleaning, Logo Design"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                   
                  </div>
                  <p className="text-sm text-gray-600">Be specific and descriptive about what you need</p>
                </div>

                {/* Description Section */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      maxLength={500}
                      className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300 p-4 text-gray-900 placeholder-gray-500 resize-none bg-white/70"
                      placeholder="Describe your task in detail. Include requirements, expectations, timeline, and any special instructions..."
                      value={formData.description}
                      onChange={(e) => {
                        setCharCount(e.target.value.length);
                        handleChange(e);
                      }}
                      required
                    />
                    <div className="absolute bottom-3 right-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${charCount > 450 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                        {charCount}/500
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">The more details you provide, the better matches you'll receive</p>
                </div>

                {/* Bidding Type Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-4">
                    Pricing Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setFormData({...formData, biddingType: "fixed"})}
                      className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        formData.biddingType === "fixed"
                          ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg ring-4 ring-green-100"
                          : "border-gray-200 bg-white/70 hover:border-green-300 hover:bg-green-50/50"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors ${
                          formData.biddingType === "fixed"
                            ? "border-green-500 bg-green-500"
                            : "border-gray-400 group-hover:border-green-400"
                        }`}>
                          {formData.biddingType === "fixed" && (
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                            <h3 className="font-semibold text-gray-900">Fixed Budget</h3>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">Set a fixed budget for your task</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Predictable</span>
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Quick hiring</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      onClick={() => setFormData({...formData, biddingType: "open-bid"})}
                      className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        formData.biddingType === "open-bid"
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg ring-4 ring-blue-100"
                          : "border-gray-200 bg-white/70 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors ${
                          formData.biddingType === "open-bid"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-400 group-hover:border-blue-400"
                        }`}>
                          {formData.biddingType === "open-bid" && (
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            <h3 className="font-semibold text-gray-900">Open for Bids</h3>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">Receive bids from freelancers</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Competitive</span>
                            <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">More options</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget & Deadline Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="budget" className="block text-sm font-semibold text-gray-800 mb-2">
                      {formData.biddingType === "fixed" ? "Budget (₵)" : "Expected Budget (₵)"} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-lg font-medium">₵</span>
                      </div>
                      <input
                        type="number"
                        id="budget"
                        name="budget"
                        min="1"
                        step="0.01"
                        className="block w-full pl-10 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300 text-gray-900 placeholder-gray-500 bg-white/70"
                        placeholder="0.00"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {formData.biddingType === "fixed" 
                        ? "Set a fixed price for your task" 
                        : "Provide a budget range to guide bidders"}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="deadline" className="block text-sm font-semibold text-gray-800 mb-2">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        className="block w-full rounded-xl border-2 border-gray-200 py-4 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300 text-gray-900 bg-white/70"
                        value={formData.deadline}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-600">When do you need this completed?</p>
                  </div>
                </div>

                {/* Category & Subcategory Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        id="category"
                        name="category"
                        className="block w-full rounded-xl border-2 border-gray-200 py-4 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300 text-gray-900 bg-white/70 appearance-none cursor-pointer"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        required
                      >
                        <option value="" className="text-gray-500">Choose a category</option>
                        {Object.keys(categories).map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subcategory" className="block text-sm font-semibold text-gray-800 mb-2">
                      Subcategory <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        id="subcategory"
                        name="subcategory"
                        className="block w-full rounded-xl border-2 border-gray-200 py-4 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300 text-gray-900 bg-white/70 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formData.subcategory}
                        onChange={handleSubcategoryChange}
                        required
                        disabled={!formData.category}
                      >
                        <option value="" className="text-gray-500">
                          {!formData.category ? "Select category first" : "Choose subcategory"}
                        </option>
                        {formData.category && categories[formData.category].map((sub, idx) => (
                          <option key={idx} value={sub}>{sub}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Location Type Selector */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-4">
                    Location Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setFormData({...formData, locationType: "remote"})}
                      className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        formData.locationType === "remote"
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg ring-4 ring-blue-100"
                          : "border-gray-200 bg-white/70 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors ${
                          formData.locationType === "remote"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-400 group-hover:border-blue-400"
                        }`}>
                          {formData.locationType === "remote" && (
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                            </svg>
                            <h3 className="font-semibold text-gray-900">Remote Work</h3>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">Work can be completed from anywhere in the world</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Flexible</span>
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Global talent</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      onClick={() => setFormData({...formData, locationType: "on-site"})}
                      className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        formData.locationType === "on-site"
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg ring-4 ring-blue-100"
                          : "border-gray-200 bg-white/70 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors ${
                          formData.locationType === "on-site"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-400 group-hover:border-blue-400"
                        }`}>
                          {formData.locationType === "on-site" && (
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h3 className="font-semibold text-gray-900">On-Site Work</h3>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">Requires physical presence at a specific location</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">In-person</span>
                            <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">Local talent</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Address Fields (Conditional) */}
                {formData.locationType === "on-site" && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 space-y-6 animate-fadeIn">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="region" className="block text-sm font-semibold text-gray-800">
                          Region <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="region"
                          name="region"
                          className="block w-full rounded-xl border-2 border-orange-200 py-3 px-4 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white/80"
                          placeholder="e.g., Greater Accra"
                          value={formData.address.region}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="city" className="block text-sm font-semibold text-gray-800">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className="block w-full rounded-xl border-2 border-orange-200 py-3 px-4 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white/80"
                          placeholder="e.g., Accra"
                          value={formData.address.city}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="suburb" className="block text-sm font-semibold text-gray-800">
                          Suburb <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="suburb"
                          name="suburb"
                          className="block w-full rounded-xl border-2 border-orange-200 py-3 px-4 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white/80"
                          placeholder="e.g., Madina"
                          value={formData.address.suburb}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Skills Input */}
                <div className="space-y-4">
                  <label htmlFor="skills" className="block text-sm font-semibold text-gray-800">
                    Required Skills <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  
                  <div className="space-y-4">
                    <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative group">
                        <input
                          type="text"
                          id="skills"
                          className="block w-full rounded-xl border-2 border-gray-200 py-3 px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-gray-300 text-gray-900 placeholder-gray-500 bg-white/70"
                          placeholder="e.g., React, Photoshop, Plumbing, Content Writing"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        disabled={!skillInput.trim()}
                      >
                        Add Skill
                      </button>
                    </form>
                    
                    <div className="min-h-[60px]">
                      {formData.skillsRequired.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {formData.skillsRequired.map((skill, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-colors group"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-800 focus:outline-none transition-all group-hover:bg-blue-200"
                                aria-label={`Remove ${skill}`}
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                          <p className="text-sm text-gray-500">No skills added yet - add skills to attract the right candidates</p>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">💡 Tip:</span> Add specific skills to help match with qualified candidates
                    </p>
                  </div>
                </div>

                {/* Enhanced Submit Button Section */}
                <div className="pt-8 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4 justify-end items-center">
                    <div className="text-sm text-gray-600 order-2 sm:order-1">
                      <span className="font-medium">Ready to post?</span> Your task will be visible to thousands of skilled professionals
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full sm:w-auto order-1 sm:order-2 group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="flex items-center space-x-3">
                            <svg className="animate-spin -ml-1 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Publishing your task...</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <span>Post Task</span>
                          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Subtle animation effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                  </div>
                  
                  {/* Additional info section */}
                  <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">What happens next?</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            <span>Your task will be reviewed and published within minutes</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            <span>Qualified professionals will start applying</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            <span>You'll receive notifications for each application</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-10 blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-full opacity-10 blur-xl"></div>
          </div>
          
          {/* Progress indicator or additional info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help? Check out our 
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline">posting guidelines</a> 
              or 
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline">contact support</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <ProcessingOverlay show={isProcessing} message="Submitting your task..." />
      
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Custom scrollbar for textarea */
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Focus ring improvements */
        input:focus,
        textarea:focus,
        select:focus {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        
        /* Hover effects for interactive elements */
        .group:hover .group-hover\\:bg-blue-200 {
          background-color: rgb(219 234 254);
        }
      `}</style>
    </div>
    </div>
  );
};

export default PostMiniTask;