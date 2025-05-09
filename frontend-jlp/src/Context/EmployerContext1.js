import React ,{useState,useEffect,createContext} from 'react'
import { getPostedJobs,getEmployerProfile } from '../APIS/API'

export const jobsCreatedContext = createContext()

export const JobsContextProvider = ({children})=>{
    const [Jobs,setJobs] = useState([])
    const [loading,setLoading] = useState(false)
    const [employerprofile,setEmployerProfile] = useState()

    const fetchJobs = async()=>{
        try{
            setLoading(true)
            const response = await getPostedJobs()
            if(response.status ===200){
                setJobs(response.data)
                setLoading(false)
            }else{
                setJobs([])
                setLoading(false)
            }

        }catch(err){
            console.log(err)
            setJobs([])
        }finally{
            setLoading(false)
        }
    }

    

    useEffect(()=>{

        fetchJobs()
        
    },[])

    return(
        <jobsCreatedContext.Provider value={{Jobs,loading,employerprofile,fetchJobs,}}>
            {children}
        </jobsCreatedContext.Provider>
    )



}