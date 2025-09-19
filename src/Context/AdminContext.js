import {useState,useEffect,createContext ,useContext} from 'react'
import { getAllJobs,getAllUsers,getAdminProfile,getAllMiniTasks,getAllDisputes,fetchAllAlerts } from '../APIS/API'

const adminContext = createContext()

export const AdminProvider =({children})=>{
      const [loading,setLoading] = useState(false)
      const [users,setUsers] = useState([])
      const [jobs,setJobs] = useState([])
      const [microJobs, setMicroJobs] = useState([])
      const [reports,setReports] = useState([])
      const [profile,setProfile] = useState(null)
      const [alerts,setAlerts] = useState([])

     const fetchProfile = async()=>{
        try{

            setLoading(true)
             const response = await getAdminProfile()
             if(response.status ===200){
                setProfile(response.data)
             }
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
     }

      const fetchAllUsers = async()=>{
        try{
            setLoading(true)
             const response = await getAllUsers()
             if(response.status ===200){
                setUsers(response.data)
             }
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
      }

      const fetchAllJobs = async()=>{
        try{
            setLoading(true)
            const response = await getAllJobs()
            if(response.status===200){
                setJobs(response.data)
            }

        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
      }

      const fetchAllMicroJobs = async()=>{
        try{
            setLoading(true)
            const response = await getAllMiniTasks()
            if(response.status===200){
                setMicroJobs(response.data)
            }

        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
      }


      const fetchAllReports = async()=>{
        try{
            setLoading(true)
            const response = await getAllDisputes()
            if(response.status===200){
                setReports(response.data)
            }

        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
      }


      const fetchRecentAlerts = async()=>{
        try{
            setLoading(true)
            const response = await fetchAllAlerts();
            const data = await response.data;
            setAlerts(data);

        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
      }




      useEffect(()=>{
        setLoading(true)
        Promise.all([fetchProfile(), fetchAllUsers(), fetchAllJobs (),fetchAllMicroJobs(),fetchAllReports(),fetchRecentAlerts()])
               .then(()=>{
                setLoading(false)
               })
               .catch((err)=>{
                console.log(err)
               })
      },[])

      return (
        <adminContext.Provider value={{loading,profile,users,jobs,microJobs,reports,alerts,setUsers,fetchProfile,fetchAllUsers,fetchAllJobs,fetchAllMicroJobs,fetchAllReports,fetchRecentAlerts}}>
            {children}
        </adminContext.Provider>
      )
}
export const useAdminContext =()=>useContext(adminContext)
