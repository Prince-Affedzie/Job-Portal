const { ApplicationModel } = require("../Models/ApplicationModel")
const {JobModel} = require("../Models/JobsModel")

const addJob = async(req,res)=>{

    try{
        const {id} = req.user
        const {title,description,category,jobType,industry,deliveryMode,company,
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

        const applications = await ApplicationModel.find({job:Id}).populate("user","name","email","skills","education")
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
    try{
        const {Id} = req.params
        const status = req.body
        console.log(status)
        const application = await ApplicationModel.findById(Id)
        if(!application){
            return res.status(404).json({message:"Application not Found"})
        }
        Object.assign(application,status)
        await application.save()
        res.status(200).json({message:"Application Modified Successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}







module.exports = {addJob,editJob,deleteJob,modifyApplication,viewSingleApplication,viewJob,
    getAllPostedJobs,viewJobApplications,jobSearch,jobSearchFilter,viewAllApplications,modifyJobStatus}