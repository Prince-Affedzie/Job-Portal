import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getJobById, modifyJob } from '../APIS/API';
import Sidebar from '../Components/EmployerDashboard/SideBar';
import EmployerNavbar from '../Components/EmployerDashboard/EmployerNavbar';
import '../Styles/EditJob.css';

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
      <div className="edit-job-container">
        <EmployerNavbar />
        <Sidebar />
       <div className="flex flex-col items-center justify-center py-16 text-gray-500">
           <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
             <p className="text-sm">Loading  job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <div className="edit-job-container">
        <EmployerNavbar />
        <Sidebar />
        
        <div className="edit-job-form-wrapper">
          <div className="form-header">
            <h2>Edit Job Posting</h2>
            <p>Update your job posting details below</p>
          </div>

          <form className="edit-job-form" onSubmit={handleSubmit}>
            
            {/* Basic Information Section */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Job Title *</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formState.title || ''}
                    onChange={handleChange}
                    placeholder="Enter job title"
                    className={errors.title ? 'error' : ''}
                  />
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="description">Job Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formState.description || ''}
                    onChange={handleChange}
                    placeholder="Provide a detailed job description"
                    rows="5"
                    className={errors.description ? 'error' : ''}
                  />
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="industry">Industry</label>
                  <select
                    id="industry"
                    name="industry"
                    value={formState.industry || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formState.category || ''}
                    onChange={handleChange}
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
              </div>
            </div>

            {/* Job Details Section */}
            <div className="form-section">
              <h3 className="section-title">Job Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="experienceLevel">Experience Level</label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formState.experienceLevel || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Experience Level</option>
                    <option value="Entry">Entry Level</option>
                    <option value="Intermediate">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="jobType">Job Type</label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formState.jobType || ''}
                    onChange={handleChange}
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryMode">Work Mode</label>
                  <select
                    id="deliveryMode"
                    name="deliveryMode"
                    value={formState.deliveryMode || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Work Mode</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="deadLine">Application Deadline *</label>
                  <input
                    id="deadLine"
                    name="deadLine"
                    type="date"
                    value={formState.deadLine ? new Date(formState.deadLine).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    className={errors.deadLine ? 'error' : ''}
                  />
                  {errors.deadLine && <span className="error-message">{errors.deadLine}</span>}
                </div>
              </div>
            </div>

            {/* Compensation Section */}
            <div className="form-section">
              <h3 className="section-title">Compensation</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="paymentStyle">Payment Structure</label>
                  <select
                    id="paymentStyle"
                    name="paymentStyle"
                    value={formState.paymentStyle || ''}
                    onChange={handleChange}
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
                  <label htmlFor="salary">Salary/Rate *</label>
                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    value={formState.salary || ''}
                    onChange={handleChange}
                    placeholder="e.g., $50,000 - $70,000"
                    className={errors.salary ? 'error' : ''}
                  />
                  {errors.salary && <span className="error-message">{errors.salary}</span>}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="form-section">
              <h3 className="section-title">Location</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location.region">Region</label>
                  <input
                    id="location.region"
                    name="location.region"
                    type="text"
                    value={formState.location?.region || ''}
                    onChange={handleChange}
                    placeholder="Enter region"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location.city">City</label>
                  <input
                    id="location.city"
                    name="location.city"
                    type="text"
                    value={formState.location?.city || ''}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="location.street">Street or Suburb</label>
                  <input
                    id="location.street"
                    name="location.street"
                    type="text"
                    value={formState.location?.street || ''}
                    onChange={handleChange}
                    placeholder="Enter street address or suburb"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details Section */}
            <div className="form-section">
              <h3 className="section-title">Additional Details</h3>
              
              {/* Job Tags */}
              <div className="form-group">
                <label>Job Tags</label>
                <div className="tag-input-container">
                  <div className="tag-list">
                    {formState.jobTags.map((tag, idx) => (
                      <span className="tag" key={idx}>
                        {tag}
                        <button
                          type="button"
                          className="tag-remove"
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
                    className="tag-input"
                  />
                </div>
              </div>

              {/* Skills Required */}
              <div className="form-group">
                <label>Skills Required & Qualifications</label>
                <div className="tag-input-container">
                  <div className="tag-list">
                    {formState.skillsRequired.map((skill, idx) => (
                      <span className="tag" key={idx}>
                        {skill}
                        <button
                          type="button"
                          className="tag-remove"
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
                    className="tag-input"
                  />
                </div>
              </div>

              {/* Responsibilities */}
              <div className="form-group">
                <label>Responsibilities</label>
                <div className="responsibility-container">
                  {formState.responsibilities.map((responsibility, idx) => (
                    <div className="responsibility-item" key={idx}>
                      <span className="responsibility-text">{responsibility}</span>
                      <button
                        type="button"
                        className="responsibility-remove"
                        onClick={() => removeArrayItem('responsibilities', idx)}
                        aria-label={`Remove responsibility: ${responsibility}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder="Type a responsibility and press Enter"
                    onKeyDown={(e) => handleArrayChange(e, 'responsibilities')}
                    className="responsibility-input"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/employer/jobs')}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;