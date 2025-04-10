import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMiniTasksposted, deleteMiniTask, updateMiniTask, assignApplicantToTask } from "../APIS/API";
import ViewTaskModal from "../Components/MiniTaskManagementComponents/ViewTaskModal";
import ApplicantsModal from "../Components/MiniTaskManagementComponents/ApplicantsModal";
import AssignApplicantModal from "../Components/MiniTaskManagementComponents/AssignApplicantsModal";
import EditMiniTaskForm from "../Components/MiniTaskManagementComponents/EditMiniTaskForm";
import Navbar from "../Components/Navbar";
import "../Styles/ManageMiniTasks.css";

const ManageMiniTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);

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
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    if (!updatedTask || !updatedTask._id) {
      console.error("❌ No ID in updatedTask", updatedTask);
      return;
    }
    try {
      console.log("⏳ Calling API with:", updatedTask);
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
    }
  };

  const handleAssignApplicant = async (taskId, applicantId) => {
    try {
      const updatedTask = await assignApplicantToTask(taskId, applicantId);
      if (updatedTask.status === 200) {
        toast.success(`Mini Task Assigned To ${applicantId}`);
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
    <div>
      <ToastContainer />
      <Navbar />
      <div className={`manage-tasks-container ${panelVisible ? "shifted" : ""}`}>
        <h2>Your Mini Tasks</h2>
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
            tasks.map((task) => (
              <div className="task-card" key={task._id}>
                <h3>{task.title}</h3>
                <p>Status: {task.status}</p>
                <p>
                  Assigned To: <span className="assigned-user">{task.assignedTo?.name || "Not Assigned"}</span>
                </p>
                <div className="task-actions">
                  <button onClick={() => { setSelectedTask(task); setIsViewModalOpen(true); }}>View</button>
                  <button onClick={() => { setSelectedTask(task); setPanelVisible(true); }}>Edit</button>
                  <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                  <button onClick={() => {
                    if (task.applicants?.length > 0) {
                      setCurrentTask(task);
                      setIsApplicantsModalOpen(true);
                    } else {
                      alert("No applicants yet");
                    }
                  }}>View Applicants</button>
                  <button onClick={() => {
                    if (task.applicants?.length > 0) {
                      setCurrentTask(task);
                      setIsAssignModalOpen(true);
                    } else {
                      alert("No applicants to assign");
                    }
                  }}>Assign</button>
                </div>
              </div>
            ))
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
        <ApplicantsModal
          applicants={currentTask?.applicants || []}
          isOpen={isApplicantsModalOpen}
          onClose={() => setIsApplicantsModalOpen(false)}
        />

        {/* Assign Applicant Modal */}
        <AssignApplicantModal
          task={currentTask}
          applicants={currentTask?.applicants || []}
          onAssign={(applicantId) => handleAssignApplicant(currentTask._id, applicantId)}
          onClose={() => setIsAssignModalOpen(false)}
          isOpen={isAssignModalOpen}
        />
      </div>
    </div>
  );
};

export default ManageMiniTasks;
