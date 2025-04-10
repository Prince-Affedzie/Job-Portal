const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const {UserModel} = require("../Models/UserModel")
const {MiniTask} = require('../Models/MiniTaskModel')


const signUp = async(req,res)=>{
    console.log(req.body)
    const {name,email,role,password,} =req.body

    try{
    if(!name || !email || !role || !password){
        return res.status(400).json({message: "All fields are required"})
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({message:"Invalid Email"})
    }

    const userExist = await UserModel.findOne({email})
    if(userExist){
        return res.status(400).json({mesaage: "Email had Already been taken"})
    }
    const hashedPassword = await bcrypt.hash(password,10)

    const user = new UserModel({
        name,
        email,
        role,
        password:hashedPassword
    })

    await user.save()
    const token = jwt.sign({id:user._id,role:user.role},process.env.token,{expiresIn:"4h"})
    res.cookie("token",token,{httpOnly:true,sameSite:"strict",secure:false})
    res.status(200).json({message:"Registration Successful",role:user.role})
}catch(err){
    console.log(err)
    res.status(500).json({message:"Internal Server Error"})
}





}

const login = async(req,res)=>{
    const {email,password} = req.body

    try{
        if (!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const findUser = await UserModel.findOne({email})
        if(!findUser){
            return res.status(404).json({message: "Account doesn't Exist"})
        }
        const isPasswordMatch = await bcrypt.compare(password,findUser.password)
        if(!isPasswordMatch){
            return res.status(401).json({message:"Invalid email or Password"})
        }
        const token = jwt.sign({id:findUser._id,role:findUser.role},process.env.token,{expiresIn:"4h"})
        res.cookie("token",token,{httpOnly:true,sameSite:"strict",secure:false})
        res.status(200).json({message:"Login Successful",role:findUser.role})

    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
    }

}

const logout =async(req,res)=>{
    const {token} = req.cookies
    if(!token){
        return res.status(400).json({message:"No token Provided"})
    }
    await res.clearCookies(token,{httpOnly:true,secure:true,sameSite:'Strict'})
    res.status(200).json({message:"Logout Succesful"})
}

const editProfile = async(req,res)=>{
    try{
        console.log(req.body)
        const {email,phone,skills,education,workExperience,Bio,location, businessName,businessRegistrationProof} = req.body
        const {id} = req.user
        const user = await UserModel.findById(id)
        if(!user){
            return res.staus(404).json("Account Doesn't Exist")
        }
        if(req.file && req.file.fieldname === "profile_image"){
            user.profileImage = req.file.filename
            
        }
        user.email = email || user.email
        user.phone = phone || user.phone
        user.skills = skills || user.skills
        user.education = education || user.education
        user.workExperience = workExperience || user.workExperience
        user.Bio = Bio || user.Bio
        user.location = location || user.location

        if(businessName || businessRegistrationProof){
            user.businessName = businessName || null
            user.businessRegistrationProof = businessRegistrationProof || null
        }

        await user.save()
        res.status(200).json({message:"Profile Updated Successfully"})


       
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const viewProfile = async(req,res)=>{
    try{
        const {id} =req.user
        const user = await UserModel.findById(id)
        if(!user){
            return res.status(404).json({message:"Account not Found"})
        }
        res.status(200).json(user)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}




module.exports = {signUp,login,logout,editProfile,viewProfile}