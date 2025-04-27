import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/PostJobForm.css";
import { addJob } from "../APIS/API";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import Footer from "../Components/MyComponents/Footer";
import ProcessingOverlay from "../Components/MyComponents/ProcessingOverLay";

const PostJobForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        jobType: "Full-Time",
        industry: "",
        company: "",
        companyEmail:"",
        deliveryMode: "",
        location: { region: "", city: "", street: "" },
        employerId: "",
        paymentStyle: "",
        salary: "",
        skillsRequired: [],
        responsibilities: [],
        tags: [],
        experienceLevel: "",
        deadLine: "",
    });

    const [tagInput, setTagInput] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [responsibilityInput, setResponsibilityInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeSection, setActiveSection] = useState(1);

    // Form sections for multi-step form
    const formSections = [
        { id: 1, title: "Basic Information" },
        { id: 2, title: "Job Details" },
        { id: 3, title: "Location & Compensation" },
        { id: 4, title: "Skills & Requirements" }
    ];

    // Handle text and select input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle location field changes
    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            location: { ...prevData.location, [name]: value },
        }));
    };

    // Handle adding a new skill
    const handleAddSkill = (event) => {
        if ((event.key === "Enter" || event.key === ",") && inputValue.trim()) {
            event.preventDefault(); // Prevent form submission
            setFormData((prev) => ({
                ...prev,
                skillsRequired: [...prev.skillsRequired, inputValue.trim()],
            }));
            setInputValue(""); // Clear input field
        }
    };

    // Handle removing a skill
    const handleRemoveSkill = (index) => {
        setFormData((prev) => ({
            ...prev,
            skillsRequired: prev.skillsRequired.filter((_, i) => i !== index),
        }));
    };

    const handleAddTag = (e) => {
        if (e.key === "Enter" && tagInput.trim() !== "") {
            e.preventDefault(); // Prevent form submission
            setFormData((prevData) => ({
                ...prevData,
                tags: [...prevData.tags, tagInput.trim()],
            }));
            setTagInput(""); // Reset input field
        }
    };

    const handleRemoveTag = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            tags: prevData.tags.filter((_, i) => i !== index),
        }));
    };

    const handleAddResponsibility = (event) => {
        if ((event.key === "Enter" || event.key === ",") && responsibilityInput.trim()) {
            event.preventDefault(); // Prevent form submission
            setFormData((prev) => ({
                ...prev,
                responsibilities: [...prev.responsibilities, responsibilityInput.trim()],
            }));
            setResponsibilityInput(""); // Clear input field
        }
    };

    const handleRemoveResponsibility = (index) => {
        setFormData((prev) => ({
            ...prev,
            responsibilities: prev.responsibilities.filter((_, i) => i !== index),
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (tagInput.trim() !== "") {
            setFormData((prevData) => ({
                ...prevData,
                tags: [...prevData.tags, tagInput.trim()],
            }));
            setTagInput(""); // Reset input field
        }

        if (inputValue.trim() !== "") {
            setFormData((prevData) => ({
                ...prevData,
                skillsRequired: [...prevData.skillsRequired, inputValue.trim()],
            }));
            setInputValue(""); // Reset input field
        }

        if (responsibilityInput.trim() !== "") {
            setFormData((prevData) => ({
                ...prevData,
                responsibilities: [...prevData.responsibilities, responsibilityInput.trim()],
            }));
            setResponsibilityInput(""); // Reset input field
        }

        try {
            setIsProcessing(true);
            const response = await addJob(formData);
            if (response.status === 200) {
                toast.success("You Successfully Posted the Job!");
                navigate("/employer/jobs");
            } else {
                toast.error(response.message || "Oops! Couldn't Add The Job. Please Try Again Later.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
            console.log(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    // Move to next section
    const nextSection = () => {
        if (activeSection < formSections.length) {
            setActiveSection(activeSection + 1);
            window.scrollTo(0, 0);
        }
    };

    // Move to previous section
    const prevSection = () => {
        if (activeSection > 1) {
            setActiveSection(activeSection - 1);
            window.scrollTo(0, 0);
        }
    };

    // Render progress bar
    const renderProgressBar = () => {
        return (
            <div className="progress-container">
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(activeSection / formSections.length) * 100}%` }}></div>
                </div>
                <div className="progress-steps">
                    {formSections.map((section) => (
                        <div 
                            key={section.id}
                            className={`progress-step ${activeSection >= section.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            <div className="step-number">{section.id}</div>
                            <div className="step-title">{section.title}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <EmployerNavbar />
            <div className="post-job-container">
                <ToastContainer />
                <div className="form-header">
                    <h2>Post a New Job</h2>
                    <p className="form-subtitle">Find the perfect candidate for your position</p>
                </div>

                {renderProgressBar()}

                <form onSubmit={activeSection === formSections.length ? handleSubmit : (e) => e.preventDefault()}>
                    {/* Section 1: Basic Information */}
                    {activeSection === 1 && (
                        <div className="form-section">
                            <h3 className="section-title">Basic Information</h3>
                            
                            <div className="form-group">
                                <label>Job Title <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="e.g. Senior Frontend Developer"
                                />
                            </div>

                            <div className="form-group">
                                <label>Company <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    name="company" 
                                    value={formData.company} 
                                    onChange={handleChange} 
                                    required
                                    placeholder="e.g. Acme Inc."
                                />
                            </div>
                            <div className="form-group">
                                <label>Company Email <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    name="companyEmail" 
                                    value={formData.companyEmail} 
                                    onChange={handleChange} 
                                    required
                                    placeholder="e.g. Info@ABC.com or Use personal email"
                                />
                            </div>

                            <div className="form-group">
                                <label>Job Type <span className="required">*</span></label>
                                <select name="jobType" value={formData.jobType} onChange={handleChange} required>
                                    {["Full-Time", "Part-Time", "Mini-Task", "Errands", "Contract", "Freelance", "Volunteer"].map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Industry</label>
                                <input 
                                    type="text" 
                                    name="industry" 
                                    value={formData.industry} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Information Technology"
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select name="category" value={formData.category} onChange={handleChange}>
                                    <option value="">Select a category</option>
                                    <option value="Administration">Administration</option>
                                    <option value="Administrative Assistance">Administrative Assistance</option>
                                    <option value="Accounting">Accounting</option>
                                    <option value="Agriculture">Agriculture</option>
                                    <option value="Banking">Banking</option>
                                    <option value="Customer Service">Customer Service</option>
                                    <option value="Consulting">Consulting</option>
                                    <option value="Education">Education</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Health">Health</option>
                                    <option value="Human Resources">Human Resources</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Project Management">Project Management</option>
                                    <option value="Software Development">Software Development</option>
                                    <option value="Sales">Sales</option>
                                    <option value="others">others</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Delivery Mode</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input 
                                            type="radio" 
                                            name="deliveryMode" 
                                            value="In-Person" 
                                            checked={formData.deliveryMode === "In-Person"}
                                            onChange={handleChange}
                                        />
                                        In-Person
                                    </label>
                                    <label className="radio-label">
                                        <input 
                                            type="radio" 
                                            name="deliveryMode" 
                                            value="Remote" 
                                            checked={formData.deliveryMode === "Remote"}
                                            onChange={handleChange}
                                        />
                                        Remote
                                    </label>
                                    <label className="radio-label">
                                        <input 
                                            type="radio" 
                                            name="deliveryMode" 
                                            value="Hybrid" 
                                            checked={formData.deliveryMode === "Hybrid"}
                                            onChange={handleChange}
                                        />
                                        Hybrid
                                    </label>
                                </div>
                            </div>

                            <div className="form-navigation">
                                <button type="button" className="next-btn" onClick={nextSection}>Next</button>
                            </div>
                        </div>
                    )}

                    {/* Section 2: Job Details */}
                    {activeSection === 2 && (
                        <div className="form-section">
                            <h3 className="section-title">Job Details</h3>
                            
                            <div className="form-group">
                                <label>Description <span className="required">*</span></label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Provide a detailed description of the job..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Job Responsibilities</label>
                                <div className="responsibilities-container">
                                    {formData.responsibilities.map((responsibility, index) => (
                                        <span key={index} className="responsibility-tag">
                                            {responsibility}
                                            <button type="button" onClick={() => handleRemoveResponsibility(index)}>❌</button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={responsibilityInput}
                                        onChange={(e) => setResponsibilityInput(e.target.value)}
                                        onKeyDown={handleAddResponsibility}
                                        placeholder="Type a responsibility and press Enter"
                                    />
                                </div>
                                <div className="hint-text">Press Enter to add each responsibility</div>
                            </div>

                            <div className="form-group">
                                <label>Experience Level</label>
                                <div className="select-wrapper">
                                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                                        <option value="">Select experience level</option>
                                        <option value="Entry">Entry</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Senior">Senior</option>
                                    </select>
                                    <div className="select-arrow"></div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Application Deadline</label>
                                <input 
                                    type="date" 
                                    name="deadLine" 
                                    value={formData.deadLine} 
                                    onChange={handleChange} 
                                    placeholder="dd/mm/yyyy"
                                />
                            </div>

                            <div className="form-navigation">
                                <button type="button" className="prev-btn" onClick={prevSection}>Previous</button>
                                <button type="button" className="next-btn" onClick={nextSection}>Next</button>
                            </div>
                        </div>
                    )}

                    {/* Section 3: Location & Compensation */}
                    {activeSection === 3 && (
                        <div className="form-section">
                            <h3 className="section-title">Location & Compensation</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Region</label>
                                    <input 
                                        type="text" 
                                        name="region" 
                                        value={formData.location.region} 
                                        onChange={handleLocationChange} 
                                        placeholder="e.g. Greater Accra"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>City</label>
                                    <input 
                                        type="text" 
                                        name="city" 
                                        value={formData.location.city} 
                                        onChange={handleLocationChange} 
                                        placeholder="e.g. Tema, Accra, Cape coast"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Street</label>
                                <input 
                                    type="text" 
                                    name="street" 
                                    value={formData.location.street} 
                                    onChange={handleLocationChange} 
                                    placeholder="e.g. Lapaz, kokomelemele, Haatso"
                                />
                            </div>

                            <div className="form-group">
                                <label>Payment Style <span className="required">*</span></label>
                                <select name="paymentStyle" value={formData.paymentStyle} onChange={handleChange} required>
                                    <option value="">Select payment style</option>
                                    <option value="Fixed">Fixed</option>
                                    <option value="Range">Range</option>
                                    <option value="Negotiable">Negotiable</option>
                                    <option value="Hourly">Hourly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Salary <span className="required">*</span></label>
                                <div className="salary-input">
                                    <span className="currency-symbol">₵</span>
                                    <input 
                                        type="text" 
                                        name="salary" 
                                        value={formData.salary} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="e.g. 75,000 or 70-90K"
                                    />
                                </div>
                            </div>

                            <div className="form-navigation">
                                <button type="button" className="prev-btn" onClick={prevSection}>Previous</button>
                                <button type="button" className="next-btn" onClick={nextSection}>Next</button>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Skills & Requirements */}
                    {activeSection === 4 && (
                        <div className="form-section">
                            <h3 className="section-title">Skills & Requirements</h3>
                            
                            <div className="form-group">
                                <label>Skills Required & Qualifications</label>
                                <div className="skills-container">
                                    {formData.skillsRequired.map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill} <button type="button" onClick={() => handleRemoveSkill(index)}>❌</button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                        placeholder="Type a skill and press Enter"
                                    />
                                </div>
                                <div className="hint-text">Press Enter to add each skill</div>
                            </div>

                            <div className="form-group">
                                <label>Job Tags</label>
                                <div className="tags-container">
                                    {formData.tags.map((tag, index) => (
                                        <span key={index} className="tag">
                                            {tag}
                                            <button type="button" onClick={() => handleRemoveTag(index)}>❌</button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        placeholder="Press Enter to add a tag"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                    />
                                </div>
                                <div className="hint-text">Add relevant tags to improve discoverability</div>
                            </div>

                            <div className="form-group form-summary">
                                <h4>Job Posting Summary</h4>
                                <div className="summary-item">
                                    <strong>Job Title:</strong> {formData.title || "Not specified"}
                                </div>
                                <div className="summary-item">
                                    <strong>Company:</strong> {formData.company || "Not specified"}
                                </div>
                                <div className="summary-item">
                                    <strong>Job Type:</strong> {formData.jobType || "Not specified"}
                                </div>
                                <div className="summary-item">
                                    <strong>Location:</strong> {formData.location.city ? `${formData.location.city}, ${formData.location.region}` : "Not specified"}
                                </div>
                                <div className="summary-item">
                                    <strong>Salary:</strong> {formData.salary ? ` ₵${formData.salary} (${formData.paymentStyle})` : "Not specified"}
                                </div>
                                <div className="summary-item">
                                    <strong>Application Deadline:</strong> {formData.deadLine || "Not specified"}
                                </div>
                            </div>

                            <div className="form-navigation">
                                <button type="button" className="prev-btn" onClick={prevSection}>Previous</button>
                                <button type="submit" className="submit-btn" disabled={isProcessing}>
                                    {isProcessing ? "Posting..." : "Post Job"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
            <Footer />
            <ProcessingOverlay show={isProcessing} message="Submitting your job posting..." />
        </div>
    );
};

export default PostJobForm;