import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addJob } from "../../APIS/API";
import EmployerNavbar from "../../Components/EmployerDashboard/EmployerNavbar";
import Footer from "../../Components/Common/Footer";
import ProcessingOverlay from "../../Components/Common/ProcessingOverLay";
import { 
  FaArrowLeft, 
  FaBriefcase, 
  FaBuilding, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaClock,
  FaGraduationCap,
  FaTag,
  FaCheckCircle,
  FaGlobe,
  FaLaptop,
  FaHandshake
} from "react-icons/fa";

const PostJobForm = () => {
    const navigate = useNavigate();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        jobType: "Full-Time",
        industry: "",
        company: "",
        companyEmail: "",
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

    // Simulate page loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Form sections for multi-step form
    const formSections = [
        { id: 1, title: "Basic Information", icon: <FaBriefcase /> },
        { id: 2, title: "Job Details", icon: <FaCheckCircle /> },
        { id: 3, title: "Location & Compensation", icon: <FaMoneyBillWave /> },
        { id: 4, title: "Skills & Requirements", icon: <FaGraduationCap /> }
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
            event.preventDefault();
            setFormData((prev) => ({
                ...prev,
                skillsRequired: [...prev.skillsRequired, inputValue.trim()],
            }));
            setInputValue("");
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
            e.preventDefault();
            setFormData((prevData) => ({
                ...prevData,
                tags: [...prevData.tags, tagInput.trim()],
            }));
            setTagInput("");
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
            event.preventDefault();
            setFormData((prev) => ({
                ...prev,
                responsibilities: [...prev.responsibilities, responsibilityInput.trim()],
            }));
            setResponsibilityInput("");
        }
    };

    const handleRemoveResponsibility = (index) => {
        setFormData((prev) => ({
            ...prev,
            responsibilities: prev.responsibilities.filter((_, i) => i !== index),
        }));
    };

    // Clean form data - remove empty strings and empty arrays
    const cleanFormData = (data) => {
        const cleaned = {};
        
        Object.keys(data).forEach(key => {
            if (key === 'location') {
                // Handle location object
                const locationData = {};
                Object.keys(data.location).forEach(locKey => {
                    if (data.location[locKey] && data.location[locKey].trim() !== '') {
                        locationData[locKey] = data.location[locKey].trim();
                    }
                });
                if (Object.keys(locationData).length > 0) {
                    cleaned.location = locationData;
                }
            } else if (Array.isArray(data[key])) {
                // Handle arrays - only include if not empty
                if (data[key].length > 0) {
                    cleaned[key] = data[key];
                }
            } else if (data[key] && data[key].toString().trim() !== '') {
                // Handle strings - only include if not empty
                cleaned[key] = data[key].toString().trim();
            }
        });

        return cleaned;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Add any remaining input values
        const finalFormData = { ...formData };

        if (tagInput.trim() !== "") {
            finalFormData.tags = [...finalFormData.tags, tagInput.trim()];
            setTagInput("");
        }

        if (inputValue.trim() !== "") {
            finalFormData.skillsRequired = [...finalFormData.skillsRequired, inputValue.trim()];
            setInputValue("");
        }

        if (responsibilityInput.trim() !== "") {
            finalFormData.responsibilities = [...finalFormData.responsibilities, responsibilityInput.trim()];
            setResponsibilityInput("");
        }

        try {
            setIsProcessing(true);
            const cleanedData = cleanFormData(finalFormData);
            
            // Map tags to jobTags to match schema
            if (cleanedData.tags) {
                cleanedData.jobTags = cleanedData.tags;
                delete cleanedData.tags;
            }

            console.log("Submitting cleaned data:", cleanedData);
            
            const response = await addJob(cleanedData);
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
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {formSections.map((section, index) => (
                        <React.Fragment key={section.id}>
                            <div 
                                className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${activeSection >= section.id ? 'text-blue-600' : 'text-gray-400'}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeSection >= section.id ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                                    <span className={`text-sm ${activeSection >= section.id ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {section.icon}
                                    </span>
                                </div>
                                <span className="text-xs font-medium hidden md:block">{section.title}</span>
                            </div>
                            {index < formSections.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 ${activeSection > section.id ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${((activeSection - 1) / (formSections.length - 1)) * 100}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    // Page loading indicator
    if (isPageLoading) {
        return (
           <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
               <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
               <p className="text-sm">Loading job posting forms...</p>
           </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <EmployerNavbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <ToastContainer />
                
                <div className="mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Dashboard
                    </button>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Post a New Job</h2>
                        <p className="text-gray-600">Find the perfect candidate for your position</p>
                    </div>
                </div>

                {renderProgressBar()}

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <form onSubmit={activeSection === formSections.length ? handleSubmit : (e) => e.preventDefault()}>
                        {/* Section 1: Basic Information */}
                        {activeSection === 1 && (
                            <div className="p-6 md:p-8">
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
                                            type="text" 
                                            name="title" 
                                            value={formData.title} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="e.g. Senior Frontend Developer"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Type <span className="text-red-500">*</span>
                                        </label>
                                        <select 
                                            name="jobType" 
                                            value={formData.jobType} 
                                            onChange={handleChange} 
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        >
                                            {["Full-Time", "Part-Time", "Mini-Task", "Errands", "Contract", "Freelance", "Volunteer"].map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company
                                        </label>
                                        <input 
                                            type="text" 
                                            name="company" 
                                            value={formData.company} 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="e.g. Acme Inc."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Email
                                        </label>
                                        <input 
                                            type="email" 
                                            name="companyEmail" 
                                            value={formData.companyEmail} 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="e.g. info@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Industry
                                        </label>
                                        <input 
                                            type="text" 
                                            name="industry" 
                                            value={formData.industry} 
                                            onChange={handleChange} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="e.g. Information Technology"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select 
                                            name="category" 
                                            value={formData.category} 
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        >
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
                                            <option value="Development">Development</option>
                                            <option value="Design">Design</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Tourism and Hospitality">Tourism and Hospitality</option>
                                            <option value="Non-profit and NGO">Non-profit and NGO</option>
                                            <option value="Legal">Legal</option>
                                            <option value="Logistics and Supply Chain">Logistics and Supply Chain</option>
                                            <option value="others">Others</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Delivery Mode
                                    </label>
                                    <div className="flex flex-wrap gap-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="deliveryMode" 
                                                value="In-Person" 
                                                checked={formData.deliveryMode === "In-Person"}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-2 border-2 ${formData.deliveryMode === "In-Person" ? 'bg-blue-100 border-blue-600 text-blue-600' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                                                <FaBuilding />
                                            </div>
                                            <span className="text-sm font-medium">In-Person</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="deliveryMode" 
                                                value="Remote" 
                                                checked={formData.deliveryMode === "Remote"}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-2 border-2 ${formData.deliveryMode === "Remote" ? 'bg-blue-100 border-blue-600 text-blue-600' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                                                <FaLaptop />
                                            </div>
                                            <span className="text-sm font-medium">Remote</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="deliveryMode" 
                                                value="Hybrid" 
                                                checked={formData.deliveryMode === "Hybrid"}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-2 border-2 ${formData.deliveryMode === "Hybrid" ? 'bg-blue-100 border-blue-600 text-blue-600' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                                                <FaHandshake />
                                            </div>
                                            <span className="text-sm font-medium">Hybrid</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-gray-200">
                                    <button 
                                        type="button" 
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        onClick={nextSection}
                                    >
                                        Next: Job Details
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Section 2: Job Details */}
                        {activeSection === 2 && (
                            <div className="p-6 md:p-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                        <FaCheckCircle className="text-blue-600" />
                                    </div>
                                    Job Details
                                </h3>
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleChange} 
                                        required 
                                        rows="6"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Provide a detailed description of the job..."
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Responsibilities
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-3">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formData.responsibilities.map((responsibility, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                                                    {responsibility}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveResponsibility(index)}
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={responsibilityInput}
                                            onChange={(e) => setResponsibilityInput(e.target.value)}
                                            onKeyDown={handleAddResponsibility}
                                            className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                            placeholder="Type a responsibility and press Enter"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Press Enter to add each responsibility</div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Experience Level
                                        </label>
                                        <select 
                                            name="experienceLevel" 
                                            value={formData.experienceLevel} 
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        >
                                            <option value="">Select experience level</option>
                                            <option value="Entry">Entry</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Senior">Senior</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Application Deadline
                                        </label>
                                        <input 
                                            type="date" 
                                            name="deadLine" 
                                            value={formData.deadLine} 
                                            onChange={handleChange} 
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6 border-t border-gray-200">
                                    <button 
                                        type="button" 
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                        onClick={prevSection}
                                    >
                                        Previous
                                    </button>
                                    <button 
                                        type="button" 
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        onClick={nextSection}
                                    >
                                        Next: Location & Compensation
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Section 3: Location & Compensation */}
                        {activeSection === 3 && (
                            <div className="p-6 md:p-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                        <FaMoneyBillWave className="text-blue-600" />
                                    </div>
                                    Location & Compensation
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Region
                                        </label>
                                        <input 
                                            type="text" 
                                            name="region" 
                                            value={formData.location.region} 
                                            onChange={handleLocationChange} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="e.g. Greater Accra"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input 
                                            type="text" 
                                            name="city" 
                                            value={formData.location.city} 
                                            onChange={handleLocationChange} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="e.g. Tema, Accra, Cape coast"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street
                                    </label>
                                    <input 
                                        type="text" 
                                        name="street" 
                                        value={formData.location.street} 
                                        onChange={handleLocationChange} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="e.g. Lapaz, kokomelemele, Haatso"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment Style
                                        </label>
                                        <select 
                                            name="paymentStyle" 
                                            value={formData.paymentStyle} 
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        >
                                            <option value="">Select payment style</option>
                                            <option value="Fixed">Fixed</option>
                                            <option value="Range">Range</option>
                                            <option value="Negotiable">Negotiable</option>
                                            <option value="Hourly">Hourly</option>
                                            <option value="Monthly">Monthly</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Salary
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₵</span>
                                            <input 
                                                type="text" 
                                                name="salary" 
                                                value={formData.salary} 
                                                onChange={handleChange} 
                                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                placeholder="e.g. 75,000 or 70-90K"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6 border-t border-gray-200">
                                    <button 
                                        type="button" 
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                        onClick={prevSection}
                                    >
                                        Previous
                                    </button>
                                    <button 
                                        type="button" 
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        onClick={nextSection}
                                    >
                                        Next: Skills & Requirements
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Section 4: Skills & Requirements */}
                        {activeSection === 4 && (
                            <div className="p-6 md:p-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                        <FaGraduationCap className="text-blue-600" />
                                    </div>
                                    Skills & Requirements
                                </h3>
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Skills Required & Qualifications
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-3">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formData.skillsRequired.map((skill, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                                                    {skill}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveSkill(index)}
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleAddSkill}
                                            className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                            placeholder="Type a skill and press Enter"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Press Enter to add each skill</div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Tags
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-3">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formData.tags.map((tag, index) => (
                                                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
                                                    <FaTag className="text-xs mr-1" />
                                                    {tag}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveTag(index)}
                                                        className="ml-2 text-gray-600 hover:text-gray-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Press Enter to add a tag"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleAddTag}
                                            className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Add relevant tags to improve discoverability</div>
                                </div>

                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-3">Job Posting Summary</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="text-sm">
                                            <strong>Job Title:</strong> {formData.title || "Not specified"}
                                        </div>
                                        <div className="text-sm">
                                            <strong>Company:</strong> {formData.company || "Not specified"}
                                        </div>
                                        <div className="text-sm">
                                            <strong>Job Type:</strong> {formData.jobType || "Not specified"}
                                        </div>
                                        <div className="text-sm">
                                            <strong>Location:</strong> {formData.location.city ? `${formData.location.city}, ${formData.location.region}` : "Not specified"}
                                        </div>
                                        <div className="text-sm">
                                            <strong>Salary:</strong> {formData.salary ? `₵${formData.salary} (${formData.paymentStyle})` : "Not specified"}
                                        </div>
                                        <div className="text-sm">
                                            <strong>Application Deadline:</strong> {formData.deadLine || "Not specified"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6 border-t border-gray-200">
                                    <button 
                                        type="button" 
                                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                        onClick={prevSection}
                                    >
                                        Previous
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                Posting...
                                            </>
                                        ) : "Post Job"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
            <Footer />
            <ProcessingOverlay show={isProcessing} message="Submitting your job posting..." />
        </div>
    );
};

export default PostJobForm;