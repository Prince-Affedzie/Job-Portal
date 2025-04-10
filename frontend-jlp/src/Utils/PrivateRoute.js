import { useContext } from "react";
import { Outlet,useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PrivateRoutes =()=>{
    const navigate = useNavigate()
    const {isAuthenticated} = useAuth()

    return isAuthenticated?<Outlet/>:navigate("/login")
}

export default PrivateRoutes