import React, { useEffect, useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getRecentMessages } from '../../Utils/getRecentMessages';
import { ChatContext } from '../../Context/ChatContext';
import ChatModal from './ChatModal';
import { notificationContext } from '../../Context/NotificationContext';

const MessagesAndNotifications = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const {notifications,fetchNotifications} = useContext( notificationContext)
  
  const [selectedChannel, setSelectedChannel] = useState(null); // <-- Modal state

  const { client, user } = useContext(ChatContext); // stream client + user info from context

  useEffect(() => {
    const loadMessages = async () => {
      if (!client || !user ||!client.userID){ 
        //console.log(client)
        //console.log(user)
        //console.log(client.userID)
        console.log("Stream client not connected yet.");
        return; 
    }// Don't proceed if not connected yet
      try {
        setLoading(true);
        const results = await getRecentMessages(client);
        setMessages(results);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [client, user]); // run this when client or user info is available

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Messages & Notifications</h2>

      {loading ? (
        <p className="text-gray-400">Loading messages...</p>
      ) : (
        <>
          {messages.length > 0 ? (
           
            messages.slice(0,3).map((msg) => (
             
              <div
                key={msg.id}
                className="bg-gray-100 p-4 rounded-lg mb-2 cursor-pointer hover:bg-gray-200"
                onClick={() => setSelectedChannel(msg.channel)}
              >
                <h3 className="font-semibold text-blue-600">
                  <FaEnvelope className="inline mr-2" /> {msg.senderName || 'Unknown'}
                </h3>
                <p className="text-gray-500 text-sm">{msg.text}</p>
                
              </div>
              
               
              
              
            ))
            
            
          ) : (
            <p className="text-gray-500">No new messages.</p>
          )}

         {/* {notifications.length > 0 ? (
            notifications.slice(0,2).map((note) => (
              <div key={note._id} className="bg-gray-100 p-4 rounded-lg mt-2">
                <h3 className="font-semibold">
                  <FaBell className="inline mr-2" /> Notifications
                </h3>
                <p className="text-gray-500">{note.message}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notifications.</p>
          )} */}

          <div className="text-center mt-4">
        <button
          onClick={() => navigate('/chat/all_chats')}
          className="text-blue-600 hover:underline font-medium"
        >
          View All Chats →
        </button>
      </div>
        </>
      )}

     {selectedChannel && (
        <ChatModal
          client={client}
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
        />
      )}
      
    </div>
  );
};

export default MessagesAndNotifications;
