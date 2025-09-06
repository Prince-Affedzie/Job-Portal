import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Search, 
  Filter, 
  Eye,
  Users,
  Award,
  Briefcase,
  X,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Download,
  MoreHorizontal,
  ChevronDown,
  Badge,
  Image,
  Menu
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Filtering and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    verification: 'all',
    eligibility: 'all',
    experience: 'all',
    availability: 'all'
  });
  
  // Sorting and view state
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Modal state
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (location.state?.applicants) {
      setApplicants(location.state.applicants);
    }
    setLoading(false);
  }, [location.state]);

  // Enhanced filtering and sorting logic
  const filteredAndSortedApplicants = useMemo(() => {
    let filtered = [...applicants];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(applicant =>
        applicant.name?.toLowerCase().includes(searchLower) ||
        applicant.email?.toLowerCase().includes(searchLower) ||
        (applicant.skills || []).some(skill => 
          skill.toLowerCase().includes(searchLower)
        ) ||
        (applicant.Bio || '').toLowerCase().includes(searchLower) ||
        (applicant.workExperience || []).some(exp =>
          exp.jobTitle?.toLowerCase().includes(searchLower) ||
          exp.company?.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply filters
    if (filters.verification !== 'all') {
      filtered = filtered.filter(applicant =>
        filters.verification === 'verified' ? applicant.isVerified : !applicant.isVerified
      );
    }

    if (filters.eligibility !== 'all') {
      filtered = filtered.filter(applicant =>
        filters.eligibility === 'eligible' ? applicant.miniTaskEligible : !applicant.miniTaskEligible
      );
    }

    if (filters.experience !== 'all') {
      filtered = filtered.filter(applicant => {
        const hasExperience = applicant.workExperience && applicant.workExperience.length > 0;
        return filters.experience === 'experienced' ? hasExperience : !hasExperience;
      });
    }

    // Sort applicants
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'date':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'relevance':
        default:
          aValue = (a.isVerified ? 2 : 0) + (a.miniTaskEligible ? 2 : 0) + (a.skills?.length || 0) * 0.1;
          bValue = (b.isVerified ? 2 : 0) + (b.miniTaskEligible ? 2 : 0) + (b.skills?.length || 0) * 0.1;
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [applicants, searchTerm, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedApplicants.length / itemsPerPage);
  const paginatedApplicants = filteredAndSortedApplicants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const getApplicantScore = (applicant) => {
    let score = 0;
    if (applicant.isVerified) score += 2;
    if (applicant.miniTaskEligible) score += 2;
    if (applicant.skills?.length > 5) score += 1;
    if (applicant.workExperience?.length > 2) score += 1;
    return Math.min(score, 5);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Profile Image Component
  const ProfileImage = ({ applicant, size = 14, className = "" }) => {
    const [imageError, setImageError] = useState(false);
    
    if (applicant.profileImage && !imageError) {
      return (
        <img
          src={applicant.profileImage}
          alt={applicant.name || 'Applicant'}
          className={`w-${size} h-${size} rounded-xl object-cover border-2 border-white shadow-sm ${className}`}
          onError={() => setImageError(true)}
        />
      );
    }
    
    return (
      <div className={`w-${size} h-${size} bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-semibold ${className}`}>
        {getInitials(applicant.name)}
      </div>
    );
  };

  const ApplicantListItem = ({ applicant }) => {
    const score = getApplicantScore(applicant);
    
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <ProfileImage applicant={applicant} size={isMobile ? 12 : 14} />
              {applicant.isVerified && (
                <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-2 h-2 md:w-3 md:h-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                <h3 className="font-semibold text-gray-900 truncate text-sm md:text-base">{applicant.name}</h3>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${i < score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-xs md:text-sm text-gray-600 mb-3 gap-1 md:gap-0">
                <span className="flex items-center">
                  <Mail className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="truncate">{applicant.email}</span>
                </span>
                {applicant.location && (
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="truncate">
                      {[applicant.location.city, applicant.location.region].filter(Boolean).join(', ')}
                    </span>
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 md:gap-2">
                {applicant.isVerified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    Verified
                  </span>
                )}
                {applicant.miniTaskEligible && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    Eligible
                  </span>
                )}
                {applicant.skills?.slice(0, isMobile ? 2 : 3).map((skill, index) => (
                  <span key={index} className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {applicant.skills?.length > (isMobile ? 2 : 3) && (
                  <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-blue-50 text-blue-600 rounded text-xs">
                    +{applicant.skills.length - (isMobile ? 2 : 3)} more
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end md:justify-normal space-x-2 md:space-x-3 md:ml-6">
            <button
              onClick={() => {
                setSelectedApplicant(applicant);
                setShowModal(true);
              }}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
            >
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              <span>View</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProfileModal = ({ applicant, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50">
      <div className="bg-white rounded-xl md:rounded-3xl max-w-5xl w-full max-h-[95vh] md:max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <ProfileImage applicant={applicant} size={isMobile ? 12 : 16} className="border-2 md:border-4 border-white/20" />
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{applicant.name}</h2>
                <div className="flex items-center space-x-1 mt-1 md:mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${i < getApplicantScore(applicant) ? 'text-yellow-300 fill-current' : 'text-white/30'}`} />
                  ))}
                  <span className="text-white/80 ml-2 text-xs md:text-sm">{getApplicantScore(applicant)}/5 Match</span>
                </div>
                <div className="flex flex-wrap gap-1 md:gap-2 mt-2 md:mt-3">
                  {applicant.isVerified && (
                    <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-100 border border-emerald-400/30">
                      <CheckCircle className="w-2 h-2 md:w-3 md:h-3 mr-1" />
                      Verified
                    </span>
                  )}
                  {applicant.miniTaskEligible && (
                    <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-100 border border-blue-400/30">
                      <Badge className="w-2 h-2 md:w-3 md:h-3 mr-1" />
                      Task Eligible
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-80px)] md:max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Left Column - Contact & Bio */}
            <div className="lg:col-span-1 space-y-4 md:space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h4 className="font-bold text-gray-900 mb-3 md:mb-4 flex items-center text-sm md:text-base">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2" />
                  Contact Information
                </h4>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center p-2 md:p-3 bg-white rounded-lg md:rounded-xl">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 text-gray-500 mr-2 md:mr-3" />
                    <span className="text-gray-700 text-xs md:text-sm">{applicant.email}</span>
                  </div>
                  {applicant.phone && (
                    <div className="flex items-center p-2 md:p-3 bg-white rounded-lg md:rounded-xl">
                      <Phone className="w-3 h-3 md:w-4 md:h-4 text-gray-500 mr-2 md:mr-3" />
                      <span className="text-gray-700 text-xs md:text-sm">{applicant.phone}</span>
                    </div>
                  )}
                  {applicant.location && (
                    <div className="flex items-center p-2 md:p-3 bg-white rounded-lg md:rounded-xl">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-500 mr-2 md:mr-3" />
                      <span className="text-gray-700 text-xs md:text-sm">
                        {[applicant.location.city, applicant.location.region].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {applicant.Bio && (
                <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h4 className="font-bold text-gray-900 mb-2 md:mb-3 flex items-center text-sm md:text-base">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-green-600 mr-2" />
                    About
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-xs md:text-sm">{applicant.Bio}</p>
                </div>
              )}

              {/* Skills */}
              {applicant.skills?.length > 0 && (
                <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h4 className="font-bold text-gray-900 mb-3 md:mb-4 flex items-center text-sm md:text-base">
                    <Award className="w-4 h-4 md:w-5 md:h-5 text-purple-600 mr-2" />
                    Skills ({applicant.skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {applicant.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-white text-gray-700 rounded text-xs font-medium border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Experience & Education */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Work Experience */}
              {applicant.workExperience?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h4 className="font-bold text-gray-900 mb-4 md:mb-6 flex items-center text-sm md:text-base">
                    <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 mr-2" />
                    Work Experience ({applicant.workExperience.length})
                  </h4>
                  <div className="space-y-4 md:space-y-6">
                    {applicant.workExperience.map((exp, index) => (
                      <div key={index} className="relative pl-4 md:pl-6 border-l-2 border-emerald-200 last:border-l-0">
                        <div className="absolute -left-1.5 md:-left-2 top-0 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full"></div>
                        <div className="bg-emerald-50 rounded-lg md:rounded-xl p-3 md:p-4">
                          <h5 className="font-bold text-gray-900 mb-1 text-sm md:text-base">{exp.jobTitle}</h5>
                          <p className="text-emerald-700 font-medium mb-2 text-xs md:text-sm">{exp.company}</p>
                          <div className="flex items-center text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 leading-relaxed text-xs md:text-sm">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {applicant.education?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                  <h4 className="font-bold text-gray-900 mb-4 md:mb-6 flex items-center text-sm md:text-base">
                    <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-amber-600 mr-2" />
                    Education ({applicant.education.length})
                  </h4>
                  <div className="space-y-3 md:space-y-4">
                    {applicant.education.map((edu, index) => (
                      <div key={index} className="bg-amber-50 rounded-lg md:rounded-xl p-3 md:p-4 border-l-4 border-amber-400">
                        <h5 className="font-bold text-gray-900 mb-1 text-sm md:text-base">{edu.degree}</h5>
                        <p className="text-amber-700 font-medium text-xs md:text-sm">{edu.institution}</p>
                        {edu.yearOfCompletion && (
                          <p className="text-xs md:text-sm text-gray-500 mt-1">Completed {edu.yearOfCompletion}</p>
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
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <AdminNavbar 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
          />
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium text-sm md:text-base">Loading applicants...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar - Fixed at the top */}
        <div className="sticky top-0 z-40">
          <AdminNavbar 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
          />
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-4 md:mb-6 lg:mb-8">
              <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 md:p-3 hover:bg-white hover:shadow-md rounded-lg md:rounded-xl transition-all duration-200 border border-gray-200"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Task Applicants</h1>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 md:mt-2 text-xs md:text-sm text-gray-600">
                    <span className="flex items-center">
                      <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      {filteredAndSortedApplicants.length} of {applicants.length} candidates
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 text-emerald-500" />
                      {applicants.filter(a => a.isVerified).length} verified
                    </span>
                    <span className="flex items-center">
                      <Badge className="w-3 h-3 md:w-4 md:h-4 mr-1 text-blue-500" />
                      {applicants.filter(a => a.miniTaskEligible).length} eligible
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6 lg:mb-8">
              {/* Top Row - Search and View Controls */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                  />
                </div>
                
                <div className="flex items-center justify-between md:justify-normal space-x-2 md:space-x-3">
                  {/* Sort Dropdown */}
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [newSortBy, newSortOrder] = e.target.value.split('-');
                      setSortBy(newSortBy);
                      setSortOrder(newSortOrder);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  >
                    <option value="relevance-desc">Best Match</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="rating-asc">Lowest Rated</option>
                  </select>

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-3 py-2 border rounded-lg transition-colors flex items-center space-x-1 md:space-x-2 text-sm md:text-base ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden md:inline">Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="border-t border-gray-200 pt-4 md:pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Verification</label>
                      <select
                        value={filters.verification}
                        onChange={(e) => handleFilterChange('verification', e.target.value)}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                      >
                        <option value="all">All Applicants</option>
                        <option value="verified">Verified Only</option>
                        <option value="unverified">Unverified Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Eligibility</label>
                      <select
                        value={filters.eligibility}
                        onChange={(e) => handleFilterChange('eligibility', e.target.value)}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                      >
                        <option value="all">All Applicants</option>
                        <option value="eligible">Eligible Only</option>
                        <option value="not-eligible">Not Eligible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Experience</label>
                      <select
                        value={filters.experience}
                        onChange={(e) => handleFilterChange('experience', e.target.value)}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                      >
                        <option value="all">All Levels</option>
                        <option value="experienced">Experienced</option>
                        <option value="entry-level">Entry Level</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Actions</label>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setFilters({
                            verification: 'all',
                            eligibility: 'all',
                            experience: 'all',
                            availability: 'all'
                          });
                          setSortBy('relevance');
                          setSortOrder('desc');
                          setCurrentPage(1);
                        }}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs md:text-sm font-medium"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Summary */}
            {(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 md:space-x-2 text-blue-800 text-xs md:text-sm">
                    <Search className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="font-medium">
                      {filteredAndSortedApplicants.length} result{filteredAndSortedApplicants.length !== 1 ? 's' : ''} found
                    </span>
                    {searchTerm && <span className="text-blue-600">for "{searchTerm}"</span>}
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({
                        verification: 'all',
                        eligibility: 'all',
                        experience: 'all',
                        availability: 'all'
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium"
                  >
                    Clear search
                  </button>
                </div>
              </div>
            )}

            {/* Applicants Display */}
            {filteredAndSortedApplicants.length > 0 ? (
              <>
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {paginatedApplicants.map((applicant, index) => (
                    <ApplicantListItem key={applicant._id || index} applicant={applicant} />
                  ))}
                </div>
              
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6 gap-4 md:gap-0">
                    <div className="text-xs md:text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedApplicants.length)} of {filteredAndSortedApplicants.length} applicants
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-xs md:text-sm"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 md:w-10 md:h-10 rounded-lg font-medium transition-colors text-xs md:text-sm ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-xs md:text-sm"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-12 md:py-16 lg:py-20">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Users className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 md:mb-3">No applicants found</h3>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
                  {searchTerm || Object.values(filters).some(f => f !== 'all')
                    ? 'Try adjusting your search criteria or filters to find more candidates.'
                    : 'This task hasn\'t received any applications yet. Check back later for updates.'}
                </p>
                {(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({
                        verification: 'all',
                        eligibility: 'all',
                        experience: 'all',
                        availability: 'all'
                      });
                    }}
                    className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm md:text-base"
                  >
                    Clear all filters
                  </button>
                )}
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