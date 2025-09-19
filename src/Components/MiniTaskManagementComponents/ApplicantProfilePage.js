import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBriefcase, 
  FaGraduationCap, 
  FaLink, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaCheckCircle,
  FaChevronLeft,
  FaDownload,
  FaExternalLinkAlt
} from 'react-icons/fa';
import PortfolioPreview from '../ProfileEdit/PortfolioPreview';
import { ClientNavbar } from '../../Components/ClientComponents/ClientNavbar';
import { ClientSidebar } from '../../Components/ClientComponents/ClientSidebar';
import LoadingSkeleton from '../Common/LoadingSkeleton';
import ErrorBoundary from '../Common/ErrorBoundary';
import usePrint from '../../hooks/usePrint'

const ApplicantProfilePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { handlePrint } = usePrint();
  const [isOpen, setIsOpen] = useState(false);
  const applicant = state?.applicant;

  // Loading state simulation (replace with actual data fetching)
  React.useEffect(() => {
    if (!applicant) {
      setIsLoading(true);
      // Simulate data loading
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [applicant]);

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!applicant) {
    return (
      <div className="flex flex-col min-h-screen">
        <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-3">Applicant Not Found</h2>
            <p className="text-gray-600 mb-6">
              The requested applicant profile could not be loaded. Please try again later.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Previous Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50">
        <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      <div className="flex-1 overflow-auto">
        <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
        
        <main className="flex-grow bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back button and action controls */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaChevronLeft className="mr-2" />
                Back to Applicants
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FaDownload size={14} />
                  Print/PDF
                </button>
              </div>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  <div className="relative flex-shrink-0 self-start">
                    <img
                      src={applicant.profileImage || "/default-profile.png"}
                      alt={`${applicant.name}'s profile`}
                      className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-profile.png";
                      }}
                    />
                    {applicant.isVerified && (
                      <span 
                        className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full"
                        title="Verified Profile"
                        aria-label="Verified Profile"
                      >
                        <FaCheckCircle className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {applicant.name}
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        {applicant.title && ` • ${applicant.title}`}
                      </span>
                    </h1>
                    
                    {applicant.bio && (
                      <p className="text-gray-600 mb-4">{applicant.bio}</p>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {applicant.phone && (
                        <div className="flex items-center text-gray-700">
                          <FaPhone className="mr-3 text-blue-500 flex-shrink-0" />
                          <a 
                            href={`tel:${applicant.phone}`} 
                            className="hover:text-blue-600 hover:underline"
                          >
                            {applicant.phone}
                          </a>
                        </div>
                      )}
                      
                      {applicant.email && (
                        <div className="flex items-center text-gray-700">
                          <FaEnvelope className="mr-3 text-blue-500 flex-shrink-0" />
                          <a 
                            href={`mailto:${applicant.email}`} 
                            className="hover:text-blue-600 hover:underline truncate"
                          >
                            {applicant.email}
                          </a>
                        </div>
                      )}
                      
                      {(applicant.location?.region || applicant.location?.city) && (
                        <div className="flex items-start text-gray-700 sm:col-span-2">
                          <FaMapMarkerAlt className="mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>
                            {[applicant.location?.street, applicant.location?.town, 
                             applicant.location?.city, applicant.location?.region]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2/3 width on large screens) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Skills Section */}
                {applicant.skills?.length > 0 && (
                  <SectionCard 
                    title="Skills & Expertise"
                    icon={<FaBriefcase className="text-blue-500" />}
                  >
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
                  </SectionCard>
                )}

                {/* Work Experience Section */}
                {applicant.workExperience?.length > 0 && (
                  <SectionCard 
                    title="Work Experience"
                    icon={<FaBriefcase className="text-blue-500" />}
                  >
                    <div className="space-y-6">
                      {applicant.workExperience.map((job, index) => (
                        <div 
                          key={index} 
                          className="pb-6 last:pb-0 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {job.jobTitle}
                              </h3>
                              <p className="text-blue-600 font-medium">
                                {job.company}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500 whitespace-nowrap">
                              {job.startDate && new Date(job.startDate).toLocaleDateString()} -{' '}
                              {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Present'}
                            </div>
                          </div>
                          
                          {job.description && (
                            <div className="mt-3 text-gray-700 space-y-2">
                              {job.description.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                              ))}
                            </div>
                          )}
                          
                          {job.achievements?.length > 0 && (
                            <div className="mt-3">
                              <h4 className="font-medium text-gray-900 mb-1">
                                Key Achievements:
                              </h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {job.achievements.map((achievement, i) => (
                                  <li key={i}>{achievement}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}
              </div>

              {/* Right Column (1/3 width on large screens) */}
              <div className="space-y-6">
                {/* Education Section */}
                {applicant.education?.length > 0 && (
                  <SectionCard 
                    title="Education"
                    icon={<FaGraduationCap className="text-blue-500" />}
                  >
                    <div className="space-y-4">
                      {applicant.education.map((edu, index) => (
                        <div 
                          key={index} 
                          className="pb-4 last:pb-0 border-b border-gray-100 last:border-0"
                        >
                          <h3 className="font-semibold text-gray-900">
                            {edu.certification}
                          </h3>
                          <p className="text-blue-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {edu.startedOn && new Date(edu.startedOn).toLocaleDateString()} -{' '}
                            {edu.yearOfCompletion ? new Date(edu.yearOfCompletion).toLocaleDateString() : 'Present'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* Portfolio Section */}
                {applicant.workPortfolio?.length > 0 && (
                  <SectionCard 
                    title="Portfolio"
                    icon={<FaLink className="text-blue-500" />}
                  >
                    <div className="space-y-4">
                      {applicant.workPortfolio.map((portfolio, index) => (
                        <PortfolioPreview
                          key={index}
                          portfolio={portfolio}
                          isCompact
                        />
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* Additional Info Section */}
                <SectionCard title="Additional Information">
                  <InfoItem 
                    label="Availability" 
                    value={applicant.availability || "Not specified"} 
                  />
                  <InfoItem 
                    label="Expected Salary" 
                    value={applicant.expectedSalary || "Not specified"} 
                  />
                  <InfoItem 
                    label="Languages" 
                    value={
                      applicant.languages?.join(', ') || "Not specified"
                    } 
                  />
                </SectionCard>
              </div>
            </div>
          </div>
        </main>
      </div>
      </div>
    </ErrorBoundary>
  );
};

// Reusable Section Card Component
const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        {icon}
        {title}
      </h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// Reusable Info Item Component
const InfoItem = ({ label, value }) => (
  <div className="mb-3 last:mb-0">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className="text-gray-900">{value}</p>
  </div>
);

// Loading Skeleton Component
const ProfileLoadingSkeleton = () => (
  <div className="flex flex-col min-h-screen">
    <ClientNavbar  />
    <div className="flex-grow bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <LoadingSkeleton className="w-32 h-32 rounded-full" />
            <div className="flex-1 space-y-3">
              <LoadingSkeleton className="h-8 w-3/4 rounded" />
              <LoadingSkeleton className="h-4 w-full rounded" />
              <LoadingSkeleton className="h-4 w-2/3 rounded" />
              <div className="grid grid-cols-2 gap-3">
                <LoadingSkeleton className="h-4 rounded" />
                <LoadingSkeleton className="h-4 rounded" />
                <LoadingSkeleton className="h-4 rounded col-span-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <LoadingSkeleton className="h-64 rounded-xl" />
            <LoadingSkeleton className="h-96 rounded-xl" />
          </div>
          <div className="space-y-6">
            <LoadingSkeleton className="h-64 rounded-xl" />
            <LoadingSkeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ApplicantProfilePage;