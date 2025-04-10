const mongoose = require("mongoose")
const schema = mongoose.Schema

const jobSchema = new schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required:true
    },
    category:{
        type :String,
       
        enum: ["Administration",'Banking',,'Development','Marketing','Software Development','Administrative Assistance','Sales','Accounting','Information Technology','Health','Education','Design']
    },
    jobType:{
        type:String,
        enum:['Full-Time','Part-Time','Mini-Task','Errands','Contract','Freelance','Volunteer'],
        required: true,
    },
    industry:{
        type:String

    },
    company:{
          type:String
    },
    deliveryMode:{
        type:String,
        enum:['In-Person','Remote','Hybrid']
    },
    location:{
        region:String,
        city:String,
        street:String

    },
    employerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    paymentStyle:{
        type: String,
        required:true,
        enum:['Fixed','Range','Negotiable','hourly','Monthly']
    },
    salary:{
        type: String,
        required:true
    },
    skillsRequired:[{
        type: String
    }],
    experienceLevel:{
        type: String,
        enum:["Entry","Intermediate","Senior"]
    },
    responsibilities:[{
        type: String
    }],
    deadLine:{
        type: Date
    },
    status:{
        type: String,
        enum:['Opened','Closed','Filled'],
        default:"Opened"
    },
    noOfApplicants:{
           type: Number,
           default:0
    },
    applicantsId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:[]  
    }],
    jobTags:[
        
       String
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

const JobModel = mongoose.model("JOb",jobSchema)
module.exports ={JobModel}