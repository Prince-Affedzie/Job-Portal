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
  RefreshCw
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
        dispute.raisedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.against.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(dispute => dispute.status === statusFilter);
    }

    setFilteredDisputes(filtered);
  }, [searchTerm, statusFilter, disputes]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      under_review: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      reassigned: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
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

  const handleViewDispute = (dispute) => {
    setSelectedDispute(dispute);
    setShowModal(true);
    setResolutionNotes(dispute.resolutionNotes || '');
    setNewStatus(dispute.status);
  };

  const handleUpdateDispute = async () => {
    if (!selectedDispute) return;

    // Create update payload with only changed/non-empty fields
    const updatePayload = {};
    
    // Only include status if it has changed
    if (newStatus !== selectedDispute.status && newStatus.trim() !== '') {
      updatePayload.newStatus = newStatus;
    }
    
    // Only include resolution notes if they are not empty and different from existing
    const trimmedNotes = resolutionNotes.trim();
    const existingNotes = selectedDispute.resolutionNotes || '';
    
    if (trimmedNotes !== '' && trimmedNotes !== existingNotes) {
      updatePayload.resolutionNotes = trimmedNotes;
    }
    
    // If no fields to update, show message and return
    if (Object.keys(updatePayload).length === 0) {
      toast.info("No changes detected to update.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await resolveDispute(selectedDispute._id, updatePayload);
      
      if (response.status === 200) {
        // Update the disputes array with the new data
        const updatedDisputes = disputes.map(dispute => 
          dispute._id === selectedDispute._id 
            ? { 
                ...dispute, 
                ...(updatePayload.newStatus && { status: updatePayload.newStatus }),
                ...(updatePayload.resolutionNotes && { resolutionNotes: updatePayload.resolutionNotes }),
                updatedAt: new Date().toISOString() // Update the timestamp
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

  const stats = getStats();

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
        
        {/* Notification Center */}
        <NotificationCenter/>
        <ToastContainer/>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dispute Management</h1>
              <p className="text-gray-600">Monitor and resolve user disputes efficiently</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Disputes</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Open</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.open}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Under Review</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.underReview}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.resolved}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search disputes..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="relative">
                    <select
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="under_review">Under Review</option>
                      <option value="resolved">Resolved</option>
                      <option value="reassigned">Reassigned</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  </div>
                  
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Disputes Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dispute Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parties Involved
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDisputes.map((dispute) => (
                      <tr key={dispute._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{dispute.reason}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{dispute.details}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="font-medium">Raised by:</span>
                              <span className="ml-1 text-gray-600">{dispute.raisedBy.name}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="font-medium">Against:</span>
                              <span className="ml-1 text-gray-600">{dispute.against.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{dispute.taskId?.title || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(dispute.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(dispute.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => handleViewDispute(dispute)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredDisputes.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No disputes found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No disputes have been reported yet.'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Modal */}
            {showModal && selectedDispute && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Dispute Details</h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Dispute Information</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">

                          <div>
                            <span className="text-sm font-medium text-gray-600">Task:</span>
                            <p className="text-sm text-gray-900 mt-1">{selectedDispute.taskId?.title || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Reason:</span>
                            <p className="text-sm text-gray-900 mt-1">{selectedDispute.reason}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Details:</span>
                            <p className="text-sm text-gray-900 mt-1">{selectedDispute.details}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Status:</span>
                            <div className="mt-1">{getStatusBadge(selectedDispute.status)}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Parties Involved</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Raised By:</span>
                            <p className="text-sm text-gray-900">{selectedDispute.raisedBy.name}</p>
                            <p className="text-sm text-gray-500">{selectedDispute.raisedBy.email}-{selectedDispute.raisedBy.phone}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Against:</span>
                            <p className="text-sm text-gray-900">{selectedDispute.against.name}</p>
                            <p className="text-sm text-gray-500">{selectedDispute.against.email}-{selectedDispute.raisedBy.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Timeline</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Created:</span>
                            <span className="text-sm text-gray-900">{formatDate(selectedDispute.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Last Updated:</span>
                            <span className="text-sm text-gray-900">{formatDate(selectedDispute.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Resolution Management</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Update Status
                            </label>
                            <select
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Resolution Notes
                            </label>
                            <textarea
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={6}
                              placeholder="Add notes about the resolution..."
                              value={resolutionNotes}
                              onChange={(e) => setResolutionNotes(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {selectedDispute.resolutionNotes && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Previous Resolution Notes</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-900">{selectedDispute.resolutionNotes}</p>
                            {selectedDispute.resolvedBy && (
                              <p className="text-xs text-gray-500 mt-2">
                                By: {selectedDispute.resolvedBy.name}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateDispute}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                    >
                      {loading && <RefreshCw className="animate-spin h-4 w-4 mr-2" />}
                      Update Dispute
                    </button>
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