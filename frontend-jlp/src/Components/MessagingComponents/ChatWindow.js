import React, { useEffect, useState, useRef, useCallback ,useContext} from 'react';
import { Send, Paperclip, FileText, Image, CheckCheck, CornerUpLeft, Trash2, X, Video,
  File,ExternalLink } from 'lucide-react';
import { fetchRoomMessages, handleChatFiles,fetchRoomInfo,sendFileToS3 } from '../../APIS/API';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { userContext } from "../../Context/FetchUser";
import  {MessageBubble} from  "./MessageBubble"
import { TypingIndicator } from './TypingIndicator';
import {FilePreview} from './FilePreview'
import {ReplyPreview} from './ReplyPreview'
import {MessageInput} from './MessageInput'

// Main component
const ChatWindow = ({ roomId, socket, currentUser,onlineUserIds, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const messageRefs = useRef({});
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [roomInfo,setRoomInfo] = useState(null)
  const [otherParticipantId,setOtherParticipantId] =useState(null)
  let isOnline 
  const {fetchUserInfo, user } = useContext(userContext);
  const finalUser = currentUser || user;
  

 
  
 
  // Helpers
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const updateMessageInState = useCallback((messageId, updatedFields) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg._id === messageId ? { ...msg, ...updatedFields } : msg
      )
    );
  }, []);

  useEffect(()=>{
    fetchUserInfo()
  },[finalUser, fetchUserInfo])

  // Message fetching
  useEffect(() => {
     if (!finalUser?._id) return;
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await fetchRoomMessages(roomId);
        if (res.status === 200) {
          setMessages(res.data);
          res.data.forEach((msg) => {
            if (!msg.seenBy.includes(finalUser._id)) {
              socket.emit('markAsSeen', { messageId: msg._id, userId: finalUser._id});
            }
          });
        }
      } catch (error) {
        const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Failed to fetch messages.";
        console.error('Failed to fetch messages', error);
        toast.info('Request being Processed');

      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      fetchMessages();
      socket.emit('joinRoom', { roomId });
    }
    
    return () => {
      if (!finalUser?._id) return;
      if (roomId) {
        socket.emit('leaveRoom', { roomId });
      }
    };
  }, [roomId, finalUser?._id, socket]);


  useEffect(()=>{

     if (!finalUser?._id) return;

  const getRoomInfo = async () => {
  try{
  const res = await fetchRoomInfo(roomId);
  if (res.status === 200 && res.data?.participants?.length > 0) {
    setRoomInfo(res.data);
    console.log(res.data.participants)
    const participantId = res.data.participants.find(
      (p) => p._id !== finalUser?._id 
    );
    setOtherParticipantId(participantId);
  
  
  } else {
    console.warn("No participants found in room data", res.data);
  }}catch(error){
     const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Failed to fetchRoom.";
        console.error('Failed to fetch messages', error);
        toast.info('Request being Processed');
  }
};

getRoomInfo()
 },[currentUser,roomId,finalUser._id])

 isOnline = onlineUserIds.includes(otherParticipantId?._id);


  // Socket events
  useEffect(() => {
    if (!finalUser?._id) return;
    socket.on('receiveMessage', (newMsg) => {
      if (newMsg.room === roomId) {
        setMessages((prev) => [...prev, newMsg]);
        socket.emit('markAsSeen', { messageId: newMsg._id, userId: finalUser._id });
      }
    });

    socket.on('messageSeen', ({ messageId, userId }) => {
      updateMessageInState(messageId, {
        seenBy: messages.find(m => m._id === messageId)?.seenBy.concat(userId) || []
      });
    });
    
    socket.on('userTyping', ({ userId }) => {
      if (userId !== finalUser._id) {
        setIsTyping(true);
      }
    });

    socket.on('userStopTyping', ({ userId }) => {
      if (userId !== finalUser._id) {
        setIsTyping(false);
      }
    });

    socket.on('messageDeleted', ({ messageId }) => {
      updateMessageInState(messageId, { deleted: true });
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('messageSeen');
      socket.off('userTyping');
      socket.off('userStopTyping');
      socket.off('messageDeleted');
    };
  }, [roomId, socket,finalUser?._id, messages, updateMessageInState]);

  // Auto-scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  

  // Message handlers
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !file) || isSending) return;

    setIsSending(true);
    let fileurl = '';
    let fileName = '';

    if (file) {
      try {
        const res = await handleChatFiles({filename: file.name,contentType:file.type});
        if(res.status ===200){
        
            const {fileUrl,fileKey, publicUrl} = res.data
            console.log(res.data)

            await sendFileToS3(fileUrl,file)
            fileurl =  publicUrl;
            fileName = file.name;
        }
        
      } catch (error) {
        const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Failed to fetch messages.";
        console.error('Failed to fetch messages', error);
        toast.error(errorMessage);
        console.error('File upload failed:', error);
        setIsSending(false);
        return;
      }
    }

    const payload = {
      senderId: finalUser._id,
      roomId,
      text: text.trim() || undefined,
      mediaUrl:  fileurl || undefined,
      fileName: fileName || undefined,
      replyTo: replyTo?._id || undefined,
    };
    console.log(payload)
    socket.emit('sendMessage', payload);
    setText('');
    setFile(null);
    setIsSending(false);
    setReplyTo(null);
  };

  const handleTyping = useCallback(() => {
    socket.emit('typing', { roomId, userId: finalUser._id });

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      socket.emit('stopTyping', { roomId, userId: finalUser._id });
    }, 2000); // stop typing after 2s of inactivity

    setTypingTimeout(timeout);
  }, [socket, roomId, finalUser._id, typingTimeout]);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
    // Focus on the text input
    document.querySelector('textarea').focus();
  };

 
const scrollToMessage = (messageId) => {
  const target = messageRefs.current[messageId];
  if (target) {
    
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
   
    target.classList.add('bg-indigo-100');
    
   
    target.classList.add('shadow-md', 'scale-[1.02]', 'transition-all', 'duration-300');
    
   
    setTimeout(() => {
      target.classList.remove('bg-indigo-100', 'shadow-md', 'scale-[1.02]');
    }, 2000);
  }
};

  const isMyMessage = useCallback((msg) => msg.sender._id === finalUser._id, [finalUser._id]);

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg  overflow-hidden border border-gray-200">

      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 border-b border-blue-800 shadow-md flex items-center justify-between">
     
      {onBack && (
    <button
      onClick={onBack}
      className="md:hidden text-white font-medium text-sm flex items-center gap-1"
    >
      <span className="text-xl">←</span>
      <span>Back</span>
    </button>
  )}
     {/* <h3 className="text-lg md:text-xl font-semibold text-white tracking-wide">
      {roomId ? 'Chat Room' : 'Select a conversation'}
       </h3> */}

    {otherParticipantId && (
      <div className="flex items-center gap-3 bg-white/10 rounded-lg px-3 py-2 shadow-inner">
      <img
        src={otherParticipantId.profileImage || '/default-avatar.png'}
        alt={otherParticipantId.name}
        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
      />
       <div>
        <div className="text-white font-medium text-sm md:text-base">
          {otherParticipantId.name}
        </div>
       {isOnline &&(<div className="text-xs text-green-200">Online</div>)}
      </div>
      </div>
       )}
    </div>


      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 bg-gradient-to-b from-gray-50 to-white"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="space-y-3 w-full max-w-md">
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 py-1">
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <div className="flex-1 py-1 flex flex-col items-end">
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 py-1">
                  <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500">
            <div className="p-6 bg-gray-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-xl font-medium mb-2">No messages yet</p>
            <p className="text-sm">Start the conversation by typing a message below</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isMyMessage={isMyMessage(msg)}
                onReply={handleReply}
                currentUser={finalUser}
                socket={socket}
                messageRef={(el) => (messageRefs.current[msg._id] = el)}
                scrollToMessage={scrollToMessage}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {file && (
        <FilePreview file={file} onClear={() => setFile(null)} />
      )}

      {/* Reply Preview */}
      {replyTo && (
        <ReplyPreview replyTo={replyTo} onClear={() => setReplyTo(null)} />
      )}

      {/* Message Input */}
      <MessageInput
        text={text}
        setText={setText}
        handleSend={handleSend}
        handleTyping={handleTyping}
        triggerFileInput={triggerFileInput}
        disabled={isSending || (!text.trim() && !file)}
      />
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        id="chat-file"
      />
    </div>
  );
};

export default ChatWindow;