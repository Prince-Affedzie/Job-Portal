import { API } from '../apiConfig';
// Job posting and management
export const addJob = (data) => API.post("/api/h1/v1/add_job", data);
export const getJobs = (filters) => API.get("/api/h1/v2/job_list", { params: filters });
export const getJobDetails = (Id) => API.get(`/api/h1/v2/view_details/${Id}`);
export const getPostedJobs = () => API.get('/api/h1/v1/get_created/jobs');
export const getJobById = (Id) => API.get(`/api/h1/v1/view_job/${Id}`);
export const modifyJob = (Id, data) => API.put(`/api/h1/v1/update_job/${Id}`, data);
export const removeJob = (Id) => API.delete(`/api/h1/v1/delete_job/${Id}`);
export const modifyJobState = (Id, state) => API.put(`/api/h1/v1/modify/job_status/${Id}`, state);