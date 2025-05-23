import { Send, Paperclip, FileText, Image, CheckCheck, CornerUpLeft, Trash2, X, Video,
  File,ExternalLink } from 'lucide-react';
  
export const MessageBubble = ({ message, isMyMessage, onReply, currentUser, socket, messageRef, scrollToMessage }) => {
  const { _id, text, mediaUrl, fileName, sender, createdAt, seenBy, deleted, replyTo } = message;
  
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
        return <Image size={24} className="text-blue-500" />;
      case 'video':
        return <Video size={24} className="text-purple-500" />;
      case 'pdf':
        return <FileText size={24} className="text-red-500" />;
      case 'document':
        return <FileText size={24} className="text-blue-500" />;
      default:
        return <File size={24} className="text-gray-500" />;
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
                  <div className={`${text ? 'mt-3' : ''} max-w-xs`}>
                    <div className="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                      {/* Media Preview Area */}
                      <div className="relative">
                        {fileType === 'image' ? (
                          <div className="bg-gray-50">
                            <img 
                              src={mediaUrl} 
                              alt="shared content" 
                              className="w-full h-auto max-h-48 object-contain rounded-t-lg" 
                              loading="lazy" 
                            />
                          </div>
                        ) : fileType === 'video' ? (
                          <div className="bg-gray-50">
                            <video
                              src={mediaUrl}
                              controls
                              className="w-full h-auto max-h-48 object-contain rounded-t-lg"
                            />
                          </div>
                        ) : (
                          <div className="h-32 w-full bg-gray-50 flex flex-col items-center justify-center p-4">
                            <div className="mb-2">{getFileIcon(fileType)}</div>
                            <div className="text-sm font-medium text-center text-gray-600 mb-1 truncate w-full">
                              {getFileName(fileName)}
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {fileType.toUpperCase()}
                            </div>
                          </div>
                        )}

                        {/* Hover overlay for non-image/video files */}
                        {fileType !== 'image' && fileType !== 'video' && (
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex items-center space-x-2 text-white">
                               <a href={`https://docs.google.com/gview?url=${encodeURIComponent(mediaUrl)}&embedded=true`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                              onClick={(e) => e.stopPropagation()}>
                                
                              <ExternalLink size={16} />
                              <span className="text-xs font-medium">Open</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* File Info Footer for non-image/video files */}
                      {fileType !== 'image' && fileType !== 'video' && (
                        <div className="p-2 bg-white border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium text-gray-700 truncate block">
                                {getFileName(fileName)}
                              </span>
                            </div>
                            <a
                              href={`https://docs.google.com/gview?url=${encodeURIComponent(mediaUrl)}&embedded=true`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={10} className="mr-1" />
                              View
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
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
