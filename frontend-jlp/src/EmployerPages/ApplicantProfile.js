import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaDownload,
  FaLinkedin,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaGraduationCap,
  FaAward,
  FaFileAlt,
  FaUser,
  FaStar,
  FaCheck,
  FaTimes,
  FaClock,
  FaEye
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImageWithFallback, MatchScoreIndicator, formatDate } from "../EmployerPages/JobApplicantsPageComponents/Utils";
import { modifyApplication } from "../APIS/API";

const ApplicantProfilePage = ({ applicants, onStatusChange }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const applicant = location.state?.app;
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAppStatusChange = async (id, status) => {
    try {
      setIsUpdating(true);
      const response = await modifyApplication(id, status);
      
      if (response.status === 200) {
        toast.success(`Application ${status.status} successfully`);
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!applicant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Applicant Not Found</h3>
          <p className="text-gray-600 mb-6">The requested applicant profile could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    reviewing: { 
      color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", 
      icon: FaEye,
      gradient: "from-blue-500 to-blue-600"
    },
    shortlisted: { 
      color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100", 
      icon: FaStar,
      gradient: "from-green-500 to-green-600"
    },
    interview: { 
      color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100", 
      icon: FaCalendarAlt,
      gradient: "from-purple-500 to-purple-600"
    },
    offered: { 
      color: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100", 
      icon: FaAward,
      gradient: "from-yellow-500 to-yellow-600"
    },
    rejected: { 
      color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100", 
      icon: FaTimes,
      gradient: "from-red-500 to-red-600"
    },
    accepted: { 
      color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100", 
      icon: FaCheck,
      gradient: "from-emerald-500 to-emerald-600"
    },
    pending: { 
      color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100", 
      icon: FaClock,
      gradient: "from-amber-500 to-amber-600"
    }
  };

  const statusOptions = ["Reviewing", "Shortlisted", "Interview", "Offered", "Rejected"];
  
  const currentStatus = applicant.status?.toLowerCase() || 'pending';
  const StatusIcon = statusConfig[currentStatus]?.icon || FaClock;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'education', label: 'Education', icon: FaGraduationCap },
    { id: 'documents', label: 'Documents', icon: FaFileAlt }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Applications</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className={`px-4 py-2 rounded-full border-2 ${statusConfig[currentStatus]?.color} flex items-center space-x-2`}>
                <StatusIcon className="w-4 h-4" />
                <span className="font-medium capitalize">{applicant.status || 'Pending'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className={`h-32 bg-gradient-to-r ${statusConfig[currentStatus]?.gradient || 'from-blue-500 to-purple-600'}`}></div>
          
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl">
                  <ImageWithFallback
                    src={applicant.user.profileImage}
                    alt={applicant.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r ${statusConfig[currentStatus]?.gradient} flex items-center justify-center shadow-lg`}>
                  <StatusIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {applicant.user.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <FaBriefcase className="w-4 h-4" />
                    <span>{applicant.user.experience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    <span>{applicant.user.location?.city}, {applicant.user.location?.region}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <a
                    href={`mailto:${applicant.user.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    <FaEnvelope className="w-4 h-4" />
                    Email
                  </a>
                  <a
                    href={`tel:${applicant.user.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                  >
                    <FaPhone className="w-4 h-4" />
                    Call
                  </a>
                  {applicant.user.linkedIn && (
                    <a
                      href={applicant.user.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <FaLinkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FaCalendarAlt}
            label="Applied"
            value={formatDate(applicant.dateApplied)}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={FaClock}
            label="Last Activity"
            value={formatDate(applicant.lastActivity)}
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={FaAward}
            label="Skills"
            value={`${applicant.user.skills?.length || 0} Listed`}
            gradient="from-green-500 to-green-600"
          />
          <StatCard
            icon={FaBriefcase}
            label="Experience"
            value={`${applicant.user.workExperience?.length || 0} Roles`}
            gradient="from-orange-500 to-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" role="tablist">
                  {tabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          isActive
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <TabIcon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Skills */}
                    <Section title="Skills & Expertise" icon={FaAward}>
                      {applicant.user.skills?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {applicant.user.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-800 px-4 py-2 text-sm rounded-full font-medium hover:shadow-md transition-shadow"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <EmptyState message="No skills listed" />
                      )}
                    </Section>

                    {/* Cover Letter */}
                    {applicant.coverLetter && (
                      <Section title="Cover Letter" icon={FaFileAlt}>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                            {applicant.coverLetter}
                          </div>
                        </div>
                      </Section>
                    )}
                  </div>
                )}

                {activeTab === 'experience' && (
                  <Section title="Work Experience" icon={FaBriefcase}>
                    {applicant.user.workExperience?.length ? (
                      <div className="space-y-4">
                        {applicant.user.workExperience.map((exp, i) => (
                          <ExperienceCard key={i} experience={exp} />
                        ))}
                      </div>
                    ) : (
                      <EmptyState message="No work experience listed" />
                    )}
                  </Section>
                )}

                {activeTab === 'education' && (
                  <Section title="Education" icon={FaGraduationCap}>
                    {applicant.user.education?.length ? (
                      <div className="space-y-4">
                        {applicant.user.education.map((edu, i) => (
                          <EducationCard key={i} education={edu} />
                        ))}
                      </div>
                    ) : (
                      <EmptyState message="No education information available" />
                    )}
                  </Section>
                )}

                {activeTab === 'documents' && (
                  <Section title="Documents & Files" icon={FaFileAlt}>
                    <div className="space-y-4">
                      {applicant.resume && (
                        <DocumentCard
                          title="Resume"
                          url={applicant.resume}
                          type="PDF"
                          icon={FaFileAlt}
                        />
                      )}
                      {/* Add more document types as needed */}
                      {!applicant.resume && (
                        <EmptyState message="No documents available" />
                      )}
                    </div>
                  </Section>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaAward className="w-5 h-5 text-blue-600" />
                Update Application Status
              </h3>
              <div className="space-y-3">
                {statusOptions.map((status) => {
                  const isActive = applicant.status?.toLowerCase() === status.toLowerCase();
                  const config = statusConfig[status.toLowerCase()];
                  const StatusButtonIcon = config?.icon || FaClock;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => handleAppStatusChange(applicant._id, { status })}
                      disabled={isUpdating || isActive}
                      className={`w-full flex items-center gap-3 px-4 py-3 border-2 rounded-xl transition-all text-left font-medium ${
                        config?.color || "bg-gray-50 text-gray-700 border-gray-200"
                      } ${
                        isActive 
                          ? "ring-2 ring-blue-500 ring-opacity-50 shadow-md" 
                          : "hover:shadow-md"
                      } ${
                        isUpdating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <StatusButtonIcon className="w-4 h-4" />
                      <span>{status}</span>
                      {isActive && <FaCheck className="w-4 h-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="w-5 h-5 text-blue-600" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <ContactItem
                  icon={FaEnvelope}
                  label="Email"
                  value={applicant.user.email}
                  href={`mailto:${applicant.user.email}`}
                />
                <ContactItem
                  icon={FaPhone}
                  label="Phone"
                  value={applicant.user.phone}
                  href={`tel:${applicant.user.phone}`}
                />
                <ContactItem
                  icon={FaMapMarkerAlt}
                  label="Address"
                  value={`${applicant.user.location?.street}, ${applicant.user.location?.city}, ${applicant.user.location?.region}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const Section = ({ title, icon: Icon, children }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-blue-600" />}
      {title}
    </h3>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, gradient }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const ExperienceCard = ({ experience }) => (
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-xl hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-2">
      <h4 className="text-lg font-semibold text-gray-900">{experience.jobTitle}</h4>
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <FaBriefcase className="w-5 h-5 text-white" />
      </div>
    </div>
    <p className="text-blue-700 font-medium mb-2">{experience.company}</p>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <FaCalendarAlt className="w-4 h-4" />
      <span>{formatDate(experience.startDate)} - {formatDate(experience.endDate)}</span>
    </div>
  </div>
);

const EducationCard = ({ education }) => (
  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-2">
      <h4 className="text-lg font-semibold text-gray-900">{education.degree}</h4>
      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
        <FaGraduationCap className="w-5 h-5 text-white" />
      </div>
    </div>
    <p className="text-green-700 font-medium mb-2">{education.institution}</p>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <FaCalendarAlt className="w-4 h-4" />
      <span>{formatDate(education.startDate)} - {formatDate(education.yearOfCompletion)}</span>
    </div>
  </div>
);

const DocumentCard = ({ title, url, type, icon: Icon }) => (
  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 p-4 rounded-xl hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{type}</p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium"
      >
        <FaDownload className="w-4 h-4" />
        Download
      </a>
    </div>
  </div>
);

const ContactItem = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
      <Icon className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      {href ? (
        <a href={href} className="text-blue-600 hover:text-blue-700 font-medium">
          {value}
        </a>
      ) : (
        <p className="font-medium text-gray-900">{value}</p>
      )}
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FaFileAlt className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-500">{message}</p>
  </div>
);

export default ApplicantProfilePage;