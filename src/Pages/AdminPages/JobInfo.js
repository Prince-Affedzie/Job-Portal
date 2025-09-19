import React, { useState, useEffect } from "react";
import {
  Edit3, 
  Trash2, 
  X, 
  User,
  Users, 
  CheckCircle, 
  Calendar, 
  DollarSign,
  Globe, 
  MapPin, 
  BarChart3, 
  Star,
  Tag, 
  Clock, 
  Eye, 
  Laptop,
  ArrowLeft,
  Building,
  Briefcase,
  Award,
  Target,
  AlertTriangle,
  TrendingUp,
  FileText,
  Settings
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleJobInfo, modifyJobStatus, deleteJob } from "../../APIS/API";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobDetailsAdminView = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await getSingleJobInfo(Id);
        if (response.status === 200) {
          setJob(response.data);
        } else {
          setJob(null);
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [Id]);

  const modifyJobState = async (id) => {
    try {
      setActionLoading(true);
      const newStatus = job.status === "Closed" ? "Opened" : "Closed";
      const response = await modifyJobStatus(id, { state: newStatus });
      if (response.status === 200) {
        toast.success(`Job ${newStatus === "Closed" ? "closed" : "reopened"} successfully`);
        setJob(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRequest = () => setConfirmDelete(true);
  
  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      const response = await deleteJob(job._id);
      if (response.status === 200) {
        toast.success("Job removed successfully");
        navigate("/admin/jobmanagement");
      } else {
        toast.error(response.message || "An unknown error occurred. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
      setConfirmDelete(false);
    }
  };

  const deadline = job?.deadLine ? new Date(job.deadLine).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : "Not set";
  
  const createdAt = job?.createdAt ? new Date(job.createdAt).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : "";

  const getStatusConfig = (status) => {
    switch (status) {
      case "Opened":
        return {
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: CheckCircle,
          dotColor: "bg-emerald-500"
        };
      case "Closed":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: X,
          dotColor: "bg-red-500"
        };
      default:
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Clock,
          dotColor: "bg-blue-500"
        };
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center space-x-2">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {trend && (
              <span className="text-emerald-600 text-sm font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className={`${color} p-3 rounded-xl`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="bg-gray-200 h-32 rounded-xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 h-24 rounded-xl"></div>
        ))}
      </div>
      <div className="bg-gray-200 h-64 rounded-xl"></div>
    </div>
  );

  const Modal = ({ isOpen, onClose, onConfirm, title, children, loading }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-6">{children}</div>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
              Yes, Delete Job
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <ToastContainer position="top-right" autoClose={3000} />
      
        <div className="flex flex-1">
         
           <AdminSidebar 
                  isOpen={isSidebarOpen} 
                 onClose={() => setIsSidebarOpen(false)}
                  />
          
          <main className="flex-1 p-6">
            <LoadingSkeleton />
          </main>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <ToastContainer position="top-right" autoClose={3000} />
      
        <div className="flex flex-1">
         
          <AdminSidebar 
                 isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
                 />
         
          <main className="flex-1 p-6">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load job details</h2>
              <p className="text-gray-600 mb-6">The job you're looking for might have been deleted or doesn't exist.</p>
              <button
                onClick={() => navigate("/admin/jobmanagement")}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Job Management
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(job.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x:hidden">
      <ToastContainer position="top-right" autoClose={3000} />
     
      
      <div className="flex flex-1">
       
          <AdminSidebar 
                 isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
                 />
          <NotificationCenter/>
        

        <main className="flex-1 overflow-auto">
            <AdminNavbar 
                  onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
                   isSidebarOpen={isSidebarOpen} 
                   />
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/admin/jobmanagement")}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Job Management
                </button>
              </div>
            </div>

            {/* Job Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building className="w-6 h-6" />
                    <span className="text-lg font-medium opacity-90">{job.company}</span>
                  </div>
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location?.city || 'Remote'}, {job.location?.region || ''}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Posted {createdAt}
                    </span>
                  </div>
                </div>
                <div className="mt-6 lg:mt-0 flex flex-col items-start lg:items-end space-y-3">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                    <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} mr-2`}></div>
                    <StatusIcon className="w-4 h-4 mr-2" />
                    {job.status}
                  </div>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                    {job.industry}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Applicants"
                value={job.noOfApplicants || 0}
                icon={Users}
                color="bg-blue-100 text-blue-600"
                trend="+12%"
              />
              <StatCard
                title="Job Interactions"
                value={job.interactions || 0}
                icon={Eye}
                color="bg-emerald-100 text-emerald-600"
                trend="+8%"
              />
              <StatCard
                title="Days Until Deadline"
                value={Math.max(0, Math.ceil((new Date(job.deadLine) - new Date()) / (1000 * 60 * 60 * 24)))}
                icon={Clock}
                color="bg-orange-100 text-orange-600"
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Job Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>

                {job.responsibilities?.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Key Responsibilities
                    </h2>
                    <ul className="space-y-3">
                      {job.responsibilities.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {job.skillsRequired?.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-blue-600" />
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skillsRequired.map((skill, i) => (
                          <span key={i} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.jobTags?.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-blue-600" />
                        Job Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.jobTags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-blue-600" />
                    Job Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Category
                      </span>
                      <span className="font-medium">{job.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Job Type
                      </span>
                      <span className="font-medium">{job.jobType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Laptop className="w-4 h-4 mr-2" />
                        Work Mode
                      </span>
                      <span className="font-medium">{job.deliveryMode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        Experience
                      </span>
                      <span className="font-medium">{job.experienceLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Salary
                      </span>
                      <span className="font-medium">{job.salary}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Deadline
                      </span>
                      <span className="font-medium">{deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/admin/${job._id}/edit_job`)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Job
                    </button>
                    
                    <button
                      onClick={() => modifyJobState(job._id)}
                      disabled={actionLoading}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                        job.status === "Closed" 
                          ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                          : "bg-gray-600 text-white hover:bg-gray-700"
                      }`}
                    >
                      {actionLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <>{job.status === "Closed" ? <CheckCircle className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}</>
                      )}
                      {job.status === "Closed" ? "Reopen Job" : "Close Job"}
                    </button>
                    
                    <button
                      onClick={() => navigate(`/admin/${job._id}/view_applicants`, { state: job })}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      View Applicants
                    </button>
                    
                    <button
                      onClick={() => navigate(`/admin/${job.employerProfileId}/employer_profile/details`)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Recruiter
                    </button>
                    
                    <button
                      onClick={handleDeleteRequest}
                      className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        loading={actionLoading}
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-700">
              Are you sure you want to delete this job? This action cannot be undone and will permanently remove all associated data.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Job: <strong>{job?.title}</strong>
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetailsAdminView;