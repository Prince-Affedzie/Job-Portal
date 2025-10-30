import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Eye,
  MessageCircle,
  Shield,
  Award,
  TrendingUp,
  X,
  Loader
} from "lucide-react";
import { getSingleMinitask } from '../../APIS/API';
import { getCuratedTaskPool, removeFromTaskpool } from '../../APIS/adminApi';
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";

const AdminViewTaskpoolPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [curatedTaskers, setCuratedTaskers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState({ type: '', text: '', show: false });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [removingTasker, setRemovingTasker] = useState(null);

  const showNotification = (type, text) => {
    setShowMessage({ type, text, show: true });
    setTimeout(() => setShowMessage({ type: '', text: '', show: false }), 4000);
  };

  useEffect(() => {
    if (taskId) {
      fetchTaskAndTaskpool();
    }
  }, [taskId]);

  const fetchTaskAndTaskpool = async () => {
    try {
      setLoading(true);
      
      // Fetch task details
      const taskRes = await getSingleMinitask(taskId);
      if (taskRes.status === 200) {
        setTask(taskRes.data);
      }

      // Fetch curated taskpool
      const taskpoolRes = await getCuratedTaskPool(taskId);
      if (taskpoolRes.status === 200) {
        // The response is an array of objects with tasker data nested
        console.log("Taskpool API response:", taskpoolRes.data);
        setCuratedTaskers(taskpoolRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("error", "Failed to load taskpool data");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromTaskpool = async (taskerId) => {
    try {
      setRemovingTasker(taskerId);
      const res = await removeFromTaskpool(taskId, taskerId);
      
      if (res.status === 200) {
        showNotification("success", "Tasker removed from pool successfully");
        // Remove from local state - note: taskerId here is the pool entry ID, not user ID
        setCuratedTaskers(prev => prev.filter(entry => entry._id !== taskerId));
      }
    } catch (error) {
      console.error("Error removing tasker:", error);
      showNotification("error", "Failed to remove tasker from pool");
    } finally {
      setRemovingTasker(null);
    }
  };

  const getResponseStatusConfig = (status) => {
    const configs = {
      pending: { color: "text-yellow-700 bg-yellow-100 border-yellow-300", icon: Clock, label: "Pending" },
      accepted: { color: "text-green-700 bg-green-100 border-green-300", icon: CheckCircle, label: "Accepted" },
      rejected: { color: "text-red-700 bg-red-100 border-red-300", icon: XCircle, label: "Rejected" },
      expired: { color: "text-gray-700 bg-gray-100 border-gray-300", icon: Clock, label: "Expired" }
    };
    return configs[status] || { color: "text-gray-700 bg-gray-100 border-gray-300", icon: Clock, label: "Unknown" };
  };

  const formatTaskerData = (taskerData) => {
    // Format location string from location object
    const locationString = taskerData.location ? 
      [taskerData.location.region, taskerData.location.city, taskerData.location.town]
        .filter(Boolean)
        .join(', ') 
      : 'Location not specified';

    return {
      _id: taskerData._id,
      name: taskerData.name || 'Unknown Tasker',
      email: taskerData.email || 'No email',
      phone: taskerData.phone || 'No phone',
      rating: taskerData.rating || 0,
      skills: taskerData.skills || [],
      location: locationString,
      completedTasks: taskerData.completedTasks || 0,
      responseRate: taskerData.responseRate || 0,
      profileImage: taskerData.profileImage || null,
      isVerified: taskerData.isVerified || false,
      Bio: taskerData.Bio || ''
    };
  };

  // Filter taskers based on search and status
  const filteredTaskers = curatedTaskers.filter(poolEntry => {
    const tasker = poolEntry.tasker;
    const formattedTasker = formatTaskerData(tasker);
    
    // Search filter
    const matchesSearch = !searchQuery.trim() || 
      formattedTasker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formattedTasker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formattedTasker.skills.some(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Status filter - use poolEntry.status instead of invitationStatus
    const matchesStatus = statusFilter === 'all' || 
      poolEntry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStats = () => {
    const total = curatedTaskers.length;
    const pending = curatedTaskers.filter(entry => entry.status === 'pending').length;
    const accepted = curatedTaskers.filter(entry => entry.status === 'accepted').length;
    const rejected = curatedTaskers.filter(entry => entry.status === 'rejected').length;
    
    return { total, pending, accepted, rejected };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <AdminNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Notification Center */}
      <NotificationCenter/>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Navbar */}
        <div className="sticky top-0 z-40">
          <AdminNavbar 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
          />
        </div>
        
        {/* Notification */}
        {showMessage.show && (
          <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            showMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              {showMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span>{showMessage.text}</span>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate(`/admin/${taskId}/mini_task_info`)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back to Task</span>
                    </button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Curated Taskpool
                      </h1>
                      <p className="text-gray-600">
                        Managing taskers for: <strong>{task?.title}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate(`/admin/curate_task_pool/${taskId}`)}
                      className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>Add More Taskers</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="p-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">Total Taskers</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                      </div>
                      <Clock className="w-8 h-8 text-yellow-500 bg-yellow-50 p-1.5 rounded-lg" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">Accepted</p>
                        <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500 bg-green-50 p-1.5 rounded-lg" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">Rejected</p>
                        <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                      </div>
                      <XCircle className="w-8 h-8 text-red-500 bg-red-50 p-1.5 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search taskers by name, email, skills..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="w-full sm:w-48">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Showing {filteredTaskers.length} of {curatedTaskers.length} taskers
                </div>
              </div>
            </div>

            {/* Taskers List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filteredTaskers.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredTaskers.map(poolEntry => {
                    const tasker = poolEntry.tasker;
                    const formattedTasker = formatTaskerData(tasker);
                    const statusConfig = getResponseStatusConfig(poolEntry.status);

                    return (
                      <div key={poolEntry._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            {/* Profile Image */}
                            {formattedTasker.profileImage ? (
                              <img 
                                src={formattedTasker.profileImage} 
                                alt={formattedTasker.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-400" />
                              </div>
                            )}

                            {/* Tasker Info */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {formattedTasker.name}
                                </h3>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="font-medium text-gray-700">
                                    {formattedTasker.rating.toFixed(1)}
                                  </span>
                                </div>
                                {formattedTasker.isVerified && (
                                  <Shield className="w-4 h-4 text-green-500" />
                                )}
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                  <statusConfig.icon className="w-3 h-3 mr-1" />
                                  {statusConfig.label}
                                </span>
                              </div>

                              {/* Contact Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                                <div className="flex items-center space-x-2">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{formattedTasker.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{formattedTasker.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{formattedTasker.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Award className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{formattedTasker.completedTasks} tasks completed</span>
                                </div>
                              </div>

                              {/* Skills */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {formattedTasker.skills.slice(0, 5).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {formattedTasker.skills.length > 5 && (
                                  <span className="text-xs text-gray-500">
                                    +{formattedTasker.skills.length - 5} more
                                  </span>
                                )}
                              </div>

                              {/* Bio */}
                              {formattedTasker.Bio && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <strong>Bio:</strong> {formattedTasker.Bio}
                                </div>
                              )}

                              {/* Response Info */}
                              {poolEntry.addedAt && (
                                <div className="text-xs text-gray-500 mt-2">
                                  Added to pool on {new Date(poolEntry.addedAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/admin/get/user_info/${tasker._id}`)}
                              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Profile</span>
                            </button>
                            
                            <button
                              onClick={() => handleRemoveFromTaskpool(tasker._id)}
                              disabled={removingTasker === tasker._id}
                              className="flex items-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                            >
                              {removingTasker === tasker._id ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No taskers in pool
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {curatedTaskers.length === 0 
                      ? "This task doesn't have any taskers in the curated pool yet. Add some taskers to get started."
                      : "No taskers match your current search and filter criteria."}
                  </p>
                  {curatedTaskers.length === 0 && (
                    <button
                      onClick={() => navigate(`/admin/minitask/${taskId}/curate-taskpool`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Users className="w-4 h-4" />
                      <span>Curate Taskpool</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminViewTaskpoolPage;