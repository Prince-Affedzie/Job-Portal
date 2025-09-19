import React, { useEffect, useState } from "react";
import { 
  Trash2, 
  Eye, 
  ExternalLink, 
  FileText, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Briefcase,
  X
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSingleEmployerProfile, updateEmployerStatus, removeEmployerProfile } from "../../APIS/API";

// Custom Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, loading }) => (
  <button
    onClick={onChange}
    disabled={loading}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      checked ? 'bg-blue-600' : 'bg-gray-200'
    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
    {loading && (
      <Loader2 className="absolute inset-0 m-auto h-3 w-3 animate-spin text-gray-600" />
    )}
  </button>
);

// Custom Select Component
const CustomSelect = ({ value, onChange, options, loading }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={loading}
    className="mt-2 w-40 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {options.map((option) => (
      <option key={option} value={option}>
        {option.toUpperCase()}
      </option>
    ))}
  </select>
);

// Status Tag Component
const StatusTag = ({ status, type = "verification" }) => {
  const getStatusConfig = () => {
    if (type === "verified") {
      return status
        ? { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, text: "Yes" }
        : { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, text: "No" };
    }
    
    switch (status) {
      case "approved":
        return { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, text: "APPROVED" };
      case "rejected":
        return { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, text: "REJECTED" };
      default:
        return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertCircle, text: "PENDING" };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      <Icon className="w-4 h-4 mr-1" />
      {config.text}
    </span>
  );
};

// Jobs Modal Component
const JobsModal = ({ isOpen, onClose, jobs, companyName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Posted Jobs - {companyName}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {jobs && jobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      #
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Job Title
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Posted Date
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, index) => (
                    <tr key={job._id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 font-medium">
                        {job.title || job.jobTitle || 'Untitled Job'}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'Opened' ? 'bg-green-100 text-green-800' :
                          job.status === 'Closed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {job.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No jobs posted yet</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Delete Employer</h3>
        </div>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this employer?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminEmployerDetail = () => {
  const { employerId } = useParams();
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showJobsModal, setShowJobsModal] = useState(false);
  const statusOptions = ["pending", "approved", "rejected"];
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  const fetchEmployer = async () => {
    try {
      setLoading(true);
      const res = await getSingleEmployerProfile(employerId);
      if (res.status === 200) {
        setEmployer(res.data);
        console.log(res.data);
      } else {
        toast.error("Failed to fetch employer details");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployer();
  }, [employerId]);

  // Your original handleToggleStatus function - unchanged
  const handleToggleStatus = async (value) => {
    try {
      setChangingStatus(true);
      const res = await updateEmployerStatus(employerId, {
        verificationStatus: value,
      });
      if (res.status === 200) {
        toast.success("Status updated");
        fetchEmployer();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    } finally {
      setChangingStatus(false);
    }
  };

  // Your original handleToggleVerified function - unchanged
  const handleToggleVerified = async () => {
    const newVerified = !employer.isVerified;
    setEmployer((prev) => ({ ...prev, isVerified: newVerified }));

    try {
      setVerifying(true);
      const res = await updateEmployerStatus(employerId, {
        isVerified: newVerified,
      });
      if (res.status === 200) {
        toast.success("Verification updated");
      } else {
        toast.error("Failed to update verification");
        fetchEmployer();
      }
    } catch (err) {
      toast.error("Error updating verification");
      fetchEmployer();
    } finally {
      setVerifying(false);
    }
  };

  // Your original handleDeleteEmployer function - unchanged
  const handleDeleteEmployer = async () => {
    try {
      setLoading(true);
      const response = await removeEmployerProfile(employerId);
      if (response.status === 200) {
        toast.success('Employer Profile deletion Succesful');
        navigate('/admin/get_employers/list');
      } else {
        toast.error(response.message || "An Unknown error occured. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
     
      <div className="flex flex-1">
       
          <AdminSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          />
        
        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 overflow-y-auto">
           <AdminNavbar 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
            />
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h1 className="text-2xl font-bold text-white">Employer Profile Details</h1>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => navigate(`/admin/get/user_info/${employer?.userId._id}`)}
                      disabled={!employer?.userId._id}
                      className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Creator
                    </button>
                    
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                    <span className="text-gray-600 text-lg">Loading employer details...</span>
                  </div>
                ) : (
                  employer && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      
                      {/* Main Content */}
                      <div className="lg:col-span-2 space-y-6">
                        
                        {/* Company Information */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6">
                          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                            Company Information
                          </h2>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="group">
                                <label className="text-sm font-medium text-gray-500 mb-1 block">Company Name</label>
                                <p className="text-gray-900 font-semibold text-lg group-hover:text-blue-600 transition-colors">
                                  {employer.companyName}
                                </p>
                              </div>
                              
                              <div className="group">
                                <label className="text-sm font-medium text-gray-500 mb-1 block flex items-center">
                                  <Mail className="w-4 h-4 mr-1" />
                                  Email
                                </label>
                                <p className="text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {employer.companyEmail}
                                </p>
                              </div>
                              
                              <div className="group">
                                <label className="text-sm font-medium text-gray-500 mb-1 block flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  Phone
                                </label>
                                <p className="text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {employer.companyLine || "N/A"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="group">
                                <label className="text-sm font-medium text-gray-500 mb-1 block flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  Location
                                </label>
                                <p className="text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {employer.companyLocation || "N/A"}
                                </p>
                              </div>
                              
                              <div className="group">
                                <label className="text-sm font-medium text-gray-500 mb-1 block flex items-center">
                                  <Globe className="w-4 h-4 mr-1" />
                                  Website
                                </label>
                                {employer.companyWebsite ? (
                                  <a
                                    href={employer.companyWebsite}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:text-blue-800 inline-flex items-center font-medium"
                                  >
                                    Visit Website
                                    <ExternalLink className="w-4 h-4 ml-1" />
                                  </a>
                                ) : (
                                  <p className="text-gray-900">N/A</p>
                                )}
                              </div>
                              
                              <div className="group">
                                <label className="text-sm font-medium text-gray-500 mb-1 block flex items-center">
                                  <FileText className="w-4 h-4 mr-1" />
                                  Business Documents
                                </label>
                                {employer.businessDocs ? (
                                  <a
                                    href={employer.businessDocs}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:text-blue-800 inline-flex items-center font-medium"
                                  >
                                    View Docs
                                    <ExternalLink className="w-4 h-4 ml-1" />
                                  </a>
                                ) : (
                                  <p className="text-gray-900">No Documents</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Posted Jobs Section */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                              Posted Jobs
                            </h2>
                            <button
                              onClick={() => setShowJobsModal(true)}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View All Jobs
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-blue-600 mb-1">
                                {employer.postedJobs?.length || 0}
                              </div>
                              <div className="text-sm text-blue-800">Total Jobs</div>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                {employer.postedJobs?.filter(job => job.status === 'Opened').length || 0}
                              </div>
                              <div className="text-sm text-green-800">Active Jobs</div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                              <div className="text-2xl font-bold text-gray-600 mb-1">
                                {employer.postedJobs?.filter(job => job.status === 'Closed').length || 0}
                              </div>
                              <div className="text-sm text-gray-800">Closed Jobs</div>
                            </div>
                          </div>
                        </div>

                        {/* Verification Notes */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Notes</h3>
                          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                            <p className="text-gray-700 leading-relaxed">
                              {employer.verificationNotes || "None"}
                            </p>
                          </div>
                        </div>

                        {/* Timestamps */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                            Timeline
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <label className="text-sm font-medium text-blue-700 mb-1 block">Created At</label>
                              <p className="text-blue-900 font-medium">
                                {new Date(employer.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-4">
                              <label className="text-sm font-medium text-green-700 mb-1 block">Updated At</label>
                              <p className="text-green-900 font-medium">
                                {new Date(employer.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Panel */}
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 sticky top-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Management</h3>
                          
                          <div className="space-y-6">
                            {/* Verified Status */}
                            <div className="border-b border-gray-200 pb-6">
                              <label className="text-sm font-medium text-gray-700 mb-3 block">Verified Status</label>
                              <div className="space-y-3">
                                <StatusTag status={employer.isVerified} type="verified" />
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm text-gray-600">Toggle Verification:</span>
                                  <ToggleSwitch
                                    checked={employer.isVerified}
                                    onChange={handleToggleVerified}
                                    loading={verifying}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Verification Status */}
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-3 block">Verification Status</label>
                              <div className="space-y-3">
                                <StatusTag status={employer.verificationStatus} />
                                <CustomSelect
                                  value={employer.verificationStatus}
                                  onChange={handleToggleStatus}
                                  options={statusOptions}
                                  loading={changingStatus}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Jobs Modal */}
      <JobsModal
        isOpen={showJobsModal}
        onClose={() => setShowJobsModal(false)}
        jobs={employer?.postedJobs || []}
        companyName={employer?.companyName || 'Unknown Company'}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteEmployer}
        loading={loading}
      />
    </div>
  );
};

export default AdminEmployerDetail;