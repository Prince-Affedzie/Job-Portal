import { API } from '../apiConfig';

// Admin management
export const getAllUsers = () => API.get('/api/get/all_users');
export const getAllJobs = () => API.get('/api/admin/get_all_jobs');
export const getAdminProfile = () => API.get('/api/admin/get_profile');
export const getSingleUser = (Id) => API.get(`/api/admin/get_single_user/${Id}`);
export const adminAddUser = (data) => API.post('/api/admin/add_new_user', data);
export const modifyUserInfo = (Id, data) => API.put(`/api/admin/modify_user_info/${Id}`, data);
export const removeUser = (Id) => API.delete(`/api/admin/remove_user/${Id}`);

export const getSingleJobInfo = (Id) => API.get(`/api/admin/get_single_job/${Id}`);
export const modifyJobStatus = (Id, state) => API.put(`/api/admin/change_job_status/${Id}`, state);
export const adminAddJob = (data) => API.post('/api/admin/add_job', data);
export const deleteJob = (Id) => API.delete(`/api/admin/remove_job/${Id}`);
export const updateJobByAdmin = (Id, update) => API.put(`/api/admin/update_job/${Id}`, update);

export const getEmployersProfiles = () => API.get('/api/admin/get_employers/profiles');
export const getSingleEmployerProfile = (Id) => API.get(`/api/admin/get_single_employer/profile/${Id}`);
export const updateEmployerStatus = (Id, update) => API.put(`/api/admin/update_employer_profile/${Id}`, update);
export const removeEmployerProfile = (Id) => API.delete(`/api/admin/delete_employer/profile/${Id}`);

export const getAllMiniTasks = () => API.get('/api/admin/get_all_mintasks');
export const getSingleMinitask = (Id) => API.get(`/api/admin/get_single_mintask/${Id}`);
export const modifyMiniTaskStatus = (Id, status) => API.put(`/api/admin/modify_mini_task_status/${Id}`, status);
export const adminDeleteMiniTask = (Id) => API.delete(`/api/admin/delete_mini_task/${Id}`);
export const updateMiniTaskByAdmin = (Id, update) => API.put(`/api/admin/modify_mini_task/${Id}`, update);

export const getAllDisputes = () => API.get('/api/admin/get_disputes');
export const resolveDispute = (disputeId, updatePayload) => API.put(`/api/admin/disputes/${disputeId}/resolve`, updatePayload);

export const fetchAllAlerts = () => API.get('/api/admin/all_alerts');
export const markAllAlertAsRead = (alerts) => API.put('/api/admin/alerts/mark-all-read', { ids: alerts });
export const markAlertAsRead = (Id) => API.put(`/api/admin/alerts/${Id}/read`);



export const dashboardStatistics = () =>API.get('/api/dashboard/stats')
export const dashboardActivity = () =>API.get('/api/dashboard/activity')
export const dashboardCategory = () =>API.get('/api/dashboard/categories')
export const recentMicroJobs = ()=>API.get('/api/dashboard/recent-microjobs')


export const getUserGrowthStats = () =>API.get('/api/admin/users/stats')
export const getUserGrowthTrend = () =>API.get('/api/admin/users/trend')
export const getUserDemographics = () =>API.get('/api/admin/users/demographics')

export const getAllTaskers = ()=>API.get('/api/admin/get_all_taskers')
