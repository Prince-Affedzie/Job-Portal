import React, { useEffect, useState, } from "react";
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
  const navigate = useNavigate()
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


  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5; // You can adjust how many tasks per page you want

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getMiniTasksposted();
      if (response.status === 200) {
        setTasks(response.data);
        console.log(response.data);
      } else {
        setTasks([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setIsProcessing(true);
      const response = await deleteMiniTask(taskId);
      if (response.status === 200) {
        toast.success("Deletion Successful");
        setTasks(tasks.filter((task) => task._id !== taskId));
      } else {
        toast.error("Couldn't Delete Task. Please try again");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    if (!updatedTask || !updatedTask._id) {
      console.error(" No ID in updatedTask", updatedTask);
      return;
    }
    try {
      setIsProcessing(true);
      const response = await updateMiniTask(updatedTask._id, updatedTask);
      if (response.status === 200) {
        toast.success("Mini Task Updated Successfully");
        setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
        setPanelVisible(false);
      } else {
        toast.error("Couldn't update Task");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
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
        toast.success(`Mini Task Assigned To ${name}`);
        setIsAssignModalOpen(false);
      } else {
        toast.error("Couldn't Assign Task. Please Try Again");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
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
      const updatedTask = { ...task, status: newStatus };
      const response = await updateMiniTask(task._id, { status: newStatus });
      
      if (response.status === 200) {
        toast.success("Status updated successfully!");
        // Update task locally
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
      console.error(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleViewApplicants = async (taskId) => {
    // Find the task by ID and extract the applicants
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.applicants) {
      // Pass the applicants data to ApplicantsPage
      navigate(`/manage-mini-tasks/${taskId}/applicants`, {
        state: { applicants: task.applicants },
      });
    }
  };

  // Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
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
    <div>
      <ToastContainer />
      <Navbar />
      <div className={`manage-tasks-container ${panelVisible ? "shifted" : ""}`}>
        <h2>Your Mini Tasks</h2>

        <div className="task-summary">
          <div>Total Posted: {tasks.length}</div>
          <div>Open: {tasks.filter(t => t.status === 'Open').length}</div>
          <div>Assigned: {tasks.filter(t => t.status === 'Assigned').length}</div>
          <div>Closed: {tasks.filter(t => t.status === 'Closed').length}</div>
          <div>Completed: {tasks.filter(t => t.status === 'Completed').length}</div>
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-tasks flex flex-col items-center justify-center text-center py-20">
              <img
                src="/images/empty-tasks.svg"
                alt="No tasks illustration"
                className="w-60 h-60 mb-6 opacity-80"
              />
              <h3 className="text-xl font-semibold text-gray-700">No Mini Tasks Posted Yet</h3>
              <p className="text-gray-500 mb-4">Start by posting a new task and manage it here.</p>
              <a
                href="/post/mini_task"
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Post a Mini Task
              </a>
            </div>
          ) : (
            <>
              {currentTasks.map((task) => (
                <div className="task-card" key={task._id}>
                  <h3>{task.title}</h3>
                  <p className="task-status">
                    Status: <span className={`mini-task-status-badge ${task.status.toLowerCase()}`}>{task.status}</span>
                  </p>
                  <p>
                    Assigned To: <span className="assigned-user">{task.assignedTo?.name || "Not Assigned"}</span>
                  </p>
                  <span className="text-sm text-gray-500">
                    {task.applicants?.length || 0} applicant(s)
                  </span>
                  <div className="task-actions">
                    <button onClick={() =>{ setSelectedTask(task); setIsViewModalOpen(true);}}> View </button>
                    <button onClick={() => { setSelectedTask(task); setPanelVisible(true); }}>Edit</button>
                    <button onClick={() => handleDeleteTask(task._id)} disabled={isProcessing}>Delete</button>
                    <button onClick={() => handleViewApplicants(task._id)}>View Applicants</button>
                    <button onClick={() => {
                      if (task.applicants?.length > 0) {
                        setCurrentTask(task);
                        setIsAssignModalOpen(true);
                      } else {
                        alert("No applicants to assign");
                      }
                    }}>Assign</button>
                    {/* --- New Change Status Button --- */}
                  {editingStatusTaskId === task._id ? (
                <div className="flex flex-col items-start gap-2 mt-2">
                  <select
                 value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                    className="border rounded px-2 py-1"
               >
                    <option value="">Select Status</option>
                   <option value="Open">Open</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Closed">Closed</option>
                    <option value="Completed">Completed</option>
                 </select>
              <div className="flex gap-2">
              <button 
               onClick={() => handleStatusUpdate(task)} 
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                disabled={isProcessing}
               >
              Save
            </button>
            <button 
              onClick={() => setEditingStatusTaskId(null)} 
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
               ) : (
                 <button 
              onClick={() => { setEditingStatusTaskId(task._id); setNewStatus(task.status); }}
              >
               Change Status
            </button>
              )}
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="pagination-controls flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
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

        {/* Applicants Modal */}
       {/* <ApplicantsModal
          applicants={currentTask?.applicants || []}
          isOpen={isApplicantsModalOpen}
          onClose={() => setIsApplicantsModalOpen(false)}
        /> */}

        {/* Assign Applicant Modal */}
        <AssignApplicantModal
          task={currentTask}
          applicants={currentTask?.applicants || []}
          onAssign={(id, name) => handleAssignApplicant(currentTask._id, id, name)}
          onClose={() => setIsAssignModalOpen(false)}
          isOpen={isAssignModalOpen}
        />
      </div>

      <ProcessingOverlay show={isProcessing} message="Processing your request..." />
    </div>
  );
};

export default ManageMiniTasks;
