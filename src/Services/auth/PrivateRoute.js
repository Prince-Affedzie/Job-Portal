import { useContext } from "react";
import { Outlet,Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const PrivateRoutes =({children})=>{
    const {role} = useAuth()
    
    if (!role) return <Navigate to="/login" />;
    return role ==="employer"?children:<Navigate to ="/login"/>
}

export default PrivateRoutes