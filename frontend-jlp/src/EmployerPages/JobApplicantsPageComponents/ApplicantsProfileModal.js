import React, {useEffect} from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaDownload,
  FaUserCircle,
  FaLinkedin
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
          toast.success(`Application ${status.status} successfully`);
         
        } else {
          toast.error("Failed to update application status");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "An unexpected error occurred";
        toast.error(errorMessage);
      }
    };

  if (!applicant) return <div className="p-6 text-red-500">Applicant not found.</div>;

  const statusOptions = ["Reviewing", "Shortlisted", "Interview", "Offered", "Rejected"];
  const statusColors = {
    reviewing: "border-blue-500 text-blue-700 hover:bg-blue-50",
    shortlisted: "border-green-500 text-green-700 hover:bg-green-50",
    interview: "border-purple-500 text-purple-700 hover:bg-purple-50",
    offered: "border-yellow-500 text-yellow-700 hover:bg-yellow-50",
    rejected: "border-red-500 text-red-700 hover:bg-red-50"
  };

   


  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <ToastContainer/>
      <button
        className="text-sm flex items-center gap-1 text-gray-600 hover:text-gray-800 mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
        {/* Top Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 border-b pb-6 items-center md:items-start">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-100">
                       {applicant?.profileImage ? (
                        <img
                        src={applicant.profileImage}
                        alt="Profile"
                      className="w-full h-full object-cover"
                         />
                         ) : (
                      <FaUserCircle className="w-full h-full text-gray-400" />
                         )}
                        </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">{applicant.name}</h2>
            <p className="text-gray-600 mt-2">
              {applicant.experience} • {applicant.location}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <a
                href={`mailto:${applicant.email}`}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <FaEnvelope /> Email
              </a>
              <a
                href={`tel:${applicant.phone}`}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <FaPhone /> Call
              </a>
              {applicant.linkedIn && (
                <a
                  href={applicant.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <FaLinkedin /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Application Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-b pb-6">
          <DetailCard label="Applied" value={formatDate(applicant.dateApplied)} />
          <DetailCard label="Last Activity" value={formatDate(applicant.lastActivity)} />
          {applicant.resume && (
            <DetailCard
              label="Resume"
              value={
                <a
                  href={applicant.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <FaDownload /> Download
                </a>
              }
            />
          )}
        </div>

        {/* Skills Section */}
        <Section title="Skills">
          {applicant.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 border border-gray-300 px-3 py-1 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills listed</p>
          )}
        </Section>

        {/* Education Section */}
        <Section title="Education">
          {applicant.educationList?.length ? (
            <div className="space-y-3">
              {applicant.educationList.map((edu, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded shadow-sm">
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} - {formatDate(edu.yearOfCompletion)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No education information</p>
          )}
        </Section>

        {/* Experience Section */}
        <Section title="Work Experience">
          {applicant.workExperience?.length ? (
            <div className="space-y-3">
              {applicant.workExperience.map((exp, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded shadow-sm">
                  <p className="font-semibold">{exp.jobTitle}</p>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No experience listed</p>
          )}
        </Section>

        {/* Cover Letter Section */}
        {applicant.coverLetter && (
          <Section title="Cover Letter">
            <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 whitespace-pre-line shadow-sm">
              {applicant.coverLetter}
            </div>
          </Section>
        )}

        {/* Status Update Section */}
        <Section title="Click the Buttons to Update the Status of this Application.">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => {
              const isActive = applicant.status?.toLowerCase() === status.toLowerCase();
              return (
                <button
                  key={status}
                  onClick={() =>  handleAppStatusChange(applicant.id, { status })}
                  className={`px-4 py-2 border rounded-md transition-colors text-sm ${
                    statusColors[status.toLowerCase()] || ""
                  } ${isActive ? "font-semibold shadow-sm" : ""}`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    {children}
  </div>
);

const DetailCard = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded shadow-sm">
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="font-medium mt-1">{value}</p>
  </div>
);

export default  ApplicantProfileModal;
