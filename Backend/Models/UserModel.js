const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required:false,
        default:null
    },
    role:{
        type:String,
        enum:["job_seeker", "employer", "admin"],
        required:true

    },
    skills:[
        {
            type:String,
             default:[]

        }
    ],
    education:[{
        degree: String,
        institution: String,
        yearOfCompletion: Number     
    }],

    workExperience:[{
        jobTitle: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String

    }],
    profileImage:{
        type:String
    },
    Bio:{
        type: String
    },
    location:{
        region:String,
        city: String,
        town : String,
        street: String
    },
    appliedJobs:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"jobs"
    }],
    profileCompleted: {
        type: Boolean,
        default: false
    },
    businessName:{
        type: String,
        default:null
    },
    businessRegistrationProof:{
          type: String,
          default:null
    },
    businessVerified:{
        type: Boolean,
        default:false
    },
    miniTaskEligible:{
        type: Boolean,
        default:false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified:{
         type:Boolean,
         default:false
    }

},{timestamps:true})

const UserModel = mongoose.model("User",userSchema)
module.exports = {UserModel}