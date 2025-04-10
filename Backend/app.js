const express = require("express")
const BodyParser = require("body-parser")
const CookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const cors = require('cors')
require("dotenv").config()

const {userRouter} = require("./Routes/UserRoutes")
const {employerRoute} = require("./Routes/EmpoyerRoutes")
const {seekRouter} = require("./Routes/JobSeekerRoutes")


const app = express()
app.use(CookieParser())
app.use(BodyParser.urlencoded({extended:true}))
app.use(BodyParser.json())
app.use(express.static("/Static"))
app.use('/Uploads',express.static('Uploads'))
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true

}))

app.use("/api",userRouter)
app.use("/api",employerRoute)
app.use("/api",seekRouter)

mongoose.connect(process.env.DB_URL)
       .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log("Listening on Port 5000")
        })
       })
       .catch((err)=>{
        console.log(err)
       })