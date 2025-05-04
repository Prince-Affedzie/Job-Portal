const express = require('express')
const adminRouter = express.Router()
const {verify_token} =require('../MiddleWare/VerifyToken')

const {adminSignup,adminLogin,adminLogout,adminEditProfile,removeJob, adminProfile,modifyUserInfo,
    getAllUsers,getSingleUser,removeUser,getAllJobs,getSingleJob,controlJobStatus,upDateJob,getAllEmployerProfiles,
    getSingleEmployerProfile,modifyEmployerProfile,deleteEmployerProfile,
} = require('../Controllers/AdminController')

adminRouter.post('/admin/signUp',adminSignup)
adminRouter.post('/admin/logout',adminLogin)
adminRouter.post('/admin/logout',adminLogout)
adminRouter.get('/admin/get_profile',verify_token, adminProfile)
adminRouter.put('/admin/edit_profile',verify_token,adminEditProfile)
adminRouter.get('/get/all_users', getAllUsers)
adminRouter.get('/admin/get_single_user/:Id',getSingleUser)
adminRouter.put('/admin/modify_user_info/:Id',modifyUserInfo)
adminRouter.delete('/admin/remove_user/:Id',removeUser)
adminRouter.get('/admin/get_all_jobs',getAllJobs)
adminRouter.get('/admin/get_single_job/:Id',getSingleJob)
adminRouter.put('/admin/change_job_status/:Id',controlJobStatus)
adminRouter.put('/admin/update_job/:Id',upDateJob)
adminRouter.delete('/admin/remove_job/:Id',removeJob)
adminRouter.get('/admin/get_employers/profiles',getAllEmployerProfiles)
adminRouter.get('/admin/get_single_employer/profile/:Id',getSingleEmployerProfile)
adminRouter.put('/admin/update_employer_profile/:Id',modifyEmployerProfile)
adminRouter.delete('/admin/delete_employer/profile/:Id',deleteEmployerProfile)

module.exports = {adminRouter}