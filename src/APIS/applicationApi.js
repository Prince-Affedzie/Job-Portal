import { API } from '../apiConfig';
// Job application management
export const applyToJob = (data, Id) => API.post(`/api/h1/v2/apply/${Id}`, data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const getRecentApplications = () => API.get("/api/h1/v2/get/recent_applications");
export const getAllApplications = () => API.get("/api/h1/v1/view_all/applications");
export const getSpecificJobApplications = (Id) => API.get(`/api/h1/v1/view_job/applications/${Id}`);
export const modifyApplication = (payload) => API.put(`/api/h1/v1/modify/application`, payload);
export const manageInterviewInvite = (Id, interviewState) => API.put(`/api/h1/v1/interview_invite/${Id}`, { interviewState });
export const scheduleAnInterview = (data) => API.post('/api/h1/v1/create_interview_invite', data);