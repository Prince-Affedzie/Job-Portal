import React, { useEffect, useState, useRef, useCallback ,useContext} from 'react';
import { Send, Paperclip, FileText, Image, CheckCheck, CornerUpLeft, Trash2, X } from 'lucide-react';
import { fetchRoomMessages, handleChatFiles,fetchRoomInfo } from '../../APIS/API';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { userContext } from "../../Context/FetchUser";

// Component organization - break down into smaller components
const MessageBubble = ({ message, isMyMessage, onReply, currentUser, socket, messageRef,scrollToMessage }) => {
  const { _id, text, mediaUrl, fileName, sender, createdAt, seenBy, deleted, replyTo } = message;
  
  const handleDelete = () => {
    socket.emit('deleteMessage', { messageId: _id, userId: currentUser._id });
  };
  
  const getFileIcon = (fileName) => {
    if (!fileName) return null;
    
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <Image size={16} className="mr-1" />;
    }
    return <FileText size={16} className="mr-1" />;
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      ref={messageRef}
      className={`group flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div className={`flex ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} max-w-md`}>
        {!isMyMessage && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 flex items-center justify-center text-white mr-2 shadow-sm">
            {sender.name ? sender.name[0].toUpperCase() : '?'}
          </div>
        )}
        
        <div className="flex flex-col">
          <div
            className={`relative px-4 py-2 rounded-xl shadow-sm ${
              isMyMessage
                ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                : 'bg-white text-gray-800 border border-gray-100'
            } ${!isMyMessage ? 'rounded-tl-none' : 'rounded-tr-none'}`}
          >
            {deleted ? (
              <p className="italic text-gray-600 text-sm">This message was deleted</p>
            ) : (
              <>
                {replyTo && (
                  <div 
                    className={`mb-2 text-xs rounded-md px-3 py-2 cursor-pointer transition-colors ${
                      isMyMessage ? 'bg-blue-700/30 border-l-4 border-blue-300' : 'bg-gray-100 border-l-4 border-gray-300'
                    }`}
                  >
                    <p className="text-[11px] font-medium text-white-100 dark:text-gray-100 truncate max-w-xs">
                      {replyTo.sender?.name || 'User'}
                    </p>
                        <p
                        className={`text-[13px] italic line-clamp-2 break-words ${
                         isMyMessage ? 'text-gray-200 dark:text-gray-100' : 'text-gray-700 dark:text-gray-700'
                        }`}
                         onClick={() => onReply ? scrollToMessage(replyTo._id) : null}
                        >
                     {replyTo.text || replyTo.fileName || '[Media]'}
                   </p>
                  </div>
                )}

                {text && <p className="break-words">{text}</p>}
                
                {mediaUrl && (
                  <div className={`mt-2 ${text ? 'pt-2 border-t border-gray-200 border-opacity-20' : ''}`}>
                    {fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={mediaUrl} 
                          alt="shared content" 
                          className="max-h-48 w-auto object-contain" 
                          loading="lazy" 
                        />
                      </div>
                    ) : (
                      <a
                        href={`https://docs.google.com/gview?url=${encodeURIComponent(mediaUrl)}&embedded=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center text-sm ${isMyMessage ? 'text-blue-100' : 'text-blue-600'} hover:underline`}
                      >
                        {getFileIcon(fileName)}
                        {fileName}
                      </a>
                    )}
                  </div>
                )}

                <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 p-1">
                  <button
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm shadow-sm transition 
                     ${isMyMessage 
                    ? 'bg-blue-400 text-white hover:bg-blue-700' 
                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => onReply(message)}
                 title="Reply"
                  >
                <CornerUpLeft size={16} className="stroke-[2]" />
                 <span className="hidden sm:inline">Reply</span>
                   </button>
                  
                  {isMyMessage && (
                    <button
                      onClick={handleDelete}
                      className="p-1 rounded-full bg-red-500 text-white opacity-70 hover:opacity-100"
                      title="Delete Message"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className={`flex text-xs text-gray-500 mt-1 ${isMyMessage ? 'justify-end mr-1' : 'justify-start ml-1'}`}>
            <span>{formatTime(createdAt)}</span>
            {isMyMessage && seenBy && seenBy.length > 1 && (
              <span className="ml-1 flex items-center">
                <CheckCheck size={12} className="text-blue-500" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1 text-sm text-gray-500 pl-2 py-2">
    <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500">
      <span className="text-sm">✎</span>
    </div>
    <div className="flex gap-1">
      <span className="animate-bounce delay-0">•</span>
      <span className="animate-bounce delay-100">•</span>
      <span className="animate-bounce delay-200">•</span>
    </div>
  </div>
);

const FilePreview = ({ file, onClear }) => (
  <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 flex items-center">
    <div className="flex-1 truncate flex items-center">
      <div className="bg-blue-100 rounded p-2 mr-2">
        <FileText size={16} className="text-blue-600" />
      </div>
      <span className="text-sm font-medium text-gray-700">{file.name}</span>
    </div>
    <button 
      onClick={onClear} 
      className="ml-2 p-1 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
      type="button"
    >
      <X size={16} />
    </button>
  </div>
);


const ReplyPreview = ({ replyTo, onClear }) => (
  <div className="flex items-start justify-between bg-blue-50 border-l-4 border-blue-500 rounded-t-md px-4 py-2">
    {/* Left: Message preview */}
    <div className="flex-1 overflow-hidden">
      <p className="text-xs text-blue-700 font-semibold mb-0.5">
        Replying to {replyTo.sender?.name || 'User'}
      </p>
      <p className="text-xs text-gray-700 truncate max-w-xs">
        {replyTo.text
          ? replyTo.text.length > 50
            ? `${replyTo.text.slice(0, 50)}...`
            : replyTo.text
          : replyTo.fileName || '[Media]'}
      </p>
    </div>

    {/* Right: Close button */}
    <button
      onClick={onClear}
      className="ml-3 p-1 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
      aria-label="Cancel reply"
    >
      <X size={16} />
    </button>
  </div>
);




const MessageInput = ({
  text,
  setText,
  handleSend,
  handleTyping,
  triggerFileInput,
  disabled,
}) => {
  const textareaRef = useRef(null);

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  return (
    <div className="p-3 bg-white border-t border-gray-200 flex gap-2 items-end">
      {/* Attachment Button */}
      {/*<button
        type="button"
        onClick={triggerFileInput}
        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Paperclip size={20} />
      </button> */}

      {/* Text Input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="w-full border border-gray-300 rounded-2xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
          placeholder="Type a message..."
          rows={1}
        />
      </div>

      {/* Send Button */}
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled}
        className={`p-3 rounded-full transition-all ${
          disabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-md active:scale-95'
        }`}
      >
        <Send size={18} />
      </button>
    </div>
  );
};

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
    let fileUrl = '';
    let fileName = '';

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await handleChatFiles(formData);
        fileUrl = res.data;
        fileName = file.name;
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
      mediaUrl: fileUrl || undefined,
      fileName: fileName || undefined,
      replyTo: replyTo?._id || undefined,
    };

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