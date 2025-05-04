import {useState,useEffect,createContext ,useContext} from 'react'
import { getAllJobs,getAllUsers,getAdminProfile } from '../APIS/API'

const adminContext = createContext()

export const AdminProvider =({children})=>{
      const [loading,setLoading] = useState(false)
      const [users,setUsers] = useState([])
      const [jobs,setJobs] = useState([])
      const [profile,setProfile] = useState(null)

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

      useEffect(()=>{
        setLoading(true)
        Promise.all([fetchProfile(), fetchAllUsers(), fetchAllJobs ()])
               .then(()=>{
                setLoading(false)
               })
               .catch((err)=>{
                console.log(err)
               })
      },[])

      return (
        <adminContext.Provider value={{loading,profile,users,jobs,setUsers,fetchProfile,fetchAllUsers,fetchAllJobs}}>
            {children}
        </adminContext.Provider>
      )
}
export const useAdminContext =()=>useContext(adminContext)
