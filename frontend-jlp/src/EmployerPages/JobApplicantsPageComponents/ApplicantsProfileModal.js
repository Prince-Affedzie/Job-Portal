import React, {useEffect} from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaDownload,
  FaUserCircle,
  FaLinkedin,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaFileAlt,
  FaClock,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaEye,
  FaAward
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImageWithFallback, MatchScoreIndicator, formatDate } from "./Utils";
import { modifyApplication } from "../../APIS/API";
import EmployerNavbar from "../../Components/EmployerDashboard/EmployerNavbar";
import EmployerSidebar from "../../Components/EmployerDashboard/SideBar";

const ApplicantProfileModal = ({ applicants, onStatusChange }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const applicant = location.state?.applicant;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleAppStatusChange = async (id, status) => {
    try {
      const response = await modifyApplication(id, status);
      
      if (response.status === 200) {
        toast.success(`Application ${status.status} successfully`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
       
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  if (!applicant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
          <FaExclamationCircle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Applicant Not Found</h2>
          <p className="text-gray-600 mb-6">The requested applicant profile could not be loaded.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusOptions = ["Reviewing", "Shortlisted", "Interview", "Offered", "Rejected"];
  const statusConfig = {
    reviewing: { 
      color: "border-blue-500 text-blue-700 hover:bg-blue-50 bg-blue-50/30", 
      icon: FaEye,
      bgGradient: "from-blue-500 to-blue-600"
    },
    shortlisted: { 
      color: "border-green-500 text-green-700 hover:bg-green-50 bg-green-50/30", 
      icon: FaCheckCircle,
      bgGradient: "from-green-500 to-green-600"
    },
    interview: { 
      color: "border-purple-500 text-purple-700 hover:bg-purple-50 bg-purple-50/30", 
      icon: FaClock,
      bgGradient: "from-purple-500 to-purple-600"
    },
    offered: { 
      color: "border-yellow-500 text-yellow-700 hover:bg-yellow-50 bg-yellow-50/30", 
      icon: FaAward,
      bgGradient: "from-yellow-500 to-yellow-600"
    },
    rejected: { 
      color: "border-red-500 text-red-700 hover:bg-red-50 bg-red-50/30", 
      icon: FaTimesCircle,
      bgGradient: "from-red-500 to-red-600"
    }
  };

  const currentStatus = applicant.status?.toLowerCase() || 'reviewing';
  const StatusIcon = statusConfig[currentStatus]?.icon || FaEye;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Applications</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Status Banner */}
            <div className={`h-2 bg-gradient-to-r ${statusConfig[currentStatus]?.bgGradient || 'from-gray-400 to-gray-500'}`}></div>
            
            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-gradient-to-br from-gray-100 to-gray-200">
                    {applicant?.profileImage ? (
                      <img
                        src={applicant.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <FaUserCircle className="w-full h-full text-gray-400" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <StatusIcon className={`text-xl ${statusConfig[currentStatus]?.color.split(' ')[1] || 'text-gray-500'}`} />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-4">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{applicant.name}</h1>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaBriefcase className="text-blue-500" />
                        <span className="font-medium">{applicant.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span>{applicant.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${statusConfig[currentStatus]?.color || 'border-gray-300 text-gray-600'}`}>
                      <StatusIcon />
                      {applicant.status || 'Reviewing'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <ActionButton
                      href={`mailto:${applicant.email}`}
                      icon={FaEnvelope}
                      text="Send Email"
                      variant="primary"
                    />
                    <ActionButton
                      href={`tel:${applicant.phone}`}
                      icon={FaPhone}
                      text="Call Now"
                      variant="secondary"
                    />
                    {applicant.linkedIn && (
                      <ActionButton
                        href={applicant.linkedIn}
                        icon={FaLinkedin}
                        text="LinkedIn"
                        variant="linkedin"
                        external
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={FaCalendarAlt}
              label="Applied Date"
              value={formatDate(applicant.dateApplied)}
              iconColor="text-blue-500"
              bgColor="bg-blue-50"
            />
            <InfoCard
              icon={FaClock}
              label="Last Activity"
              value={formatDate(applicant.lastActivity)}
              iconColor="text-green-500"
              bgColor="bg-green-50"
            />
            {applicant.resume && (
              <InfoCard
                icon={FaDownload}
                label="Resume"
                value={
                  <a
                    href={applicant.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors duration-200"
                  >
                    Download PDF
                  </a>
                }
                iconColor="text-purple-500"
                bgColor="bg-purple-50"
              />
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-8">
              {/* Skills Section */}
              <ContentCard title="Skills & Expertise" icon={FaAward}>
                {applicant.skills?.length ? (
                  <div className="flex flex-wrap gap-3">
                    {applicant.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-4 py-2 text-sm font-medium rounded-full text-blue-800 hover:shadow-md transition-shadow duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No skills listed" />
                )}
              </ContentCard>

              {/* Work Experience Section */}
              <ContentCard title="Work Experience" icon={FaBriefcase}>
                {applicant.workExperience?.length ? (
                  <div className="space-y-6">
                    {applicant.workExperience.map((exp, i) => (
                      <ExperienceCard
                        key={i}
                        title={exp.jobTitle}
                        company={exp.company}
                        startDate={exp.startDate}
                        endDate={exp.endDate}
                        type="work"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No work experience listed" />
                )}
              </ContentCard>

              {/* Cover Letter Section */}
              {applicant.coverLetter && (
                <ContentCard title="Cover Letter" icon={FaFileAlt}>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-l-4 border-blue-500 shadow-inner">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {applicant.coverLetter}
                    </div>
                  </div>
                </ContentCard>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Education Section */}
              <ContentCard title="Education" icon={FaGraduationCap}>
                {applicant.educationList?.length ? (
                  <div className="space-y-4">
                    {applicant.educationList.map((edu, i) => (
                      <ExperienceCard
                        key={i}
                        title={edu.degree}
                        company={edu.institution}
                        startDate={edu.startDate}
                        endDate={edu.yearOfCompletion}
                        type="education"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState text="No education information" />
                )}
              </ContentCard>

              {/* Status Update Section */}
              <ContentCard title="Application Status" icon={FaClock}>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Update the status of this application by clicking one of the buttons below:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {statusOptions.map((status) => {
                      const isActive = applicant.status?.toLowerCase() === status.toLowerCase();
                      const config = statusConfig[status.toLowerCase()];
                      const StatusButtonIcon = config?.icon || FaEye;
                      
                      return (
                        <button
                          key={status}
                          onClick={() => handleAppStatusChange(applicant.id, { status })}
                          className={`flex items-center gap-3 px-4 py-3 border-2 rounded-xl transition-all duration-200 text-left hover:shadow-md transform hover:-translate-y-0.5 ${
                            config?.color || "border-gray-300 text-gray-600"
                          } ${isActive ? "font-semibold shadow-lg ring-2 ring-opacity-50" : ""}`}
                        >
                          <StatusButtonIcon className="text-lg" />
                          <span>{status}</span>
                          {isActive && (
                            <span className="ml-auto text-xs bg-white bg-opacity-50 px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </ContentCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ActionButton = ({ href, icon: Icon, text, variant, external = false }) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300",
    linkedin: "bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg"
  };

  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 ${variants[variant]}`}
    >
      <Icon className="text-lg" />
      {text}
    </a>
  );
};

const InfoCard = ({ icon: Icon, label, value, iconColor, bgColor }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center gap-4">
      <div className={`${bgColor} p-3 rounded-xl`}>
        <Icon className={`text-xl ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">{label}</p>
        <div className="font-semibold text-gray-900 truncate">{value}</div>
      </div>
    </div>
  </div>
);

const ContentCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
        <Icon className="text-xl text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

const ExperienceCard = ({ title, company, startDate, endDate, type }) => (
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-200">
    <h4 className="font-bold text-lg text-gray-900 mb-1">{title}</h4>
    <p className="text-blue-600 font-semibold mb-2">{company}</p>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <FaCalendarAlt className="text-xs" />
      <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
    </div>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="text-center py-12">
    <div className="text-gray-400 mb-3">
      <FaExclamationCircle className="text-4xl mx-auto" />
    </div>
    <p className="text-gray-500 font-medium">{text}</p>
  </div>
);

export default ApplicantProfileModal;