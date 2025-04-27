import { 
  FaArrowLeft, FaSearch, FaUser, FaEnvelope, FaPhone, 
  FaCalendarAlt, FaFileAlt, FaCheckCircle, FaTimesCircle, 
  FaClock, FaDownload, FaEllipsisV, FaLinkedin 
} from "react-icons/fa";
import { StatusBadge } from "../../EmployerPages/JobApplicantsPage";
import { ImageWithFallback } from "../../EmployerPages/JobApplicantsPage";
import { MatchScoreIndicator } from "../../EmployerPages/JobApplicantsPage";
import { formatDate } from "../../EmployerPages/JobApplicantsPage";

const ProfileModal = ({ applicant, onClose, onStatusChange, }) => {
  const statusOptions = ["Reviewing", "Shortlisted", "Interview", "Offered", "Rejected"];
  
  return (
<div className="fixed inset-0 z-50 flex items-start justify-center pt-[80px] md:pl-[250px] pl-4 pr-4 pb-4 bg-black bg-opacity-40">
<div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Applicant Profile</h3>
          <button className="text-gray-400 hover:text-gray-600 focus:outline-none p-1" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                <ImageWithFallback src={applicant.profileImage} alt={applicant.name} />
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{applicant.name}</h2>
              <p className="text-gray-600 mt-1">{applicant.experience} • {applicant.location}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <a href={`mailto:${applicant.email}`} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full">
                  <FaEnvelope /> Email
                </a>
                <a href={`tel:${applicant.phone}`} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full">
                  <FaPhone /> Call
                </a>
                {applicant.linkedIn && (
                  <a href={applicant.linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full">
                    <FaLinkedin /> LinkedIn
                  </a>
                )}
              </div>
            </div>
            
            <div className="md:text-right">
              <div className="mb-2">
                <StatusBadge status={applicant.status} />
              </div>
              {/*<div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Match Score</p>
                <MatchScoreIndicator score={applicant.matchScore} />
              </div> */}
            </div>
          </div>

          {/* Application Details */}
          <div className="py-4 border-b">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Application Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-500">Applied</p>
                <p className="font-medium">{formatDate(applicant.dateApplied)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-500">Last Activity</p>
                <p className="font-medium">{formatDate(applicant.lastActivity)}</p>
              </div>
              {applicant.resume && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Resume</p>
                  <a href={`${process.env.REACT_APP_BACKEND_URL}/uploads/${applicant.resume}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <FaDownload className="mr-1" /> Download
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Skills, Education and Experience */}
          <div className="py-4 border-b space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills?.length > 0 ? (
                    applicant.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">{skill}</span>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3">Education</h4>
                {applicant.educationList?.length > 0 ? (
                  <div className="space-y-3">
                    {applicant.educationList.map((edu, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{edu.degree || "Degree not specified"}</p>
                        <p className="text-gray-600">{edu.institution || "School not specified"}</p>
                        {(edu.startDate || edu.yearOfCompletion) && (
                          <p className="text-sm text-gray-500">
                            {formatDate(edu.startDate) || "?"} - {formatDate(edu.yearOfCompletion) || "Present"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No education information provided</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Work Experience</h4>
              {applicant.workExperience?.length > 0 ? (
                <div className="space-y-3">
                  {applicant.workExperience.map((exp, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{exp.jobTitle || "Role not specified"}</p>
                      <p className="text-gray-600">{exp.company || "Company not specified"}</p>
                      {(exp.startDate || exp.endDate) && (
                        <p className="text-sm text-gray-500">
                          {formatDate(exp.startDate) || "?"} - {formatDate(exp.endDate) || "Present"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No work experience information provided</p>
              )}
            </div>
          </div>

          {/* Update Status */}
          <div className="py-4 border-b">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Update Status</h4>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(status => {
                const isActive = applicant.status.toLowerCase() === status.toLowerCase();
                const statusColors = {
                  reviewing: "border-blue-500 text-blue-700 hover:bg-blue-50",
                  shortlisted: "border-green-500 text-green-700 hover:bg-green-50",
                  interview: "border-purple-500 text-purple-700 hover:bg-purple-50",
                  offered: "border-yellow-500 text-yellow-700 hover:bg-yellow-50",
                  rejected: "border-red-500 text-red-700 hover:bg-red-50"
                };
                const statusColor = statusColors[status.toLowerCase()] || "border-gray-300 text-gray-700 hover:bg-gray-50";

                return (
                  <button 
                    key={status}
                    onClick={() => onStatusChange(applicant.id, { status })}
                    className={`px-4 py-2 border rounded-md focus:outline-none transition-colors ${statusColor} ${isActive ? 'font-medium' : ''}`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t flex flex-col sm:flex-row justify-between gap-3">
          <button 
            className="order-2 sm:order-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2"
            onClick={onClose}
          >
            Close
          </button>
          <div className="order-1 sm:order-2 flex gap-3">
            <button 
              onClick={() => onStatusChange(applicant.id, { status: "Shortlisted" })}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                applicant.status === "Shortlisted" 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-green-600 text-white hover:bg-green-700"
              }`}
              disabled={applicant.status === "Shortlisted"}
            >
              <FaCheckCircle /> Shortlist
            </button>
            <button 
              onClick={() => onStatusChange(applicant.id, { status: "Rejected" })}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                applicant.status === "Rejected" 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-red-600 text-white hover:bg-red-700"
              }`}
              disabled={applicant.status === "Rejected"}
            >
              <FaTimesCircle /> Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;