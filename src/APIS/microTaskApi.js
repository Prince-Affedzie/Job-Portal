import { API } from '../apiConfig';

// Mini task management
export const postMiniTask = (data) => API.post("/api/h1/v2/post_mini_task", data);
export const getMiniTasks = (filters) => API.get('/api/h1/v2/get/mini_tasks', { params: filters });
export const applyToMiniTask = (Id) => API.post(`/api/h1/v2/mini_task/apply/${Id}`);
export const bidOnMiniTask = (Id, bidData) => API.post(`/api/h1/v2/mini_task/apply/${Id}`, bidData);
export const getMiniTasksPosted = () => API.get("/api/h1/v2/get_created/mini_tasks");
export const deleteMiniTask = (Id) => API.delete(`/api/h1/v2/delete/mini_task/${Id}`);
export const updateMiniTask = (Id, data) => API.put(`/api/h1/v2/edit/mini_task/${Id}`, { body: data });
export const assignApplicantToTask = (taskId, applicantId) => API.put(`/api/h1/v2/assign/mini_task/${taskId}/${applicantId}`);
export const getYourAppliedMiniTasks = () => API.get("/api/h1/v2/get_your_applied/mini_tasks");
export const getMiniTaskInfo = (Id) => API.get(`/api/h1/v2/get_min_task_info/${Id}`);
export const acceptMiniTaskAssignment = (Id) => API.put(`/api/h1/v2/accept_task_assignment/${Id}`);
export const rejectMiniTaskAssignment = (Id) => API.put(`/api/h1/v2/reject_task_assignment/${Id}`);
export const removeAppliedMiniTaskFromDashboard = (Ids) => API.put('/api/h1/v2/remove_mini_task_from_dashboard', Ids);
export const getMicroTaskApplicants = (Id) => API.get(`/api/h1/v2/get_applicants/my_micro_task/${Id}`);
export const getMicroTaskBids = (Id) => API.get(`/api/h1/v2/get_bids/my_micro_task/${Id}`);
export const acceptBidForTask = (taskId, bidId) => API.put(`/api/h1/v2/accept_bid/mini_task/${taskId}/${bidId}`);

// Mark Tasks as done
export const markTaskAsDoneTasker = (Id)=>API.put(`/api/h1/v2/mark_task_as_done/tasker/${Id}`)
export const markTaskAsDoneClient = (Id)=>API.put(`/api/h1/v2/mark_task_as_done/client/${Id}`)
export const unmarkTaskAsDoneTasker =(Id)=>API.put(`/api/h1/v2/mark_task__undone/tasker/${Id}`)
export const unmarkTaskAsDoneClient =(Id)=>API.put(`/api/h1/v2/mark_task__undone/client/${Id}`)

