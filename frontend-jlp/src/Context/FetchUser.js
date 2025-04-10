import { createContext,useEffect,useState } from "react";

import { fetchUser } from "../APIS/API";
import { getRecentApplications } from "../APIS/API";

export const userContext = createContext()

export const UserProvider =({children})=>{
    
    const [user,setUser] = useState()
    const [loading,setLoading] =useState(false)
    const [recentApplications,setRecentApplications] =useState([])

    const fetchUserInfo =async()=>{
      if (user && Object.keys(user).length > 0) return;

        try{
          setLoading(true)
          const response = await fetchUser()
          if(response.status ===200){
            setUser(response.data)
            setLoading(false)
          }else{
            setUser(null)
            setLoading(false)
          }
        }catch(err){
            console.log(err)
            setUser(null)
            setLoading(false)
        }finally{
          setLoading(false)
        }
    }
    const fetchRecentApplications = async ()=>{
      try{
        const response = await getRecentApplications()
        if(response.status ===200){
          console.log(response.data)
          setRecentApplications(response.data)
        }else{
          setRecentApplications([])

        }
        

      }catch(err){
        console.log(err)
        setRecentApplications([])
      }
    }

    useEffect(()=>{
        fetchUserInfo()
        fetchRecentApplications()
    },[user])

    return(
        <userContext.Provider value={{user,setUser,fetchUserInfo,fetchRecentApplications,recentApplications,loading, setLoading}}>
             {children}
        </userContext.Provider>
    )


}

