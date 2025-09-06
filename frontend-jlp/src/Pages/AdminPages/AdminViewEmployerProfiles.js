import React, { useEffect, useState } from "react";
import { Eye, ExternalLink, Building, Mail, Phone, MapPin, Globe, CheckCircle, XCircle, Clock, AlertCircle, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { getEmployersProfiles } from "../../APIS/API";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
 import { useNavigate } from "react-router-dom";

const AdminEmployerList = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  // Show notification function
  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const res = await getEmployersProfiles();
        if (res.status === 200) {
          setEmployers(res.data);
          console.log(res.data);
        } else {
          showNotification("Failed to load employers.", "error");
        }
      } catch (err) {
        showNotification("Something went wrong.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployers();
  }, []);

  // Filter employers based on search and status
  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employer.companyEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employer.companyLocation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || employer.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployers = filteredEmployers.slice(startIndex, startIndex + itemsPerPage);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, label: "PENDING" },
      approved: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle, label: "APPROVED" },
      rejected: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle, label: "REJECTED" },
    };
    return configs[status] || configs.pending;
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-16">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Building className="w-5 h-5 text-blue-600" />
        </div>
      </div>
    </div>
  );


  const TableRow = ({ employer, index }) => {
    const statusConfig = getStatusConfig(employer.verificationStatus);
    const StatusIcon = statusConfig.icon;

    return (
      <tr className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
        {/* Company Name */}
        
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">{employer.companyName}</div>
              <div className="flex items-center space-x-1 mt-1">
                {employer.isVerified ? (
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${employer.isVerified ? 'text-emerald-600' : 'text-red-600'}`}>
                  {employer.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>
        </td>

        {/* Email */}
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="text-sm truncate max-w-48">{employer.companyEmail}</span>
          </div>
        </td>

        {/* Phone */}
        <td className="px-6 py-4">
          {employer.companyLine ? (
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{employer.companyLine}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">N/A</span>
          )}
        </td>

        {/* Location */}
        <td className="px-6 py-4">
          {employer.companyLocation ? (
            <div className="flex items-center space-x-2 text-gray-700">
              <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm truncate max-w-32">{employer.companyLocation}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">N/A</span>
          )}
        </td>

        {/* Website */}
        <td className="px-6 py-4">
          {employer.companyWebsite ? (
            <a 
              href={employer.companyWebsite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Visit</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-gray-400 text-sm">N/A</span>
          )}
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border text-xs font-semibold ${statusConfig.color}`}>
            <StatusIcon className="w-3 h-3" />
            <span>{statusConfig.label}</span>
          </div>
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          <button
            onClick={() => {
             navigate(`/admin/${employer._id}/employer_profile/details`);
            
            }}
           className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            <span>View</span>
          </button>
        </td>
      </tr>
    );
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
        <div className="text-sm text-gray-600 font-medium">
          Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to <span className="font-bold text-gray-900">{Math.min(startIndex + itemsPerPage, filteredEmployers.length)}</span> of <span className="font-bold text-gray-900">{filteredEmployers.length}</span> results
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-1">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              
              if (totalPages > 7 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                if (page === currentPage - 3 || page === currentPage + 3) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                if (Math.abs(page - currentPage) > 2) return null;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-105'
                      : 'text-gray-700 hover:bg-gray-100 border border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
     
      <div className="flex flex-1">
       
          <AdminSidebar 
                        isOpen={isSidebarOpen} 
                       onClose={() => setIsSidebarOpen(false)}
               />
          <NotificationCenter/>
       
        
        <main className="flex-1 overflow-y-auto">
         <AdminNavbar 
                onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
                 isSidebarOpen={isSidebarOpen} 
                 />
          <div className="max-w-full">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
                Employers Overview
              </h1>
              <p className="text-gray-600 text-lg">Manage and monitor employer profiles and verification status</p>
            </div>

            {/* Controls */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 max-w-md relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by company name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div className="text-sm font-semibold text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-3 rounded-xl border border-blue-200">
                    Total: <span className="text-blue-700">{filteredEmployers.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {loading ? (
                <LoadingSpinner />
              ) : filteredEmployers.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No employers found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters to find what you're looking for." 
                      : "No employer profiles are available at the moment. New employers will appear here once they register."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-100 to-blue-100 border-b border-gray-200">
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                            Company
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                            Phone
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                            Location
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                            Website
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedEmployers.map((employer, index) => (
                          <TableRow key={employer._id} employer={employer} index={index} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEmployerList;