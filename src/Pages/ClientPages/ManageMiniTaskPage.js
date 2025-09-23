import React, { useEffect, useState, useCallback, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import { userContext } from "../../Context/FetchUser";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { getMiniTasksposted, deleteMiniTask, updateMiniTask, assignApplicantToTask, raiseDispute } from "../../APIS/API";
import ViewTaskModal from "../../Components/MiniTaskManagementComponents/ViewTaskModal";
import ApplicantsPage from "../../Components/MiniTaskManagementComponents/ApplicantsPage";
import AssignApplicantModal from "../../Components/MiniTaskManagementComponents/AssignApplicantsModal";
import EditMiniTaskForm from "../../Components/MiniTaskManagementComponents/EditMiniTaskForm";
import { ClientNavbar } from '../../Components/ClientComponents/ClientNavbar';
import { ClientSidebar } from '../../Components/ClientComponents/ClientSidebar';
import ReportForm from "../../Components/Common/ReportForm";
import { NotificationToast } from "../../Components/Common/NotificationToast";
import "../../Styles/ManageMiniTasks.css";
import ProcessingOverlay from "../../Components/Common/ProcessingOverLay";
import MarkDoneSwitch from "../../Components/MiniTaskManagementComponents/MarkDoneButton";

const ManageMiniTasks = () => {
  const navigate = useNavigate();
  const { user, minitasks, fetchAppliedMiniTasks } = useContext(userContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingStatusTaskId, setEditingStatusTaskId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  
  // New states for improved UX
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingTask, setReportingTask] = useState(null);

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
        actions.push(
          { id: 'report', label: 'Report Issue', icon: 'flag', color: 'text-red-700' },
          { id: 'applicants', label: 'View Applicants', icon: 'users', color: 'text-purple-700' }
        );
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
        navigate(`/client_view/task/${task._id}`);
        break;
      case 'edit':
       navigate(`/edit_task/${task._id}`, { 
      state: { task } // Pass the task as state
    });
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
      <div className="flex h-screen bg-gray-50">
        <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <div className="flex-1 overflow-auto">
          <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4 mx-auto"></div>
              <p className="text-lg font-medium text-gray-700">Fetching your mini tasks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />

        {/* Dashboard Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <ToastContainer position="top-right" autoClose={3000} />
          
          <div className={`manage-tasks-container max-w-6xl mx-auto ${panelVisible ? "shifted" : ""}`}>
           <div className={`manage-tasks-container max-w-6xl mx-auto px-4 sm:px-6 ${panelVisible ? "shifted" : ""}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
             <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">My micro tasks</h2>
               <a
                  href="/post/mini_task"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm sm:text-base w-full sm:w-auto justify-center"
               >
                <span className="mr-2">+</span> Add New Task
                  </a>
               </div>
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
                                className="bg-blue-600 max-w-[125px] hover:bg-blue-700 text-white text-xs flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors"
                                >
                              <svg
                             className="w-3 h-3"
                             fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                          <path
                           strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                         />
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
                                  <option key={action.id} value={action.id} className="text-white">
                                    {action.label}
                                  </option>
                                ))}
                              </select>
                               {/* Mark as Done Toggle */}
                              {(task.status === "Assigned" || task.status === "In-progress") && (
                             <div className="mt-2 bg-white p-2 rounded">
                             <MarkDoneSwitch
                              taskId={task._id}
                              userRole="client"
                              initialMarked={task.markedDoneByEmployer}
                             />
                              </div>

                               )}
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
                              <option value="Closed">Closed</option>
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
                 <div className="flex justify-center items-center gap-3 mt-6">
                 {/* Previous Button */}
                 <button
                  onClick={handlePrevPage}
                 disabled={currentPage === 1}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm
                ${
                 currentPage === 1
               ? "bg-gray-100 text-gray-400 cursor-not-allowed"
               : "bg-blue-600 text-white hover:bg-blue-700"
               }`}
              >
               <span>←</span>
                 <span className="hidden sm:inline">Previous</span>
              </button>

            {/* Page Indicator */}
           <span className="text-gray-700 font-semibold text-sm">
           Page <span className="text-blue-600">{currentPage}</span> of{" "}
           <span className="text-blue-600">{totalPages}</span>
          </span>

        {/* Next Button */}
         <button
         onClick={handleNextPage}
         disabled={currentPage === totalPages}
         className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm
         ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
    >
      <span className="hidden sm:inline">Next</span>
      <span>→</span>
    </button>
  </div>
)}

                </>
              )}
            </div>

            {showReportModal && (
              <ReportForm
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                task={reportingTask}
                currentUser={user}
                onReportSubmitted={() => {
                  // Optional: Add any post-submission logic here
                }}
              />
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
        </div>
      </div>

      <ProcessingOverlay show={isProcessing} message="Processing your request..." />
      <NotificationToast/>
    </div>
  );
};

export default ManageMiniTasks;