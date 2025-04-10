import axios from "axios"

const API = axios.create({baseURL:"http://localhost:5000",withCredentials:true,})
export const signUp =(data)=>API.post("/api/user/signup",data)
export const loginUser =(data)=>API.post("/api/user/login",data)
export const completeProfile = (data)=>API.put("/api/user/edit_profile",data)
export const fetchUser =()=>API.get("/api/user/view_profile")
export const modifyProfile =(data)=>API.put("/api/user/edit_profile",data)


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
export const getMiniTasksposted =()=>API.get("/api/h1/v2/get_created/mini_tasks")
export const deleteMiniTask=(Id)=>API.delete(`/api/h1/v2/delete/mini_task/${Id}`)
export const updateMiniTask =(Id,data) =>API.put(`/api/h1/v2/edit/mini_task/${Id}`,{body:data})
export const assignApplicantToTask =(taskId,applicantId)=>API.put(`/api/h1/v2/assign/mini_task/${taskId}/${applicantId}`)


// Employer APIs
export const getPostedJobs = ()=>API.get('/api/h1/v1/get_created/jobs')
export const getAllApplications =()=>API.get("/api/h1/v1/view_all/applications")
export const getJobById =(Id)=>API.get(`/api/h1/v1/view_job/${Id}`)
export const modifyJob = (Id,data) =>API.put(`/api/h1/v1/update_job/${Id}`,data)
export const removeJob =(Id) => API.delete(`/api/h1/v1/delete_job/${Id}`)
export const modifyJobState=(Id,state)=>API.put(`/api/h1/v1/modify/job_status/${Id}`,state)
export const modifyApplication = (Id,status)=>API.put(`/api/h1/v1/modify/application/${Id}`,status)

