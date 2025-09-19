import React, { useEffect, useState } from "react";
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
  FaAward,
  FaGlobe,
  FaCertificate,
  FaLink,
  
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../../Components/EmployerDashboard/EmployerNavbar";
import LoadingSkeleton from "../../Components/Common/LoadingSkeleton";
import ErrorBoundary from "../../Components/Common/ErrorBoundary";
import  usePrint  from "../../hooks/usePrint";
import { formatDate } from "../../Components/EmployerDashboard/Utils";
import { modifyApplication } from "../../APIS/API";
import PortfolioPreview from "../../Components/ProfileEdit/PortfolioPreview"; // Added PortfolioPreview import

const ApplicantProfilePage = ({ applicants, onStatusChange }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { handlePrint, printableRef } = usePrint();
  const applicant = location.state?.applicant;


  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
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
        if (onStatusChange) onStatusChange(id, status.status);
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  const statusOptions = ["Reviewing", "Shortlisted", "Interview", "Offered", "Rejected"];
  const statusConfig = {
    reviewing: { 
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: FaEye,
      bgGradient: "from-blue-500 to-blue-600"
    },
    shortlisted: { 
      color: "bg-green-100 text-green-800 border-green-200",
      icon: FaCheckCircle,
      bgGradient: "from-green-500 to-green-600"
    },
    interview: { 
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: FaClock,
      bgGradient: "from-purple-500 to-purple-600"
    },
    offered: { 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: FaAward,
      bgGradient: "from-yellow-500 to-yellow-600"
    },
    rejected: { 
      color: "bg-red-100 text-red-800 border-red-200",
      icon: FaTimesCircle,
      bgGradient: "from-red-500 to-red-600"
    }
  };

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!applicant) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <EmployerNavbar />
          <div className="flex flex-1">
            <div className=" lg:block sm:hidden">
            <Sidebar />
            </div>
            <div className={`lg:ml-64 flex-1 p-8 flex items-center justify-center transition-all duration-300`}>
              <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
                <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Applicant Not Found</h2>
                <p className="text-gray-600 mb-6">The requested applicant profile could not be loaded.</p>
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Return to Applications
                </button>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  const currentStatus = applicant.status?.toLowerCase() || 'reviewing';
  const StatusIcon = statusConfig[currentStatus]?.icon || FaEye;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col" ref={printableRef}>
        <EmployerNavbar />
        <div className="flex flex-1">
          <div className="lg:block sm:hidden">
            <Sidebar />
            </div>
          
          <main className="lg:ml-64 flex-1 transition-all duration-300 p-6 lg:p-8 bg-gray-50">
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
            />

            {/* Header with Back Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Applications
              </button>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              {/* Status Indicator Bar */}
              <div className={`h-2 bg-gradient-to-r ${statusConfig[currentStatus]?.bgGradient || 'from-gray-400 to-gray-500'}`} />
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-md">
                      {applicant.profileImage ? (
                        <img
                          src={applicant.profileImage}
                          alt={`${applicant.name}'s profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-profile.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <FaUserCircle className="text-gray-400 text-5xl" />
                        </div>
                      )}
                    </div>
                   
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-4">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                        {applicant.name}
                      </h1>
                      {applicant.currentPosition && (
                        <p className="text-lg text-gray-600 mb-3">{applicant.currentPosition}</p>
                      )}
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                        {applicant.location && (
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-red-500" />
                            <span>{applicant.location}</span>
                          </div>
                        )}
                        {applicant.website && (
                          <a
                            href={applicant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:underline"
                          >
                            <FaGlobe className="mr-2 text-blue-500" />
                            <span>Website</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Status Badge and Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusConfig[currentStatus]?.color}`}>
                        <StatusIcon className="mr-2" />
                        {applicant.status || 'Reviewing'}
                      </div>

                      <div className="flex gap-2">
                        <ActionButton
                          href={`mailto:${applicant.email}`}
                          icon={FaEnvelope}
                          text="Email"
                          variant="primary"
                        />
                        <ActionButton
                          href={`tel:${applicant.phone}`}
                          icon={FaPhone}
                          text="Call"
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
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard
                icon={FaCalendarAlt}
                label="Applied Date"
                value={formatDate(applicant.dateApplied)}
                iconColor="text-blue-500"
              />
              <StatCard
                icon={FaClock}
                label="Last Activity"
                value={formatDate(applicant.lastActivity)}
                iconColor="text-green-500"
              />
              {applicant.resume && (
                <StatCard
                  icon={FaDownload}
                  label="Resume"
                  value={
                    <a
                      href={applicant.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </a>
                  }
                  iconColor="text-purple-500"
                />
              )}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-6">
                {/* About Section */}
                {applicant.about && (
                  <SectionCard title="About" icon={FaUserCircle}>
                    <div className="prose max-w-none text-gray-700">
                      {applicant.about}
                    </div>
                  </SectionCard>
                )}

                {/* Skills Section */}
                <SectionCard title="Skills & Expertise" icon={FaAward}>
                  {applicant.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No skills listed" />
                  )}
                </SectionCard>

                {/* Work Experience */}
                <SectionCard title="Work Experience" icon={FaBriefcase}>
                  {applicant.workExperience?.length > 0 ? (
                    <div className="space-y-4">
                      {applicant.workExperience.map((exp, index) => (
                        <ExperienceItem
                          key={index}
                          title={exp.jobTitle}
                          subtitle={exp.company}
                          startDate={exp.startDate}
                          endDate={exp.endDate}
                          description={exp.description}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No work experience listed" />
                  )}
                </SectionCard>

                {/* Cover Letter */}
                
                {applicant.coverLetter && (
                <SectionCard title="Cover Letter" icon={FaFileAlt}>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap bg-gray-50 p-6 rounded-lg">
                {/* Split by double newlines to preserve paragraphs */}
               {applicant.coverLetter.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                  {paragraph.split('\n').map((line, lineIndex) => (
                     <React.Fragment key={lineIndex}>
                    {line}
                  {lineIndex < paragraph.split('\n').length - 1 && <br />}
                   </React.Fragment>
              ))}
             </p>
              ))}
             </div>
             </SectionCard>
            )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Education */}
                <SectionCard title="Education" icon={FaGraduationCap}>
                  {applicant.educationList?.length > 0 ? (
                    <div className="space-y-4">
                      {applicant.educationList.map((edu, index) => (
                        <ExperienceItem
                          key={index}
                          title={edu.degree}
                          subtitle={edu.institution}
                          startDate={edu.startDate}
                          endDate={edu.yearOfCompletion}
                          description={edu.description}
                          isEducation
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No education information" />
                  )}
                </SectionCard>

                {/* Portfolio Section */}
                <SectionCard title="Portfolio" icon={FaGlobe}>
                  {applicant.workPortfolio?.length > 0 ? (
                    <div className="space-y-4">
                      {applicant.workPortfolio.map((portfolio, index) => (
                        <PortfolioPreview
                          key={index}
                          portfolio={portfolio}
                          isCompact={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="No portfolio items available" />
                  )}
                </SectionCard>

                {/* Documents */}
                <SectionCard title="Documents" icon={FaFileAlt}>
                  <div className="space-y-3">
                    {applicant.resume && (
                      <DocumentItem
                        title="Resume"
                        url={applicant.resume}
                        type="PDF"
                        icon={FaFileAlt}
                      />
                    )}
                    {applicant.certifications?.map((cert, index) => (
                      <DocumentItem
                        key={index}
                        title={cert.name || `Certification ${index + 1}`}
                        url={cert.url}
                        type="Certificate"
                        icon={FaCertificate}
                      />
                    ))}
                    {!applicant.resume && !applicant.portfolio && (!applicant.certifications || applicant.certifications.length === 0) && (
                      <EmptyState text="No documents available" />
                    )}
                  </div>
                </SectionCard>

                {/* Status Update */}
                <SectionCard title="Update Status" icon={FaCheckCircle}>
                  <div className="space-y-3">
                    {statusOptions.map((status) => {
                      const statusKey = status.toLowerCase();
                      const isCurrent = currentStatus === statusKey;
                      const StatusIcon = statusConfig[statusKey]?.icon || FaEye;
                      
                      return (
                        <button
                          key={status}
                          onClick={() => handleAppStatusChange(applicant.id, { status })}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                            isCurrent 
                              ? `${statusConfig[statusKey]?.color} font-semibold shadow-inner`
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <StatusIcon className="flex-shrink-0" />
                          <span className="text-left flex-1">{status}</span>
                          {isCurrent && (
                            <span className="text-xs bg-white px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </SectionCard>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Reusable Components (keep the same as previous version)
const ActionButton = ({ href, icon: Icon, text, variant, external = false }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
    linkedin: "bg-[#0077B5] hover:bg-[#006097] text-white"
  };

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${variants[variant]}`}
    >
      <Icon className="text-sm" />
      {text}
    </a>
  );
};

const StatCard = ({ icon: Icon, label, value, iconColor }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}>
        <Icon className="text-lg" />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Icon className="text-blue-500" />
        {title}
      </h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const ExperienceItem = ({ title, subtitle, startDate, endDate, description, isEducation = false }) => (
  <div className="border-l-4 border-blue-500 pl-4 py-1">
    <h4 className="font-semibold text-gray-900">{title}</h4>
    <p className={`${isEducation ? "text-blue-600" : "text-gray-600"} font-medium`}>{subtitle}</p>
    <div className="flex items-center gap-2 text-sm text-gray-500 my-1">
      <FaCalendarAlt className="text-xs" />
      <span>
        {formatDate(startDate)} - {endDate ? formatDate(endDate) : "Present"}
      </span>
    </div>
    {description && (
      <p className="text-gray-700 text-sm mt-2 whitespace-pre-line">{description}</p>
    )}
  </div>
);

const DocumentItem = ({ title, url, type, icon: Icon }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
        <Icon className="text-lg" />
      </div>
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500">{type}</p>
      </div>
    </div>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
    >
      {type === "Link" ? "View" : "Download"}
    </a>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="text-center py-8 text-gray-500">
    <FaExclamationCircle className="mx-auto text-gray-400 mb-2" />
    <p>{text}</p>
  </div>
);

const ProfileLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <EmployerNavbar />
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>

          {/* Profile Card Skeleton */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-2 bg-gray-200"></div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="w-32 h-32 rounded-xl bg-gray-200"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  <div className="flex gap-4">
                    <div className="h-10 w-24 bg-gray-200 rounded"></div>
                    <div className="h-10 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm h-20 bg-gray-200"></div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm h-64 bg-gray-200"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm h-64 bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ApplicantProfilePage;