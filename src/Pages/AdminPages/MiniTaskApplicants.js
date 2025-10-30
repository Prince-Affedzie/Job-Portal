import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download,
  ChevronDown,
  X,
  Star,
  CheckCircle,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  FileText,
  Shield,
  Send,
  Users,
  Eye,
  Phone,
  FileCheck,
  BookOpen,
  Clock,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";

// Enhanced Profile Image Component
const ProfileImage = React.memo(({ applicant, size = 12, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (applicant.profileImage && !imageError) {
    return (
      <img
        src={applicant.profileImage}
        alt={applicant.name || 'Applicant'}
        className={`w-${size} h-${size} rounded-full object-cover border-2 border-white shadow-sm ${className}`}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }
  
  return (
    <div className={`w-${size} h-${size} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm ${className}`}>
      {getInitials(applicant.name)}
    </div>
  );
});

// Applicant Card Component
const ApplicantCard = ({ applicant, onViewApplicant, formatDate }) => {
  const navigate = useNavigate()
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group hover:border-blue-300">
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative flex-shrink-0">
          <ProfileImage applicant={applicant} size={12} className="w-12 h-12" />
          {applicant.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg truncate">{applicant.name}</h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm">
                {applicant.rating ? (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-gray-700 ml-1">
                      {applicant.rating}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">No rating</span>
                )}
                {applicant.completedTasks > 0 && (
                  <span className="text-gray-500">
                    • {applicant.completedTasks} tasks
                  </span>
                )}
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              applicant.status === 'accepted' 
                ? 'bg-green-100 text-green-800' 
                : applicant.status === 'rejected' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {applicant.status || 'pending'}
            </span>
          </div>

          <div className="space-y-2 mt-3 text-sm">
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{applicant.email}</span>
            </div>
            
            {applicant.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{applicant.phone}</span>
              </div>
            )}

            {applicant.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate text-sm">
                  {[applicant.location.city, applicant.location.region].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {applicant.skills?.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {applicant.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {skill}
              </span>
            ))}
            {applicant.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{applicant.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Applied {applicant.applicationDate ? formatDate(applicant.applicationDate) : 'recently'}
        </span>
        
        <button
          onClick={() => navigate(`/admin/tasker_info/${applicant._id}`)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
      </div>
    </div>
  );
};

// Applicant List Item Component
const ApplicantListItem = ({ applicant, onViewApplicant, formatDate }) => {
  const navigate = useNavigate()
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 group hover:border-blue-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-shrink-0">
          <ProfileImage applicant={applicant} size={14} className="w-14 h-14" />
          {applicant.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs">
              {applicant.rating ? (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-700 ml-1">
                    {applicant.rating}
                  </span>
                </div>
              ) : (
                <span className="text-gray-500">No rating</span>
              )}
              {applicant.completedTasks > 0 && (
                <span className="text-gray-500">
                  • {applicant.completedTasks} tasks
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{applicant.email}</span>
            </div>
            
            {applicant.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{applicant.phone}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              applicant.status === 'accepted' 
                ? 'bg-green-100 text-green-800' 
                : applicant.status === 'rejected' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {applicant.status || 'pending'}
            </span>
            
            <button
              onClick={() =>navigate(`/admin/tasker_info/${applicant._id}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Modal Component
const ProfileModal = ({ applicant, onClose, formatDate }) => {
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              <div className="relative flex-shrink-0">
                {applicant.profileImage ? (
                  <img
                    src={applicant.profileImage}
                    alt={applicant.name}
                    className="w-20 h-20 rounded-full border-4 border-white/20 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg border-4 border-white/20">
                    {getInitials(applicant.name)}
                  </div>
                )}
                {applicant.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold truncate">{applicant.name}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                  {applicant.rating && (
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-300 fill-current" />
                      <span className="ml-2 font-medium">{applicant.rating} Rating</span>
                    </div>
                  )}
                  {applicant.completedTasks > 0 && (
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-300" />
                      <span className="ml-2 font-medium">{applicant.completedTasks} Tasks</span>
                    </div>
                  )}
                  {applicant.isVerified && (
                    <span className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm">
                      <Shield className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Modal Content - Scrollable */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                  <Mail className="w-5 h-5 text-blue-600 mr-2" />
                  Contact
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center p-3 bg-white rounded-lg">
                    <Mail className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 truncate">{applicant.email}</span>
                  </div>
                  {applicant.phone && (
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <Phone className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{applicant.phone}</span>
                    </div>
                  )}
                  {applicant.location && (
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">
                        {[applicant.location.city, applicant.location.region].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {applicant.skills?.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                    <FileCheck className="w-5 h-5 text-purple-600 mr-2" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Application */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  Application
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      applicant.status === 'accepted' 
                        ? 'bg-green-100 text-green-800' 
                        : applicant.status === 'rejected' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {applicant.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applied:</span>
                    <span className="text-gray-700">
                      {applicant.applicationDate ? formatDateTime(applicant.applicationDate) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 text-base">Actions</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors text-sm">
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {applicant.Bio && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                    Summary
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm">{applicant.Bio}</p>
                </div>
              )}

              {applicant.workExperience?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                    <Briefcase className="w-5 h-5 text-emerald-600 mr-2" />
                    Experience ({applicant.workExperience.length})
                  </h4>
                  <div className="space-y-4">
                    {applicant.workExperience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-emerald-400 pl-4">
                        <h5 className="font-bold text-gray-900 text-base">{exp.jobTitle}</h5>
                        <p className="text-emerald-700 font-medium text-sm">{exp.company}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate) || 'Present'}
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {applicant.education?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                    <GraduationCap className="w-5 h-5 text-amber-600 mr-2" />
                    Education
                  </h4>
                  <div className="space-y-3">
                    {applicant.education.map((edu, index) => (
                      <div key={index} className="bg-amber-50 rounded-lg p-4">
                        <h5 className="font-bold text-gray-900 text-sm">{edu.degree}</h5>
                        <p className="text-amber-700 font-medium text-sm">{edu.institution}</p>
                        {edu.yearOfCompletion && (
                          <p className="text-xs text-gray-500 mt-1">Completed {edu.yearOfCompletion}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {applicant.certifications?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                    <FileCheck className="w-5 h-5 text-purple-600 mr-2" />
                    Certifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {applicant.certifications.map((cert, index) => (
                      <div key={index} className="bg-purple-50 rounded-lg p-3">
                        <h5 className="font-bold text-gray-900 text-sm">{cert.name}</h5>
                        {cert.issuer && <p className="text-purple-700 text-xs">{cert.issuer}</p>}
                        {cert.issueDate && (
                          <p className="text-xs text-gray-500 mt-1">Issued {formatDate(cert.issueDate)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// View Mode Toggle Component
const ViewModeToggle = ({ viewMode, onViewModeChange }) => (
  <div className="flex bg-gray-100 rounded-lg p-1">
    <button
      onClick={() => onViewModeChange('grid')}
      className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    </button>
    <button
      onClick={() => onViewModeChange('list')}
      className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    </button>
  </div>
);

// Sort Dropdown Component
const SortDropdown = ({ sortBy, onSortChange }) => (
  <select
    value={sortBy}
    onChange={(e) => onSortChange(e.target.value)}
    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option value="recent">Most Recent</option>
    <option value="rating">Highest Rated</option>
    <option value="name">Name A-Z</option>
    <option value="experience">Most Experienced</option>
  </select>
);

// Filter Select Component
const FilterSelect = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Header Component
const Header = ({ applicantCount, onBack }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all border border-gray-200"
      >
        <ArrowLeft className="w-6 h-6 text-gray-600" />
      </button>
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Task Applicants</h1>
        <p className="text-gray-600 mt-1">
          {applicantCount} applicant{applicantCount !== 1 ? 's' : ''} • Review profiles
        </p>
      </div>
    </div>
  </div>
);

// Analytics Overview Component
const AnalyticsOverview = ({ analytics }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Total</span>
        <Users className="w-4 h-4 text-blue-600" />
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.total}</p>
    </div>
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Pending</span>
        <Calendar className="w-4 h-4 text-yellow-600" />
      </div>
      <p className="text-2xl font-bold text-yellow-600 mt-2">{analytics.pending}</p>
    </div>
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Accepted</span>
        <CheckCircle className="w-4 h-4 text-green-600" />
      </div>
      <p className="text-2xl font-bold text-green-600 mt-2">{analytics.accepted}</p>
    </div>
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Verified</span>
        <Shield className="w-4 h-4 text-purple-600" />
      </div>
      <p className="text-2xl font-bold text-purple-600 mt-2">{analytics.verified}</p>
    </div>
  </div>
);

// Search and Filters Component
const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  showFilters, 
  onToggleFilters 
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, skills..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <button
          onClick={onToggleFilters}
          className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          <FilterSelect 
            label="Status"
            value={filters.status}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'rejected', label: 'Rejected' }
            ]}
            onChange={(value) => onFilterChange('status', value)}
          />
          <FilterSelect 
            label="Rating"
            value={filters.rating}
            options={[
              { value: 'all', label: 'All Ratings' },
              { value: '4+', label: '4+ Stars' },
              { value: '3-4', label: '3-4 Stars' },
              { value: '0-3', label: '0-3 Stars' },
              { value: 'unrated', label: 'Unrated' }
            ]}
            onChange={(value) => onFilterChange('rating', value)}
          />
          <FilterSelect 
            label="Verification"
            value={filters.verification}
            options={[
              { value: 'all', label: 'All' },
              { value: 'verified', label: 'Verified Only' },
              { value: 'unverified', label: 'Unverified Only' }
            ]}
            onChange={(value) => onFilterChange('verification', value)}
          />
          <FilterSelect 
            label="Experience"
            value={filters.experience}
            options={[
              { value: 'all', label: 'All Experience' },
              { value: 'experienced', label: 'Experienced' },
              { value: 'entry-level', label: 'Entry Level' }
            ]}
            onChange={(value) => onFilterChange('experience', value)}
          />
        </div>
      )}
    </div>
  </div>
);

// Quick Results Component
const QuickResults = ({ searchTerm, filters, resultCount, onClear }) => {
  const hasActiveFilters = searchTerm || Object.values(filters).some(f => f !== 'all');
  
  if (!hasActiveFilters) return null;

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2 text-blue-800">
        <Search className="w-4 h-4" />
        <span className="font-medium">
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </span>
        {searchTerm && <span className="text-blue-600">for "{searchTerm}"</span>}
      </div>
      <button
        onClick={onClear}
        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
      >
        Clear all filters
      </button>
    </div>
  );
};

// Applicants Grid Component
const ApplicantsGrid = ({ applicants, viewMode, onViewApplicant, formatDate }) => {
  if (applicants.length === 0) {
    return (
      <div className="text-center py-16">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applicants found</h3>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return viewMode === 'grid' ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {applicants.map((applicant, i) => (
        <ApplicantCard 
          key={applicant._id || i} 
          applicant={applicant} 
          onViewApplicant={onViewApplicant}
          formatDate={formatDate}
        />
      ))}
    </div>
  ) : (
    <div className="space-y-4">
      {applicants.map((applicant, i) => (
        <ApplicantListItem 
          key={applicant._id || i} 
          applicant={applicant} 
          onViewApplicant={onViewApplicant}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

// Loading State Component
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex overflow-hidden">
    <div className="flex-1 flex flex-col">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </main>
    </div>
  </div>
);

// Quick Actions Component
const QuickActions = ({ viewMode, onViewModeChange, sortBy, onSortChange }) => (
  <div className="flex items-center gap-2">
    <ViewModeToggle 
      viewMode={viewMode} 
      onViewModeChange={onViewModeChange} 
    />
    <SortDropdown 
      sortBy={sortBy} 
      onSortChange={onSortChange} 
    />
    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
      <Download className="w-5 h-5 text-gray-600" />
    </button>
  </div>
);

// Main Component
const AdminViewMiniTaskApplicants = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Consolidated state management
  const [state, setState] = useState({
    applicants: [],
    loading: true,
    isSidebarOpen: false,
    searchTerm: '',
    filters: {
      status: 'all',
      rating: 'all',
      verification: 'all',
      experience: 'all'
    },
    selectedApplicant: null,
    showModal: false,
    showFilters: false,
    sortBy: 'recent',
    viewMode: 'grid'
  });

  // State updater helper
  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

  useEffect(() => {
    if (location.state?.applicants) {
      updateState({ applicants: location.state.applicants, loading: false });
    }
  }, [location.state]);

  // Enhanced data processing with better performance
  const { filteredApplicants, analytics } = useMemo(() => {
    let filtered = [...state.applicants];
    const analytics = {
      total: state.applicants.length,
      pending: state.applicants.filter(a => a.status === 'pending').length,
      accepted: state.applicants.filter(a => a.status === 'accepted').length,
      rejected: state.applicants.filter(a => a.status === 'rejected').length,
      verified: state.applicants.filter(a => a.isVerified).length
    };

    // Search filter
    if (state.searchTerm) {
      const searchLower = state.searchTerm.toLowerCase();
      filtered = filtered.filter(applicant =>
        applicant.name?.toLowerCase().includes(searchLower) ||
        applicant.email?.toLowerCase().includes(searchLower) ||
        (applicant.skills || []).some(skill => 
          skill.toLowerCase().includes(searchLower)
        ) ||
        (applicant.Bio || '').toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    Object.entries(state.filters).forEach(([key, value]) => {
      if (value === 'all') return;
      
      switch(key) {
        case 'status':
          filtered = filtered.filter(applicant => applicant.status === value);
          break;
        case 'rating':
          filtered = filtered.filter(applicant => {
            const rating = applicant.rating || 0;
            switch(value) {
              case '4+': return rating >= 4;
              case '3-4': return rating >= 3 && rating < 4;
              case '0-3': return rating < 3 && rating > 0;
              case 'unrated': return !rating;
              default: return true;
            }
          });
          break;
        case 'verification':
          filtered = filtered.filter(applicant => 
            value === 'verified' ? applicant.isVerified : !applicant.isVerified
          );
          break;
        case 'experience':
          filtered = filtered.filter(applicant => {
            const hasExperience = applicant.workExperience && applicant.workExperience.length > 0;
            return value === 'experienced' ? hasExperience : !hasExperience;
          });
          break;
          default:

      }
    });

    // Sorting
    filtered.sort((a, b) => {
      switch(state.sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'experience':
          return (b.workExperience?.length || 0) - (a.workExperience?.length || 0);
        case 'recent':
        default:
          return new Date(b.applicationDate || 0) - new Date(a.applicationDate || 0);
      }
    });

    return { filteredApplicants: filtered, analytics };
  }, [state.applicants, state.searchTerm, state.filters, state.sortBy]);

  // Memoized utility functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Event handlers
  const handleSearchChange = (searchTerm) => updateState({ searchTerm });
  
  const handleFilterChange = (filterType, value) => {
    updateState({ 
      filters: { ...state.filters, [filterType]: value } 
    });
  };

  const handleViewApplicant = (applicant) => {
    updateState({ selectedApplicant: applicant, showModal: true });
  };

  const handleClearFilters = () => {
    updateState({ 
      searchTerm: '', 
      filters: { status: 'all', rating: 'all', verification: 'all', experience: 'all' } 
    });
  };

  if (state.loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <AdminSidebar 
        isOpen={state.isSidebarOpen} 
        onClose={() => updateState({ isSidebarOpen: false })} 
      />
      
      <div className="flex-1 flex flex-col">
        <AdminNavbar onMenuToggle={() => updateState({ isSidebarOpen: !state.isSidebarOpen })} />
        
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${state.isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}>
          <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
            <Header 
              applicantCount={filteredApplicants.length}
              onBack={() => navigate(-1)}
            />
            
            <AnalyticsOverview analytics={analytics} />
            
            <SearchAndFilters 
              searchTerm={state.searchTerm}
              onSearchChange={handleSearchChange}
              filters={state.filters}
              onFilterChange={handleFilterChange}
              showFilters={state.showFilters}
              onToggleFilters={() => updateState({ showFilters: !state.showFilters })}
            />
            
            <div className="flex items-center justify-between">
              <QuickActions 
                viewMode={state.viewMode}
                onViewModeChange={(viewMode) => updateState({ viewMode })}
                sortBy={state.sortBy}
                onSortChange={(sortBy) => updateState({ sortBy })}
              />
            </div>
            
            <QuickResults 
              searchTerm={state.searchTerm}
              filters={state.filters}
              resultCount={filteredApplicants.length}
              onClear={handleClearFilters}
            />
            
            <ApplicantsGrid 
              applicants={filteredApplicants}
              viewMode={state.viewMode}
              onViewApplicant={handleViewApplicant}
              formatDate={formatDate}
            />
          </div>
        </main>

        {state.showModal && state.selectedApplicant && (
          <ProfileModal 
            applicant={state.selectedApplicant}
            onClose={() => updateState({ showModal: false, selectedApplicant: null })}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
};

export default AdminViewMiniTaskApplicants;