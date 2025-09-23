import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getSingleMinitask, updateMiniTaskByAdmin } from "../../APIS/API";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";

const AdminEditMiniTaskPage = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    locationType: "",
    category: "",
    subcategory: "",
    skillsRequired: [],
    status: "",
    verificationRequired: false,
    address: {
      region: "",
      city: "",
      suburb: ""
    }
  });
  const [errors, setErrors] = useState({});

  // Constants
  const CATEGORIES = [
    "Home Services",
    "Delivery & Errands",
    "Digital Services",
    "Writing & Assistance",
    "Learning & Tutoring",
    "Creative Tasks",
    "Event Support",
    "Others"
  ];

  const STATUS_OPTIONS = [
    "Pending", "Open", "Assigned", "In-progress", "Review", "Rejected", "Completed", "Closed"
  ];

  const LOCATION_TYPES = ["remote", "on-site"];

  useEffect(() => {
    if (Id) fetchTask();
  }, [Id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await getSingleMinitask(Id);
      if (res.status === 200) {
        setTask(res.data);
        setFormData({
          title: res.data.title || "",
          description: res.data.description || "",
          budget: res.data.budget || "",
          deadline: res.data.deadline ? dayjs(res.data.deadline).format('YYYY-MM-DD') : "",
          locationType: res.data.locationType || "",
          category: res.data.category || "",
          subcategory: res.data.subcategory || "",
          skillsRequired: res.data.skillsRequired || [],
          status: res.data.status || "Pending",
          verificationRequired: res.data.verificationRequired || false,
          address: res.data.address || { region: "", city: "", suburb: "" }
        });
      }
    } catch (error) {
      console.error("Fetch task error:", error);
      showNotification("Failed to load task details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "info") => {
    // Create a simple notification system
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === "error" ? "bg-red-500 text-white" : 
      type === "success" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim() || formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.description.trim() || formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.budget || formData.budget < 1) {
      newErrors.budget = "Budget must be at least 1 GHS";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    } else if (new Date(formData.deadline) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.deadline = "Deadline must be in the future";
    }

    if (!formData.locationType) {
      newErrors.locationType = "Location type is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      skillsRequired: skills
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification("Please fix the errors before submitting", "error");
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
        deadline: new Date(formData.deadline).toISOString(),
        locationType: formData.locationType,
        category: formData.category,
        subcategory: formData.subcategory,
        skillsRequired: formData.skillsRequired,
        status: formData.status,
        verificationRequired: formData.verificationRequired,
        address: formData.address
      };

      const res = await updateMiniTaskByAdmin(Id, payload);
      if (res.status === 200) {
        showNotification("MiniTask updated successfully", "success");
        setTimeout(() => {
          navigate(`/admin/${Id}/mini_task_info`);
        }, 1000);
      }
    } catch (error) {
      console.error("Update error:", error);
      showNotification("Failed to update MiniTask", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/${Id}/mini_task_info`);
  };

  const getStatusColor = (status) => {
    const colors = {
      "Completed": "bg-green-100 text-green-800",
      "In-progress": "bg-blue-100 text-blue-800",
      "Pending": "bg-orange-100 text-orange-800",
      "Open": "bg-cyan-100 text-cyan-800",
      "Assigned": "bg-purple-100 text-purple-800",
      "Review": "bg-yellow-100 text-yellow-800",
      "Rejected": "bg-red-100 text-red-800",
      "Closed": "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <AdminNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading task details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <AdminNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <h3 className="text-red-800 font-semibold mb-2">Task Not Found</h3>
              <p className="text-red-600 mb-4">The requested mini task could not be found.</p>
              <button 
                onClick={() => navigate("/admin/dashboard")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-64 bg-white shadow-lg`}>
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit MiniTask
                </h1>
                <button 
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
              <p className="text-gray-600">
                Task ID: {task._id} • Created: {dayjs(task.createdAt).format('MMM D, YYYY')}
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { key: "basic", label: "Basic Information" },
                    { key: "location", label: "Location Details" },
                    { key: "overview", label: "Task Overview" }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.key
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Basic Information Tab */}
                {activeTab === "basic" && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.title ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter task title"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget (GHS) *
                        </label>
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          min="1"
                          max="10000"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.budget ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="e.g., 50"
                        />
                        {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.description ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Describe the task requirements, expectations, and deliverables clearly..."
                      />
                      {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                      <p className="mt-1 text-sm text-gray-500">
                        {formData.description.length}/1000 characters
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deadline *
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          min={dayjs().format('YYYY-MM-DD')}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.deadline ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location Type *
                        </label>
                        <select
                          name="locationType"
                          value={formData.locationType}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.locationType ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select location type</option>
                          {LOCATION_TYPES.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </select>
                        {errors.locationType && <p className="mt-1 text-sm text-red-600">{errors.locationType}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.category ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select category</option>
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subcategory
                        </label>
                        <input
                          type="text"
                          name="subcategory"
                          value={formData.subcategory}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Logo Design, Home Cleaning"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills Required
                      </label>
                      <input
                        type="text"
                        onChange={handleSkillsChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add skills separated by commas (e.g., JavaScript, Design, Writing)"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.skillsRequired.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="verificationRequired"
                            checked={formData.verificationRequired}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-700">
                            Verification Required
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status *
                          </label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.status ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">Select status</option>
                            {STATUS_OPTIONS.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Location Details Tab */}
                {activeTab === "location" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                        <input
                          type="text"
                          name="region"
                          value={formData.address.region}
                          onChange={handleAddressChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Greater Accra"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.address.city}
                          onChange={handleAddressChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Accra"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Suburb</label>
                        <input
                          type="text"
                          name="suburb"
                          value={formData.address.suburb}
                          onChange={handleAddressChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., East Legon"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Task Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Task ID</span>
                        <p className="font-mono text-sm">{task._id}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Employer</span>
                        <p className="text-sm">{task.employer?.name || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Bidding Type</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.biddingType === 'fixed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {task.biddingType}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Current Status</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Applicants</span>
                        <p className="text-sm">{task.applicants?.length || 0}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Bids Received</span>
                        <p className="text-sm">{task.bids?.length || 0}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Assigned To</span>
                        <p className="text-sm">{task.assignedTo ? task.assignedTo.name : 'Not assigned'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Completion Status</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.markedDoneByEmployer && task.markedDoneByTasker ? 'bg-green-100 text-green-800' :
                          task.markedDoneByEmployer ? 'bg-blue-100 text-blue-800' :
                          task.markedDoneByTasker ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {task.markedDoneByEmployer && task.markedDoneByTasker ? 'Mutually Completed' :
                           task.markedDoneByEmployer ? 'Employer Marked Done' :
                           task.markedDoneByTasker ? 'Tasker Marked Done' : 'Not Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl">
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={submitting}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={activeTab === "basic" ? handleSubmit : () => setActiveTab("basic")}
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 min-w-32 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Guidelines */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Admin Editing Guidelines</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    You can modify task details, status, and verification requirements. Avoid changing sensitive financial or assignment data unless absolutely necessary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditMiniTaskPage;