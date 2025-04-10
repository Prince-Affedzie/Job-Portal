import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/JobDetails.css";
import { FaMapMarkerAlt, FaClock, FaBriefcase, FaMoneyBillWave, FaCheckCircle, FaTasks } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import { getJobDetails, applyToJob } from "../APIS/API";

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

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
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setApplicationData({ ...applicationData, [name]: value });
    };

    const handleFileChange = (e) => {
        setApplicationData({ ...applicationData, resume: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!applicationData.resume) {
            alert("Please upload your resume before submitting.");
            return;
        }
        const formData = new FormData();
        formData.append("fullName", applicationData.fullName);
        formData.append("email", applicationData.email);
        formData.append("coverLetter", applicationData.coverLetter);
        formData.append("resume", applicationData.resume); // Important!

        try {
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

    if (loading) return <div className="loading">Loading job details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!job) return <div className="not-found">Job not found</div>;

    return (
        <div>
            <Navbar />
            <ToastContainer />

            {/* Hero Section */}
            <div className="job-hero">
                <h1>{job.title}</h1>
                <p>{job.company}</p>
            </div>

            <div className="job-details-container">
                {/* Job Details Section */}
                <div className="job-content">
                    <div className="job-meta">
                        <span><FaMapMarkerAlt /> {job.location.city}, {job.location.region}</span>
                        <span><FaBriefcase /> {job.jobType}</span>
                        <span><FaMoneyBillWave /> {job.salary}</span>
                        <span><FaClock /> Deadline: {new Date(job.deadLine).toLocaleDateString()}</span>
                    </div>

                    <div className="job-description-container">
                        <h2>Job Description</h2>
                        <p>{job.description}</p>
                    </div>

                    {/* Responsibilities Section */}
                    <div className="responsibilities-container">
                        <h2><FaTasks /> Responsibilities</h2>
                        <ul>
                            {job.responsibilities.map((resp, index) => (
                                <li key={index}>{resp}</li>
                            ))}
                        </ul>
                    </div>

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

                {/* Sticky Apply Section */}
                <div className="apply-box">
                    {hasApplied ? (
                        <p className="applied-notice">✅ You have applied successfully</p>
                    ) : (
                        !showForm ? (
                            <button className="apply-btn" onClick={() => setShowForm(true)}>Apply Now</button>
                        ) : (
                            <div className="application-form">
                                <h2>Apply for {job.title}</h2>
                                <form onSubmit={handleSubmit}>
                                    <label>Full Name</label>
                                    <input type="text" name="fullName" value={applicationData.fullName} onChange={handleChange} required />

                                    <label>Email</label>
                                    <input type="email" name="email" value={applicationData.email} onChange={handleChange} required />

                                    <label>Upload Resume</label>
                                    <input type="file" name="resume" accept=".pdf,.docx" onChange={handleFileChange} required />

                                    <label>Cover Letter</label>
                                    <textarea name="coverLetter" value={applicationData.coverLetter} onChange={handleChange} required></textarea>

                                    <button type="submit">Submit Application</button>
                                    <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                                </form>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
