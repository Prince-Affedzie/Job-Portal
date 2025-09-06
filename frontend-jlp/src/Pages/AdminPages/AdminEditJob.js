import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  Tag, 
  Edit3, 
  Save, 
  ArrowLeft,
  Loader2,
  Check,
  X,
  Plus,
  Building2,
  Globe,
  AlertCircle
} from "lucide-react";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import { getSingleJobInfo, updateJobByAdmin } from "../../APIS/API";

const AdminEditJob = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl transition-all duration-500 transform translate-x-0 backdrop-blur-sm ${
      type === 'success' 
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
        : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
    }`;
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-5 h-5">
          ${type === 'success' 
            ? '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
            : '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'
          }
        </div>
        <span class="font-medium">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 4000);
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getSingleJobInfo(Id);
        if (res.status === 200) {
          setJob(res.data);
        }
      } catch (err) {
        showToast("Failed to load job.", 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [Id]);

  const validateForm = () => {
    const newErrors = {};
    if (!job.title?.trim()) newErrors.title = "Title is required";
    if (!job.description?.trim()) newErrors.description = "Description is required";
    if (!job.category?.trim()) newErrors.category = "Category is required";
    if (!job.salary?.trim()) newErrors.salary = "Salary is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setJob((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !job.skillsRequired.includes(newSkill.trim())) {
      handleChange('skillsRequired', [...job.skillsRequired, newSkill.trim()]);
      setNewSkill("");
      setShowSkillInput(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    handleChange('skillsRequired', job.skillsRequired.filter(skill => skill !== skillToRemove));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !job.jobTags.includes(newTag.trim())) {
      handleChange('jobTags', [...job.jobTags, newTag.trim()]);
      setNewTag("");
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    handleChange('jobTags', job.jobTags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast("Please fix the errors before saving.", 'error');
      return;
    }

    try {
      setSaving(true);
      const updatePayload = {
        title: job.title,
        description: job.description,
        category: job.category,
        jobType: job.jobType,
        deliveryMode: job.deliveryMode,
        experienceLevel: job.experienceLevel,
        salary: job.salary,
        paymentStyle: job.paymentStyle,
        deadLine: job.deadLine,
        status: job.status,
        skillsRequired: job.skillsRequired,
        jobTags: job.jobTags,
      };
      const res = await updateJobByAdmin(Id, updatePayload);
      if (res.status === 200) {
        showToast("Job updated successfully", 'success');
        setTimeout(() => navigate(`/admin/${Id}/job_details`), 1500);
      } else {
        showToast("Failed to update job", 'error');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred";
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <AdminNavbar 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
          />
          
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                <div className="absolute inset-0 rounded-full bg-blue-600/20 animate-pulse"></div>
              </div>
              <p className="mt-4 text-slate-600 font-medium">Loading job details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <AdminNavbar 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
          />
          
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Job Not Found</h3>
              <p className="text-slate-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={() => navigate('/admin/jobmanagement')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar - Fixed at the top */}
        <div className="sticky top-0 z-40">
          <AdminNavbar 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
          />
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate(`/admin/${Id}/job_details`)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                      <Edit3 className="w-8 h-8 text-blue-600" />
                      Edit Job
                    </h1>
                    <p className="text-slate-600 mt-1">Update job information and requirements</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === 'Opened' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : job.status === 'Closed'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  }`}>
                    {job.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="p-8 space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800">Basic Information</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={job.title || ''}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Enter job title"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          errors.title 
                            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                            : 'border-slate-200 bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        } focus:outline-none`}
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Job Description *
                      </label>
                      <textarea
                        rows={5}
                        value={job.description || ''}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Describe the job role, responsibilities, and requirements"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none ${
                          errors.description 
                            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                            : 'border-slate-200 bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        } focus:outline-none`}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800">Job Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Category *
                      </label>
                      <input
                        type="text"
                        value={job.category || ''}
                        onChange={(e) => handleChange("category", e.target.value)}
                        placeholder="e.g., Technology, Marketing"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          errors.category 
                            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                            : 'border-slate-200 bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        } focus:outline-none`}
                      />
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Job Type
                      </label>
                      <select
                        value={job.jobType || ''}
                        onChange={(e) => handleChange("jobType", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      >
                        <option value="">Select job type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Delivery Mode
                      </label>
                      <select
                        value={job.deliveryMode || ''}
                        onChange={(e) => handleChange("deliveryMode", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      >
                        <option value="">Select delivery mode</option>
                        <option value="In-Person">Onsite</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Experience Level
                      </label>
                      <select
                        value={job.experienceLevel || ''}
                        onChange={(e) => handleChange("experienceLevel", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      >
                        <option value="">Select experience level</option>
                        <option value="Entry">Junior</option>
                        <option value="Intermediate">Mid</option>
                        <option value="Senior">Senior</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Salary *
                      </label>
                      <input
                        type="text"
                        value={job.salary || ''}
                        onChange={(e) => handleChange("salary", e.target.value)}
                        placeholder="e.g., 50000"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          errors.salary 
                            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                            : 'border-slate-200 bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        } focus:outline-none`}
                      />
                      {errors.salary && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.salary}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Payment Style
                      </label>
                      <select
                        value={job.paymentStyle || ''}
                        onChange={(e) => handleChange("paymentStyle", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      >
                        <option value="">Select payment style</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Hourly">Hourly</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Negotiable">Negotiable</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Deadline
                      </label>
                      <input
                        type="date"
                        value={job.deadLine ? new Date(job.deadLine).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleChange("deadLine", e.target.value ? new Date(e.target.value).toISOString() : '')}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status
                      </label>
                      <select
                        value={job.status || ''}
                        onChange={(e) => handleChange("status", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      >
                        <option value="">Select status</option>
                        <option value="Opened">Opened</option>
                        <option value="Closed">Closed</option>
                        <option value="Filled">Filled</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewing">Reviewing</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Skills and Tags */}
                <div className="space-y-8">
                  {/* Skills Required */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800">Skills Required</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {job.skillsRequired?.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg border border-blue-200 hover:bg-blue-200 transition-colors"
                          >
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="hover:bg-blue-300 rounded-full p-1 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {showSkillInput ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                              placeholder="Add skill"
                              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={handleAddSkill}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setShowSkillInput(false);
                                setNewSkill("");
                              }}
                              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowSkillInput(true)}
                            className="inline-flex items-center gap-2 px-3 py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Add Skill
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Job Tags */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Tag className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800">Job Tags</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {job.jobTags?.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg border border-purple-200 hover:bg-purple-200 transition-colors"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:bg-purple-300 rounded-full p-1 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {showTagInput ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                              placeholder="Add tag"
                              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                              autoFocus
                            />
                            <button
                              onClick={handleAddTag}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setShowTagInput(false);
                                setNewTag("");
                              }}
                              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowTagInput(true)}
                            className="inline-flex items-center gap-2 px-3 py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:border-purple-400 hover:text-purple-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Add Tag
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end pt-6 border-t border-slate-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-200 transform ${
                      saving
                        ? 'bg-slate-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    }`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEditJob;