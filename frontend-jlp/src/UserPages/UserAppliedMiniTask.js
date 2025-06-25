// MyMiniTaskApplications.jsx
// MyMiniTaskApplications.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { userContext } from "../Context/FetchUser";
import Navbar from '../Components/MyComponents/Navbar';
import { useNavigate } from 'react-router-dom';
import { acceptMiniTaskAssignment, removeAppliedMiniTaskFromDashboard, rejectMiniTaskAssignment } from '../APIS/API';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaFilter, FaCheck, FaArrowUp, FaArrowDown, FaClock, FaMapMarkerAlt, FaDollarSign, FaUser, FaPhone, FaEye, FaUpload, FaComments, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import WorkSubmissionModal from '../Components/MyComponents/WorkSubmissionModal';
import StartChatButton from '../Components/MessagingComponents/StartChatButton';
import  TaskActions from '../Components/MyComponents/MiniTaskActionButtons';

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
        autoClose={4000} 
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
                  <div key={task._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    {/* Card Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          {isRemovable && (
                            <div className="mt-1">
                              <input
                                type="checkbox"
                                id={`task-select-${task._id}`}
                                checked={!!selectedTasks[task._id]}
                                onChange={() => handleTaskSelection(task._id)}
                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <span className="inline-flex items-center gap-1">
                                <FaDollarSign className="w-4 h-4" />
                                Budget: ₵{task.budget}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span>{task.category}</span>
                              {task.employer?.name && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="inline-flex items-center gap-1">
                                    <FaUser className="w-3 h-3" />
                                    {task.employer.name}
                                  </span>
                                </>
                              )}
                              {task.employer?.phone && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="inline-flex items-center gap-1">
                                    <FaPhone className="w-3 h-3" />
                                    {task.employer.phone}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.className}`}>
                            {statusInfo.icon}
                            <span>{statusInfo.text}</span>
                          </div>
                          {statusInfo.subtext && (
                            <span className="text-xs text-gray-500">{statusInfo.subtext}</span>
                          )}
                          {deadlineStatus && (
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${deadlineStatus.className}`}>
                              <FaClock className="w-3 h-3" />
                              {deadlineStatus.text}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Location:</span>
                          <span>
                            {task.locationType === "remote" ? "Remote" : 
                              (task.address ? `${task.address.suburb || ''}, ${task.address.city || ''}`.replace(/, $/, '') : "On-site")}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Deadline:</span>
                          <span>
                            {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', 
                              {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}) : 'Not specified'}
                          </span>
                        </div>
                      </div>

                      {task.skillsRequired && task.skillsRequired.length > 0 && (
                        <div className="mb-6">
                          <span className="text-sm font-medium text-gray-700 mb-2 block">Skills Required:</span>
                          <div className="flex flex-wrap gap-2">
                            {task.skillsRequired.map((skill, skillIndex) => (
                              <span key={skillIndex} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <TaskActions
          task={task}
          user={user}
          isProcessing={isProcessing}
          layout="dropdown" // or 'grid', 'priority', 'vertical'
          onViewDetails={(taskId) => navigate(`/view/mini_task/info/${taskId}`)}
          onSubmitWork={(taskId) => openSubmitModal(taskId)}
          onViewSubmissions={(taskId) => navigate(`/freelancer/${taskId}/view_task_submissions`)}
          onAcceptTask={handleTaskAcceptance}
          onRejectTask={handleTaskRejection}
          StartChatButton={StartChatButton}
          className="custom-task-actions" // Optional custom styling
        />

                    {/* Modal for submitting work */}
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      
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