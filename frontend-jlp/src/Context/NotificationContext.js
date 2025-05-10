import { createContext,useEffect,useState,useContext } from "react";
import io from 'socket.io-client'
import {getNotifications } from "../APIS/API";
import { fetchUser } from "../APIS/API";


export const notificationContext = createContext()


export const NotificationProvider = ({children})=>{
 

const [notifications,setNotifications] = useState([])
const [user,setUser] = useState()



  const fetchNotifications =async()=>{
        try{
            const response = await getNotifications()
            if(response.status ===200){
              setNotifications(response.data)
              
            }else{
              setNotifications([])
            }
        }catch(err){
          console.log(err)
          setNotifications([])
        }
      }

    const fetuser = async()=>{
      try{
      const response = await fetchUser ()
      if(response.status ===2000){
         setUser(response.data)
      }}catch(err){
        console.log(err)
        setUser(null)
      }
    }
  useEffect(()=>{
    fetchNotifications()
    
     const socket  = io(process.env.REACT_APP_BACKEND_URL,{
      withCredentials:true
     
  })
  socket.on('connections',()=>{
    console.log('Socket connected',socket.id)
  })

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socket.on('notification',(notification)=>{
    setNotifications((prevNotifications)=>[
      notification,
      ...prevNotifications
    ])
  })

  return ()=>{ 
    socket.off('notification')
}
  

    

   
  },[])

  
  return(
    <notificationContext.Provider value={{notifications,fetchNotifications,}}>
       {children}
    </notificationContext.Provider>
  )

}
