import { Send, Paperclip, FileText, Image, CheckCheck, CornerUpLeft, Trash2, X, Video,
  File, ExternalLink } from 'lucide-react';
import { useState } from 'react';
  
export const MessageBubble = ({ message, isMyMessage, onReply, currentUser, socket, messageRef, scrollToMessage }) => {
  const { _id, text, mediaUrl, fileName, sender, createdAt, seenBy, deleted, replyTo } = message;
  const [showImageModal, setShowImageModal] = useState(false);
  
  const handleDelete = () => {
    socket.emit('deleteMessage', { messageId: _id, userId: currentUser._id });
  };
  
  const getFileType = (mediaUrl) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl)) {
      return 'image';
    } else if (/\.(mp4|webm|mov|avi|wmv)$/i.test(mediaUrl)) {
      return 'video';
    } else if (/\.(pdf)$/i.test(mediaUrl)) {
      return 'pdf';
    } else if (/\.(doc|docx)$/i.test(mediaUrl)) {
      return 'document';
    } else {
      return 'other';
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image':
        return <Image size={20} className="text-blue-500" />;
      case 'video':
        return <Video size={20} className="text-purple-500" />;
      case 'pdf':
        return <FileText size={20} className="text-red-500" />;
      case 'document':
        return <FileText size={20} className="text-blue-500" />;
      default:
        return <File size={20} className="text-gray-500" />;
    }
  };

  const getFileName = (fileName) => {
    if (!fileName) return 'Shared file';
    return fileName;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fileType = getFileType(mediaUrl);

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (fileType === 'image') {
      setShowImageModal(true);
    }
  };

  const closeImageModal = (e) => {
    e.stopPropagation();
    setShowImageModal(false);
  };

  return (
    <>
      <div
        ref={messageRef}
        className={`group flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-3 px-3 sm:px-4 `}
      >
        <div className={`flex ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[85%] sm:max-w-[60%]`}>
          {/* Avatar - only show for other users */}
          {!isMyMessage && (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs sm:text-sm font-medium shadow-sm mb-1">
              {sender.name ? sender.name[0].toUpperCase() : '?'}
            </div>
          )}
          
          <div className="flex flex-col min-w-0 flex-1">
            {/* Sender name for group chats (optional) */}
            {!isMyMessage && sender.name && (
              <div className="text-xs text-gray-500 mb-1 ml-3 font-medium">
                {sender.name}
              </div>
            )}
            
            <div
              className={`relative px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-lg ${
                isMyMessage
                  ? 'bg-gradient-to-r from-purple-500 via-purple-500 to-indigo-600 text-white rounded-br-md shadow-pink-200/50'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
              }`}
            >
              {deleted ? (
                <p className="italic text-gray-500 text-sm">This message was deleted</p>
              ) : (
                <>
                  {/* Reply Preview */}
                  {replyTo && (
                    <div 
                      className={`mb-2 text-xs rounded-lg px-3 py-2 cursor-pointer transition-all duration-200 ${
                        isMyMessage 
                          ? 'bg-white/20 border-l-2 border-white/50 hover:bg-white/30 backdrop-blur-sm' 
                          : 'bg-gray-50 border-l-2 border-gray-300 hover:bg-gray-100'
                      }`}
                      onClick={() => scrollToMessage && scrollToMessage(replyTo._id)}
                    >
                      <p className={`text-[10px] font-semibold mb-1 ${
                        isMyMessage ? 'text-white/90' : 'text-blue-600'
                      }`}>
                        {replyTo.sender?.name || 'User'}
                      </p>
                      <p className={`text-[11px] line-clamp-2 break-words ${
                        isMyMessage ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {replyTo.text || replyTo.fileName || '[Media]'}
                      </p>
                    </div>
                  )}

                  {/* Text Content */}
                  {text && (
                      <p className="break-words whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {text}
                    </p>
                  )}
                  
                  {/* Media Content */}
                  {mediaUrl && (
                 <div className={`${text ? 'mt-2' : ''} w-full max-w-full overflow-hidden`}>
                 <div className={`relative group border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 ${
                   isMyMessage ? 'border-white/30 bg-white/10 backdrop-blur-sm' : 'border-gray-200 bg-white'
                 }`}>
               {/* Media Preview */}
                  <div className="relative">
                    {fileType === 'image' ? (
                    <div className={`cursor-pointer ${isMyMessage ? 'bg-white/10' : 'bg-gray-50'}`} onClick={handleImageClick}>
                   <img 
                  src={mediaUrl} 
                  alt="shared content" 
                  className="w-full h-auto max-h-64 sm:max-h-80 object-contain hover:opacity-90 transition-opacity" 
                  loading="lazy" 
                />
                {/* Click indicator overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50 rounded-full p-2">
                    <ExternalLink size={20} className="text-white" />
                  </div>
                </div>
               </div>
             ) : fileType === 'video' ? (
              <div className={`${isMyMessage ? 'bg-white/10' : 'bg-gray-50'}`}>
               <video
                src={mediaUrl}
                controls
                className="w-full h-auto max-h-64 sm:max-h-80 object-contain"
                preload="metadata"
              />
            </div>
          ) : (
            <div className={`h-auto w-full max-w-full flex flex-wrap sm:flex-nowrap items-center gap-2 p-3 overflow-hidden ${
              isMyMessage ? 'bg-white/10' : 'bg-gray-50'
            }`}>
              <div className="flex-shrink-0">{getFileIcon(fileType)}</div>
              <div className="flex-1 min-w-0 break-words overflow-hidden">
                <div className={`text-sm font-medium truncate break-all max-w-[160px] sm:max-w-[220px] ${
                  isMyMessage ? 'text-white/90' : 'text-gray-700'
                }`}>
                  {getFileName(fileName)}
                </div>
                <div className={`text-xs mt-1 ${
                  isMyMessage ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {fileType.toUpperCase()} FILE
                </div>
              </div>
              <div className="flex-shrink-0 ml-auto">
                <a
                  href={`https://docs.google.com/gview?url=${encodeURIComponent(mediaUrl)}&embedded=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full transition-colors ${
                    isMyMessage 
                      ? 'text-white/80 hover:bg-white/20' 
                      : 'text-blue-600 hover:bg-blue-200'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
  }

                  {/* Action Buttons - Only show on hover/touch */}
                  <div className={`absolute -top-8 ${isMyMessage ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 z-10`}>
                    <button
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => onReply(message)}
                      title="Reply"
                    >
                      <CornerUpLeft size={12} />
                      <span className="hidden sm:inline">Reply</span>
                    </button>
                    
                    {isMyMessage && (
                      <button
                        onClick={handleDelete}
                        className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg transition-all duration-200"
                        title="Delete Message"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Time and Status */}
            <div className={`flex items-center text-xs text-gray-500 mt-1 gap-1 ${
              isMyMessage ? 'justify-end mr-2' : 'justify-start ml-2'
            }`}>
              <span>{formatTime(createdAt)}</span>
              {isMyMessage && seenBy && seenBy.length > 1 && (
                <CheckCheck size={12} className="text-pink-400 ml-1" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal with Scrolling */}
      {showImageModal && fileType === 'image' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-start justify-center z-50 overflow-auto"
          onClick={closeImageModal}
        >
          {/* Scrollable container */}
          <div className="w-full h-full overflow-auto flex items-start justify-center py-4 px-4">
            <div className="relative min-h-full flex items-center justify-center">
              {/* Close Button - Fixed position */}
              <button
                onClick={closeImageModal}
                className="fixed top-4 right-4 z-10 bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-70 transition-all duration-200 backdrop-blur-sm"
                title="Close"
              >
                <X size={24} />
              </button>
              
              {/* Full Size Image Container */}
              <div className="relative max-w-full">
                <img
                  src={mediaUrl}
                  alt="Full size view"
                  className="max-w-full h-auto object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    maxHeight: 'none', // Allow full height
                    minHeight: 'auto'
                  }}
                />
                
                {/* Optional: Image info overlay */}
                {fileName && (
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
                    {fileName}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Scroll hint for mobile */}
        
        </div>
      )}
    </>
  );
};