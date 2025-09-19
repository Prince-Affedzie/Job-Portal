import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, Mail, Calendar, User, Filter, Search, Download, ChevronLeft, ChevronRight, PhoneCall, Image } from "lucide-react";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";

// Profile Image Component
const ProfileImage = ({ applicant, size = 10, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  
  // If applicant has a profile image and no error loading it
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
  
  // Fallback to initial avatar
  return (
    <div className={`w-${size} h-${size} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold ${className}`}>
      {applicant.name?.charAt(0)?.toUpperCase() || 'A'}
    </div>
  );
};

// Enhanced Profile Image with status indicator
const ProfileImageWithStatus = ({ applicant, size = 10, showStatus = false, status = "active" }) => {
  const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-gray-400'
  };

  return (
    <div className="relative inline-block">
      <ProfileImage applicant={applicant} size={size} />
      {showStatus && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-white`}></div>
      )}
    </div>
  );
};

const ViewApplicantsAdmin = ({ jobId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const job = location.state;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Use your actual job data from location.state
    if (job?.applicantsId) {
      setApplicants(job.applicantsId);
      setFilteredApplicants(job.applicantsId);
    }
  }, [job]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = applicants;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(applicant => 
        applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(applicant => {
        if (statusFilter === "active") return applicant.status;
        if (statusFilter === "inactive") return !applicant.status;
        return true;
      });
    }
    
    setFilteredApplicants(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, applicants]);

  // Pagination
  const totalPages = Math.ceil(filteredApplicants.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentApplicants = filteredApplicants.slice(startIndex, endIndex);

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
        Inactive
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
        <div className="flex">
         <AdminSidebar 
                 isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
                 />
          <div className="flex-1 p-8">
            <div className="flex items-center justify-center h-96">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      <div className="flex">
      <AdminSidebar 
              isOpen={isSidebarOpen} 
             onClose={() => setIsSidebarOpen(false)}
              />
        <NotificationCenter/>

        <div className="flex-1 overflow-y-auto">
          <AdminNavbar 
                  onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
                   isSidebarOpen={isSidebarOpen} 
                   />
          <div className="mt-7 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent">
                      Applicants Overview
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Manage and review job applicants for <span className="font-semibold text-blue-600">{job?.title || 'this position'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl font-medium border border-blue-200">
                      {filteredApplicants.length} Applicant{filteredApplicants.length !== 1 ? 's' : ''}
                    </div>
                    <button className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="mb-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search applicants by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-12 pr-8 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[180px]"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Applicants Grid/Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              {currentApplicants.length === 0 ? (
                <div className="text-center py-16">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No applicants found</h3>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search or filter criteria"
                      : "No applicants have applied for this position yet"
                    }
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div style={{
                   display: windowWidth >= 1024 ? 'block' : 'none',
                   }}  className="md:block">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200">
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Applicant</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Contact</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Applied On</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentApplicants.map((applicant, index) => (
                            <tr 
                              key={applicant._id} 
                              className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-300 group"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <ProfileImageWithStatus 
                                    applicant={applicant} 
                                    size={10} 
                                    showStatus={true} 
                                    status={applicant.status ? "active" : "inactive"}
                                  />
                                  <div>
                                    <div className="font-semibold text-gray-900">{applicant.name}</div>
                                    <div className="text-sm text-gray-500">{applicant.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <PhoneCall className="w-4 h-4" />
                                  <span className="text-sm">{applicant.phone}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                {getStatusBadge(applicant.status)}
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <span className="text-sm">{formatDate(applicant.createdAt)}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <button
                                  onClick={() => navigate(`/admin/get/user_info/${applicant._id}`)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 group-hover:shadow-blue-200"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span className="font-medium">View Details</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden p-4 space-y-4">
                    {currentApplicants.map((applicant, index) => (
                      <div 
                        key={applicant._id}
                        className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <ProfileImageWithStatus 
                              applicant={applicant} 
                              size={12} 
                              showStatus={true} 
                              status={applicant.status ? "active" : "inactive"}
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{applicant.name}</div>
                              <div className="text-sm text-gray-500">ID: {applicant._id.slice(-6)}</div>
                            </div>
                          </div>
                          {getStatusBadge(applicant.status)}
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{applicant.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatDate(applicant.createdAt)}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => navigate(`/admin/get/user_info/${applicant._id}`)}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Showing {startIndex + 1} to {Math.min(endIndex, filteredApplicants.length)} of {filteredApplicants.length} applicants
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                currentPage === page
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                  : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicantsAdmin;