import { createContext,useEffect,useState,useContext } from "react";
import io from 'socket.io-client'
import {getNotifications } from "../APIS/API";
import { fetchUser } from "../APIS/API";
import { NotificationToast } from "../Components/Common/NotificationToast";


export const notificationContext = createContext()


export const NotificationProvider = ({children})=>{
 

const [notifications,setNotifications] = useState([])
const [user,setUser] = useState()
const [socket, setSocket] = useState(null);



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
    
     const newSocket  = io(process.env.REACT_APP_BACKEND_URL,{
      withCredentials:true
     
  })
  setSocket(newSocket)
  newSocket.on('connections',()=>{
    console.log('Socket connected',socket.id)
  })

 newSocket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  newSocket.on('notification',(notification)=>{
    setNotifications((prevNotifications)=>[
      notification,
      ...prevNotifications
    ])
  })

  return ()=>{ 
   newSocket.off('notification')
}
  

    

   
  },[])

  
  return(
    <notificationContext.Provider value={{notifications,fetchNotifications,socket}}>
       {children}
     
    </notificationContext.Provider>
  )

}
