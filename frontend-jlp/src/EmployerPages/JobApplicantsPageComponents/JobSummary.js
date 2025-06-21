import React from "react";
import { 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaCalendarAlt, 
  FaUsers,
  FaBriefcase,
  FaClock
} from "react-icons/fa";
import { formatDate } from './Utils';

const JobDetailsSummary = ({ jobDetails }) => {
  // Status color mapping for professional appearance
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'open':
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 'closed':
      case 'expired':
        return "bg-red-50 text-red-700 border-red-200";
      case 'draft':
        return "bg-amber-50 text-amber-700 border-amber-200";
      case 'paused':
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  // Calculate days since posted
  const getDaysPosted = (createdAt) => {
    const postedDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysPosted = getDaysPosted(jobDetails.createdAt);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-5 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBriefcase className="text-blue-600 text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">
                  {jobDetails.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaClock className="text-xs" />
                  <span>Posted {daysPosted} day{daysPosted !== 1 ? 's' : ''} ago</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusStyle(jobDetails.status)} flex-shrink-0`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              jobDetails.status?.toLowerCase() === 'active' || jobDetails.status?.toLowerCase() === 'open' 
                ? 'bg-emerald-500' 
                : jobDetails.status?.toLowerCase() === 'closed' || jobDetails.status?.toLowerCase() === 'expired'
                ? 'bg-red-500'
                : jobDetails.status?.toLowerCase() === 'draft'
                ? 'bg-amber-500'
                : 'bg-slate-500'
            }`}></div>
            {jobDetails.status}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Location */}
          <div className="flex items-start gap-3 group">
            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
              <FaMapMarkerAlt className="text-slate-600 group-hover:text-blue-600 transition-colors duration-200" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Location
              </p>
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {jobDetails.location}
              </p>
            </div>
          </div>

          {/* Salary */}
          <div className="flex items-start gap-3 group">
            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors duration-200">
              <FaDollarSign className="text-slate-600 group-hover:text-green-600 transition-colors duration-200" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Salary Range
              </p>
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {jobDetails.salary}
              </p>
            </div>
          </div>

          {/* Posted Date */}
          <div className="flex items-start gap-3 group">
            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-200">
              <FaCalendarAlt className="text-slate-600 group-hover:text-purple-600 transition-colors duration-200" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Posted Date
              </p>
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {formatDate(jobDetails.createdAt)}
              </p>
            </div>
          </div>

          {/* Total Applicants */}
          <div className="flex items-start gap-3 group">
            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-200">
              <FaUsers className="text-slate-600 group-hover:text-orange-600 transition-colors duration-200" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Total Applicants
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {jobDetails.noOfApplicants}
                </p>
                {jobDetails.noOfApplicants > 0 && (
                  <span className="text-xs text-slate-500">
                    candidate{jobDetails.noOfApplicants !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Bar */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Active Posting
              </span>
              {jobDetails.noOfApplicants > 0 && (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Receiving Applications
                </span>
              )}
            </div>
            
            <div className="text-xs text-slate-500">
              Last updated: {formatDate(jobDetails.updatedAt || jobDetails.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsSummary;