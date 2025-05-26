import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { fetchRoomMessages, handleChatFiles, fetchRoomInfo, sendFileToS3 } from '../../APIS/API';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { userContext } from "../../Context/FetchUser";
import { MessageBubble } from "./MessageBubble"
import { TypingIndicator } from './TypingIndicator';
import { FilePreview } from './FilePreview'
import { ReplyPreview } from './ReplyPreview'
import  {MessageInput}  from './MessageInput'

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
  const [pendingScroll, setPendingScroll] = useState(null); // 'bottom' | 'preserve' | null
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

  // Utility function to check if user is at bottom
  const checkIfAtBottom = useCallback(() => {
    if (!chatContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 50; // Reduced threshold
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
      // If no last read message, scroll to bottom on initial load
      scrollToBottom('auto');
      setInitialScrollSet(true);
    }
  }, [lastReadMessageId, messages.length, initialScrollSet, scrollToBottom]);

  const findLastReadMessage = useCallback((messageList) => {
    // Find the last message that the current user has seen
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
    
    // Store scroll position before fetching if appending older messages
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
            // When appending older messages, filter out duplicates
            const existingIds = new Set(prev.map(msg => msg._id));
            const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg._id));
            updatedMessages = [...uniqueNewMessages, ...prev];
          } else {
            // For initial load, just set the messages
            updatedMessages = newMessages;
            
            // Set initial scroll positioning data
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
        
        // Mark messages as seen only if they're visible or user is at bottom
        const shouldMarkAsSeen = !isInitialLoad || checkIfAtBottom();
        
        if (shouldMarkAsSeen) {
          newMessages.forEach((msg) => {
            if (!msg.seenBy.includes(finalUser._id)) {
              socket.emit('markAsSeen', { messageId: msg._id, userId: finalUser._id });
            }
          });
        }
        
        // Handle scroll positioning with proper timing
        if (append && chatContainerRef.current) {
          // Set pending scroll to preserve position
          setPendingScroll('preserve');
          // Use setTimeout to ensure DOM is updated
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

    if (isUserScrolling < 80 && hasMoreMessages) {
    fetchMessages(nextCursor, true);
    }
  // Reset state when room changes and fetch initial messages
  useEffect(() => {
    if (!finalUser?._id || !roomId) return;
    
    // Only reset and fetch if the room actually changed
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
      
      fetchMessages(); // fetch initial batch
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
      // Small delay to ensure DOM is updated
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
      
      // Don't interfere with scroll position preservation, but allow other scroll logic
      if (pendingScroll === 'preserve') return;
      
      // Mark user as actively scrolling
      setIsUserScrolling(true);
      clearTimeout(userScrollTimeoutRef.current);
      userScrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 300); // Increased timeout for better UX
      
      // Update bottom status
      const nowAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(nowAtBottom);
      
      // Mark visible messages as seen when user scrolls to bottom
      if (nowAtBottom && unreadMessages.length > 0) {
        unreadMessages.forEach(msg => {
          socket.emit('markAsSeen', { messageId: msg._id, userId: finalUser._id });
        });
        setUnreadMessages([]);
      }
      
      // Load older messages when scrolled to top (only if not fetching)
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
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(msg => msg._id === newMsg._id);
          if (messageExists) return prev;
          
          return [...prev, newMsg];
        });
        
        // Handle scroll behavior for new messages
        const wasAtBottom = checkIfAtBottom();
        const isOwnMessage = newMsg.sender._id === finalUser._id;
        
        if (wasAtBottom || isOwnMessage) {
          // Scroll to bottom if user was at bottom or sent the message
          setPendingScroll('bottom');
          socket.emit('markAsSeen', { messageId: newMsg._id, userId: finalUser._id });
        } else {
          // Add to unread messages if not at bottom
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

  // Message handlers
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !file) || isSending) return;

    setIsSending(true);
    setPendingScroll('bottom'); // Queue scroll to bottom for sent message
    let fileurl = '';
    let fileName = '';

    if (file) {
      try {
        const res = await handleChatFiles({ filename: file.name, contentType: file.type });
        if (res.status === 200) {
          const { fileUrl, publicUrl } = res.data;
          console.log(res.data);

          await sendFileToS3(fileUrl, file);
          fileurl = publicUrl;
          fileName = file.name;
        }
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
    // Focus on the text input
    const textarea = document.querySelector('textarea');
    if (textarea) textarea.focus();
  };

  const scrollToMessage = (messageId) => {
    const target = messageRefs.current[messageId];
    if (target) {
      setIsUserScrolling(true); // Prevent auto-scroll conflicts
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('bg-indigo-100');
      target.classList.add('shadow-md', 'scale-[1.02]', 'transition-all', 'duration-300');

      setTimeout(() => {
        target.classList.remove('bg-indigo-100', 'shadow-md', 'scale-[1.02]');
        setIsUserScrolling(false);
      }, 2000);
    }
  };

  // Function to scroll to latest messages (for unread message indicator)
  const scrollToLatestMessages = () => {
    setPendingScroll('bottom');
    
    // Mark all unread messages as seen
    unreadMessages.forEach(msg => {
      socket.emit('markAsSeen', { messageId: msg._id, userId: finalUser._id });
    });
    setUnreadMessages([]);
  };

  const isMyMessage = useCallback((msg) => msg.sender._id === finalUser._id, [finalUser._id]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 overflow-hidden">
      {/* Chat Header - Fixed height with responsive padding */}
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

      {/* Messages Area - Takes remaining space with proper scrolling */}
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
              <div className="flex gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1 py-1 min-w-0">
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

      {/* File Preview - Conditional with max height */}
      {file && (
        <div className="flex-shrink-0 max-h-32 overflow-hidden border-t border-gray-200">
          <FilePreview file={file} onClear={() => setFile(null)} />
        </div>
      )}

      {/* Reply Preview - Conditional with max height */}
      {replyTo && (
        <div className="flex-shrink-0 max-h-20 overflow-hidden border-t border-gray-200">
          <ReplyPreview replyTo={replyTo} onClear={() => setReplyTo(null)} />
        </div>
      )}

      {/* Message Input - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <MessageInput
          text={text}
          setText={setText}
          handleSend={handleSend}
          handleTyping={handleTyping}
          triggerFileInput={triggerFileInput}
          disabled={isSending || (!text.trim() && !file)}
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