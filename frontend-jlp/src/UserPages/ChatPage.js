import React, { useEffect, useState, useContext } from 'react';
import { notificationContext } from '../Context/NotificationContext';
import { useParams, useLocation } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import RoomList from '../Components/MessagingComponents/RoomList';
import ChatWindow from '../Components/MessagingComponents/ChatWindow';
import { Loader2 } from 'lucide-react';
import { userContext } from "../Context/FetchUser";
import { getAllChatRooms } from '../APIS/API';
import Navbar from '../Components/MyComponents/Navbar';


const ChatPage = () => {
  const { roomId } = useParams();
  const { socket } = useContext(notificationContext);
  const { user } = useContext(userContext);
  const location = useLocation();
  const isLoading = location.state?.loading;

  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(roomId || null);
  const [showRoomList, setShowRoomList] = useState(true);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [loading,setLoading] = useState(false)
  
  useEffect(() => {
    if (!user) return;
    const fetchRooms = async () => {
      try{

      setLoading(true)
      const res = await getAllChatRooms();
      if (res.status === 200) {
        setRooms(res.data);
        setLoading(false)
      }}catch(error){
        const errorMessage =
               error.response?.data?.message ||
               error.response?.data?.error ||
               "An unexpected error occurred. Failed to fetch Rooms.";
               console.error('Failed to fetch Rooms', error);
               toast.error(errorMessage);
      }finally{
        setLoading(false)
      }

    };
    fetchRooms();
  }, [user]);

  useEffect(() => {
    if (roomId) {
      setSelectedRoomId(roomId);
      // Auto-switch to ChatWindow on small screens
      setShowRoomList(false);
    }
  }, [roomId]);

useEffect(() => {
  if (socket && user?._id) {
    socket.emit('user-online', user._id);
  }
}, [socket, user]);

useEffect(() => {
  if (!socket) return;

  socket.on('update-online-users', (ids) => {
    setOnlineUserIds(ids);
  });

  return () => {
    socket.off('update-online-users');
  };
}, [socket]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-blue-600 animate-fade-in">
        <div className="bg-white border border-blue-100 shadow-md px-6 py-4 rounded-lg flex items-center gap-3">
          <Loader2 className="animate-spin" size={24} />
          <div className="text-sm font-medium">Connecting to chat room...</div>
        </div>
        <p className="mt-2 text-xs text-gray-500">Please wait while we set things up.</p>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer/>
      <Navbar/>
    <div className="flex h-screen overflow-hidden">
      {/* Room List */}
      <div style={{
            width: window.innerWidth >= 1024 ? '20%' : window.innerWidth >= 768 ? '25%' : '100%',
            display:
            showRoomList || window.innerWidth >= 768 ? 'block' : 'none',
            backgroundColor: 'white',
            borderRight: '1px solid #e5e7eb',
            overflowY: 'auto',
      }}>
        <RoomList
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={(id) => {
           setSelectedRoomId(id);
         if (window.innerWidth < 768) setShowRoomList(false); // hide list on mobile
         }}currentUserId={user?._id}
         onlineUserIds ={onlineUserIds}
         loading ={loading}
        />
      </div>

      {/* Chat Window */}
      <div style={{
          flex: 1,
         backgroundColor: '#f9fafb',
        display:
      showRoomList && !roomId && window.innerWidth < 768 ? 'none' : 'block',
     }}>
        {selectedRoomId ? (
          <ChatWindow
            roomId={selectedRoomId}
            socket={socket}
            currentUser={user}
            onlineUserIds={onlineUserIds}
            onBack={() => setShowRoomList(true)} // back button handler
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default ChatPage;
