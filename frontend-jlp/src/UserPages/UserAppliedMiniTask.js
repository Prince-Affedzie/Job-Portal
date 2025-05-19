// MyMiniTaskApplications.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../Styles/UserMinitaskApp.css';
import { userContext } from "../Context/FetchUser";
import Navbar from '../Components/MyComponents/Navbar';
import { useNavigate } from 'react-router-dom';
import { acceptMiniTaskAssignment, removeAppliedMiniTaskFromDashboard,rejectMiniTaskAssignment } from '../APIS/API';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaFilter, FaCheck, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import WorkSubmissionModal from '../Components/MyComponents/WorkSubmissionModal';
import StartChatButton from '../Components/MessagingComponents/StartChatButton'
import  MiniTaskActions from '../Components/MyComponents/MiniTaskActionButtons'



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
      return { text: "Completed(You completed this Task)", className: "status-completed" };
    if (task.status === "In-progress" && isAssigned) 
      return { text: "In Progress (You are assigned)", className: "status-in-progress" };
    if (task.status === "Open" && !task.assignedTo) 
      return { text: "Applied (Awaiting decision)", className: "status-applied" };
    if (task.status === "Open" && !isAssigned && task.assignedTo) 
      return { text: "Not Selected", className: "status-not-selected" };
    if (task.status === "Open" && isAssigned && task.assignedTo) 
      return { text: "Selected (You are assigned)", className: "status-selected" };
    if (task.status === "Closed" && !isAssigned) 
      return { text: "Closed (Not selected)", className: "status-closed" };
    
    return { text: task.status, className: `status-${task.status.toLowerCase()}` };
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

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
      
      <div className="my-mini-applications-container">
        <div className="header-with-actions">
          <h1 className="page-title">Mini Jobs You've Applied To</h1>
          
        </div>

        <div className="mini-filter-container">
          <div className="filter-section">
            <span>Filter:</span>
            <div className="mini-filter-buttons">
              {['all', 'open', 'in-progress', 'completed', 'closed'].map(status => (
                <button
                  key={status}
                  className={filter === status ? 'active' : ''}
                  onClick={() => { setFilter(status); setCurrentPage(1); }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="sort-section">
            <span>Sort by:</span>
            <div className="sort-buttons">
              <button 
                className={sortField === 'deadline' ? 'active' : ''} 
                onClick={() => handleSort('deadline')}
              >
                Deadline {sortField === 'deadline' && 
                          (sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
              </button>
              <button 
                className={sortField === 'budget' ? 'active' : ''} 
                onClick={() => handleSort('budget')}
              >
                Budget {sortField === 'budget' && 
                        (sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
              </button>
              <button 
                className={sortField === 'title' ? 'active' : ''} 
                onClick={() => handleSort('title')}
              >
                Title {sortField === 'title' && 
                      (sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
              </button>
            </div>
          </div>
        </div>

        {showDeleteButton && (
          <div className="action-buttons-container">
            <button
              className="select-all-btn"
              onClick={handleSelectAll}
            >
              <FaCheck /> {Object.keys(selectedTasks).filter(id => selectedTasks[id]).length === 
                        sortedAndFilteredApplications.filter(task => canRemoveTask(task)).length ? 
                        "Deselect All" : "Select All"}
            </button>
            
            <button
              className="delete-selected-btn"
              onClick={confirmRemoveSelectedTasks}
              disabled={isProcessing}
            >
              <span className="delete-icon"><FaTrash/></span>
              {isProcessing ? "Removing..." : `Delete Selected (${Object.values(selectedTasks).filter(Boolean).length})`}
            </button>
          </div>
        )}

        {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-sm text-gray-600 font-medium">
                Loading your applications...
                </p>
           </div>
          ) : sortedAndFilteredApplications.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-10 space-y-3 text-center">
         <p className="text-gray-600 text-sm">
          {filter === 'all'
            ? "You haven't applied to any minitasks yet."
           : `No ${filter} applications found.`}
         </p>
       <button
        onClick={() => navigate('/mini_task/listings')}
         className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
      >
          Find Mini Tasks
        </button>
       </div>
       ): (
          <div>
            <div className="mini-list">
              {currentApplications.map((task) => {
                const statusInfo = getApplicationStatus(task);
                const isRemovable = canRemoveTask(task);
                const isAssigned = task.assignedTo && task.assignedTo === user?._id;
                const isTaskActive = activeTaskId === task._id;

                return (
                  <div key={task._id} className="mini-list-item">
                    <div className="mini-list-top">
                      <div className="task-header-with-checkbox">
                        {isRemovable && (
                          <div className="task-checkbox">
                            <input
                              type="checkbox"
                              id={`task-select-${task._id}`}
                              checked={!!selectedTasks[task._id]}
                              onChange={() => handleTaskSelection(task._id)}
                            />
                            <label htmlFor={`task-select-${task._id}`}></label>
                          </div>
                        )}
                        <div>
                          <h2>{task.title}</h2>
                          <p className="mini-list-category">
                            {task.category} • Budget: ₵{task.budget}
                            {task.employer?.phone && ` • Employer Contact: ${task.employer.phone}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`mini-status ${statusInfo.className}`}>
                          {statusInfo.text}
                        </span>
                        {task.deadline && (
                          <span className={`deadline-indicator ${
                            new Date(task.deadline) < new Date() ? 'deadline-passed' : 
                            new Date(task.deadline) - new Date() < 86400000 ? 'deadline-soon' : ''
                          }`}>
                            {new Date(task.deadline) < new Date() ? 'Deadline passed' : 
                             new Date(task.deadline) - new Date() < 86400000 ? 'Due soon' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mini-list-bottom">
                      <div>
                        <strong>Location:</strong> {task.locationType === "remote" ? "Remote" : 
                          (task.address ? `${task.address.suburb || ''}, ${task.address.city || ''}`.replace(/, $/, '') : "On-site")}
                      </div>
                      <div>
                        <strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', 
                          {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}) : 'Not specified'}
                      </div>
                      <div className="mini-skills-container">
                        {task.skillsRequired && task.skillsRequired.map((skill, index) => (
                          <span key={index} className="mini-skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mini-list-actions">
                      <button
                        className="view-details-btn"
                        onClick={() => navigate(`/view/mini_task/info/${task._id}`)}
                      >
                        View Details
                      </button>
                      
                      {isAssigned && (task.status === "In-progress"  || task.status === "Completed") && (
                        <>
                          <button
                            className="submit-proof-btn"
                            onClick={() => openSubmitModal(task._id)}
                          >
                            Submit Work
                          </button>
                          <button
                            className="view-submissions-btn"
                            onClick={() => navigate(`/freelancer/${task._id}/view_task_submissions`)}
                          >
                            View Submissions
                          </button>
                          <StartChatButton
                           userId2={task.employer._id}
                            jobId={task._id}
                           />
                        </>
                      )}
                      
                      {(task.assignedTo === user?._id && !task.assignmentAccepted) && (
                       <>
                        <button 
                          className={`accept-task-btn ${isTaskActive ? 'processing' : ''}`}
                          onClick={() => handleTaskAcceptance(task._id)}
                          disabled={isProcessing}
                        >
                          {isTaskActive && isProcessing ? 'Accepting...' : 'Accept Task'}
                        </button>

                        <button 
                          className={`accept-task-btn ${isTaskActive ? 'processing' : ''}`}
                          onClick={() => handleTaskRejection(task._id)}
                          disabled={isProcessing}
                        >
                          {isTaskActive && isProcessing ? 'Reject...' : 'Reject Task'}
                        </button>
                        </>
                      )}
                      
                      {(task.assignedTo === user?._id && task.assignmentAccepted) && (
                        <p className="acceptance-indicator">
                          <FaCheck /> Task accepted
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span className="page-indicator">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modal for submitting work */}
      {modalOpen && (
        <WorkSubmissionModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setActiveTaskId(null);
          }}
          taskId={activeTaskId}
        />
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