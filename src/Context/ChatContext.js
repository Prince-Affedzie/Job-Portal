// src/context/ChatContext.js
import { StreamChat } from 'stream-chat';
import { createContext, useContext, useEffect, useState } from 'react';
import { authenticateChat } from '../APIS/API'; // Your API to get token & user data

export const ChatContext = createContext();

const client = StreamChat.getInstance('c9tbyybnmgwt');

export const ChatProvider = ({children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const connect = async () => {
        if (!client.userID) {
            try {
              const response = await authenticateChat();
              if(response.status===200){
             const {userData,token} = response.data
             const {id,name,image} = userData
              console.log(response.data)
              if (!client.userID) {
                await client.connectUser({ id, name, image }, token);
          
              }
              setUser(userData);}
            } catch (err) {
              console.error("Failed to connect user", err);
            }
          }
    };

    connect();

   
      return () => {
        if (client.userID) {
          client.disconnectUser();
          console.log("🔌 Disconnected user on unmount");
        }
      };
   
  }, []);

  return (
    <ChatContext.Provider value={{ client, user }}>
      {children}
    </ChatContext.Provider>
  );
};

