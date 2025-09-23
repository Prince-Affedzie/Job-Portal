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
  X,
  Mail,
  Phone,
  Award,
  FileCheck,
  Shield,
  TrendingUp,
  Briefcase,
  Navigation,
  XCircle
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
  const [activeTab, setActiveTab] = useState("overview");

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
      Pending: { color: "text-gray-700 bg-gray-100 border-gray-300", icon: Clock },
      Open: { color: "text-emerald-700 bg-emerald-100 border-emerald-300", icon: Award },
      "In-progress": { color: "text-blue-700 bg-blue-100 border-blue-300", icon: TrendingUp },
      Assigned: { color: "text-amber-700 bg-amber-100 border-amber-300", icon: Briefcase },
      Review: { color: "text-purple-700 bg-purple-100 border-purple-300", icon: FileCheck },
      Rejected: { color: "text-red-700 bg-red-100 border-red-300", icon: X },
      Completed: { color: "text-green-700 bg-green-100 border-green-300", icon: CheckCircle },
      Closed: { color: "text-red-700 bg-red-100 border-red-300", icon: Shield },
    };
    return configs[status] || { color: "text-gray-700 bg-gray-100 border-gray-300", icon: Clock };
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMMM DD, YYYY [at] h:mm A");
  };

  const formatRelativeTime = (dateString) => {
    return dayjs(dateString).fromNow();
  };

 /* if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
          <p className="text-gray-600 mb-6">The task you are looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate('/admin/manage_minitasks')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Back to Task List
          </button>
        </div>
      </div>
    );
  }*/

  const statusConfig = getStatusConfig(task?.status);
  const StatusIcon = statusConfig.icon;

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
    {loading ? (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    ) : (
      <>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {task.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Created {task.createdAt ? formatRelativeTime(task.createdAt) : 'N/A'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {task.title}
                </h1>
                <p className="text-gray-600 flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {task.category} • {task.subcategory || "No subcategory"}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(`/admin/${task._id}/modify_min_task`)}
                  className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Task</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Budget</p>
                    <p className="text-xl font-bold text-gray-900">
                      GHS {task.budget?.toLocaleString() || "0"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{task.biddingType === "fixed" ? "Fixed Price" : "Open for Bids"}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Deadline</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatDate(task.deadline)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {dayjs(task.deadline).isBefore(dayjs()) ? "Past deadline" : `${dayjs(task.deadline).fromNow(true)} left`}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-500 bg-orange-50 p-1.5 rounded-lg" />
                </div>
              </div>

              <div 
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => navigate(`/admin/minitask/${task._id}/applicants`, { state: { applicants: task.applicants } })}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Applicants</p>
                    <p className="text-xl font-bold text-gray-900">
                      {task.applicants?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Click to view details</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500 bg-purple-50 p-1.5 rounded-lg" />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                   onClick={()=>navigate(`/admin/${task._id}/mini_task_info/bids`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Bids</p>
                    <p className="text-xl font-bold text-gray-900">
                      {task.bids?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{task.biddingType === "fixed" ? "Fixed price" : "Open for bids"}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500 bg-green-50 p-1.5 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto -mb-px">
              {["overview", "employer", "applicants", "completion", "activity"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                {/* Description */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    Task Description
                  </h2>
                  <div className="prose max-w-none text-gray-700">
                    {task.description || "No description provided."}
                  </div>
                </div>

                {/* Skills Required */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-blue-500" />
                    Skills Required
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {task.skillsRequired?.length > 0 ? (
                      task.skillsRequired.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No specific skills required</p>
                    )}
                  </div>
                </div>

                {/* Location Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    Location Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Location Type</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        task.locationType === "remote" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {task.locationType?.charAt(0).toUpperCase() + task.locationType?.slice(1) || "N/A"}
                      </span>
                    </div>
                    
                    {task.locationType === "on-site" && task.address && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Region</p>
                          <p className="text-gray-900">{task.address.region || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">City</p>
                          <p className="text-gray-900">{task.address.city || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Suburb</p>
                          <p className="text-gray-900">{task.address.suburb || "N/A"}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Employer Tab */}
            {activeTab === "employer" && task.employer && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Employer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                      <p className="text-gray-900 font-medium">{task.employer.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-gray-900">{task.employer.email || "N/A"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="text-gray-900">{task.employer.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Member Since</p>
                      <p className="text-gray-900">{task.employer.createdAt ? formatDate(task.employer.createdAt) : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Tasks Posted</p>
                      <p className="text-gray-900">{task.employer.tasksCount || "N/A"}</p>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={() => navigate(`/admin/get/user_info/${task.employer._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                      >
                        <span>View Full Profile</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applicants Tab */}
            {activeTab === "applicants" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Applicants ({task.applicants?.length || 0})
                </h2>

                {task.applicants && task.applicants.length > 0 ? (
                  <div className="space-y-4">
                    {task.applicants.map(applicant => (
                      <div
                        key={applicant._id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start space-x-4">
                          {/* Profile Image */}
                          {applicant.profileImage ? (
                            <img 
                              src={applicant.profileImage} 
                              alt={applicant.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            {/* Name and Rating */}
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 text-lg">
                                {applicant.name || "Unnamed Applicant"}
                              </h3>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-medium text-gray-700">
                                  {applicant.rating || "N/A"}
                                </span>
                              </div>
                            </div>

                            {/* Contact Information */}
                            <div className="mt-2 space-y-1">
                              {applicant.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{applicant.email}</span>
                                </div>
                              )}
                              
                              {applicant.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{applicant.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants yet</h3>
                    <p className="text-gray-500">This task hasn't received any applications yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Completion Tab */}
            {activeTab === "completion" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileCheck className="w-5 h-5 mr-2 text-blue-500" />
                  Completion Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Verification</h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Verification Required</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.verificationRequired 
                            ? "bg-red-100 text-red-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {task.verificationRequired ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    {task.proofOfCompletion && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Proof of Completion</h3>
                        <button
                          onClick={() => window.open(task.proofOfCompletion, '_blank')}
                          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View Proof Document</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Completion Status</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Marked Done by Employer</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            task.markedDoneByEmployer 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {task.markedDoneByEmployer ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Marked Done by Tasker</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            task.markedDoneByTasker 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {task.markedDoneByTasker ? "Yes" : "No"}
                          </span>
                        </div>
                        {task.employerDoneAt && (
                          <div className="text-sm text-gray-500">
                            Employer marked done: {formatDate(task.employerDoneAt)}
                          </div>
                        )}
                        {task.taskerDoneAt && (
                          <div className="text-sm text-gray-500">
                            Tasker marked done: {formatDate(task.taskerDoneAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-blue-500" />
                Update Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    {["Pending", "Open", "In-progress", "Assigned", "Review", "Rejected", "Completed", "Closed"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleStatusUpdate}
                  disabled={newStatus === task.status || updating}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    newStatus === task.status || updating
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
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

            {/* Task Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-blue-500" />
                Task Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Task ID</p>
                  <p className="font-medium text-gray-900 text-sm">{task._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <p className="font-medium text-gray-900 text-sm">{task.createdAt ? formatDate(task.createdAt) : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="font-medium text-gray-900 text-sm">{task.updatedAt ? formatDate(task.updatedAt) : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bidding Type</p>
                  <p className="font-medium text-gray-900 text-sm capitalize">{task.biddingType || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Assigned Tasker */}
            {task.assignedTo && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                  Assigned Tasker
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{task.assignedTo.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact</p>
                    <p className="font-medium text-gray-900">{task.assignedTo.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assignment Accepted</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      task.assignmentAccepted 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {task.assignmentAccepted ? "Yes" : "Pending"}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/get/user_info/${task.assignedTo._id}`)}
                    className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>View Tasker Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/admin/minitask/${task._id}/applicants`, { state: { applicants: task.applicants } })}
                  className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span>View Applicants</span>
                  <Users className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => navigate(`/admin/${task._id}/mini_task_info/bids`)}
                  className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span>View Bids</span>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => navigate(`/admin/get/user_info/${task.employer._id}`)}
                  className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span>View Employer Profile</span>
                  <User className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
</main>
      </div>
    </div>
  );
};

export default AdminMiniTaskDetailPage;