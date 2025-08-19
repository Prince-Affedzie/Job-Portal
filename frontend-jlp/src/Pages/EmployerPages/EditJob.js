import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getJobById, modifyJob } from '../../APIS/API';
import Sidebar from '../../Components/EmployerDashboard/SideBar';
import EmployerNavbar from '../../Components/EmployerDashboard/EmployerNavbar';
import { 
  FaArrowLeft, 
  FaBriefcase, 
  FaBuilding, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaTag, 
  FaGraduationCap, 
  FaCheckCircle,
  FaLaptop,
  FaHandshake
} from 'react-icons/fa';

const EditJob = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    industry: '',
    experienceLevel: '',
    jobType: '',
    category: '',
    paymentStyle: '',
    salary: '',
    deadLine: '',
    deliveryMode: '',
    location: {
      region: '',
      city: '',
      street: ''
    },
    jobTags: [],
    skillsRequired: [],
    responsibilities: [],
  });

  // Form validation
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const response = await getJobById(Id);
        if (response.status === 200) {
          setJobData(response.data);
          setFormState({
            ...response.data,
            location: response.data.location || { region: '', city: '', street: '' }
          });
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [Id]);

  const validateForm = () => {
    const newErrors = {};

    if (!formState.title?.trim()) {
      newErrors.title = 'Job title is required';
    }
    if (!formState.description?.trim()) {
      newErrors.description = 'Job description is required';
    }
    if (!formState.salary?.trim()) {
      newErrors.salary = 'Salary information is required';
    }
    if (!formState.deadLine) {
      newErrors.deadLine = 'Application deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested location object
    if (name.startsWith('location.')) {
      const locationField = name.replace('location.', '');
      setFormState((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (e, arrayName) => {
    const { value } = e.target;
    if (e.key === 'Enter' && value.trim() !== '') {
      e.preventDefault();
      if (!formState[arrayName].includes(value.trim())) {
        setFormState((prev) => ({
          ...prev,
          [arrayName]: [...prev[arrayName], value.trim()],
        }));
      }
      e.target.value = '';
    }
  };

  const removeArrayItem = (arrayName, index) => {
    setFormState((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const response = await modifyJob(Id, formState);
      if (response.status === 200) {
        toast.success("Job updated successfully!");
        setTimeout(() => navigate('/employer/jobs'), 1500);
      } else {
        toast.error(response.message || "Failed to update job. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An unexpected error occurred. Please try again.";
      console.error('Update error:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !jobData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EmployerNavbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
              <p className="text-sm">Loading job details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployerNavbar />
      <div className="flex">
        <Sidebar />
        
        <div className="lg:ml-64 flex-1 p-4 md:p-6 lg:p-8">
          <ToastContainer />
          
          <div className="mb-6 ">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium mb-4"
            >
              <FaArrowLeft className="mr-2" />
              Back to Jobs
            </button>
            
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Edit Job Posting</h2>
              <p className="text-gray-600">Update your job posting details below</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              {/* Basic Information Section */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FaBriefcase className="text-blue-600" />
                  </div>
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="title"
                      type="text"
                      value={formState.title || ''}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter job title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formState.industry || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Hospitality">Hospitality</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formState.description || ''}
                    onChange={handleChange}
                    rows="6"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Provide a detailed job description"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formState.category || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Category</option>
                      <option value="Administration">Administration</option>
                      <option value="Administrative Assistance">Administrative Assistance</option>
                      <option value="Accounting">Accounting</option>
                      <option value="Banking">Banking</option>
                      <option value="Education">Education</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Health">Health</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Software Development">Software Development</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type
                    </label>
                    <select
                      name="jobType"
                      value={formState.jobType || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Job Type</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Contract">Contract</option>
                      <option value="Volunteer">Volunteer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Job Details Section */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FaCheckCircle className="text-blue-600" />
                  </div>
                  Job Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      name="experienceLevel"
                      value={formState.experienceLevel || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Experience Level</option>
                      <option value="Entry">Entry Level</option>
                      <option value="Intermediate">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Mode
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name="deliveryMode" 
                          value="In-Person" 
                          checked={formState.deliveryMode === "In-Person"}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-2 border-2 ${formState.deliveryMode === "In-Person" ? 'bg-blue-100 border-blue-600 text-blue-600' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                          <FaBuilding />
                        </div>
                        <span className="text-sm font-medium">In-Person</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name="deliveryMode" 
                          value="Remote" 
                          checked={formState.deliveryMode === "Remote"}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-2 border-2 ${formState.deliveryMode === "Remote" ? 'bg-blue-100 border-blue-600 text-blue-600' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                          <FaLaptop />
                        </div>
                        <span className="text-sm font-medium">Remote</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="radio" 
                          name="deliveryMode" 
                          value="Hybrid" 
                          checked={formState.deliveryMode === "Hybrid"}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-2 border-2 ${formState.deliveryMode === "Hybrid" ? 'bg-blue-100 border-blue-600 text-blue-600' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                          <FaHandshake />
                        </div>
                        <span className="text-sm font-medium">Hybrid</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="deadLine"
                      type="date"
                      value={formState.deadLine ? new Date(formState.deadLine).toISOString().split('T')[0] : ''}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.deadLine ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.deadLine && <p className="text-red-500 text-sm mt-1">{errors.deadLine}</p>}
                  </div>
                </div>
              </div>

              {/* Compensation Section */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FaMoneyBillWave className="text-blue-600" />
                  </div>
                  Compensation
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Structure
                    </label>
                    <select
                      name="paymentStyle"
                      value={formState.paymentStyle || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Payment Structure</option>
                      <option value="Fixed">Fixed</option>
                      <option value="Range">Range</option>
                      <option value="Negotiable">Negotiable</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary/Rate <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₵</span>
                      <input
                        name="salary"
                        type="text"
                        value={formState.salary || ''}
                        onChange={handleChange}
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.salary ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 50,000 - 70,000"
                      />
                    </div>
                    {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FaMapMarkerAlt className="text-blue-600" />
                  </div>
                  Location
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <input
                      name="location.region"
                      type="text"
                      value={formState.location?.region || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter region"
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      name="location.city"
                      type="text"
                      value={formState.location?.city || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street or Suburb
                  </label>
                  <input
                    name="location.street"
                    type="text"
                    value={formState.location?.street || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter street address or suburb"
                  />
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FaTag className="text-blue-600" />
                  </div>
                  Additional Details
                </h3>
                
                {/* Job Tags */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Tags
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formState.jobTags.map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
                          <FaTag className="text-xs mr-1" />
                          {tag}
                          <button
                            type="button"
                            className="ml-2 text-gray-600 hover:text-gray-800"
                            onClick={() => removeArrayItem('jobTags', idx)}
                            aria-label={`Remove ${tag} tag`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Type a tag and press Enter"
                      onKeyDown={(e) => handleArrayChange(e, 'jobTags')}
                      className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Skills Required */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills Required & Qualifications
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formState.skillsRequired.map((skill, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                          {skill}
                          <button
                            type="button"
                            className="ml-2 text-blue-600 hover:text-blue-800"
                            onClick={() => removeArrayItem('skillsRequired', idx)}
                            aria-label={`Remove ${skill} skill`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter"
                      onKeyDown={(e) => handleArrayChange(e, 'skillsRequired')}
                      className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsibilities
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3">
                    <div className="space-y-2 mb-3">
                      {formState.responsibilities.map((responsibility, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <span className="text-gray-700">{responsibility}</span>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeArrayItem('responsibilities', idx)}
                            aria-label={`Remove responsibility: ${responsibility}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Type a responsibility and press Enter"
                      onKeyDown={(e) => handleArrayChange(e, 'responsibilities')}
                      className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  onClick={() => navigate('/employer/jobs')}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Saving Changes...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJob;