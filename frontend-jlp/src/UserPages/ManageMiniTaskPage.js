import React, { useEffect, useState, useCallback,useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import { userContext } from "../Context/FetchUser";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { getMiniTasksposted, deleteMiniTask, updateMiniTask, assignApplicantToTask,raiseDispute } from "../APIS/API";
import ViewTaskModal from "../Components/MiniTaskManagementComponents/ViewTaskModal";
import ApplicantsPage from "../Components/MiniTaskManagementComponents/ApplicantsPage";
import AssignApplicantModal from "../Components/MiniTaskManagementComponents/AssignApplicantsModal";
import EditMiniTaskForm from "../Components/MiniTaskManagementComponents/EditMiniTaskForm";
import Navbar from "../Components/MyComponents/Navbar";
import "../Styles/ManageMiniTasks.css";
import ProcessingOverlay from "../Components/MyComponents/ProcessingOverLay";

const ManageMiniTasks = () => {
  const navigate = useNavigate();
  const { user, minitasks, fetchAppliedMiniTasks } = useContext(userContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingStatusTaskId, setEditingStatusTaskId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // New states for improved UX
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingTask, setReportingTask] = useState(null);
 const [reportForm, setReportForm] = useState({
  against: reportingTask?.assignedTo?._id || '',
  taskId: reportingTask?._id || '',
  tasktitle:reportingTask?.title || '',
  reportedBy :user?.name || '',
  reason: '',
  details: ''
});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  // Fetch tasks function using useCallback to avoid recreating it on every render
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMiniTasksposted();
      if (response.status === 200) {
        setTasks(response.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  // New selection handlers
  const handleSelectTask = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === currentTasks.length) {
      setSelectedTasks(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedTasks(new Set(currentTasks.map(task => task._id)));
      setShowBulkActions(true);
    }
  };

  const handleClearSelection = () => {
    setSelectedTasks(new Set());
    setShowBulkActions(false);
  };

  // Report issue handlers
  const handleReportIssue = (task) => {
    setReportingTask(task);
    setShowReportModal(true);
  };

  useEffect(() => {
  if (reportingTask) {
    setReportForm((prev) => ({
      ...prev,
      against: reportingTask.assignedTo?._id || '',
      taskId: reportingTask._id || '',
      tasktitle:reportingTask.title,
      reportedBy : user?.name
    }));
  }
}, [reportingTask]);


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

  // Bulk action handlers
  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedTasks.size} selected task(s)?`)) {
      return;
    }
    
    setIsProcessing(true);
    try {
      const deletePromises = Array.from(selectedTasks).map(taskId => deleteMiniTask(taskId));
      await Promise.all(deletePromises);
      
      setTasks(prevTasks => prevTasks.filter(task => !selectedTasks.has(task._id)));
      toast.success(`${selectedTasks.size} task(s) deleted successfully`);
      handleClearSelection();
    } catch (error) {
      toast.error("Some tasks could not be deleted");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    setIsProcessing(true);
    try {
      const updatePromises = Array.from(selectedTasks).map(taskId => 
        updateMiniTask(taskId, { status: newStatus })
      );
      await Promise.all(updatePromises);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          selectedTasks.has(task._id) ? { ...task, status: newStatus } : task
        )
      );
      toast.success(`Status updated for ${selectedTasks.size} task(s)`);
      handleClearSelection();
    } catch (error) {
      toast.error("Some tasks could not be updated");
    } finally {
      setIsProcessing(false);
    }
  };

  // Your existing handlers remain unchanged
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    
    try {
      setIsProcessing(true);
      const response = await deleteMiniTask(taskId);
      if (response.status === 200) {
        toast.success("Task deleted successfully");
        setTasks(prevTasks => prevTasks.filter((task) => task._id !== taskId));
      } else {
        toast.error("Couldn't delete task. Please try again");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    if (!updatedTask || !updatedTask._id) return;
    
    try {
      setIsProcessing(true);
      const response = await updateMiniTask(updatedTask._id, updatedTask);
      if (response.status === 200) {
        toast.success("Mini Task updated successfully");
        setTasks(prevTasks => prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
        setPanelVisible(false);
      } else {
        toast.error("Couldn't update task");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

 
  const handleStatusUpdate = async (task) => {
    if (!newStatus || newStatus === task.status) {
      toast.error("Please select a different status");
      return;
    }
  
    try {
      setIsProcessing(true);
      const response = await updateMiniTask(task._id, { status: newStatus });
      
      if (response.status === 200) {
        toast.success("Status updated successfully!");
        setTasks((prevTasks) => 
          prevTasks.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
        );
        setEditingStatusTaskId(null);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleViewApplicants = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.applicants) {
      navigate(`/manage-mini-tasks/${taskId}/applicants`, {
        state: { applicants: task.applicants, assignedTo: task.assignedTo },
      });
    }
  };

  // Filter tasks based on status
  const filteredTasks = filterStatus === "All" 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  // Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'Assigned': return 'bg-blue-100 text-blue-800';
      case 'In-progress': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get context-aware actions based on task status and selection
  const getTaskActions = (task) => {
    const actions = [];
    
    // Always available actions
    actions.push(
      { id: 'view', label: 'View Details', icon: 'eye', color: 'text-gray-700' },
      { id: 'edit', label: 'Edit', icon: 'edit', color: 'text-blue-700' }
    );

    // Status-based actions
    if (task.status === 'Open') {
      actions.push({ id: 'applicants', label: 'View Applicants', icon: 'users', color: 'text-purple-700' });
    }
    
    if (task.status === 'Assigned' || task.status === 'In-progress') {
      if (task.assignedTo) {
        actions.push({ id: 'report', label: 'Report Issue', icon: 'flag', color: 'text-red-700' });
      }
    }
    
    if (task.status === 'In-progress' || task.status === 'Completed') {
      actions.push({ id: 'submissions', label: 'View Submissions', icon: 'document', color: 'text-green-700' });
    }

    actions.push(
      { id: 'status', label: 'Change Status', icon: 'status', color: 'text-yellow-700' },
      { id: 'delete', label: 'Delete', icon: 'trash', color: 'text-red-700' }
    );

    return actions;
  };

  const executeAction = (action, task) => {
    switch(action.id) {
      case 'view':
        navigate(`/view/mini_task/info/${task._id}`);
        break;
      case 'edit':
        setSelectedTask(task);
        setPanelVisible(true);
        break;
      case 'applicants':
        handleViewApplicants(task._id);
        break;
      case 'submissions':
        navigate(`/client/${task._id}/view_task_submissions`);
        break;
      case 'status':
        setEditingStatusTaskId(task._id);
        setNewStatus(task.status);
        break;
      case 'delete':
        handleDeleteTask(task._id);
        break;
      case 'report':
        handleReportIssue(task);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Fetching your mini tasks...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className={`manage-tasks-container max-w-6xl mx-auto px-4 py-8 ${panelVisible ? "shifted" : ""}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Mini Tasks Posts</h2>
          <a
            href="/post/mini_task"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center"
          >
            <span className="mr-2">+</span> Post New Task
          </a>
        </div>

        {/* Task Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-500">Total Posted</p>
            <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-500">Open</p>
            <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'Open').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-500">Assigned</p>
            <p className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'Assigned').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-500">In-Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'In-progress').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-500">Closed</p>
            <p className="text-2xl font-bold text-red-600">{tasks.filter(t => t.status === 'Closed').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-purple-600">{tasks.filter(t => t.status === 'Completed').length}</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2 sm:mb-0">Filter Tasks</h3>
            <div className="flex items-center">
              <label htmlFor="status-filter" className="mr-2 text-gray-600">Status:</label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In-progress">In-Progress</option>
                <option value="Closed">Closed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selection Controls 
        {currentTasks.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {selectedTasks.size === currentTasks.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedTasks.size > 0 && (
                  <span className="text-gray-600">
                    {selectedTasks.size} task{selectedTasks.size !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
              
              {showBulkActions && (
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => e.target.value && handleBulkStatusChange(e.target.value)}
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="">Change Status...</option>
                    <option value="Open">Open</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In-progress">In-Progress</option>
                    <option value="Closed">Closed</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-600 text-white px-3 py-2 text-sm rounded hover:bg-red-700"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={handleClearSelection}
                    className="bg-gray-300 text-gray-700 px-3 py-2 text-sm rounded hover:bg-gray-400"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        )} */}

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-tasks flex flex-col items-center justify-center text-center py-16 bg-white rounded-lg shadow">
              <img
                src="/images/empty-tasks.svg"
                alt="No tasks illustration"
                className="w-40 h-40 mb-6 opacity-80"
              />
              <h3 className="text-xl font-semibold text-gray-700">
                {tasks.length === 0 
                  ? "No Mini Tasks Posted Yet" 
                  : `No ${filterStatus !== "All" ? filterStatus : ""} Tasks Found`}
              </h3>
              <p className="text-gray-500 mb-4">
                {tasks.length === 0 
                  ? "Start by posting a new task and manage it here." 
                  : "Try changing your filter to see other tasks."}
              </p>
              {tasks.length === 0 && (
                <a
                  href="/post/mini_task"
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-200"
                >
                  Post a Mini Task
                </a>
              )}
            </div>
          ) : (
            <>
              {currentTasks.map((task) => (
                <div className="task-card bg-white rounded-lg shadow-sm mb-4 p-5 hover:shadow-md transition-shadow duration-200" key={task._id}>
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    {/*<input
                      type="checkbox"
                      checked={selectedTasks.has(task._id)}
                      onChange={() => handleSelectTask(task._id)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />*/}
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                        <h3 className="text-lg font-medium text-gray-800 mb-2 md:mb-0">{task.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                            {task.applicants?.length || 0} applicant(s)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Assigned to:</span> {task.assignedTo?.name || "Not Assigned"}
                          </p>
                          {task.assignedTo && (task.status === 'Assigned' || task.status === 'In-progress') && (
                            <button
                              onClick={() => handleReportIssue(task)}
                              className=" text-red-600 hover:text-red-800 text-xs flex items-center gap-1 w-fit"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                              </svg>
                              Report Issue
                            </button>
                          )}
                        </div>
                        
                        {/* Single Action Button */}
                        <div className="relative">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                const actions = getTaskActions(task);
                                const selectedAction = actions.find(a => a.id === e.target.value);
                                if (selectedAction) {
                                  executeAction(selectedAction, task);
                                  e.target.value = ''; // Reset selection
                                }
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                            defaultValue=""
                          >
                            <option value="" disabled>Choose Action</option>
                            {getTaskActions(task).map(action => (
                              <option key={action.id} value={action.id} className="text-gray-900">
                                {action.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Update Form (conditionally rendered) */}
                  {editingStatusTaskId === task._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Update Task Status</h4>
                      <div className="flex flex-wrap gap-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Status</option>
                          <option value="Open">Open</option>
                          {/*<option value="Assigned">Assigned</option>
                          <option value="In-progress">In-Progress</option> */}
                          <option value="Closed">Closed</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button 
                          onClick={() => handleStatusUpdate(task)}
                          disabled={isProcessing}
                          className="bg-green-500 text-white px-3 py-2 text-sm rounded hover:bg-green-600 disabled:opacity-50 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingStatusTaskId(null)}
                          className="bg-gray-300 text-gray-700 px-3 py-2 text-sm rounded hover:bg-gray-400 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-controls flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {showReportModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <h3 className="text-lg font-semibold mb-4">Report Issue</h3>

      <p className="text-gray-600 mb-2">
        Report an issue with: <strong>{reportingTask?.title}</strong>
      </p>
      <p className="text-gray-600 mb-4">
        Assigned to: <strong>{reportingTask?.assignedTo?.name}</strong>
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

        {/* View Task Modal */}
        <ViewTaskModal task={selectedTask} onClose={() => setIsViewModalOpen(false)} isOpen={isViewModalOpen} />

        {/* Edit Mini Task Form - Sliding Panel */}
        {panelVisible && selectedTask && (
          <EditMiniTaskForm
            task={selectedTask}
            onUpdate={handleUpdateTask}
            onClose={() => setPanelVisible(false)}
            isOpen={panelVisible}
          />
        )}
      </div>

      <ProcessingOverlay show={isProcessing} message="Processing your request..." />
    </div>
  );
};

export default ManageMiniTasks;