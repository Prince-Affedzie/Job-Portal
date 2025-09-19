import { useContext } from "react";
import {Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const AdminRoutes =({children})=>{
    const {role} = useAuth()
    
    if (!role) return <Navigate to="/login" />;
    return role ==="admin"?children:<Navigate to ="/login"/>
}

export default AdminRoutes