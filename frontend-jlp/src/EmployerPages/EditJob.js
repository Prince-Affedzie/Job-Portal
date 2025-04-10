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
  const [formState, setFormState] = useState({
    jobTags: [],
    skillsRequired: [],
    responsibilities: [],
  });

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const response = await getJobById(Id);
        if (response.status === 200) {
          setJobData(response.data);
          setFormState(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [Id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, arrayName) => {
    const { value } = e.target;
    if (e.key === 'Enter' && value.trim() !== '') {
        e.preventDefault()
        setFormState((prev) => ({
        ...prev,
        [arrayName]: [...prev[arrayName], value.trim()],
      }));
      e.target.value = '';  // Clear the input field after adding the skill
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
    try {
      const response = await modifyJob(Id, formState);
      if (response.status === 200) {
        toast.success("Update Successful");
        navigate('/employer/jobs');
      } else {
        toast.error(response.message || "Oops! Couldn't Add The Job. Please Try Again Later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (loading || !jobData) return <p>Loading job details...</p>;

  return (
    <div>
      <ToastContainer />
      <div className="edit-job-container">
        <EmployerNavbar />
        <Sidebar />
        <div className="edit-job-form-wrapper">
          <h2>Edit Job Posting</h2>
          <form className="edit-job-form" onSubmit={handleSubmit}>
            <label>Title</label>
            <input
              name="title"
              value={formState.title}
              onChange={handleChange}
              placeholder="Job Title"
            />
            <label>Description</label>
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Description"
            />
            <label>Industry</label>
            <select
              name="industry"
              value={formState.industry}
              onChange={handleChange}
            >
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
            </select>

            <label>Experience Level</label>
            <select
              name="experienceLevel"
              value={formState.experienceLevel}
              onChange={handleChange}
            >
              <option value="Entry">Entry Level</option>
              <option value="Intermediate">Mid Level</option>
              <option value="Senior">Senior Level</option>
            </select>

            <label>Job Type</label>
            <select
              name="jobType"
              value={formState.jobType}
              onChange={handleChange}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Freelance">Freelance</option>
              <option value="Contract">Contract</option>
              <option value="Volunteer">Volunteer</option>
            </select>

            <label>Category</label>
            <select
              name="category"
              value={formState.category}
              onChange={handleChange}
            >
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

            <label>Pricing Style</label>
            <select
              name="paymentStyle"
              value={formState.paymentStyle}
              onChange={handleChange}
            >
              <option value="Fixed">Fixed</option>
              <option value="Range">Range</option>
              <option value="Negotiable">Negotiable</option>
              <option value="Hourly">Hourly</option>
              <option value="Monthly">Monthly</option>
            </select>

            <label>Salary</label>
            <input
              name="salary"
              value={formState.salary}
              onChange={handleChange}
              placeholder="Salary"
            />
            <label>Deadline</label>
            <input
              name="deadLine"
              value={new Date(formState.deadLine).toLocaleDateString()}
              onChange={handleChange}
              placeholder="Deadline"
              type="date"
            />
            <label>Mode of Delivery</label>
            <select
              name="deliveryMode"
              value={formState.deliveryMode}
              onChange={handleChange}
            >
              <option value="In-Person">In-Person</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            <label>Region</label>
            <input
              name="location.region"
              value={formState.location?.region}
              onChange={handleChange}
              placeholder="Region"
            />
            <label>City</label>
            <input
              name="location.city"
              value={formState.location?.city}
              onChange={handleChange}
              placeholder="City"
            />
            <label>Street or Suburb</label>
            <input
              name="location.street"
              value={formState.location?.street}
              onChange={handleChange}
              placeholder="Street"
            />

            {/* Job Tags */}
            <div className="input-group">
              <label>Job Tags</label>
              <div className="tag-container">
                {formState.jobTags.map((tag, idx) => (
                  <div className="tag" key={idx}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('jobTags', idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Add a tag and press Enter"
                  onKeyDown={(e) => handleArrayChange(e, 'jobTags')}
                />
              </div>
            </div>

            {/* Skills Required */}
            <div className="input-group">
              <label>Skills Required And Qualifications</label>
              <div className="tag-container">
                {formState.skillsRequired.map((skill, idx) => (
                  <div className="tag" key={idx}>
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('skillsRequired', idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Add a skill and press Enter"
                  onKeyDown={(e) => handleArrayChange(e, 'skillsRequired')}
                />
              </div>
            </div>

            {/* Responsibilities */}
            <div className="input-group">
              <label>Responsibilities</label>
              <div className="dynamic-list">
                {formState.responsibilities.map((responsibility, idx) => (
                  <div key={idx}>
                    {responsibility}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('responsibilities', idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Add a responsibility and press Enter"
                  onKeyDown={(e) => handleArrayChange(e, 'responsibilities')}
                />
              </div>
            </div>

            <button type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
