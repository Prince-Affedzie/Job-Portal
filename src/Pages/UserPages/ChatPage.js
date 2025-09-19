import React, { useEffect, useState, useContext } from 'react';
import { notificationContext } from '../../Context/NotificationContext';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import RoomList from '../../Components/MessagingComponents/RoomList';
import ChatWindow from '../../Components/MessagingComponents/ChatWindow';
import { Loader2 } from 'lucide-react';
import { userContext } from "../../Context/FetchUser";
import { getAllChatRooms } from '../../APIS/API';
import Navbar from '../../Components/Common/Navbar';
import { ClientNavbar } from '../../Components/ClientComponents/ClientNavbar';

import { NotificationToast } from '../../Components/Common/NotificationToast';

const ChatPage = () => {
  const { roomId } = useParams();
  const { socket } = useContext(notificationContext);
  const { user } = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoading = location.state?.loading;

  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(roomId || null);
  const [showRoomList, setShowRoomList] = useState(true);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      // Check if we're in a chat room and on mobile
      if (selectedRoomId && window.innerWidth < 768 && !showRoomList) {
        // Prevent the default back navigation
        event.preventDefault();
        // Show room list instead
        setShowRoomList(true);
        setSelectedRoomId(null);
        // Update URL to remove roomId
        navigate('/messages', { replace: true });
      }
    };

    // Add event listener for browser back button
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedRoomId, showRoomList, navigate]);

  // Push a history state when entering a chat room on mobile
  useEffect(() => {
    if (selectedRoomId && window.innerWidth < 768 && !showRoomList) {
      // Push a new history state so back button can be intercepted
      window.history.pushState({ chatRoom: selectedRoomId }, '', `/messages/${selectedRoomId}`);
    }
  }, [selectedRoomId, showRoomList]);

  useEffect(() => {
    if (!user) return;
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await getAllChatRooms();
        if (res.status === 200) {
          setRooms(res.data);
          setLoading(false);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "An unexpected error occurred. Failed to fetch Rooms.";
        console.error('Failed to fetch Rooms', error);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [user]);

  useEffect(() => {
    if (roomId) {
      setSelectedRoomId(roomId);
      // Auto-switch to ChatWindow on small screens
      if (window.innerWidth < 768) {
        setShowRoomList(false);
      }
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

  useEffect(() => {
    if (!socket) return;

    const handleRoomUpdate = (updatedRoom) => {
      setRooms(prev => {
        const roomExists = prev.find(r => r._id.toString() === updatedRoom._id.toString());
        if (roomExists) {
          return prev.map(r => r._id === updatedRoom._id ? {
            ...r,
            ...updatedRoom, // This brings in lastMessage, lastMessageAt, unreadCounts
          } : r);
        } else {
          return [updatedRoom, ...prev];
        }
      });
    };

    socket.on("updatedRoom", (room) => {
      handleRoomUpdate(room);
    });
    
    

    return () => {
      socket.off("updatedRoom");
      
    };
  }, [socket, setRooms]);

  // Enhanced back handler for ChatWindow
  const handleBackToRoomList = () => {
    setShowRoomList(true);
    setSelectedRoomId(null);
    // Update URL to remove roomId
    navigate('/messages', { replace: true });
  };

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
      <ToastContainer />
      {user?.role === 'job_seeker'?(
         <Navbar />
      ):(
        <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
      )}
     
      <div className="flex h-screen overflow-x-hidden  overflow-hidden">
        {/* Room List */}
        <div style={{
          width: window.innerWidth >= 1024 ? '20%' : window.innerWidth >= 768 ? '25%' : '100%',
          display: showRoomList || window.innerWidth >= 768 ? 'block' : 'none',
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          overflowY: 'auto',
        }}>
          <RoomList
            rooms={rooms}
            setRooms={setRooms}
            selectedRoomId={selectedRoomId}
            setSelectedRoomId={(id) => {
              setSelectedRoomId(id);
              if (window.innerWidth < 768) {
                setShowRoomList(false);
                // Update URL when selecting a room
                navigate(`/messages/${id}`, { replace: true });
              }
            }}
            currentUserId={user?._id}
            onlineUserIds={onlineUserIds}
            socket={socket}
            loading={loading}
          />
        </div>

        {/* Chat Window */}
        <div style={{
          flex: 1,
          backgroundColor: '#f9fafb',
          display: showRoomList && !roomId && window.innerWidth < 768 ? 'none' : 'block',
        }}>
          {selectedRoomId ? (
            <ChatWindow
              roomId={selectedRoomId}
              socket={socket}
              currentUser={user}
              onlineUserIds={onlineUserIds}
              onBack={handleBackToRoomList} // Use enhanced back handler
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
         <NotificationToast/>
      </div>
    </div>
  );
};

export default ChatPage;