import React, { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { getMiniTasksposted, deleteMiniTask, updateMiniTask, assignApplicantToTask } from "../APIS/API";
import ViewTaskModal from "../Components/MiniTaskManagementComponents/ViewTaskModal";
import ApplicantsPage from "../Components/MiniTaskManagementComponents/ApplicantsPage";
import AssignApplicantModal from "../Components/MiniTaskManagementComponents/AssignApplicantsModal";
import EditMiniTaskForm from "../Components/MiniTaskManagementComponents/EditMiniTaskForm";
import Navbar from "../Components/MyComponents/Navbar";
import "../Styles/ManageMiniTasks.css";
import ProcessingOverlay from "../Components/MyComponents/ProcessingOverLay";

const ManageMiniTasks = () => {
  const navigate = useNavigate();
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
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

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

  // Close any open dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActionMenuId && !event.target.closest('.action-menu-container')) {
        setOpenActionMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionMenuId]);

  const handleDeleteTask = async (taskId) => {
    // Show confirmation dialog
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    
    try {
      setIsProcessing(true);
      const response = await deleteMiniTask(taskId);
      if (response.status === 200) {
        toast.success("Task deleted successfully");
        setTasks(prevTasks => prevTasks.filter((task) => task._id !== taskId));
        setOpenActionMenuId(null);
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

  const handleAssignApplicant = async (taskId, id, name) => {
    try {
      setIsProcessing(true);
      const updatedTask = await assignApplicantToTask(taskId, id);
      if (updatedTask.status === 200) {
        toast.success(`Mini Task assigned to ${name}`);
        setIsAssignModalOpen(false);
      } else {
        toast.error("Couldn't assign task. Please try again");
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
        setOpenActionMenuId(null);
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
    setOpenActionMenuId(null);
  };

  const toggleActionMenu = (taskId) => {
    if (openActionMenuId === taskId) {
      setOpenActionMenuId(null);
    } else {
      setOpenActionMenuId(taskId);
      // Close any open status editing if user opens a different action menu
      if (editingStatusTaskId && editingStatusTaskId !== taskId) {
        setEditingStatusTaskId(null);
      }
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
                  
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Assigned to:</span> {task.assignedTo?.name || "Not Assigned"}
                  </p>
                  
                  {/* Action Menu Button and Dropdown */}
                  <div className="relative action-menu-container">
                    <button 
                      onClick={() => toggleActionMenu(task._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center text-sm transition-colors"
                    >
                      <span>Actions</span>
                      <svg 
                        className={`ml-2 w-4 h-4 transition-transform ${openActionMenuId === task._id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    
                    {openActionMenuId === task._id && (
                      <div className="absolute z-10 mt-2 left-0 w-48 bg-white rounded shadow-lg border border-gray-200 py-1">
                        <button 
                          onClick={() => {
                            navigate(`/view/mini_task/info/${task._id}`);
                            setOpenActionMenuId(null);
                          }}
                          className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          View Details
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedTask(task);
                            setPanelVisible(true);
                            setOpenActionMenuId(null);
                          }}
                          className="px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 w-full text-left flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task._id)}
                          disabled={isProcessing}
                          className="px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left flex items-center disabled:opacity-50"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Delete
                        </button>
                        <button 
                          onClick={() => handleViewApplicants(task._id)}
                          className="px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 w-full text-left flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          View Applicants
                        </button>
                        {(task.status === 'In-progress'|| task.status === 'Completed') && (
                          <button 
                            onClick={() => {
                              navigate(`/client/${task._id}/view_task_submissions`);
                              setOpenActionMenuId(null);
                            }}
                            className="px-4 py-2 text-sm text-green-700 hover:bg-green-50 w-full text-left flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            View Submissions
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setEditingStatusTaskId(task._id);
                            setNewStatus(task.status);
                          }}
                          className="px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 w-full text-left flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                          </svg>
                          Change Status
                        </button>
                      </div>
                    )}
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
                          <option value="Assigned">Assigned</option>
                          <option value="In-progress">In-Progress</option>
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