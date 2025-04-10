const express = require("express")
const employerRoute = express.Router()
const verifyEligibility = require("../MiddleWare/EligibilityVerification.js")
const {verify_token}= require('../MiddleWare/VerifyToken.js')
const {addJob,editJob,deleteJob,modifyApplication,viewSingleApplication,viewJob,modifyJobStatus,
    getAllPostedJobs,viewJobApplications,jobSearch,jobSearchFilter,viewAllApplications} = require('../Controllers/JobsControllerEmployers.js')


employerRoute.post("/h1/v1/add_job",verify_token,verifyEligibility,addJob)
employerRoute.put("/h1/v1/update_job/:Id",verify_token,editJob)
employerRoute.delete("/h1/v1/delete_job/:Id",verify_token,deleteJob)
employerRoute.get('/h1/v1/get_created/jobs',verify_token,getAllPostedJobs)
employerRoute.get('/h1/v1/view_job/applications/:Id',verify_token,viewJobApplications)
employerRoute.get('/h1/v1/view_all/applications',verify_token,viewAllApplications)
employerRoute.get('/h1/v1/view_application/:Id',verify_token,viewSingleApplication)
employerRoute.put('/h1/v1/modify/application/:Id',verify_token,modifyApplication)
employerRoute.get("/h1/v1/view_job/:Id",verify_token,viewJob)
employerRoute.put('/h1/v1/modify/job_status/:Id',verify_token,modifyJobStatus)



module.exports = {employerRoute}
