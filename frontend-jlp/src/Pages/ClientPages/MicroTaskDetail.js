import React, { useState, useEffect } from "react";
import { 
  FaArrowLeft, FaEdit, FaEye, FaClock, FaMoneyBillWave, 
  FaMapMarkerAlt, FaUser, FaUsers, FaCalendarAlt, FaTag,
  FaCheckCircle, FaTimesCircle, FaShare, FaBookmark,
  FaChevronDown, FaChevronUp, FaEnvelope, FaPhone, FaGlobe,
  FaUserFriends // Added icon for applicants
} from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ClientNavbar } from '../../Components/ClientComponents/ClientNavbar';
import { getMiniTaskInfo } from "../../APIS/API";
import { ClientSidebar } from '../../Components/ClientComponents/ClientSidebar';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MicroTaskDetailPageForClient = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedApplicant, setExpandedApplicant] = useState(null);
  const [showAllApplicants, setShowAllApplicants] = useState(false);

  useEffect(() => {
    const getTask = async () => {
      try {
        const response = await getMiniTaskInfo(Id);
        if (response.status === 200) {
          setTask(response.data);
        }
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };
    getTask();
  }, [Id]);

  const handleEditTask = () => {
    navigate(`/edit_task/${Id}`, { state: { task } });
  };

  const handleViewApplicants = () => {
    navigate(`/manage-mini-tasks/${task._id}/applicants`, {
      state: { 
        applicants: task.applicants || [], 
        assignedTo: task.assignedTo 
      }
    });
  };

 

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Hired': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <div className="flex-1 overflow-auto">
          <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading task details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <div className="flex-1 overflow-auto">
          <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Task Not Found</h2>
              <p className="text-gray-500 mb-4">The task you're looking for doesn't exist.</p>
              <button 
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasApplicants = task.applicants && task.applicants.length > 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      <div className="flex-1 overflow-auto">
        <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <FaArrowLeft className="mr-2" />
              Back to Tasks
            </button>
            
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <button
                onClick={handleEditTask}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaEdit className="mr-2" />
                Edit Task
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Task Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Task Header */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {task.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-blue-500" />
                    Posted {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <FaEye className="mr-2 text-purple-500" />
                    {task.metrics?.views || 'N/A'} views
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-2 text-green-500" />
                    {task.applicants.length || 0} applications
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <FaMoneyBillWave className="mr-1" />
                   ₵{task.budget}
                  </div>
                  <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                    <FaCalendarAlt className="mr-1" />
                    Due {new Date(task.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                    <FaTag className="mr-1" />
                    {task.category} • {task.subcategory}
                  </div>
                  {task.locationType === 'on-site' ? (
                    <div className="flex items-center bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                      <FaMapMarkerAlt className="mr-1" />
                      {task.address.city}, {task.address.region}
                    </div>
                  ) : (
                    <div className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      <FaGlobe className="mr-1" />
                      Remote
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {hasApplicants && (
                    <button
                      onClick={handleViewApplicants}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaUserFriends className="mr-2" />
                      View Applicants ({task.applicants.length})
                    </button>
                  )}
                  {/* Uncomment if you want to add share/save buttons later
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <FaShare className="mr-2" />
                    Share
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <FaBookmark className="mr-2" />
                    Save
                  </button>
                  */}
                </div>
              </div>

              {/* Task Description */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {task.description}
                </p>
              </div>

              {/* Skills Required */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {task.skillsRequired && task.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Metrics & Applicants */}
            <div className="space-y-6">
              {/* Metrics Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Performance</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Views</span>
                    <span className="font-semibold">{task.metrics?.views || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Applications</span>
                    <span className="font-semibold">{task.applicants.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Times Saved</span>
                    <span className="font-semibold">{task.metrics?.saves || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shares</span>
                    <span className="font-semibold">{task.metrics?.shares || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {hasApplicants && (
                    <button
                      onClick={handleViewApplicants}
                      className="w-full flex items-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <FaUserFriends className="mr-3" />
                      Manage Applicants ({task.applicants.length})
                    </button>
                  )}
                  <button className="w-full flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                    <FaEdit className="mr-3" />
                    Edit Task Details
                  </button>
                  <button className="w-full flex items-center px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                    <FaCalendarAlt className="mr-3" />
                    Extend Deadline
                  </button>
                  <button className="w-full flex items-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                    <FaTimesCircle className="mr-3" />
                    Close Task
                  </button>
                </div>
              </div>

              {/* Recent Applicants Preview (if any) */}
              {hasApplicants && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Applicants</h2>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                      {task.applicants.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {task.applicants.slice(0, 3).map((applicant, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {applicant.name ? applicant.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 text-sm">
                              {applicant.name || 'Unknown User'}
                            </h3>
                            <p className="text-xs text-gray-600">
                              Applied {new Date(applicant.appliedDate || task.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(applicant.status)}`}>
                          {applicant.status || 'Pending'}
                        </span>
                      </div>
                    ))}

                    {task.applicants.length > 3 && (
                      <button
                        onClick={handleViewApplicants}
                        className="w-full text-center text-blue-600 hover:text-blue-800 text-sm py-2"
                      >
                        View all {task.applicants.length} applicants →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroTaskDetailPageForClient;