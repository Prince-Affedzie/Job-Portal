import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/JobDetails.css";
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaBriefcase, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaTasks,
  FaBuilding,
  FaFileAlt,
  FaEnvelope,
  FaUser
} from "react-icons/fa";
import Navbar from "../Components/MyComponents/Navbar";
import { getJobDetails, applyToJob } from "../APIS/API";
import ProcessingOverlay from "../Components/MyComponents/ProcessingOverLay";

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [formStep, setFormStep] = useState(1);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProcessing,setIsProcessing] = useState(false)

    const [applicationData, setApplicationData] = useState({
        fullName: "",
        email: "",
        resume: null,
        coverLetter: "",
    });

    useEffect(() => {
        if (!id) {
            setError("Job ID is missing");
            setLoading(false);
            return;
        }

        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                const response = await getJobDetails(id);
                if (response.status === 200) {
                    setJob(response.data);
                    setHasApplied(response.data.inviteForInterview);
                } else {
                    setError("Failed to load job details");
                }
            } catch (err) {
                setError("An error occurred while fetching job details");
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setApplicationData({ ...applicationData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Simulate upload progress
            setUploadProgress(0);
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);
            
            setApplicationData({ ...applicationData, resume: file });
        }
    };

    const nextStep = () => {
        if (formStep === 1 && (!applicationData.fullName || !applicationData.email)) {
            toast.warning("Please fill out all required fields");
            return;
        }
        setFormStep(2);
    };

    const prevStep = () => {
        setFormStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!applicationData.resume) {
            toast.warning("Please upload your resume before submitting");
            return;
        }
        
        const formData = new FormData();
        formData.append("fullName", applicationData.fullName);
        formData.append("email", applicationData.email);
        formData.append("coverLetter", applicationData.coverLetter);
        formData.append("resume", applicationData.resume);

        try {
            toast.info("Submitting your application...");
            const response = await applyToJob(formData, id);
            if (response.status === 200) {
                toast.success("Application submitted successfully!");
                setShowForm(false);
                setHasApplied(true);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "An unexpected error occurred. Please try again.";
            console.log(errorMessage);
            toast.error(errorMessage);
        }
    };

    if (loading) return (
        <div className="job-details-loading-container">
            <div className="job-details-loading">
                <div className="job-details-skeleton title"></div>
                <div className="job-details-skeleton text"></div>
                <div className="job-details-skeleton short"></div>
                <div className="job-details-skeleton text"></div>
                <div className="pulse-loader"></div>
                <p>Loading job details...</p>
            </div>
        </div>
    );
    
   /* if (error) return (
        <div className="error-container">
            <div className="error-message">
                <FaExclamationCircle />
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        </div>
    );*/
    
    if (!job) return (
        <div className="not-found-container">
            <div className="not-found">
                <h2>Job Not Found</h2>
                <p>The job listing you're looking for might have been removed or is no longer available.</p>
                <button onClick={() => window.history.back()}>Go Back</button>
            </div>
        </div>
    );

    const isDeadlinePassed = new Date(job.deadLine) < new Date();
    const daysUntilDeadline = Math.ceil((new Date(job.deadLine) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div className="job-details-page">
            <Navbar />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

            {/* Hero Section */}
            <div className="job-hero">
                <div className="job-hero-content">
                    <div className="company-avatar">
                        <FaBuilding size={32} />
                    </div>
                    <h1>{job.title}</h1>
                    <p className="company-name">{job.company}</p>
                    
                    <div className="job-highlights">
                        <span className="job-highlight">
                            <FaMapMarkerAlt /> {job.location.city}, {job.location.region}
                        </span>
                        <span className="job-highlight">
                            <FaBriefcase /> {job.jobType}
                        </span>
                        <span className="job-highlight">
                            <FaMoneyBillWave /> {job.salary}
                        </span>
                    </div>
                    
                    {!hasApplied && !isDeadlinePassed && !showForm && (
                        <button className="hero-apply-btn" onClick={() => setShowForm(true)}>
                            Apply Now
                        </button>
                    )}
                </div>
            </div>

            <div className="job-details-container">
                {/* Job Content Section */}
                <div className="job-content">
                    <div className="job-details-job-meta">
                        <span><FaMapMarkerAlt /> {job.location.city}, {job.location.region}</span>
                        <span><FaBriefcase /> {job.jobType}</span>
                        <span><FaMoneyBillWave /> {job.salary}</span>
                        <span className={`deadline ${isDeadlinePassed ? 'expired' : daysUntilDeadline <= 3 ? 'urgent' : ''}`}>
                            <FaClock /> 
                            {isDeadlinePassed 
                                ? 'Deadline passed' 
                                : daysUntilDeadline <= 3 
                                    ? `Urgent: ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left` 
                                    : `Deadline: ${new Date(job.deadLine).toLocaleDateString()}`
                            }
                        </span>
                    </div>

                    {/* Overview Card */}
                    <div className="job-overview-card">
                        <h2>Overview</h2>
                        <p>{job.description}</p>
                    </div>

                    {/* Responsibilities Section */}
                    <div className="responsibilities-container">
                        <h2><FaTasks /> Key Responsibilities</h2>
                        <ul className="responsibilities-list">
                            {job.responsibilities.map((resp, index) => (
                                <li key={index}>
                                    <span className="responsibility-marker"></span>
                                    {resp}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Skills Section */}
                    <div className="skills-container">
                        <h2>Required Skills</h2>
                        <div className="skills-container-jobDetails">
                            {job.skillsRequired.map((skill, index) => (
                                <span key={index} className="skill-chip">
                                    <FaCheckCircle /> {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Application Section */}
                <div className="apply-section">
                    <div className="apply-box">
                        {hasApplied ? (
                            <div className="applied-card">
                                <div className="success-icon">
                                    <FaCheckCircle size={40} />
                                </div>
                                <h3>Application Submitted</h3>
                                <p>Your application has been successfully submitted. We'll be in touch soon!</p>
                            </div>
                        ) : isDeadlinePassed ? (
                            <div className="deadline-passed-card">
                                <div className="expired-icon">
                                    <FaClock size={40} />
                                </div>
                                <h3>Application Closed</h3>
                                <p>The deadline for this position has passed.</p>
                            </div>
                        ) : !showForm ? (
                            <div className="apply-prompt">
                                <h2>Interested in this role?</h2>
                                <p>Submit your application today and take the next step in your career journey.</p>
                                <button className="apply-btn" onClick={() => setShowForm(true)}>Apply Now</button>
                                
                                <div className="application-deadline">
                                    <FaClock /> Application closes: {new Date(job.deadLine).toLocaleDateString()}
                                </div>
                            </div>
                        ) : (
                            <div className="application-form-container">
                                <h2>Apply for {job.title}</h2>
                                
                                {formStep === 1 ? (
                                    <form className="application-form step-1">
                                        <div className="form-step-indicator">
                                            <div className="step active">1</div>
                                            <div className="step-connector"></div>
                                            <div className="step">2</div>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label><FaUser /> Full Name</label>
                                            <input 
                                                type="text" 
                                                name="fullName" 
                                                value={applicationData.fullName} 
                                                onChange={handleChange} 
                                                placeholder="Enter your full name"
                                                required 
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label><FaEnvelope /> Email Address</label>
                                            <input 
                                                type="email" 
                                                name="email" 
                                                value={applicationData.email} 
                                                onChange={handleChange} 
                                                placeholder="Enter your email"
                                                required 
                                            />
                                        </div>

                                        <div className="form-actions">
                                            <button type="button" className="next-btn" onClick={nextStep}>Next</button>
                                            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleSubmit} className="application-form step-2">
                                        <div className="form-step-indicator">
                                            <div className="step completed">1</div>
                                            <div className="step-connector active"></div>
                                            <div className="step active">2</div>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label><FaFileAlt /> Upload Resume</label>
                                            <div className="file-upload-container">
                                                <input 
                                                    type="file" 
                                                    name="resume" 
                                                    id="resume-upload"
                                                    accept=".pdf,.docx" 
                                                    onChange={handleFileChange} 
                                                    required 
                                                />
                                                <label htmlFor="resume-upload" className="file-upload-btn">
                                                    <FaFileAlt /> {applicationData.resume ? applicationData.resume.name : "Choose File"}
                                                </label>
                                            </div>
                                            
                                            {uploadProgress > 0 && (
                                                <div className="upload-progress">
                                                    <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                                                    <span>{uploadProgress === 100 ? "Upload Complete" : "Uploading..."}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label>Cover Letter</label>
                                            <textarea 
                                                name="coverLetter" 
                                                value={applicationData.coverLetter} 
                                                onChange={handleChange}
                                                placeholder="Tell us why you're the perfect fit for this role..."
                                                rows="6"
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="form-actions">
                                            <button type="button" className="back-btn" onClick={prevStep}>Back</button>
                                            <button type="submit" className="submit-btn">Submit Application</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Company Info Card */}
                    <div className="company-info-card">
                    <h3>Financial Protection</h3>
                     <p className="safety-text">
                        <strong>Never pay any initial money or incentives</strong> to anyone. 
                         This platform does not require any upfront payments to secure Jobs.
                         If someone asks for payment, it's a scam.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;