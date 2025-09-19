import axios from "axios"
const BackendURL = process.env.REACT_APP_BACKEND_URL
const API = axios.create({baseURL:process.env.REACT_APP_BACKEND_URL,withCredentials:true,timeout: 10000, })
export const signUp =(data)=>API.post("/api/user/signup",data)
export const requestPasswordReset = (email)=>API.post("/api/user/request-password-reset",{email:email})
export const verifyResetToken = ()=>API.post()
export const resetPassword = (password)=>API.post('/api/user/reset-password',{password:password})
export const loginUser =(data)=>API.post("/api/user/login",data)
export const logoutUser =()=>API.post('/api/user/logout')
export const completeProfile = (data)=>
  API.put("/api/user/edit_profile",data,{
  headers: {
    'Content-Type': 'multipart/form-data',
  },})

export const fetchUser =()=>API.get("/api/user/view_profile")
export const modifyProfile = (formData) => 
    API.put("/api/user/edit_profile", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });


export const uploadImage = (file) => {
    
    const form = new FormData();
    form.append("profileImage", file);
    for (let pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    return API.put("/api/user/image_profile", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

export const addPortfolio = (data)=>API.post("/api/user/upload_portfolio",data)
  
export const authenticateChat =(targetUserId) =>API.post("/api/user/athenticate",{targetUserId:targetUserId})
export const createNotification =(data)=>API.post('/api/notifications',data)
export const getNotifications = ()=>API.get('/api/notifications')
export const markNotificationAsRead =(ids)=>API.put(`/api/mark_notifications/read`,ids)


// Job Handling APIs

export const addJob = (data)=>API.post("/api/h1/v1/add_job",data)
export const getJobs = (filters)=>API.get("/api/h1/v2/job_list",{params:filters})
export const getJobDetails = (Id)=>API.get(`/api/h1/v2/view_details/${Id}`)
export const applyToJob =(data,Id)=>API.post(`/api/h1/v2/apply/${Id}`,data, {headers: {
    "Content-Type": "multipart/form-data",
}})
export const getRecentApplications =()=>API.get("/api/h1/v2/get/recent_applications")

//Mini Task APIs
export const postMiniTask =(data)=>API.post("/api/h1/v2/post_mini_task",data)
export const getMiniTasks = (filters)=>API.get('/api/h1/v2/get/mini_tasks',{params:filters})
export const applyToMiniTask =(Id)=>API.post(`/api/h1/v2/mini_task/apply/${Id}`)
export const bidOnMiniTask =(Id,bidData)=>API.post(`/api/h1/v2/mini_task/apply/${Id}`,bidData)
export const getMiniTasksposted =()=>API.get("/api/h1/v2/get_created/mini_tasks")
export const deleteMiniTask=(Id)=>API.delete(`/api/h1/v2/delete/mini_task/${Id}`)
export const updateMiniTask =(Id,data) =>API.put(`/api/h1/v2/edit/mini_task/${Id}`,{body:data})
export const assignApplicantToTask =(taskId,applicantId)=>API.put(`/api/h1/v2/assign/mini_task/${taskId}/${applicantId}`)
export const getYourAppliedMiniTasks =()=>API.get("/api/h1/v2/get_your_applied/mini_tasks")
export const getMiniTaskInfo = (Id)=>API.get(`/api/h1/v2/get_min_task_info/${Id}`)
export const acceptMiniTaskAssignment = (Id)=>API.put(`/api/h1/v2/accept_task_assignment/${Id}`)
export const rejectMiniTaskAssignment =(Id)=>API.put(`/api/h1/v2/reject_task_assignment/${Id}`)
export const removeAppliedMiniTaskFromDashboard = (Ids)=>API.put('/api/h1/v2/remove_mini_task_from_dashboard',Ids)
export const submitWorkForReview = (taskId,data)=>API.post(`/api/submit_task_work/${taskId}`,data)
export const getMyWorkSubmissions = (taskId)=>API.get(`/api/get_mysubmissions/${taskId}`)
export const deleteWorkSubmission = (submissionId)=>API.delete(`/api/delete/submission/${submissionId}`)
export const clientgetTaskSubmissions = (taskId)=>API.get(`/api/view_task_submissions/${taskId}`)
export const reviewSubmission = (submissionId,data)=>API.put(`/api/review_task_submission/${submissionId}`,data)
export const getSignedUrl =(data)=>API.post('/api/submissions/upload-url',data)
export const addReportingEvidence=(data)=>API.post('/api/create/reporting/evidence',data)
export const getPreviewUrl =(fileKey,selectedSubmission)=> API.get(`/api/get_preview_url?fileKey=${encodeURIComponent(fileKey)}&selectedSubmission=${encodeURIComponent(selectedSubmission)}`);
export const raiseDispute = (reportForm)=>API.post('/api/create_dispute',reportForm)
export const sendFileToS3 = async (uploadURL, file,onProgress) => {
  await fetch(uploadURL, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    },
    onUploadProgress: onProgress
  });
};
export const getMicroTaskApplicants=(Id)=>API.get(`/api/h1/v2/get_applicants/my_micro_task/${Id}`)
export const getMicroTaskBids=(Id)=>API.get(`/api/h1/v2/get_bids/my_micro_task/${Id}`)
export const acceptBidForTask =(taskId,bidId)=>API.put(`/api/h1/v2/accept_bid/mini_task/${taskId}/${bidId}`)


//Chat Mesaging APIs
export const startOrGetChatRoom = (data)=>API.post('/api/start/chat_room',data)
export const getAllChatRooms = ()=>API.get('/api/get/messages/rooms')
export const fetchRoomMessages =(roomId, cursor)=>API.get(`/api/get/chat_room_messages/${roomId}${cursor ? `?cursor=${cursor}` : ''}`)
export const createMessage = (data)=>API.post('/api/send/message',data)
export const handleChatFiles = (data)=>API.post('/api/handle/chat_files',data)

export const fetchRoomInfo =(roomId)=>API.get(`/api/get_room_info/${roomId}`)

// Employer APIs
export const employerSignUp = (data)=>API.post('/api/h1/v1/employer_sign_up',data,
  {headers: {
  "Content-Type": "multipart/form-data",
}})
export const getPostedJobs = ()=>API.get('/api/h1/v1/get_created/jobs')
export const getAllApplications =()=>API.get("/api/h1/v1/view_all/applications")
export const getSpecificJobApplications =(Id)=>API.get(`/api/h1/v1/view_job/applications/${Id}`)
export const getJobById =(Id)=>API.get(`/api/h1/v1/view_job/${Id}`)
export const modifyJob = (Id,data) =>API.put(`/api/h1/v1/update_job/${Id}`,data)
export const removeJob =(Id) => API.delete(`/api/h1/v1/delete_job/${Id}`)
export const modifyJobState=(Id,state)=>API.put(`/api/h1/v1/modify/job_status/${Id}`,state)
export const modifyApplication = (payload)=>API.put(`/api/h1/v1/modify/application`,payload)
export const manageInterviewInvite =(Id,interviewState)=>API.put(`/api/h1/v1/interview_invite/${Id}`,{interviewState:interviewState})
export const scheduleAnInterview = (data)=>API.post('/api/h1/v1/create_interview_invite',data)
export const getEmployerProfile = ()=>API.get('/api/h1/v1/get_employer_profile')


//Admin Api 
export const adminLogin = (data)=>API.post(`/api/admin/login`,data)
export const getAllUsers = ()=>API.get('/api/get/all_users')
export const getAllJobs = ()=>API.get('/api/admin/get_all_jobs')
export const getAdminProfile = ()=>API.get('/api/admin/get_profile')
export const getSingleUser =(Id)=>API.get(`/api/admin/get_single_user/${Id}`)
export const adminAddUser = (data)=>API.post('/api/admin/add_new_user',data)
export const modifyUserInfo=(Id,data)=>API.put(`/api/admin/modify_user_info/${Id}`,data)
export const removeUser = (Id)=>API.delete(`/api/admin/remove_user/${Id}`)

export const getSingleJobInfo = (Id)=>API.get(`/api/admin/get_single_job/${Id}`)
export const modifyJobStatus = (Id,state)=>API.put(`/api/admin/change_job_status/${Id}`,state)
export const adminAddJob =(data)=>API.post('/api/admin/add_job',data)
export const deleteJob = (Id)=>API.delete(`/api/admin/remove_job/${Id}`)
export const updateJobByAdmin =(Id,update)=>API.put(`/api/admin/update_job/${Id}`,update)
export const getEmployersProfiles = ()=>API.get('/api/admin/get_employers/profiles')
export const getSingleEmployerProfile =(Id)=>API.get(`/api/admin/get_single_employer/profile/${Id}`)
export const updateEmployerStatus =(Id,update)=>API.put(`/api/admin/update_employer_profile/${Id}`,update)
export const removeEmployerProfile = (Id)=>API.delete(`/api/admin/delete_employer/profile/${Id}`)

export const getAllMiniTasks = ()=>API.get('/api/admin/get_all_mintasks')
export const getSingleMinitask = (Id)=>API.get(`/api/admin/get_single_mintask/${Id}`)
export const modifyMiniTaskStatus = (Id,status)=>API.put(`/api/admin/modify_mini_task_status/${Id}`,status)
export const adminDeleteMiniTask =(Id)=>API.delete(`/api/admin/delete_mini_task/${Id}`)
export const updateMiniTaskByAdmin =(Id,update) =>API.put(`/api/admin/modify_mini_task/${Id}`,update)
export const getAllDisputes = ()=>API.get('/api/admin/get_disputes')
export const resolveDispute =(disputeId,updatePayload)=>API.put(`/api/admin/disputes/${disputeId}/resolve`,updatePayload)

export const fetchAllAlerts = ()=>API.get('/api/admin/all_alerts')
export const markAllAlertAsRead = (alerts)=>API.put('/api/admin/alerts/mark-all-read',{ids:alerts})
export const markAlertAsRead = (Id)=>API.put(`/api/admin/alerts/${Id}/read`)