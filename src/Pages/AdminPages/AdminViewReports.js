import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  User,
  Calendar,
  FileText,
  MessageSquare,
  ChevronDown,
  Download,
  RefreshCw,
  Image,
  Video,
  File,
  ZoomIn,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { getAllDisputes, resolveDispute } from '../../APIS/API';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";

const DisputeAdminDashboard = () => {
  const [disputes, setDisputes] = useState([]);
  const [filteredDisputes, setFilteredDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchAllDisputes = async() => {
      setLoading(true);
      try {
        const response = await getAllDisputes();
        if (response.status === 200) {
          setDisputes(response.data);
        } else {
          setDisputes([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllDisputes();
  }, []);

  useEffect(() => {
    let filtered = disputes;

    if (searchTerm) {
      filtered = filtered.filter(dispute => 
        dispute.raisedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.against?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(dispute => dispute.status === statusFilter);
    }

    setFilteredDisputes(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, disputes]);

  // Pagination calculations
  const totalItems = filteredDisputes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDisputes = filteredDisputes.slice(startIndex, endIndex);

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: 'bg-red-50 text-red-700 border border-red-200', icon: AlertTriangle },
      under_review: { color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: Clock },
      resolved: { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: CheckCircle },
      reassigned: { color: 'bg-blue-50 text-blue-700 border border-blue-200', icon: RefreshCw }
    };

    const config = statusConfig[status] || statusConfig.open;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEvidenceIcon = (evidenceUrl) => {
    if (!evidenceUrl) return File;
    
    const extension = evidenceUrl.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return Image;
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) return Video;
    return File;
  };

  const handleViewDispute = (dispute) => {
    setSelectedDispute(dispute);
    setShowModal(true);
    setResolutionNotes(dispute.resolutionNotes || '');
    setNewStatus(dispute.status);
  };

  const handleViewEvidence = (evidenceUrl) => {
    setSelectedEvidence(evidenceUrl);
    setShowEvidenceModal(true);
  };

  const handleUpdateDispute = async () => {
    if (!selectedDispute) return;

    const updatePayload = {};
    
    if (newStatus !== selectedDispute.status && newStatus.trim() !== '') {
      updatePayload.newStatus = newStatus;
    }
    
    const trimmedNotes = resolutionNotes.trim();
    const existingNotes = selectedDispute.resolutionNotes || '';
    
    if (trimmedNotes !== '' && trimmedNotes !== existingNotes) {
      updatePayload.resolutionNotes = trimmedNotes;
    }
    
    if (Object.keys(updatePayload).length === 0) {
      toast.info("No changes detected to update.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await resolveDispute(selectedDispute._id, updatePayload);
      
      if (response.status === 200) {
        const updatedDisputes = disputes.map(dispute => 
          dispute._id === selectedDispute._id 
            ? { 
                ...dispute, 
                ...(updatePayload.newStatus && { status: updatePayload.newStatus }),
                ...(updatePayload.resolutionNotes && { resolutionNotes: updatePayload.resolutionNotes }),
                updatedAt: new Date().toISOString()
              }
            : dispute
        );
        
        setDisputes(updatedDisputes);
        setShowModal(false);
        toast.success("Dispute updated successfully!");
      } else {
        toast.error("Failed to update dispute. Please try again.");
      }
    } catch (error) {
      console.error("Error updating dispute:", error);
      toast.error("An error occurred while updating the dispute.");
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const total = disputes.length;
    const open = disputes.filter(d => d.status === 'open').length;
    const underReview = disputes.filter(d => d.status === 'under_review').length;
    const resolved = disputes.filter(d => d.status === 'resolved').length;
    
    return { total, open, underReview, resolved };
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar */}
        <div className="sticky top-0 z-40">
          <AdminNavbar 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
          />
        </div>
        
        {/* Notification Center */}
        <NotificationCenter/>
        <ToastContainer/>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Dispute Management</h1>
              <p className="text-slate-600">Monitor and resolve user disputes efficiently</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Disputes', value: stats.total, icon: FileText, color: 'blue' },
                { label: 'Open', value: stats.open, icon: AlertTriangle, color: 'red' },
                { label: 'Under Review', value: stats.underReview, icon: Clock, color: 'amber' },
                { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'emerald' }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search disputes by name, reason, or details..."
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:flex-none">
                    <select
                      className="appearance-none w-full bg-white border border-slate-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="under_review">Under Review</option>
                      <option value="resolved">Resolved</option>
                      <option value="reassigned">Reassigned</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
                  </div>

                  <div className="relative flex-1 lg:flex-none">
                    <select
                      className="appearance-none w-full bg-white border border-slate-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                      <option value="50">50 per page</option>
                    </select>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Disputes Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Dispute Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Parties
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Evidence
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {currentDisputes.map((dispute) => (
                      <tr key={dispute._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm font-semibold text-slate-900 mb-1">{dispute.reason}</div>
                            <div className="text-sm text-slate-600 line-clamp-2">{dispute.details}</div>
                            {dispute.taskId?.title && (
                              <div className="text-xs text-slate-500 mt-1">
                                Task: {dispute.taskId.title}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="font-medium text-slate-700">By:</span>
                              <span className="text-slate-600">{dispute.raisedBy?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="font-medium text-slate-700">Against:</span>
                              <span className="text-slate-600">{dispute.against?.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {dispute.evidence ? (
                            <button
                              onClick={() => handleViewEvidence(dispute.evidence)}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-medium transition-all duration-200"
                            >
                              {(() => {
                                const Icon = getEvidenceIcon(dispute.evidence);
                                return <Icon className="w-4 h-4" />;
                              })()}
                              View Evidence
                            </button>
                          ) : (
                            <span className="text-sm text-slate-400">No evidence</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(dispute.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(dispute.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDispute(dispute)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-all duration-200"
                          >
                            <Eye className="w-4 h-4" />
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {currentDisputes.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No disputes found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No disputes have been reported yet.'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                      Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                      <span className="font-semibold">{Math.min(endIndex, totalItems)}</span> of{' '}
                      <span className="font-semibold">{totalItems}</span> disputes
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Items per page selector */}
                      <div className="hidden sm:flex items-center gap-2 mr-4">
                        <span className="text-sm text-slate-600">Show:</span>
                        <select
                          className="text-sm border border-slate-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-blue-500"
                          value={itemsPerPage}
                          onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                        </select>
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={goToFirstPage}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="First page"
                        >
                          <ChevronsLeft className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={goToPrevPage}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Previous page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {getPageNumbers().map(page => (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`min-w-8 h-8 px-2 rounded-lg border text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Next page"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={goToLastPage}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Last page"
                        >
                          <ChevronsRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dispute Detail Modal */}
            {showModal && selectedDispute && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-all duration-300">
                <div className="relative top-4 mx-auto p-4 w-11/12 max-w-6xl shadow-2xl rounded-2xl bg-white transform transition-transform duration-300">
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Dispute Resolution</h3>
                      <p className="text-slate-600 mt-1">Manage and resolve dispute between users</p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
                    >
                      <XCircle className="h-6 w-6 text-slate-400 hover:text-slate-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column - Dispute Info */}
                    <div className="xl:col-span-2 space-y-6">
                      {/* Dispute Information */}
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Dispute Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Task</label>
                            <p className="text-sm text-slate-900 font-medium mt-1">
                              {selectedDispute.taskId?.title || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Reason</label>
                            <p className="text-sm text-slate-900 font-medium mt-1">
                              {selectedDispute.reason}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-600">Details</label>
                            <p className="text-sm text-slate-700 mt-2 bg-white p-4 rounded-xl border border-slate-200">
                              {selectedDispute.details}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Parties Involved */}
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Parties Involved
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="font-semibold text-slate-900">Raised By</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900">{selectedDispute.raisedBy?.name}</p>
                            <p className="text-sm text-slate-600 mt-1">{selectedDispute.raisedBy?.email}</p>
                            <p className="text-sm text-slate-600">{selectedDispute.raisedBy?.phone}</p>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-red-200">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="font-semibold text-slate-900">Against</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900">{selectedDispute.against?.name}</p>
                            <p className="text-sm text-slate-600 mt-1">{selectedDispute.against?.email}</p>
                            <p className="text-sm text-slate-600">{selectedDispute.against?.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Evidence Section */}
                      {selectedDispute.evidence && (
                        <div className="bg-slate-50 rounded-2xl p-6">
                          <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Image className="w-5 h-5" />
                            Supporting Evidence
                          </h4>
                          <div className="bg-white rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {(() => {
                                  const EvidenceIcon = getEvidenceIcon(selectedDispute.evidence);
                                  return <EvidenceIcon className="w-8 h-8 text-blue-600" />;
                                })()}
                                <div>
                                  <p className="text-sm font-medium text-slate-900">Evidence File</p>
                                  <p className="text-xs text-slate-500">Click to view full evidence</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleViewEvidence(selectedDispute.evidence)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                              >
                                <ZoomIn className="w-4 h-4" />
                                View Evidence
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Resolution */}
                    <div className="space-y-6">
                      {/* Resolution Management */}
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Resolution Management</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Update Status
                            </label>
                            <select
                              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                            >
                              <option value="open">Open</option>
                              <option value="under_review">Under Review</option>
                              <option value="resolved">Resolved</option>
                              <option value="reassigned">Reassigned</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Resolution Notes
                            </label>
                            <textarea
                              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                              rows={8}
                              placeholder="Add detailed notes about the resolution process and outcome..."
                              value={resolutionNotes}
                              onChange={(e) => setResolutionNotes(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Timeline</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-slate-200">
                            <span className="text-sm text-slate-600">Created</span>
                            <span className="text-sm font-medium text-slate-900">{formatDate(selectedDispute.createdAt)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-slate-600">Last Updated</span>
                            <span className="text-sm font-medium text-slate-900">{formatDate(selectedDispute.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateDispute}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
                    >
                      {loading && <RefreshCw className="animate-spin h-4 w-4" />}
                      Update Dispute
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Evidence Modal */}
            {showEvidenceModal && selectedEvidence && (
              <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-all duration-300">
                <div className="relative top-4 mx-auto p-4 w-11/12 max-w-4xl shadow-2xl rounded-2xl bg-white transform transition-transform duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Evidence Preview</h3>
                    <button
                      onClick={() => setShowEvidenceModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
                    >
                      <X className="h-6 w-6 text-slate-400 hover:text-slate-600" />
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6">
                    {selectedEvidence.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <div className="flex justify-center">
                        <img 
                          src={selectedEvidence} 
                          alt="Evidence" 
                          className="max-h-96 rounded-lg shadow-lg"
                        />
                      </div>
                    ) : selectedEvidence.match(/\.(mp4|avi|mov|wmv)$/i) ? (
                      <div className="flex justify-center">
                        <video 
                          controls 
                          className="max-h-96 rounded-lg shadow-lg"
                        >
                          <source src={selectedEvidence} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <File className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                        <p className="text-slate-700 mb-4">Document evidence</p>
                        <a 
                          href={selectedEvidence} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Download File
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end mt-6">
                    <a 
                      href={selectedEvidence} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DisputeAdminDashboard;