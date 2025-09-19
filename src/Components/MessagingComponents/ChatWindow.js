import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { fetchRoomMessages, handleChatFiles, fetchRoomInfo, sendFileToS3 } from '../../APIS/API';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { userContext } from "../../Context/FetchUser";
import { MessageBubble } from "./MessageBubble"
import { TypingIndicator } from './TypingIndicator';
import { FilePreview } from './FilePreview'
import { ReplyPreview } from './ReplyPreview'
import { MessageInput } from './MessageInput'
import { FileUploadProgress } from './FileUploadProgress' // New component

// Main component
const ChatWindow = ({ roomId, socket, currentUser, onlineUserIds, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  
  // New state for file upload progress
  const [uploadingFiles, setUploadingFiles] = useState(new Map());
  const [fileUploadQueue, setFileUploadQueue] = useState([]);
  
  const messageRefs = useRef({});
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [otherParticipantId, setOtherParticipantId] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  
  // Simplified scroll state management
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [pendingScroll, setPendingScroll] = useState(null);
  const userScrollTimeoutRef = useRef(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  
  // New state for smart scroll positioning
  const [lastReadMessageId, setLastReadMessageId] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [initialScrollSet, setInitialScrollSet] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  let isOnline;
  const { fetchUserInfo, user } = useContext(userContext);
  const finalUser = currentUser || user;

  // Generate unique ID for file uploads
  const generateFileId = () => `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // File upload progress tracking
  const updateFileProgress = useCallback((fileId, progress, status = 'uploading') => {
    setUploadingFiles(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(fileId);
      if (existing) {
        newMap.set(fileId, { ...existing, progress, status });
      }
      return newMap;
    });
  }, []);

  const removeFileFromUploads = useCallback((fileId) => {
    setUploadingFiles(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
  }, []);

  // Enhanced file upload with progress tracking
 const uploadFileWithProgress = useCallback(async (file, messageText = '', replyToMessage = null) => {
  const fileId = generateFileId();
  const fileData = {
    id: fileId,
    name: file.name,
    size: file.size,
    type: file.type,
    progress: 0,
    status: 'preparing',
    startTime: Date.now()
  };
  
  // Add to uploading files immediately
  setUploadingFiles(prev => new Map(prev).set(fileId, fileData));
  
  try {
    // Step 1: Get upload URL
    updateFileProgress(fileId, 0, 'preparing');
    const res = await handleChatFiles({ filename: file.name, contentType: file.type });
    
    if (res.status !== 200) {
      throw new Error('Failed to get upload URL');
    }

    const { fileKey,fileUrl, publicUrl } = res.data;
    console.log(res.data)
    
    // Step 2: Upload to S3 using your API function with progress tracking
    updateFileProgress(fileId, 5, 'uploading');
    
    // Modify sendFileToS3 to accept progress callback
    await sendFileToS3(
        fileUrl,
        file);
    
    // Step 3: Send message with file
    updateFileProgress(fileId, 95, 'processing');
    
    const payload = {
  senderId: finalUser._id,
  roomId,
  ...(messageText.trim() && { text: messageText.trim() }),  // Only include if not empty
  mediaUrl: publicUrl,
  fileName: file.name,
  ...(replyToMessage?._id && { replyTo: replyToMessage._id }),
};
    
    socket.emit('sendMessage', payload);
    setText('');
    setFile(null);
    setIsSending(false);
    setReplyTo(null);
    
    // Step 4: Mark as completed
    updateFileProgress(fileId, 100, 'completed');
    
    // Remove from uploading files after a short delay
    setTimeout(() => removeFileFromUploads(fileId), 2000);
    
    toast.success(`File "${file.name}" uploaded successfully!`);
    return true;
  } catch (error) {
    console.error('File upload failed:', error);
    updateFileProgress(fileId, 0, 'failed');
    
    const errorMessage = error.response?.data?.message || 
                        error.message ||
                        "Failed to upload file";
    
    toast.error(`Upload failed: ${errorMessage}`);
    
    // Remove failed upload after showing error
    setTimeout(() => removeFileFromUploads(fileId), 5000);
    return false;
  }
}, [finalUser._id, roomId, socket, updateFileProgress, removeFileFromUploads]);
  // Utility function to check if user is at bottom
  const checkIfAtBottom = useCallback(() => {
    if (!chatContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 50;
  }, []);

  // Scroll to bottom function
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (messagesEndRef.current && !isUserScrolling) {
      messagesEndRef.current.scrollIntoView({ behavior });
      setIsAtBottom(true);
    }
  }, [isUserScrolling]);

  const scrollToLastReadMessage = useCallback(() => {
    if (lastReadMessageId && messageRefs.current[lastReadMessageId]) {
      const element = messageRefs.current[lastReadMessageId];
      element.scrollIntoView({ behavior: 'auto', block: 'center' });
      setInitialScrollSet(true);
    } else if (messages.length > 0 && !initialScrollSet) {
      scrollToBottom('auto');
      setInitialScrollSet(true);
    }
  }, [lastReadMessageId, messages.length, initialScrollSet, scrollToBottom]);

  const findLastReadMessage = useCallback((messageList) => {
    for (let i = messageList.length - 1; i >= 0; i--) {
      const msg = messageList[i];
      if (msg.seenBy.includes(finalUser._id) && msg.sender._id !== finalUser._id) {
        return msg._id;
      }
    }
    return null;
  }, [finalUser._id]);

  const identifyUnreadMessages = useCallback((messageList) => {
    return messageList.filter(msg => 
      !msg.seenBy.includes(finalUser._id) && msg.sender._id !== finalUser._id
    );
  }, [finalUser._id]);

  const updateMessageInState = useCallback((messageId, updatedFields) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg._id === messageId ? { ...msg, ...updatedFields } : msg
      )
    );
  }, []);

  useEffect(() => {
    if (finalUser) {
      fetchUserInfo();
    }
  }, [finalUser?._id, fetchUserInfo, finalUser]);

  // Updated fetchMessages function with smart scroll positioning
  const fetchMessages = useCallback(async (cursor = null, append = false) => {
    if (isFetchingMore || (append && !hasMoreMessages)) return;
    setIsFetchingMore(true);
    
    let previousScrollHeight = 0;
    let previousScrollTop = 0;
    if (append && chatContainerRef.current) {
      previousScrollHeight = chatContainerRef.current.scrollHeight;
      previousScrollTop = chatContainerRef.current.scrollTop;
    }
    
    try {
      const res = await fetchRoomMessages(roomId, cursor);
      if (res.status === 200) {
        const { messages: newMessages, nextCursor, hasMore } = res.data;
        
        setMessages((prev) => {
          let updatedMessages;
          if (append) {
            const existingIds = new Set(prev.map(msg => msg._id));
            const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg._id));
            updatedMessages = [...uniqueNewMessages, ...prev];
          } else {
            updatedMessages = newMessages;
            
            if (isInitialLoad) {
              const lastRead = findLastReadMessage(newMessages);
              const unread = identifyUnreadMessages(newMessages);
              setLastReadMessageId(lastRead);
              setUnreadMessages(unread);
            }
          }
          return updatedMessages;
        });
        
        setNextCursor(nextCursor);
        setHasMoreMessages(hasMore);
        
        const shouldMarkAsSeen = !isInitialLoad || checkIfAtBottom();
        
        if (shouldMarkAsSeen) {
          newMessages.forEach((msg) => {
            if (!msg.seenBy.includes(finalUser._id)) {
              socket.emit('markAsSeen', { messageId: msg._id, userId: finalUser._id });
            }
          });
        }
        
        if (append && chatContainerRef.current) {
          setPendingScroll('preserve');
          setTimeout(() => {
            if (chatContainerRef.current && pendingScroll === 'preserve') {
              const newScrollHeight = chatContainerRef.current.scrollHeight;
              const heightDifference = newScrollHeight - previousScrollHeight;
              chatContainerRef.current.scrollTop = previousScrollTop + heightDifference;
              setPendingScroll(null);
            }
          }, 0);
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred while fetching messages.";
      console.error('Failed to fetch messages', error);
      toast.info('Request being Processed');
    } finally {
      setIsFetchingMore(false);
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [roomId, finalUser._id, socket, isFetchingMore, hasMoreMessages, isInitialLoad, findLastReadMessage, identifyUnreadMessages, checkIfAtBottom, pendingScroll]);

  // Reset state when room changes and fetch initial messages
  useEffect(() => {
    if (!finalUser?._id || !roomId) return;
    
    if (roomId !== currentRoomId) {
      setCurrentRoomId(roomId);
      setMessages([]);
      setIsLoading(true);
      setIsAtBottom(true);
      setIsUserScrolling(false);
      setPendingScroll(null);
      setNextCursor(null);
      setHasMoreMessages(true);
      setIsFetchingMore(false);
      setLastReadMessageId(null);
      setUnreadMessages([]);
      setInitialScrollSet(false);
      setIsInitialLoad(true);
      
      // Clear upload states when switching rooms
      setUploadingFiles(new Map());
      setFileUploadQueue([]);
      
      fetchMessages();
      socket.emit('joinRoom', { roomId });
    }

    return () => {
      if (roomId && roomId === currentRoomId) {
        socket.emit('leaveRoom', { roomId });
      }
    };
  }, [roomId, finalUser?._id, socket, fetchMessages, currentRoomId]);

  // Handle initial scroll positioning after messages are loaded
  useEffect(() => {
    if (!isLoading && messages.length > 0 && !initialScrollSet) {
      const timeoutId = setTimeout(() => {
        scrollToLastReadMessage();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, messages.length, initialScrollSet, scrollToLastReadMessage]);

  // Improved scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      
      if (pendingScroll === 'preserve') return;
      
      setIsUserScrolling(true);
      clearTimeout(userScrollTimeoutRef.current);
      userScrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 300);
      
      const nowAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(nowAtBottom);
      
      if (nowAtBottom && unreadMessages.length > 0) {
        unreadMessages.forEach(msg => {
          socket.emit('markAsSeen', { messageId: msg._id, userId: finalUser._id });
        });
        setUnreadMessages([]);
      }
      
      if (scrollTop < 80 && hasMoreMessages && !isFetchingMore) {
        fetchMessages(nextCursor, true);
      }
    };
    
    const ref = chatContainerRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        ref.removeEventListener('scroll', handleScroll);
        clearTimeout(userScrollTimeoutRef.current);
      };
    }
    
    return () => clearTimeout(userScrollTimeoutRef.current);
  }, [nextCursor, hasMoreMessages, isFetchingMore, fetchMessages, unreadMessages, socket, finalUser._id, pendingScroll]);

  // Fetch room info
  useEffect(() => {
    if (!finalUser?._id || !roomId) return;

    const getRoomInfo = async () => {
      try {
        const res = await fetchRoomInfo(roomId);
        if (res.status === 200 && res.data?.participants?.length > 0) {
          setRoomInfo(res.data);
          console.log(res.data.participants);
          const participantId = res.data.participants.find(
            (p) => p._id !== finalUser?._id
          );
          setOtherParticipantId(participantId);
        } else {
          console.warn("No participants found in room data", res.data);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "An unexpected error occurred. Failed to fetchRoom.";
        console.error('Failed to fetch room info', error);
        toast.info('Request being Processed');
      }
    };

    getRoomInfo();
  }, [roomId, finalUser?._id]);

  isOnline = onlineUserIds.includes(otherParticipantId?._id);

  // Socket events
  useEffect(() => {
    if (!finalUser?._id || !socket) return;

    const handleReceiveMessage = (newMsg) => {
      if (newMsg.room === roomId) {
        setMessages((prev) => {
          const messageExists = prev.some(msg => msg._id === newMsg._id);
          if (messageExists) return prev;
          
          return [...prev, newMsg];
        });
        
        const wasAtBottom = checkIfAtBottom();
        const isOwnMessage = newMsg.sender._id === finalUser._id;
        
        if (wasAtBottom || isOwnMessage) {
          setPendingScroll('bottom');
          socket.emit('markAsSeen', { messageId: newMsg._id, userId: finalUser._id });
        } else {
          setUnreadMessages(prev => [...prev, newMsg]);
        }
      }
    };

    const handleMessageSeen = ({ messageId, userId }) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === messageId 
            ? { ...msg, seenBy: [...new Set([...msg.seenBy, userId])] }
            : msg
        )
      );
    };

    const handleUserTyping = ({ userId }) => {
      if (userId !== finalUser._id) {
        setIsTyping(true);
      }
    };

    const handleUserStopTyping = ({ userId }) => {
      if (userId !== finalUser._id) {
        setIsTyping(false);
      }
    };

    const handleMessageDeleted = ({ messageId }) => {
      updateMessageInState(messageId, { deleted: true });
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('messageSeen', handleMessageSeen);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStopTyping', handleUserStopTyping);
    socket.on('messageDeleted', handleMessageDeleted);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('messageSeen', handleMessageSeen);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStopTyping', handleUserStopTyping);
      socket.off('messageDeleted', handleMessageDeleted);
    };
  }, [roomId, socket, finalUser?._id, updateMessageInState, checkIfAtBottom]);

  // Handle pending scroll actions
  useEffect(() => {
    if (pendingScroll === 'bottom' && !isUserScrolling) {
      const timeoutId = setTimeout(() => {
        scrollToBottom('smooth');
        setPendingScroll(null);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pendingScroll, isUserScrolling, scrollToBottom]);

  // Enhanced message send handler
   const handleSend = async (e) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !file) || isSending) return;

    setIsSending(true);
    setPendingScroll('bottom'); // Queue scroll to bottom for sent message
    let fileurl = '';
    let fileName = '';

    if (file) {
      try {
        await uploadFileWithProgress(file, text.trim(), replyTo);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "An unexpected error occurred. Failed to upload file.";
        console.error('File upload failed:', error);
        toast.error(errorMessage);
        setIsSending(false);
        setPendingScroll(null);
        return;
      }
      return;
    }

    const payload = {
      senderId: finalUser._id,
      roomId,
      text: text.trim() || undefined,
      mediaUrl: fileurl || undefined,
      fileName: fileName || undefined,
      replyTo: replyTo?._id || undefined,
    };
    console.log(payload);
    socket.emit('sendMessage', payload);
    setText('');
    setFile(null);
    setIsSending(false);
    setReplyTo(null);
  };

  const handleTyping = useCallback(() => {
    if (!socket || !finalUser?._id) return;
    
    socket.emit('typing', { roomId, userId: finalUser._id });

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      socket.emit('stopTyping', { roomId, userId: finalUser._id });
    }, 2000);

    setTypingTimeout(timeout);
  }, [socket, roomId, finalUser?._id, typingTimeout]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
    const textarea = document.querySelector('textarea');
    if (textarea) textarea.focus();
  };

  // Function to scroll to latest messages
  const scrollToLatestMessages = () => {
    setPendingScroll('bottom');
    
    unreadMessages.forEach(msg => {
      socket.emit('markAsSeen', { messageId: msg._id, userId: finalUser._id });
    });
    setUnreadMessages([]);
  };

  const isMyMessage = useCallback((msg) => msg.sender._id === finalUser._id, [finalUser._id]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-2 sm:px-4 py-2 sm:py-3 border-b border-blue-800 shadow-md flex items-center justify-between flex-shrink-0 min-h-[3rem] sm:min-h-[4rem]">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden text-white font-medium text-sm flex items-center gap-1 flex-shrink-0 p-1"
          >
            <span className="text-lg">←</span>
            <span className="hidden xs:inline text-xs">Back</span>
          </button>
        )}

        {otherParticipantId && (
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1.5 shadow-inner min-w-0 flex-1 ml-2 sm:ml-0">
            <img
              src={otherParticipantId.profileImage || '/default-avatar.png'}
              alt={otherParticipantId.name}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-white font-medium text-xs sm:text-sm truncate">
                {otherParticipantId.name}
              </div>
              {isOnline && (
                <div className="text-xs text-green-200 leading-none">Online</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 space-y-1 bg-gradient-to-b from-gray-50 to-white relative"
        style={{ 
          minHeight: 0,
          maxHeight: '100%'
        }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full min-h-[20rem]">
            <div className="space-y-3 w-full max-w-md px-4">
              <div className="flex gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1 py-1 min-w-0">
                  <div className="w-3/4 h-3 sm:h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-1/2 h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <div className="flex-1 py-1 flex flex-col items-end min-w-0">
                  <div className="w-3/4 h-3 sm:h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-1/2 h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500 px-4 min-h-[20rem]">
            <div className="p-4 sm:p-6 bg-gray-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-base sm:text-lg font-medium mb-2 text-center">No messages yet</p>
            <p className="text-xs sm:text-sm text-center">Start the conversation by typing a message below</p>
          </div>
        ) : (
          <>
            {isFetchingMore && (
              <div className="flex justify-center py-2">
                <span className="text-xs text-gray-400">Loading older messages...</span>
              </div>
            )}
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isMyMessage={isMyMessage(msg)}
                onReply={handleReply}
                currentUser={finalUser}
                socket={socket}
                messageRef={(el) => (messageRefs.current[msg._id] = el)}
              />
            ))}
            
            {/* File Upload Progress Components */}
            {Array.from(uploadingFiles.entries()).map(([fileId, fileData]) => (
              <FileUploadProgress
                key={fileId}
                fileData={fileData}
                onCancel={() => removeFileFromUploads(fileId)}
              />
            ))}
            
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
        
        {/* Unread messages indicator */}
        {unreadMessages.length > 0 && !isAtBottom && (
          <div className="fixed bottom-20 right-4 z-10">
            <button
              onClick={scrollToLatestMessages}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 shadow-lg text-sm font-medium flex items-center gap-2 transition-all duration-200"
            >
              <span>{unreadMessages.length} new message{unreadMessages.length > 1 ? 's' : ''}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* File Preview */}
      {file && (
        <div className="flex-shrink-0 max-h-32 overflow-hidden border-t border-gray-200">
          <FilePreview file={file} onClear={() => setFile(null)}  />
        </div>
      )}

      {/* Reply Preview */}
      {replyTo && (
        <div className="flex-shrink-0 max-h-20 overflow-hidden border-t border-gray-200">
          <ReplyPreview replyTo={replyTo} onClear={() => setReplyTo(null)} />
        </div>
      )}

      {/* Message Input */}
      <div className="flex-shrink-0 bg-white">
        <MessageInput
          text={text}
          setText={setText}
          handleSend={handleSend}
          handleTyping={handleTyping}
          triggerFileInput={triggerFileInput}
          disabled={isSending }
          hasFile={!!file}
          isUploading={uploadingFiles.size > 0}
        />
      </div>

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