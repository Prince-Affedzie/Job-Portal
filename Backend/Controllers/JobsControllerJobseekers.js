const {JobModel} = require('../Models/JobsModel')
const {ApplicationModel} = require("../Models/ApplicationModel")
const {MiniTask} =require("../Models/MiniTaskModel")
const { UserModel } = require('../Models/UserModel')


const allJobs = async(req,res)=>{
    try{
        let query = {}
        const {category,search,type} = req.query

        if(search){
            query.$or = [
                {title:{$regex:search,$options:'i'}},
                {description:{$regex:search,$options:'i'}}
            ]
        }
        if(category && category !=="All Categories"){
           query.category =category
        }
        if(type && type!== "All Types"){
            query.jobType = type
        }
        console.log("Generated Query:", JSON.stringify(query, null, 2));
        const jobs = await JobModel.find(query).limit(100).sort({createdAt:-1})
        
        res.status(200).json(jobs)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const viewJob = async(req,res)=>{
    try{
        const {Id} =req.params
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

const applyToJob = async(req,res)=>{
      const {id} = req.user
      const{Id} = req.params
      const {coverLetter} = req.body
      console.log("Body ",req.body)
      console.log("file ",req.file)
      const resume = req.file?req.file.filename: ''
      console.log(req.body)
      console.log(resume)
    try{

        const job = await JobModel.findById(Id)

        if (!job || job.status === "Closed"){
            return res.status(400).json({message:"Application Closed For this Job"})
        }

        const hasAlreadyApplied = job.applicantsId.some(Id=>{
            return Id.equals(id)
        })
        console.log(hasAlreadyApplied)
        if(hasAlreadyApplied){
            return res.status(400).json({message:"You have already Applied to this job"})
        }

        const application = new ApplicationModel({
           user:id,
           job:Id,
           coverLetter:coverLetter,
           resume:resume,
           reviewer:job.employerId
        })
        
         await UserModel.findOneAndUpdate(
            {'_id':id},
            { $push: { appliedJobs: Id } }, 
            { new: true } // Returns the updated document
        )
        
        
        job.noOfApplicants = job.noOfApplicants + 1
        job.applicantsId.push(id)
        await application.save()
        await job.save()
        res.status(200).json({message:"Job Application Successful"})
             
      
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const viewAllApplications = async(req,res)=>{
    try{
         const {id} = req.user
         const jobsApplied = await ApplicationModel.find({user:id}).populate('job').sort({createdAt:-1})
         res.status(200).json(jobsApplied)   
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})    
    }
}

const viewApplication = async(req,res)=>{
    try{
         const {Id} = req.params
         const application = await ApplicationModel.findById(Id)
         if(!application){
            return res.status(404).json({message:"Application not found"})
         }
         res.status(200).json(application)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}


const postMiniTask = async(req,res)=>{
    try{
        const {id} =req.user
        const { title, description, budget, deadline, locationType,address,category,subcategory,skillsRequired} = req.body;
        
        if (!title || !description || !budget || !deadline || !locationType) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }

        const newTask = new MiniTask({
            title,
            description,
            employer:id,
            budget,
            deadline,
            address,
            locationType,
            category,
            subcategory,
            skillsRequired,
            
        });
        await newTask.save()
        return res.status(200).json({message:"Task Created Successfully"})


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server Error"})
    }
}

const assignMiniTask =async(req,res)=>{
    try{
        const {taskId,applicantId} =req.params
        console.log(taskId)
        console.log(applicantId)
        const miniTask = await MiniTask.findById(taskId)
        if(!miniTask){
            return res.status(404).json({message:"Task not Found"})
        }
        miniTask.assignedTo = applicantId
        await miniTask.save()
        res.status(200).json({message:"Task Assigned Successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getMiniTasks = async(req,res)=>{
    try{
        let query ={}
        
        const {search,category,subcategory} = req.query
        if(category && category !== "All Categories"){
            query.category = category
        }
        if(subcategory && subcategory !== "All Subcategories"){
            query.subcategory = subcategory
        }
        
        if(search){

            query.$or =[
                {title:{$regex:search,$options:'i'}},
                {description:{$regex:search,$options:'i'}}
            ]

        }
        console.log(query)
        const miniTasks = await MiniTask.find(query).sort({createdAt:-1}).populate("employer","name phone")
        res.status(200).json(miniTasks)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})

    }
}

const applyToMiniTask = async(req,res)=>{
    try{
        const {id} =req.user
        const {Id} =req.params
        const miniTask = await MiniTask.findById(Id)
        if(!miniTask){
            return res.status(404).json({message:"Job not Found"})
        }
        if(!miniTask.applicants.includes(id)){
            miniTask.applicants.push(id)
            await miniTask.save()
            return res.status(200).json({message:"Application Successful"})
        }else{
            return res.status(400).json({message:"You've Already Applied to this Task"})
        }


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getRecentJobApplications  =async(req,res)=>{
    try{
        const {id} =req.user
        const applications = await ApplicationModel.find({user:id}).populate('job','title company status description').sort({createdAt:-1})
        return res.status(200).json(applications)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const getCreatedMiniTasks = async(req,res)=>{
    try{
        const {id} =req.user
        const minitasks = await MiniTask.find({employer:id}).populate("applicants")
        .populate("assignedTo")
        res.status(200).json(minitasks)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

const editMiniTask =async(req,res)=>{
    try{
        const {Id} = req.params
        const {body} = req.body
        console.log("Id: ",Id)
        console.log(body)
        const task = await MiniTask.findById(Id)
        if(!task){
            return res.status(400).json({message:"No Task Found"})
        }
        Object.assign(task,body)
        await task.save()
        res.status(200).json({message:"Mini Task Updated Successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}


const deleteMiniTask = async(req,res)=>{
    try{
        const {Id} = req.params
        console.log(Id)
        const task = await MiniTask.findById(Id)
        if(!task){
            return res.status(400).json({message:"Task not found"})
        }
        await task.deleteOne()
        res.status(200).json({message:"Task Deleted Successfully"})

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}


module.exports = {viewJob,viewAllApplications,viewApplication,applyToJob,jobSearch,
    jobSearchFilter,allJobs,postMiniTask,assignMiniTask,getMiniTasks,applyToMiniTask,
    getRecentJobApplications,getCreatedMiniTasks,editMiniTask,deleteMiniTask}