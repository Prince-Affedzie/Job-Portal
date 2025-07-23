import  {Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const RouteProtection =({children})=>{
    const {role} = useAuth()

     if (!role) {

        return <Navigate to="/login" replace />;
    }

     return  children
}

export default  RouteProtection