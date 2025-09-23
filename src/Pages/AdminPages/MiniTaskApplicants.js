import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  Eye,
  Users,
  Award,
  Briefcase,
  X,
  Star,
  CheckCircle,
  ChevronDown,
  FileText,
  Shield,
  Clock,
  TrendingUp,
  Download,
  MessageSquare,
  ExternalLink,
  MoreHorizontal,
  Send,
  FileCheck,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";

const AdminViewMiniTaskApplicants = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Core state
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filtering and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    rating: 'all',
    verification: 'all',
    experience: 'all'
  });
  
  // Modal state
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    if (location.state?.applicants) {
      setApplicants(location.state.applicants);
    }
    setLoading(false);
  }, [location.state]);

  // Enhanced filtering and sorting
  const filteredApplicants = useMemo(() => {
    let filtered = [...applicants];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(applicant =>
        applicant.name?.toLowerCase().includes(searchLower) ||
        applicant.email?.toLowerCase().includes(searchLower) ||
        (applicant.skills || []).some(skill => 
          skill.toLowerCase().includes(searchLower)
        ) ||
        (applicant.Bio || '').toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(applicant => applicant.status === filters.status);
    }

    // Rating filter
    if (filters.rating !== 'all') {
      filtered = filtered.filter(applicant => {
        const rating = applicant.rating || 0;
        switch(filters.rating) {
          case '4+': return rating >= 4;
          case '3-4': return rating >= 3 && rating < 4;
          case '0-3': return rating < 3 && rating > 0;
          case 'unrated': return !rating;
          default: return true;
        }
      });
    }

    // Verification filter
    if (filters.verification !== 'all') {
      filtered = filtered.filter(applicant => 
        filters.verification === 'verified' ? applicant.isVerified : !applicant.isVerified
      );
    }

    // Experience filter
    if (filters.experience !== 'all') {
      filtered = filtered.filter(applicant => {
        const hasExperience = applicant.workExperience && applicant.workExperience.length > 0;
        return filters.experience === 'experienced' ? hasExperience : !hasExperience;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
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

    return filtered;
  }, [applicants, searchTerm, filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  // Profile Image Component
  const ProfileImage = ({ applicant, size = 12, className = "" }) => {
    const [imageError, setImageError] = useState(false);
    
    if (applicant.profileImage && !imageError) {
      return (
        <img
          src={applicant.profileImage}
          alt={applicant.name || 'Applicant'}
          className={`w-${size} h-${size} rounded-full object-cover border-2 border-white shadow-sm ${className}`}
          onError={() => setImageError(true)}
        />
      );
    }
    
    return (
      <div className={`w-${size} h-${size} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold ${className}`}>
        {getInitials(applicant.name)}
      </div>
    );
  };

  const ApplicantCard = ({ applicant }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group hover:border-blue-300">
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative flex-shrink-0">
            <ProfileImage applicant={applicant} size={12} />
            {applicant.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg truncate">{applicant.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {applicant.rating ? (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700 ml-1">
                        {applicant.rating}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No rating</span>
                  )}
                  {applicant.completedTasks > 0 && (
                    <span className="text-sm text-gray-500">
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

            <div className="space-y-2 mt-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">{applicant.email}</span>
              </div>
              
              {applicant.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span>{applicant.phone}</span>
                </div>
              )}

              {applicant.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">
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
                  +{applicant.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            Applied {applicant.applicationDate ? formatDate(applicant.applicationDate) : 'recently'}
          </span>
          
          <button
            onClick={() => {
              setSelectedApplicant(applicant);
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm group-hover:shadow-lg"
          >
            <Eye className="w-4 h-4" />
            <span>View Profile</span>
          </button>
        </div>
      </div>
    );
  };

  const ApplicantListItem = ({ applicant }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 group hover:border-blue-300">
        <div className="flex items-center space-x-6">
          <div className="relative flex-shrink-0">
            <ProfileImage applicant={applicant} size={14} />
            {applicant.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{applicant.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                {applicant.rating ? (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700 ml-1">
                      {applicant.rating}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No rating</span>
                )}
                {applicant.completedTasks > 0 && (
                  <span className="text-sm text-gray-500">
                    • {applicant.completedTasks} tasks
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">{applicant.email}</span>
              </div>
              
              {applicant.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span>{applicant.phone}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
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
                onClick={() => {
                  setSelectedApplicant(applicant);
                  setShowModal(true);
                }}
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

  const ProfileModal = ({ applicant, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-scaleIn">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <ProfileImage applicant={applicant} size={16} className="border-4 border-white/20 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold truncate">{applicant.name}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  {applicant.rating && (
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-300 fill-current" />
                      <span className="ml-2 font-medium">{applicant.rating} Rating</span>
                    </div>
                  )}
                  {applicant.completedTasks > 0 && (
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-300" />
                      <span className="ml-2 font-medium">{applicant.completedTasks} Tasks Completed</span>
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
        
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Contact & Basic Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-2" />
                  Contact Information
                </h4>
                <div className="space-y-3">
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
                      <span className="text-gray-700">
                        {[applicant.location.city, applicant.location.region].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {applicant.skills?.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 text-purple-600 mr-2" />
                    Skills & Expertise
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

              {/* Application Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  Application Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Applied:</span>
                    <span className="text-sm text-gray-700">
                      {applicant.applicationDate ? formatDateTime(applicant.applicationDate) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">Actions</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors">
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Professional Summary */}
              {applicant.Bio && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                    Professional Summary
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{applicant.Bio}</p>
                </div>
              )}

              {/* Work Experience */}
              {applicant.workExperience?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 text-emerald-600 mr-2" />
                    Work Experience ({applicant.workExperience.length})
                  </h4>
                  <div className="space-y-4">
                    {applicant.workExperience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-emerald-400 pl-4">
                        <h5 className="font-bold text-gray-900">{exp.jobTitle}</h5>
                        <p className="text-emerald-700 font-medium">{exp.company}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
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

              {/* Education */}
              {applicant.education?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 text-amber-600 mr-2" />
                    Education
                  </h4>
                  <div className="space-y-3">
                    {applicant.education.map((edu, index) => (
                      <div key={index} className="bg-amber-50 rounded-lg p-4">
                        <h5 className="font-bold text-gray-900">{edu.degree}</h5>
                        <p className="text-amber-700 font-medium">{edu.institution}</p>
                        {edu.yearOfCompletion && (
                          <p className="text-sm text-gray-500 mt-1">Completed {edu.yearOfCompletion}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {applicant.certifications?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <FileCheck className="w-5 h-5 text-purple-600 mr-2" />
                    Certifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex overflow-hidden">
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col">
          <AdminNavbar 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
          />
          
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="h-16 bg-gray-200 rounded-xl mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="h-64 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col">
        <AdminNavbar 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 border border-gray-200"
                  >
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Task Applicants</h1>
                    <p className="text-gray-600 mt-1 sm:mt-2">
                      {filteredApplicants.length} applicants found • Review applicant profiles
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                    <option value="experience">Most Experienced</option>
                  </select>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search applicants by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <select
                        value={filters.rating}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Ratings</option>
                        <option value="4+">4+ Stars</option>
                        <option value="3-4">3-4 Stars</option>
                        <option value="0-3">0-3 Stars</option>
                        <option value="unrated">Unrated</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                      <select
                        value={filters.verification}
                        onChange={(e) => handleFilterChange('verification', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Applicants</option>
                        <option value="verified">Verified Only</option>
                        <option value="unverified">Unverified Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                      <select
                        value={filters.experience}
                        onChange={(e) => handleFilterChange('experience', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All Experience</option>
                        <option value="experienced">Experienced</option>
                        <option value="entry-level">Entry Level</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Summary */}
            {(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Search className="w-4 h-4" />
                    <span className="font-medium">
                      {filteredApplicants.length} result{filteredApplicants.length !== 1 ? 's' : ''} found
                    </span>
                    {searchTerm && <span className="text-blue-600">for "{searchTerm}"</span>}
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({
                        status: 'all',
                        rating: 'all',
                        verification: 'all',
                        experience: 'all'
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Applicants Grid/List */}
            {filteredApplicants.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredApplicants.map((applicant, index) => (
                    <ApplicantCard key={applicant._id || index} applicant={applicant} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplicants.map((applicant, index) => (
                    <ApplicantListItem key={applicant._id || index} applicant={applicant} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No applicants found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm || Object.values(filters).some(f => f !== 'all')
                    ? 'Try adjusting your search criteria or filters to find more candidates.'
                    : 'This task hasn\'t received any applications yet.'}
                </p>
              </div>
            )}

            {/* Profile Modal */}
            {showModal && selectedApplicant && (
              <ProfileModal 
                applicant={selectedApplicant} 
                onClose={() => setShowModal(false)} 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminViewMiniTaskApplicants;