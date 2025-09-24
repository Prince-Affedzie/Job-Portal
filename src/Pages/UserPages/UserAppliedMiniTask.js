// MyMiniTaskApplications.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { userContext } from "../../Context/FetchUser";
import Navbar from '../../Components/Common/Navbar';
import { useNavigate } from 'react-router-dom';
import { acceptMiniTaskAssignment, removeAppliedMiniTaskFromDashboard, raiseDispute, rejectMiniTaskAssignment, addReportingEvidence, sendFileToS3 } from '../../APIS/API';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaFilter,FaMoneyCheck,FaMoneyBillWave, FaCheck, FaArrowUp, FaArrowDown, FaClock, FaMapMarkerAlt, FaDollarSign, FaFlag, FaBuilding, FaUser, FaPhone, FaEye, FaUpload, FaComments, FaTimes, FaCheckCircle, FaExclamationTriangle, FaGavel, FaFileAlt, FaSearch, FaPlus, FaEllipsisV, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import WorkSubmissionModal from '../../Components/Common/WorkSubmissionModal';
import StartChatButton from '../../Components/MessagingComponents/StartChatButton';
import TaskActions from '../../Components/MiniTaskManagementComponents/MiniTaskActionButtons';
import Pagination from "../../Components/Common/Pagination";
import ReportForm from "../../Components/Common/ReportForm";
import { useFreelancerGuide } from '../../Components/MiniTaskManagementComponents/UseFreelancerAcceptanceGuide'

const MyMiniTaskApplications = () => {
  const navigate = useNavigate();
  const { loading, user, minitasks, fetchAppliedMiniTasks } = useContext(userContext);
  const [filter, setFilter] = useState('all');
  const [viewType, setViewType] = useState('applications'); // 'applications' or 'bids'
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('deadline');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const applicationsPerPage = 6;
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingTask, setReportingTask] = useState(null);
  const { showFreelancerGuide, hideFreelancerGuide, FreelancerGuide } = useFreelancerGuide();
  const [searchTerm, setSearchTerm] = useState('');

  // Extract applications and bids from minitasks
  const applications = minitasks?.applications || [];
  const bids = minitasks?.bids || [];

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

  // Filter items by search term
  const filterItemsBySearch = (items) => {
    if (!searchTerm) return items;
    
    return items.filter(item => {
      const task = viewType === 'applications' ? item : item.task;
      return (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.employer?.name && task.employer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.skillsRequired && task.skillsRequired.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    });
  };

  // Sort and filter applications or bids based on viewType
  const sortAndFilterItems = () => {
    const items = viewType === 'applications' ? applications : bids;
    
    const filtered = items.filter(item => {
      if (filter === 'all') return true;
      
      if (viewType === 'applications') {
        return item.status.toLowerCase() === filter.toLowerCase();
      } else {
        return item.task.status.toLowerCase() === filter.toLowerCase();
      }
    });

    const searchedItems = filterItemsBySearch(filtered);

    return searchedItems.sort((a, b) => {
      let compareValueA, compareValueB;
      
      switch (sortField) {
        case 'deadline':
          compareValueA = new Date(viewType === 'applications' ? a.deadline : a.task.deadline);
          compareValueB = new Date(viewType === 'applications' ? b.deadline : b.task.deadline);
          break;
        case 'budget':
          compareValueA = parseFloat(viewType === 'applications' ? a.budget : a.task.budget);
          compareValueB = parseFloat(viewType === 'applications' ? b.budget : b.task.budget);
          break;
        case 'title':
          compareValueA = (viewType === 'applications' ? a.title : a.task.title).toLowerCase();
          compareValueB = (viewType === 'applications' ? b.title : b.task.title).toLowerCase();
          break;
        case 'bidAmount':
          if (viewType === 'bids') {
            compareValueA = parseFloat(a.bid.amount);
            compareValueB = parseFloat(b.bid.amount);
          } else {
            compareValueA = 0;
            compareValueB = 0;
          }
          break;
        default:
          compareValueA = new Date(viewType === 'applications' ? a.deadline : a.task.deadline);
          compareValueB = new Date(viewType === 'applications' ? b.deadline : b.task.deadline);
      }
      
      if (sortDirection === 'asc') {
        return compareValueA > compareValueB ? 1 : -1;
      } else {
        return compareValueA < compareValueB ? 1 : -1;
      }
    });
  };

  const sortedAndFilteredItems = sortAndFilterItems();
  
  // Calculate pagination details
  const indexOfLastItem = currentPage * applicationsPerPage;
  const indexOfFirstItem = indexOfLastItem - applicationsPerPage;
  const currentItems = sortedAndFilteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAndFilteredItems.length / applicationsPerPage);

  const handleReportIssue = (task) => {
    setReportingTask(task);
    setShowReportModal(true);
  };

  const handleTaskAcceptance = async (task, taskId) => {
    setIsProcessing(true);
    setActiveTaskId(taskId);
    
    try {
      const res = await acceptMiniTaskAssignment(taskId);
      if (res.status === 200) {
        toast.success("Task accepted successfully! You can now start working on it.");
        showFreelancerGuide(
          task.title,
          task.employer.name,
          task.deadline
        );
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

  const handleTaskRejection = async (taskId) => {
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

  const handleSelectAll = () => {
    const allTasks = {};
    sortedAndFilteredItems.forEach(item => {
      const taskId = viewType === 'applications' ? item._id : item.task._id;
      if (canRemoveTask(item)) {
        allTasks[taskId] = true;
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

  const getApplicationStatus = (item) => {
    const task = viewType === 'applications' ? item : item.task;
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

  const canRemoveTask = (item) => {
    const task = viewType === 'applications' ? item : item.task;
    const isAssigned = task.assignedTo && task.assignedTo === user?._id;
    return !(isAssigned && task.status === "In-progress");
  };

  const openSubmitModal = (taskId) => {
    setActiveTaskId(taskId);
    setModalOpen(true);
  };

  const getBidStatus = (bid) => {
    switch (bid.status) {
      case 'accepted':
        return { text: 'Accepted', className: 'bg-green-100 text-green-800 border-green-200', icon: <FaCheckCircle className="w-4 h-4" /> };
      case 'rejected':
        return { text: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200', icon: <FaTimes className="w-4 h-4" /> };
      case 'pending':
      default:
        return { text: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <FaClock className="w-4 h-4" /> };
    }
  };

 // Card View Component - Redesigned
const CardView = ({ item, isApplication }) => {
  const task = isApplication ? item : item.task;
  const bid = isApplication ? null : item.bid;
  const statusInfo = getApplicationStatus(item);
  const isAssigned = task.assignedTo && task.assignedTo === user?._id;
  const bidStatus = !isApplication ? getBidStatus(bid) : null;

  return (
    <div   className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group hover:border-gray-200">
      {/* Card Header - Clean and Minimal */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start gap-3">
          <h3 
            className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors flex-1 leading-tight"
            onClick={() => navigate(`/view/applied/mini_task/info/${task._id}`)}
          >
            {task.title}
          </h3>
          
          <div className="flex flex-col items-end gap-1">
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.text}</span>
            </div>
            {!isApplication && (
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bidStatus.className}`}>
                {bidStatus.icon}
                <span className="ml-1">{bidStatus.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body - Streamlined Content */}
      <div className="p-4">
        {/* Key Metrics - Compact Layout */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaMoneyBillWave className="text-blue-600 w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Budget</p>
              <p className="font-semibold text-gray-900 text-sm">₵{task.budget}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaClock className="text-amber-600 w-4 h-4" />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Deadline</p>
              <p className="font-semibold text-gray-900 text-sm">
                {new Date(task.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Bid Details - Only for bids view */}
        {!isApplication && (
          <div className="bg-blue-50 rounded-md p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FaGavel className="text-blue-600 w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">YOUR BID</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-600 mb-1">Amount</p>
                <p className="font-semibold text-blue-800 text-sm">₵{bid.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Timeline</p>
                <p className="font-medium text-gray-900 text-sm">{bid.timeline}</p>
              </div>
            </div>
            {bid.message && (
              <div className="mt-2 p-2 bg-white rounded border border-gray-100">
                <p className="text-xs text-gray-600 mb-1">Your Message</p>
                <p className="text-xs text-gray-700 line-clamp-2">{bid.message}</p>
              </div>
            )}
          </div>
        )}

        {/* Skills - Compact Chip Style */}
        {task.skillsRequired?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 font-medium mb-2">SKILLS REQUIRED</p>
            <div className="flex flex-wrap gap-1">
              {task.skillsRequired.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-md font-medium"
                >
                  {skill}
                </span>
              ))}
              {task.skillsRequired.length > 3 && (
                <span className="text-xs text-gray-500 self-center">
                  +{task.skillsRequired.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Employer Info - Minimal */}
        {task.employer?.name && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md mb-4">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUser className="text-gray-600 w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">Posted by</p>
              <p className="text-xs font-medium text-gray-900 truncate">{task.employer.name}</p>
            </div>
          </div>
        )}

        {/* Action Buttons - Clean and Aligned */}
        <div className="flex gap-2 items-stretch">
          <div className="flex-1 min-w-0">
            <TaskActions
              task={task}
              user={user}
              isProcessing={isProcessing}
              layout="stacked"
              onViewDetails={(taskId) =>  navigate(`/view/applied/mini_task/info/${taskId}`)}
              onSubmitWork={(taskId) => openSubmitModal(taskId)}
              onViewSubmissions={(taskId) => navigate(`/freelancer/${taskId}/view_task_submissions`)}
              onAcceptTask={handleTaskAcceptance}
              onRejectTask={handleTaskRejection}
              StartChatButton={StartChatButton}
              className="w-full h-full"
            />
          </div>
          
          {/* Report Issue Button - Compact */}
          {isAssigned && (task.status === 'Assigned' || task.status === 'In-progress') && (
            <button
              onClick={() => handleReportIssue(task)}
              className="flex items-center justify-center gap-1 px-2.5 py-2 bg-white border border-gray-300 rounded-md text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all duration-200 text-xs font-medium whitespace-nowrap min-w-[60px]"
              title="Report Issue"
            >
              <FaFlag className="w-3 h-3 flex-shrink-0" />
              <span className="sr-only sm:not-sr-only sm:inline">Report</span>
            </button>
          )} 
        </div>
      </div>
    </div>
  );
};
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Mini Task Applications</h1>
                <p className="text-blue-100 opacity-90">Manage and track your applied mini tasks and bids</p>
              </div>
              <button
                onClick={() => navigate('/mini_task/listings')}
                className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-colors duration-200 font-semibold shadow-md"
              >
                <FaPlus className="w-4 h-4" />
                Find New Tasks
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                <FaFileAlt className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                <FaGavel className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Bids</p>
                <p className="text-2xl font-bold text-gray-900">{bids.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mr-4">
                <FaClock className="text-amber-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'In-progress' && app.assignedTo === user?._id).length +
                   bids.filter(bid => bid.task.status === 'In-progress' && bid.task.assignedTo === user?._id).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
                <FaCheckCircle className="text-purple-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'Completed' && app.assignedTo === user?._id).length +
                   bids.filter(bid => bid.task.status === 'Completed' && bid.task.assignedTo === user?._id).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search and View Toggle */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400 w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* View Type Toggle */}
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewType === 'applications' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => { setViewType('applications'); setCurrentPage(1); }}
                  >
                    <FaFileAlt className="w-4 h-4" />
                    Applications ({applications.length})
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewType === 'bids' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => { setViewType('bids'); setCurrentPage(1); }}
                  >
                    <FaGavel className="w-4 h-4" />
                    Bids ({bids.length})
                  </button>
                </div>
              </div>
            </div>
            
            {/* Filter and Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Filter */}
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <select 
                  className="bg-gray-50 border border-gray-300 rounded-xl pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filter}
                  onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              {/* Sort */}
              <div className="flex items-center gap-2">
                <FaSort className="text-gray-500" />
                <select 
                  className="bg-gray-50 border border-gray-300 rounded-xl pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortField}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="deadline">Deadline</option>
                  <option value="budget">Budget</option>
                  <option value="title">Title</option>
                  {viewType === 'bids' && <option value="bidAmount">Bid Amount</option>}
                </select>
                <button 
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {sortDirection === 'asc' ? <FaSortUp className="w-4 h-4" /> : <FaSortDown className="w-4 h-4" />}
                </button>
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
                  sortedAndFilteredItems.filter(item => canRemoveTask(item)).length ? 
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
              <p className="text-gray-600 font-medium">Loading your {viewType}...</p>
            </div>
          </div>
        ) : sortedAndFilteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {viewType === 'applications' ? 'No Applications Found' : 'No Bids Found'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all'
                    ? `You haven't ${viewType === 'applications' ? 'applied to' : 'bid on'} any minitasks yet.`
                    : `No ${filter} ${viewType} found.`}
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
            {/* Results Count */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedAndFilteredItems.length)} of {sortedAndFilteredItems.length} {viewType}
              </p>
            </div>

            {/* Item Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
              {currentItems.map((item) => (
                <CardView 
                  key={viewType === 'applications' ? item._id : item.task._id} 
                  item={item} 
                  isApplication={viewType === 'applications'} 
                />
              ))}
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

      {/* Work Submission Modal */}
      {modalOpen && (
        <WorkSubmissionModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setActiveTaskId(null);
          }}
          taskId={activeTaskId}
          task={viewType === 'applications' 
            ? applications.find(app => app._id === activeTaskId)
            : bids.find(bid => bid.task._id === activeTaskId)?.task
          }
        />
      )}

      {/* Report Form Modal */}
      {showReportModal && (
        <ReportForm
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          task={reportingTask}
          currentUser={user}
          onReportSubmitted={() => {}}
        />
      )}
  
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove {Object.values(selectedTasks).filter(Boolean).length} task(s) from your dashboard?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                onClick={handleRemoveSelectedTasks}
                disabled={isProcessing}
              >
                {isProcessing ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <FreelancerGuide/>
    </div>
  );
};

export default MyMiniTaskApplications;