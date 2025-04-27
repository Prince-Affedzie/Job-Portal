const express = require("express")
const userRouter = express.Router()
const {signUp,login,logout,editProfile,viewProfile,chat,getNotifications,createNotification} = require('../Controllers/UserContoller')
const {upload} = require('../Utils/Mutler')
const {validateInput} = require('../Utils/ValidatePassword')
const {verify_token} = require("../MiddleWare/VerifyToken")

userRouter.post("/user/signup",validateInput,signUp)
userRouter.post("/user/login",login)
userRouter.post("/user/logout",logout)
userRouter.put("/user/edit_profile",verify_token,upload.single("profile_image"),editProfile)
userRouter.get("/user/view_profile",verify_token,viewProfile)
userRouter.post('/user/athenticate',verify_token,chat )
userRouter.post('/notifications',verify_token,createNotification)
userRouter.get('/notifications',verify_token,getNotifications)


module.exports = {userRouter}