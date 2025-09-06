import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  DollarSign,
  User,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  FileText,
  Tag,
  Users,
  Building,
  Star,
  ExternalLink,
  Edit3,
  Save,
  X
} from "lucide-react";
import { getSingleMinitask, modifyMiniTaskStatus } from '../../APIS/API';
import dayjs from "dayjs";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";

const AdminMiniTaskDetailPage = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showMessage, setShowMessage] = useState({ type: '', text: '', show: false });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showNotification = (type, text) => {
    setShowMessage({ type, text, show: true });
    setTimeout(() => setShowMessage({ type: '', text: '', show: false }), 4000);
  };

  const handleStatusUpdate = async () => {
    if (newStatus === task.status) return;

    try {
      setUpdating(true);
      const res = await modifyMiniTaskStatus(task._id, { status: newStatus });
      if (res.status === 200) {
        showNotification("success", "Status updated successfully");
        setTask((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      showNotification("error", "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (Id) fetchMiniTask();
  }, [Id]);

  const fetchMiniTask = async () => {
    try {
      const res = await getSingleMinitask(Id);
      if (res.status === 200) {
        setTask(res.data);
        setNewStatus(res.data.status);
      }
    } catch (error) {
      showNotification("error", "Failed to fetch task");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      Open: { color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: Clock },
      "In-progress": { color: "text-blue-700 bg-blue-50 border-blue-200", icon: Edit3 },
      Assigned: { color: "text-amber-700 bg-amber-50 border-amber-200", icon: User },
      Completed: { color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle },
      Closed: { color: "text-red-700 bg-red-50 border-red-200", icon: X },
    };
    return configs[status] || { color: "text-gray-700 bg-gray-50 border-gray-200", icon: Clock };
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMMM DD, YYYY");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">MiniTask Not Found</h2>
          <p className="text-gray-600 mb-6">The task you are looking for doesn't exist</p>
          <button
            onClick={() => navigate('/admin/manage_minitasks')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Back to Task List
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Notification Center */}
      <NotificationCenter/>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar - Fixed at the top */}
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
              {showMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span>{showMessage.text}</span>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                      {task.title}
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base">
                      Created on {task.createdAt ? formatDate(task.createdAt) : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${statusConfig.color}`}>
                      <StatusIcon className="w-5 h-5" />
                      <span className="font-semibold">{task.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium mb-1">Budget</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-800">
                          GHS {task.budget.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium mb-1">Deadline</p>
                        <p className="text-lg sm:text-xl font-bold text-blue-800">
                          {formatDate(task.deadline)}
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 relative group cursor-pointer transform hover:scale-105 transition-all duration-200"
                       onClick={() => navigate(`/admin/minitask/${task._id}/applicants`,{state:{applicants:task.applicants}})}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium mb-1">Applicants</p>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-800">
                          {task.applicants?.length || 0}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-8 h-8 text-purple-600" />
                        <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-purple-600 bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all duration-200"></div>
                    <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      View Applicants
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-600 text-sm font-medium mb-1">Category</p>
                        <p className="text-lg sm:text-xl font-bold text-amber-800">
                          {task.category}
                        </p>
                      </div>
                      <Building className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Task Details */}
              <div className="xl:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-6 h-6 mr-3 text-blue-600" />
                    Task Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    {task.description}
                  </p>
                </div>

                {/* Skills Required */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="w-6 h-6 mr-3 text-blue-600" />
                    Skills Required
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {task.skillsRequired.length > 0 ? (
                      task.skillsRequired.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No specific skills required</p>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Tag className="w-6 h-6 mr-3 text-blue-600" />
                    Additional Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Subcategory</p>
                        <p className="text-gray-900 font-semibold">{task.subcategory || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Location Type</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          task.locationType === "remote" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {task.locationType?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Verification Required</p>
                        <div className="flex items-center space-x-2">
                          {task.verificationRequired ? (
                            <>
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-700 font-medium">Required</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-700 font-medium">Not Required</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                          <p className="text-gray-900">
                            {`${task?.address?.region || ""}, ${task?.address?.city || ""}, ${task?.address?.suburb || ""}`}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Assigned To</p>
                        {task.assignedTo ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-900">
                              {task.assignedTo.name} - {task.assignedTo.phone}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="text-gray-600">Not assigned</span>
                          </div>
                        )}
                      </div>
                      {task.proofOfCompletion && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Proof of Completion</p>
                          <button
                            onClick={() => window.open(task.proofOfCompletion, '_blank')}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View File</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Employer Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Employer Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Name</p>
                      <p className="font-semibold text-gray-900">{task.employer?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">{task.employer?.phone || "N/A"}</p>
                    </div>
                    {task.employer?._id && (
                      <button
                        onClick={() => navigate(`/admin/get/user_info/${task.employer._id}`)}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
                    Update Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      >
                        {["Open", "In-progress", "Assigned", "Completed", "Closed"].map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={newStatus === task.status || updating}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                        newStatus === task.status || updating
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                      }`}
                    >
                      {updating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Update Status</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminMiniTaskDetailPage;