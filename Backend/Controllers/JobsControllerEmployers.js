const { ApplicationModel } = require("../Models/ApplicationModel")
const {JobModel} = require("../Models/JobsModel")
const {NotificationModel} = require("../Models/NotificationModel")

let socketIo =null

function setSocketInstance(ioInstance){
    socketIo = ioInstance
}

const addJob = async(req,res)=>{

    try{
        const {id} = req.user
        const {title,description,category,jobType,industry,deliveryMode,company, companyEmail,
            location,paymentStyle, salary,skillsRequired,experienceLevel,responsibilities, deadLine,tags} = req.body
            console.log(req.body)
        const job = new JobModel({
            title:title,
            description: description,
            category:category,
            jobType:jobType,
            industry:industry,
            deliveryMode:deliveryMode,
            location:location,
            paymentStyle:paymentStyle,
            salary:salary,
            skillsRequired:skillsRequired,
            experienceLevel:experienceLevel,
            responsibilities:responsibilities,
            deadLine:deadLine,
            employerId:id,
            company:company,
            companyEmail:companyEmail,
            jobTags:tags
        })
        await job.save()
        res.status(200).json({message:"Job Added Successfully"})

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error"})
    }

}

const editJob = async(req,res)=>{
    try{
        const {Id} = req.params
        const update = req.body
        const job = await JobModel.findById(Id)
        if(!job){
            return res.status(404).json({message:"Job not Found"})
        }
        Object.assign(job,update)
        await job.save()
        res.status(200).json({message:"Job Update Successful"})


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const deleteJob = async(req,res)=>{
    try{
        const {Id} =req.params
        const job = await JobModel.findById(Id)
        if(!job){
            return res.staus(404).json({message:"Job not Found"})
        }
        await job.deleteOne()
        res.status(200).json({message:"Job Deleted Successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const modifyJobStatus =async(req,res)=>{
    try{
        const {Id} = req.params
        const {state} = req.body
        console.log({state})
        const job = await JobModel.findById(Id)
        if(!job){
            return res.status(404).json({message:"Job not Found"})
        }
        job.status = state
        job.save()
        return res.status(200).json({message:"Job status changed successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server error"})
    }
}

const getAllPostedJobs =async(req,res)=>{
    try{
        const {id} =req.user
        const jobs = await JobModel.find({employerId:id}).populate("applicantsId").sort({createdAt:-1})
        res.status(200).json(jobs)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const viewJob = async(req,res)=>{
    try{
        const {Id} = req.params
        console.log(Id)
        const job = await JobModel.findById(Id)
        if(!job){
            return res.status(404).json({message:"Job not Found"})
        }
        res.status(200).json(job)


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}


const jobSearch = async(req,res)=>{
    try{
        const {term} = req.query
        const jobs = await JobModel.find({

            $or:[
                {title:{$regex:term, $options:'i'}},
                {description:{$regex:term,$options:'i'}}
            ]

            
        })
        res.status(200).json(jobs)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}


const jobSearchFilter = async(req,res)=>{
    try{
        const {term} = req.query
        if(!term){
            return res.status(400).json({message:"Search term Can't be empty"})
        }

        const jobs = await JobModel.find({
            $or:[
                {category:{$regex:term,$options:"i"}},
                { jobType:{$regex:term,$options:'i'}}
            ]
        })
        res.status(200).json(jobs)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const viewAllApplications = async(req,res)=>{
    try{
        const {id} =req.user
        const applications = await ApplicationModel.find({reviewer:id}).populate("user")
        .populate("job").sort({createdAt:-1})
        res.status(200).json(applications)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}
const viewJobApplications = async(req,res)=>{
    try{
        const {Id} = req.params

        const applications = await ApplicationModel.find({job:Id}).populate({
           path: 'user',
           select: 'name email phone education skills workExperience profileImage location ' 
       })
      .populate({
        path :'job',
        select:'title noOfApplicants status salary createdAt deliveryMode'
        }).exec()

       
        res.status(200).json(applications)


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const viewSingleApplication = async(req,res)=>{
    try{
         const {Id} = req.params
         const application = await ApplicationModel.findById(Id).populate("users","name","email","skills","education")
         if(!application){
            return res.status(404).json({message:"Application not Found"})
         }
         res.status(application)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const modifyApplication =async(req,res)=>{

 let notification = null 

    try{
        const {Id} = req.params
        const status = req.body
       
        const application = await ApplicationModel.findById(Id).populate({
            path:"job",
            select:'title'
        })
       
        if(!application){
            return res.status(404).json({message:"Application not Found"})
        }

       
        if(req.body.status === "Shortlisted"){

            notification = new NotificationModel({
                user:application.user,
                message:`Congratulations! You've been shortlisted For this Job: "${application.job.title}". Please contact the employer for more details.`,
                title:"Application Short Listing"
            })

        }else if(req.body.status === "Rejected"){
            notification = new NotificationModel({
                user:application.user,
                message:`Sorry! You're application For this Job Has Been Rejected: "${application.job.title}". `,
                title:"Application REejection"
            })
        }else if(req.body.status === "Interview"){
            notification = new NotificationModel({
                user:application.user,
                message:`Congratulations! You've been invited to an Interview For this Job: "${application.job.title}". Please contact the employer for more details.`,
                title:"Invite For An Interview"
            })
        }
        
        if (notification){

            await notification.save()
            if(socketIo){
                console.log("I'm alive")
            
                socketIo.to(application.user.toString()).emit('notification',notification)
            }else {
                console.warn("SocketIO is not initialized!");
            }

        }
        Object.assign(application,status)
        await application.save()
        res.status(200).json({message:"Application Modified Successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const interviewController = async(req,res)=>{
    let notification
    try{
        const {Id} = req.params
        const {interviewState} = req.body
       
        const application = await ApplicationModel.findById(Id).populate({
            path:"job",
            select:'title'
        })
       
        if(!application){
            return res.status(400).json({message:"Application not found"})
        }
        application.inviteForInterview = interviewState
         if(interviewState === true){
             notification = new NotificationModel({
                user:application.user,
                message:`Congratulations! You've been invited to an Interview For this Job: "${application.job.title}". Please contact the employer for more details.`,
                title:"Invite For An Interview"
            })
         }else{
             notification = new NotificationModel({
                user:application.user,
                message:`Sorry! Your Interview Invitation For this Job: "${application.job.title}" has been Canceled. Please contact the employer for more details.`,
                title:"Interview Invitation Cancellation"
            })
         }
        
        
        if(socketIo){
            
            socketIo.to(application.user.toString()).emit('notification',notification)
        }else {
            console.warn("SocketIO is not initialized!");
        }

        await application.save()
        await notification.save()
       
        res.status(200).json({message:"Applicants Invited for Interview"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }

}







module.exports = {addJob,editJob,deleteJob,modifyApplication,viewSingleApplication,viewJob,
    getAllPostedJobs,viewJobApplications,jobSearch,jobSearchFilter,viewAllApplications,modifyJobStatus,interviewController,setSocketInstance}