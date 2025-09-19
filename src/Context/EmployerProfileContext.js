import React ,{useState,useEffect,createContext,useContext} from 'react'
import { getEmployerProfile } from '../APIS/API'

export const employerProfileContext = createContext()

export const EmployerProfileProvider = ({children})=>{
    const [employerprofile,setEmployerProfile] = useState()
    const [loading1,setLoading] = useState(false)

    const fetchEmloyerProfile = async()=>{
            try{
                setLoading(true)
                const response = await getEmployerProfile()
                if(response.status===200){
                setEmployerProfile(response.data)
                }
    
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        }

        useEffect(()=>{
        
            fetchEmloyerProfile()
                
        },[])

         return(
                <employerProfileContext.Provider value={{loading1,employerprofile,fetchEmloyerProfile}}>
                    {children}
                </employerProfileContext.Provider>
            )
}

export const useEmployerProfileContext = ()=>useContext(employerProfileContext)
