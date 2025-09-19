import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaStar,
} from "react-icons/fa";
import { formatDate } from "./Utils";
import { useNavigate } from "react-router-dom";

const ApplicantCard = ({
  applicant,
  selectedApplicants,
  toggleApplicant,
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/employer/job/applicantprofile", { state: { applicant } });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Render star rating (if available)
  const renderRating = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1 mt-1">
        <FaStar className="text-amber-400 text-xs" />
        <span className="text-xs font-medium text-slate-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Circular progress component
  const CircularProgress = ({ percentage, size = 40, strokeWidth = 4 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="text-slate-200"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-blue-500 transform -rotate-90 origin-center"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-blue-600">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg p-5 flex flex-col gap-4 border border-slate-200 w-full max-w-full group">
      {/* Header with profile and basic info */}
      <div className="flex items-start gap-4">
        {/* Professional Avatar */}
        <div className="relative flex-shrink-0">
          {applicant.profileImage ? (
            <img
              src={applicant.profileImage}
              alt={applicant.name}
              className="h-20 w-20 rounded-full object-cover border-2 border-slate-100"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`h-10 w-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center ${applicant.profileImage ? 'hidden' : 'flex'}`}
          >
            <FaUser className="text-slate-400 text-sm" />
          </div>
        </div>

        {/* Name, Experience & Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-semibold text-slate-900 truncate">
                {applicant.name}
              </h4>
              {renderRating(applicant.rating)}
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div
                className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(
                  applicant.status,
                )} flex-shrink-0`}
              >
                {applicant.status || "Unknown"}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
            <FaMapMarkerAlt className="text-slate-400 text-xs" />
            <span className="truncate">{applicant.location}</span>
          </div>
        </div>
      </div>

      {/* Score Indicators - New Design */}
      <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
        {applicant.totalScore && (
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 mb-1">Total Match</span>
            <div className="text-lg font-semibold text-blue-600">
              {applicant.totalScore}%
            </div>
          </div>
        )}
        
        {applicant.skillsScore && (
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 mb-1">Skills Match</span>
            <CircularProgress percentage={applicant.skillsScore} size={36} />
          </div>
        )}
        
        {/* Add other score indicators here if needed */}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2 min-w-0">
          <FaEnvelope className="text-slate-400 text-xs flex-shrink-0" />
          <span className="truncate">{applicant.email}</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <FaPhone className="text-slate-400 text-xs flex-shrink-0" />
          <span className="truncate">{applicant.phone}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {applicant.skills?.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-100"
          >
            {skill}
          </span>
        ))}
        {applicant.skills?.length > 4 && (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            +{applicant.skills.length - 4} more
          </span>
        )}
      </div>

      {/* Application Date */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <FaCalendarAlt className="text-slate-400 text-xs" />
        <span>
          Applied on{" "}
          <span className="font-medium text-slate-800">{formatDate(applicant.dateApplied)}</span>
        </span>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleNavigation}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
        >
          View Profile →
        </button>

        <label className="inline-flex items-center gap-2 cursor-pointer select-none group/checkbox">
           <input
            type="checkbox"
            checked={selectedApplicants.some((a) => a.userId === applicant.userId)}
            onChange={() => toggleApplicant(applicant.userId, applicant.id)}
            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-150"
          />
          <span className="text-sm text-slate-600 group-hover/checkbox:text-slate-800 transition-colors duration-150">
            Select
          </span>
        </label>
      </div>
    </div>
  );
};



// ---------------- Sticky Action Bar ---------------- //
export const ApplicantActionBar = ({
  selectedApplicants = [],
  onSendInvite = () => {},
  onBulkStatusChange = () => {},
  clearSelection = () => {},
}) => {
  if (!selectedApplicants.length) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-xl z-50">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-slate-50/30 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Selection Counter with Icon */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <FaCheckCircle className="text-blue-600 text-sm" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-900">
                {selectedApplicants.length} applicant{selectedApplicants.length > 1 ? "s" : ""} selected
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose an action to perform on selected items
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Update Status Button */}
            <button
              onClick={() => onBulkStatusChange(selectedApplicants)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
             
              <span>Update Status</span>
            </button>

            {/* Send Interview Invite Button - Primary Action */}
           <button 
            onClick={() => onSendInvite(selectedApplicants)}
            className="inline-flex items-center gap-1 sm:gap-2 px-2 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-xs sm:text-sm font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group"
            >
            <FaEnvelope className="text-xs sm:text-sm group-hover:scale-110 transition-transform duration-200" />
          <span>Send Interview Invite</span>
        </button>
            {/* Clear Selection Button */}
            <button
              onClick={clearSelection}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-red-50 text-sm font-medium text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <FaTimesCircle className="text-sm text-slate-400 group-hover:text-red-500 transition-colors" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-3 sm:mt-0 sm:absolute sm:top-0 sm:left-0 sm:right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20"></div>
      </div>
    </div>
  );
};
export default ApplicantCard;