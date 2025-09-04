import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../Styles/coverLetter.css'
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
  FaUser,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaRegBookmark,
  FaBookmark,
  FaShare,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import Navbar from "../../Components/Common/Navbar";
import { getJobDetails, applyToJob, sendFileToS3 } from "../../APIS/API";
import ProcessingOverlay from "../../Components/Common/ProcessingOverLay";
import CoverLetterField from "../../Components/Common/coverLetter";
import { NotificationToast } from "../../Components/Common/NotificationToast";

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [formStep, setFormStep] = useState(1);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEditorExpanded, setIsEditorExpanded] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);

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
        const file = e.target.files[0];
        if (file) {
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

    useEffect(() => {
          window.scrollTo(0, 0);
     }, []);

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
            setIsProcessing(true);
            toast.info("Submitting your application...");
            const response = await applyToJob(formData, id);
            if (response.status === 200) {
                const { uploadUrl } = response.data;
                await sendFileToS3(uploadUrl, applicationData.resume);
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
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const isDeadlinePassed = job ? new Date(job.deadLine) < new Date() : false;
    const daysUntilDeadline = job ? Math.ceil((new Date(job.deadLine) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            {isProcessing && <ProcessingOverlay />}

            {loading ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            <div className="md:col-span-2 space-y-6">
                                <div className="h-64 bg-gray-200 rounded-lg"></div>
                                <div className="h-32 bg-gray-200 rounded-lg"></div>
                            </div>
                            <div className="h-96 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            ) : !job ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
                        <p className="text-gray-600 mb-6">
                            The job listing you're looking for might have been removed or is no longer available.
                        </p>
                        <button 
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    <div className="bg-white shadow-sm max-w-7xl mx-auto mt-5">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <FaBuilding className="w-8 h-8 text-blue-600" />
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
                                            <p className="text-lg text-gray-600 mt-1">{job.company || 'Anonymous Company'}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setIsBookmarked(!isBookmarked)}
                                                className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                                                aria-label={isBookmarked ? "Unbookmark job" : "Bookmark job"}
                                            >
                                                {isBookmarked ? <FaBookmark className="w-5 h-5 text-yellow-500" /> : <FaRegBookmark className="w-5 h-5" />}
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                <FaShare className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                            <FaBriefcase className="mr-1.5" /> {job.jobType}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                                            <FaMapMarkerAlt className="mr-1.5" /> {job.location.city}, {job.location.region}
                                        </span>
                                        {job.salary && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                                                <FaMoneyBillWave className="mr-1.5" /> {job.salary}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            isDeadlinePassed 
                                                ? "bg-red-100 text-red-800" 
                                                : daysUntilDeadline <= 3 
                                                    ? "bg-orange-100 text-orange-800"
                                                    : "bg-gray-100 text-gray-800"
                                        }`}>
                                            <FaClock className="mr-1.5" />
                                            {isDeadlinePassed 
                                                ? 'Deadline passed' 
                                                : daysUntilDeadline <= 3 
                                                    ? `Urgent: ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left` 
                                                    : `Deadline: ${new Date(job.deadLine).toLocaleDateString()}`
                                            }
                                        </span>
                                    </div>
                                    
                                   {/* {!hasApplied && !isDeadlinePassed && !showForm && (
                                        <button 
                                            onClick={() => setShowForm(true)}
                                            className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                        >
                                            Apply Now
                                        </button>
                                    )}*/}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Job Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Job Description */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div 
                                        className="p-6 cursor-pointer"
                                        onClick={() => toggleSection('description')}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
                                          { /* {expandedSection === 'description' ? (
                                                <FaChevronUp className="text-gray-400" />
                                            ) : (
                                                <FaChevronDown className="text-gray-400" />
                                            )} */}
                                        </div>
                                    </div>
                                   
                                       <div className="px-6 pb-6">
                                        <div className="prose max-w-none text-gray-700">
                                        {job.description.split('\n').map((paragraph, index) => (
                                       paragraph.trim() && (
                                       <p key={index} className="mb-4 last:mb-0">
                                        {paragraph}
                                      </p>
                                           )
                                           ))}
                                      </div>
                                   </div>
                                </div>

                                {/* Responsibilities */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div 
                                        className="p-6 cursor-pointer"
                                        onClick={() => toggleSection('responsibilities')}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                <FaTasks className="text-blue-600" /> Key Responsibilities
                                            </h2>
                                            {/*{expandedSection === 'responsibilities' ? (
                                                <FaChevronUp className="text-gray-400" />
                                            ) : (
                                                <FaChevronDown className="text-gray-400" />
                                            )}*/}
                                        </div>
                                    </div>
                                   
                                        <div className="px-6 pb-6">
                                            <ul className="space-y-3">
                                                {job.responsibilities.map((resp, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                                                            <FaCheckCircle />
                                                        </span>
                                                        <span className="ml-3 text-gray-700">{resp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    
                                </div>

                                {/* Skills */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div 
                                        className="p-6 cursor-pointer"
                                        onClick={() => toggleSection('skills')}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-semibold text-gray-900">Required Skills</h2>
                                            {/*{expandedSection === 'skills' ? (
                                                <FaChevronUp className="text-gray-400" />
                                            ) : (
                                                <FaChevronDown className="text-gray-400" />
                                            )}*/}
                                        </div>
                                    </div>
                                    
                        <div className="px-6 pb-6">
                        <ul className="space-y-3">
                     {job.skillsRequired.length > 0 ? (
                    job.skillsRequired.map((skill, index) => (
                   <li key={index} className="flex items-center">
                      <span className="inline-flex items-center px-3 py-1.5 text-gray-700 text-sm font-medium">
                       <FaCheckCircle className="mr-2 text-blue-600" /> 
                      {skill}
                     </span>
                   </li>
                 ))
                ) : (
                <li>
               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                 <div className="flex">
                  <div className="flex-shrink-0">
                  <FaInfoCircle className="h-5 w-5 text-yellow-400" />
                  </div>
               <div className="ml-3">
                     <p className="text-sm text-yellow-700">
                No specific skills highlighted for this position. 
                General qualifications may be discussed during the interview process.
                   </p>
                   </div>
                   </div>
                </div>
             </li>
             )}
              </ul>
                 </div>
                                    
                        </div>
                            </div>

                            {/* Right Column - Application */}
                            <div className="space-y-6">
                                {hasApplied ? (
                                    <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6 text-center">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                            <FaCheckCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h3 className="mt-3 text-lg font-medium text-gray-900">Application Submitted</h3>
                                        <p className="mt-2 text-sm text-gray-600">
                                            Your application has been successfully submitted. We'll be in touch soon!
                                        </p>
                                    </div>
                                ) : isDeadlinePassed ? (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                                            <FaClock className="h-6 w-6 text-gray-500" />
                                        </div>
                                        <h3 className="mt-3 text-lg font-medium text-gray-900">Application Closed</h3>
                                        <p className="mt-2 text-sm text-gray-600">
                                            The deadline for this position has passed.
                                        </p>
                                    </div>
                                ) : !showForm ? (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-lg font-medium text-gray-900">Interested in this role?</h2>
                                        <p className="mt-2 text-sm text-gray-600">
                                            Submit your application today and take the next step in your career journey.
                                        </p>
                                        <button 
                                            onClick={() => setShowForm(true)}
                                            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                                        >
                                            Apply Now
                                        </button>
                                        <div className="mt-4 flex items-center text-sm text-gray-500">
                                            <FaClock className="mr-2" />
                                            Application closes: {new Date(job.deadLine).toLocaleDateString()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-lg font-medium text-gray-900 mb-4">Apply for {job.title}</h2>
                                        
                                        {formStep === 1 ? (
                                            <form className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-medium">
                                                            1
                                                        </div>
                                                        <div className="ml-2 text-sm font-medium text-gray-700">Basic Information</div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-sm font-medium flex items-center justify-center">
                                                            2
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                    <input 
                                                        type="text" 
                                                        name="fullName" 
                                                        value={applicationData.fullName} 
                                                        onChange={handleChange} 
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Enter your full name"
                                                        required 
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                    <input 
                                                        type="email" 
                                                        name="email" 
                                                        value={applicationData.email} 
                                                        onChange={handleChange} 
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Enter your email"
                                                        required 
                                                    />
                                                </div>

                                                <div className="flex justify-between pt-4">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setShowForm(false)}
                                                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        onClick={nextStep}
                                                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-medium">
                                                            1
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-medium flex items-center justify-center">
                                                            2
                                                        </div>
                                                        <div className="ml-2 text-sm font-medium text-gray-700">Documents</div>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume</label>
                                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                        <div className="space-y-1 text-center">
                                                            <div className="flex text-sm text-gray-600">
                                                                <label
                                                                    htmlFor="resume-upload"
                                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                                                >
                                                                    <span>Upload a file</span>
                                                                    <input 
                                                                        id="resume-upload" 
                                                                        name="resume" 
                                                                        type="file" 
                                                                        accept=".pdf,.docx"
                                                                        className="sr-only"
                                                                        onChange={handleFileChange}
                                                                        required
                                                                    />
                                                                </label>
                                                                <p className="pl-1">or drag and drop</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                PDF, DOCX up to 5MB
                                                            </p>
                                                            {applicationData.resume && (
                                                                <p className="text-sm text-gray-900 mt-2">
                                                                    Selected: {applicationData.resume.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {uploadProgress > 0 && (
                                                        <div className="mt-2">
                                                            <div className="relative pt-1">
                                                                <div className="flex mb-2 items-center justify-between">
                                                                    <div>
                                                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                                            {uploadProgress === 100 ? "Complete" : "Uploading"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-xs font-semibold inline-block text-blue-600">
                                                                            {uploadProgress}%
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                                                    <div 
                                                                        style={{ width: `${uploadProgress}%` }}
                                                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    
                                                    <CoverLetterField 
                                                        value={applicationData.coverLetter} 
                                                        onChange={handleChange}
                                                    />
                                                   
                                                </div>

                                                <div className="flex justify-between pt-4">
                                                    <button 
                                                        type="button" 
                                                        onClick={prevStep}
                                                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Back
                                                    </button>
                                                    <button 
                                                        type="submit" 
                                                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        Submit Application
                                                    </button>
                                                     {isEditorExpanded && <div className="modal-backdrop" onClick={() => setIsEditorExpanded(false)}></div>}
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                )}

                                {/* Company Info Card */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Financial Protection</h3>
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">
                                                    <strong>Never pay any initial money or incentives</strong> to anyone. 
                                                    This platform does not require any upfront payments to secure Jobs.
                                                    If someone asks for payment, it's a scam.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <NotificationToast/>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default JobDetails;