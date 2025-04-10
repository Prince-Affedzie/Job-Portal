const {UserModel} = require("../Models/UserModel")

const verifyEligibility = async(req,res,next)=>{
    try{

        const {id,role} = req.user
        const {jobType} = req.body

        const user = await UserModel.findById(id)
        
        if(!user || user.isVerified === false){
            return res.status(403).json({message:"You are not Verified to Post Jobs"})
        }

        if(jobType === "Mini-Task"){
            if(user.miniTaskEligible === false){
                return res.status(403).json({message:"You are not Verified to post Mini Jobs"})
            }
            next()
        }else{
            checkIsBusinessVerified = user.businessVerified
            if(role === "employer" && checkIsBusinessVerified===true){
                next()
            }else{
                return res.status(403).json({message:"Business not Verified"})
            }

        }



    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = verifyEligibility