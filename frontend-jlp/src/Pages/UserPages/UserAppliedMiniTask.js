// MyMiniTaskApplications.jsx
// MyMiniTaskApplications.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { userContext } from "../../Context/FetchUser";
import Navbar from '../../Components/MyComponents/Navbar';
import { useNavigate } from 'react-router-dom';
import { acceptMiniTaskAssignment, removeAppliedMiniTaskFromDashboard,raiseDispute, rejectMiniTaskAssignment } from '../../APIS/API';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaFilter, FaCheck, FaArrowUp, FaArrowDown, FaClock, FaMapMarkerAlt, FaDollarSign,FaFlag, FaBuilding,FaUser, FaPhone, FaEye, FaUpload, FaComments, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import WorkSubmissionModal from '../../Components/MyComponents/WorkSubmissionModal';
import StartChatButton from '../../Components/MessagingComponents/StartChatButton';
import  TaskActions from '../../Components/MyComponents/MiniTaskActionButtons';
import Pagination from "../../Components/MyComponents/Pagination";


const MyMiniTaskApplications = () => {
  const navigate = useNavigate();
  const { loading, user, minitasks, fetchAppliedMiniTasks } = useContext(userContext);
  const [filter, setFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('deadline');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const applicationsPerPage = 5;
   const [showReportModal, setShowReportModal] = useState(false);
   const [reportingTask, setReportingTask] = useState(null);
   const [reportForm, setReportForm] = useState({
    against: reportingTask?.employer?._id || '',
    taskId: reportingTask?._id || '',
    tasktitle:reportingTask?.title || '',
    reportedBy : user?.name || '',
    reason: '',
    details: ''
  });
  

  // Use a more efficient debounced fetch
  const debouncedFetch = useCallback(() => {
    if (user && !minitasks) {
      fetchAppliedMiniTasks();
    }
  }, [user, minitasks, fetchAppliedMiniTasks]);

  useEffect(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  useEffect(() => {
    const hasSelectedTasks = Object.values(selectedTasks).some(value => value === true);
    setShowDeleteButton(hasSelectedTasks);
  }, [selectedTasks]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort and filter applications
  const sortAndFilterApplications = () => {
    if (!minitasks) return [];
    
    const filtered = minitasks.filter(app => {
      if (filter === 'all') return true;
      return app.status.toLowerCase() === filter.toLowerCase();
    });

    return filtered.sort((a, b) => {
      let compareValueA, compareValueB;
      
      switch (sortField) {
        case 'deadline':
          compareValueA = new Date(a.deadline);
          compareValueB = new Date(b.deadline);
          break;
        case 'budget':
          compareValueA = parseFloat(a.budget);
          compareValueB = parseFloat(b.budget);
          break;
        case 'title':
          compareValueA = a.title.toLowerCase();
          compareValueB = b.title.toLowerCase();
          break;
        default:
          compareValueA = new Date(a.deadline);
          compareValueB = new Date(b.deadline);
      }
      
      if (sortDirection === 'asc') {
        return compareValueA > compareValueB ? 1 : -1;
      } else {
        return compareValueA < compareValueB ? 1 : -1;
      }
    });
  };

  const sortedAndFilteredApplications = sortAndFilterApplications();
  
  // Calculate pagination details
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = sortedAndFilteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(sortedAndFilteredApplications.length / applicationsPerPage);

  const handleReportIssue = (task) => {
      setReportingTask(task);
      setShowReportModal(true);
    };
  
    useEffect(() => {
    if (reportingTask) {
      setReportForm((prev) => ({
        ...prev,
        against: reportingTask.employer?._id || '',
        taskId: reportingTask._id || '',
        tasktitle:reportingTask.title,
       reportedBy : user?.name
      }));
    }
  }, [reportingTask,user?.name]);
  
  
    const submitReport = async () => {
      
      const { against, taskId, reason, details } = reportForm;
  
    if (!against || !taskId || !reason || !details) {
      toast.error("Please fill in all fields before submitting the report.");
      return;
    }
  
      setIsProcessing(true);
      try {
      
        const response = await raiseDispute(reportForm)
        if (response.status ===200){
        toast.success(`Issue reported for task: ${reportingTask.title}. Our Team Would Reach Out Soon.`);
        setShowReportModal(false);
        setReportingTask(null);
       
        }
       
      } catch (error) {
        toast.error("Failed to submit report");
      } finally {
        setIsProcessing(false);
      }
    };
  

  const handleTaskAcceptance = async(taskId) => {
    setIsProcessing(true);
    setActiveTaskId(taskId);
    
    try {
      const res = await acceptMiniTaskAssignment(taskId);
      if (res.status === 200) {
        toast.success("Task accepted successfully! You can now start working on it.");
        fetchAppliedMiniTasks();
      } else {
        toast.error("Failed to accept task. Please try again later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setActiveTaskId(null);
    }
  };

  const handleTaskRejection = async(taskId) => {
    setIsProcessing(true);
    setActiveTaskId(taskId);
    
    try {
      const res = await rejectMiniTaskAssignment(taskId);
      if (res.status === 200) {
        toast.success("Task Rejected successfully!.");
        fetchAppliedMiniTasks();
      } else {
        toast.error("Failed to reject task. Please try again later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setActiveTaskId(null);
    }
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleSelectAll = () => {
    const allTasks = {};
    sortedAndFilteredApplications.forEach(task => {
      if (canRemoveTask(task)) {
        allTasks[task._id] = true;
      }
    });
    
    // If all are selected, deselect all
    const allSelected = Object.keys(allTasks).length === 
                        Object.keys(selectedTasks).filter(id => selectedTasks[id]).length;
    
    setSelectedTasks(allSelected ? {} : allTasks);
  };

  const confirmRemoveSelectedTasks = () => {
    const count = Object.values(selectedTasks).filter(Boolean).length;
    if (count > 0) {
      setShowConfirmation(true);
    } else {
      toast.info("No tasks selected");
    }
  };

  const handleRemoveSelectedTasks = async () => {
    setIsProcessing(true);
    setShowConfirmation(false);
    
    try {
      const tasksToRemove = Object.keys(selectedTasks).filter(id => selectedTasks[id]);
      
      if (tasksToRemove.length === 0) {
        toast.info("No tasks selected");
        return;
      }

      const res = await removeAppliedMiniTaskFromDashboard({Ids: tasksToRemove});
      if (res.status === 200) {
        toast.success(`${tasksToRemove.length} task(s) removed from your dashboard`);
        setSelectedTasks({});
        fetchAppliedMiniTasks();
      } else {
        toast.error("Failed to remove tasks. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to remove tasks. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getApplicationStatus = (task) => {
    const isAssigned = task.assignedTo && task.assignedTo === user?._id;
    
    if (task.status === "Completed" && isAssigned) 
      return { text: "Completed", subtext: "You completed this task", className: "bg-green-100 text-green-800 border-green-200", icon: <FaCheckCircle className="w-4 h-4" /> };
    if (task.status === "In-progress" && isAssigned) 
      return { text: "In Progress", subtext: "You are assigned", className: "bg-blue-100 text-blue-800 border-blue-200", icon: <FaClock className="w-4 h-4" /> };
    if (task.status === "Open" && !task.assignedTo) 
      return { text: "Applied", subtext: "Awaiting decision", className: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <FaClock className="w-4 h-4" /> };
    if (task.status === "Open" && !isAssigned && task.assignedTo) 
      return { text: "Not Selected", subtext: "", className: "bg-red-100 text-red-800 border-red-200", icon: <FaTimes className="w-4 h-4" /> };
    if (task.status === "Open" && isAssigned && task.assignedTo) 
      return { text: "Selected", subtext: "You are assigned", className: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: <FaCheck className="w-4 h-4" /> };
    if (task.status === "Closed" && !isAssigned) 
      return { text: "Closed", subtext: "Not selected", className: "bg-gray-100 text-gray-800 border-gray-200", icon: <FaTimes className="w-4 h-4" /> };
    
    return { text: task.status, subtext: "", className: "bg-gray-100 text-gray-800 border-gray-200", icon: <FaClock className="w-4 h-4" /> };
  };

  const canRemoveTask = (task) => {
    const isAssigned = task.assignedTo && task.assignedTo === user?._id;
    return !(isAssigned && task.status === "In-progress");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const openSubmitModal = (taskId) => {
    setActiveTaskId(taskId);
    setModalOpen(true);
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return { text: 'Overdue', className: 'bg-red-100 text-red-700 border-red-200' };
    if (daysDiff === 0) return { text: 'Due Today', className: 'bg-orange-100 text-orange-700 border-orange-200' };
    if (daysDiff <= 3) return { text: `${daysDiff} days left`, className: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden ">
      <Navbar />
      <ToastContainer 
        position="top-right" 
        autoClose={6000} 
        hideProgressBar={false}
        className="mt-16"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Mini Task Applications</h1>
            <p className="text-gray-600">Manage and track your applied mini tasks</p>
          </div>
        </div>

        {/* Filters and Sort Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700 font-medium">
               
                <span>Filter:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'open', 'in-progress', 'completed', 'closed'].map(status => (
                  <button
                    key={status}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === status 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => { setFilter(status); setCurrentPage(1); }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sort Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { field: 'deadline', label: 'Deadline' },
                  { field: 'budget', label: 'Budget' },
                  { field: 'title', label: 'Title' }
                ].map(({ field, label }) => (
                  <button 
                    key={field}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      sortField === field 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSort(field)}
                  >
                    {label}
                    {sortField === field && (
                      sortDirection === 'asc' ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {showDeleteButton && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                onClick={handleSelectAll}
              >
                <FaCheck className="w-4 h-4" />
                {Object.keys(selectedTasks).filter(id => selectedTasks[id]).length === 
                  sortedAndFilteredApplications.filter(task => canRemoveTask(task)).length ? 
                  "Deselect All" : "Select All"}
              </button>
              
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50"
                onClick={confirmRemoveSelectedTasks}
                disabled={isProcessing}
              >
                <FaTrash className="w-4 h-4" />
                {isProcessing ? "Removing..." : `Delete Selected (${Object.values(selectedTasks).filter(Boolean).length})`}
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading your applications...</p>
            </div>
          </div>
        ) : sortedAndFilteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all'
                    ? "You haven't applied to any minitasks yet."
                    : `No ${filter} applications found.`}
                </p>
                <button
                  onClick={() => navigate('/mini_task/listings')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Find Mini Tasks
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Task Cards */}
            <div className="space-y-4">
              {currentApplications.map((task, index) => {
                const statusInfo = getApplicationStatus(task);
                const isRemovable = canRemoveTask(task);
                const isAssigned = task.assignedTo && task.assignedTo === user?._id;
                const isTaskActive = activeTaskId === task._id;
                const deadlineStatus = getDeadlineStatus(task.deadline);

    return (
   <div
  key={task._id}
  className="bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 hover:border-blue-300 p-5 space-y-4 group"
>
  {/* Header with improved layout */}
  <div className="flex justify-between items-start gap-4">
    <div className="flex-1 min-w-0">
      <h3 
        className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 cursor-pointer transition-colors"
        onClick={() => navigate(`/view/mini_task/info/${task._id}`)}
      >
        {task.title}
      </h3>

      {/* Metadata chips - Upwork style */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-700">
          <FaDollarSign className="w-3 h-3 mr-1 text-green-500" />
          ₵{task.budget}
        </span>
        
        {task.category && (
          <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-700">
            <FaBuilding className="w-3 h-3 mr-1 text-indigo-500" />
            {task.category}
          </span>
        )}
        
        {task.locationType && (
          <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-700">
            <FaMapMarkerAlt className="w-3 h-3 mr-1 text-blue-500" />
            {task.locationType === 'remote' ? 'Remote' : task.address?.city || 'On-site'}
          </span>
        )}
      </div>
    </div>

    {/* Status pill - improved visibility */}
    <div className={`flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
      {statusInfo.icon}
      <span className="ml-1.5">{statusInfo.text}</span>
    </div>
  </div>

  {/* Divider for visual separation */}
  <div className="border-t border-gray-100"></div>

  {/* Body with improved information hierarchy */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
    {/* Deadline */}
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
        <FaClock className="text-amber-500 w-3.5 h-3.5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider">Deadline</p>
        <p className="font-medium text-gray-900">
          {new Date(task.deadline).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>

    {/* Employer */}
    {task.employer?.name && (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
          <FaUser className="text-blue-500 w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Posted by</p>
          <p className="font-medium text-gray-900 line-clamp-1">{task.employer.name}</p>
        </div>
      </div>
    )}
  </div>

  {/* Skills - improved presentation */}
  {task.skillsRequired?.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {task.skillsRequired.slice(0, 4).map((skill, index) => (
        <span
          key={index}
          className="bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium rounded-full"
        >
          {skill}
        </span>
      ))}
      {task.skillsRequired.length > 4 && (
        <span className="text-xs text-gray-500 self-center">+{task.skillsRequired.length - 4} more</span>
      )}
    </div>
  )}

  {/* Report Issue button - improved styling */}
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3">
  {/* Report Issue button - now properly aligned with TaskActions on mobile */}
  {isAssigned && (task.status === 'Assigned' || task.status === 'In-progress') && (
    <button
      onClick={() => handleReportIssue(task)}
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
    >
      <FaFlag className="w-3.5 h-3.5" />
      Report Issue
    </button>
  )}
  
  {/* TaskActions with responsive positioning */}
  <div className="w-full sm:w-auto flex justify-end">
    <TaskActions
      task={task}
      user={user}
      isProcessing={isProcessing}
      layout="dropdown"
      onViewDetails={(taskId) => navigate(`/view/mini_task/info/${taskId}`)}
      onSubmitWork={(taskId) => openSubmitModal(taskId)}
      onViewSubmissions={(taskId) => navigate(`/freelancer/${taskId}/view_task_submissions`)}
      onAcceptTask={handleTaskAcceptance}
      onRejectTask={handleTaskRejection}
      StartChatButton={StartChatButton}
      className="custom-task-actions w-full sm:w-auto"
    />
  
</div>
  </div>

  {/* Modal - unchanged */}
  {modalOpen && activeTaskId === task._id && (
    <WorkSubmissionModal
      isOpen={modalOpen}
      onClose={() => {
        setModalOpen(false);
        setActiveTaskId(null);
      }}
      taskId={activeTaskId}
      task={task}
    />
  )}
</div>
);


              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                    />
              </div>
            )}
          </div>
        )}
      </div>


    {showReportModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <h3 className="text-lg font-semibold mb-4">Report Issue</h3>

      <p className="text-gray-600 mb-2">
        Report an issue with: <strong>{reportingTask?.title}</strong>
      </p>
      

     
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <input
            type="text"
            value={reportForm.reason}
            onChange={(e) =>
              setReportForm((prev) => ({ ...prev, reason: e.target.value }))
            }
            placeholder="Enter a brief reason"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Details
          </label>
          <textarea
            value={reportForm.details}
            onChange={(e) =>
              setReportForm((prev) => ({ ...prev, details: e.target.value }))
            }
            placeholder="Provide detailed explanation"
            rows="4"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowReportModal(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
             onClick={submitReport}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Submit Report
          </button>
        </div>
      
    </div>
  </div>
)}
  
      
   {/* Confirmation dialog for deleting tasks */}
      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to remove {Object.values(selectedTasks).filter(Boolean).length} task(s) from your dashboard?</p>
            <div className="confirmation-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleRemoveSelectedTasks}
                disabled={isProcessing}
              >
                {isProcessing ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMiniTaskApplications;