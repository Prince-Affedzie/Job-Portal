import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/PostJobForm.css";
import { addJob } from "../APIS/API";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import Footer from "../Components/Footer";

const PostJobForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        jobType: "Full-Time",
        industry: "",
        company: "",
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

    // Handle changing an individual skill
    

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
    
        try {
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
        }
    };

    return (
        <div>
             <EmployerNavbar/>
        <div className="post-job-container">
           
            <ToastContainer />
            <h2>Post a New Job</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Job Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                        <option value="">Select a category</option>
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
                    <label>Job Type</label>
                    <select name="jobType" value={formData.jobType} onChange={handleChange} required>
                        {["Full-Time", "Part-Time", "Mini-Task", "Errands", "Contract", "Freelance", "Volunteer"].map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Industry</label>
                    <input type="text" name="industry" value={formData.industry} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Company</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Delivery Mode</label>
                    <select name="deliveryMode" value={formData.deliveryMode} onChange={handleChange}>
                        <option value="">Select delivery mode</option>
                        <option value="In-Person">In-Person</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>

                {/* Location Fields */}
                <div className="form-group">
                    <label>Region</label>
                    <input type="text" name="region" value={formData.location.region} onChange={handleLocationChange} />
                </div>

                <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={formData.location.city} onChange={handleLocationChange} />
                </div>

                <div className="form-group">
                    <label>Street</label>
                    <input type="text" name="street" value={formData.location.street} onChange={handleLocationChange} />
                </div>

                <div className="form-group">
                    <label>Payment Style</label>
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
                    <label>Salary</label>
                    <input type="text" name="salary" value={formData.salary} onChange={handleChange} required />
                </div>

                {/* Skills Required (Array Instead of Comma-Separated) */}
                <div className="form-group">
                <label>Skills Required And Qualifications</label>
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
</div>


                <div className="form-group">
                    <label>Experience Level</label>
                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                        <option value="">Select experience level</option>
                        <option value="Entry">Entry</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Senior">Senior</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Application Deadline</label>
                    <input type="date" name="deadLine" value={formData.deadLine} onChange={handleChange} />
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
                </div>

                <button type="submit" className="submit-btn">Post Job</button>
            </form>
           
        </div>
        <Footer/>
        </div>
    );
};

export default PostJobForm;
