import React from 'react';
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
  ChannelHeader
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

const ChatModal = ({ client, channel, onClose }) => {
  const unreadCount = channel.countUnread()
  return (
    <div className="fixed bottom-0 right-0 z-50 w-full sm:bottom-4 sm:right-4 sm:w-full sm:max-w-sm">
      <div className="bg-white h-[90vh] sm:h-[500px] rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Chat</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-lg font-bold"
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-grow overflow-hidden">
          <Chat client={client} theme="str-chat__theme-light">
            <Channel channel={channel}>
              <Window>
                <ChannelHeader/>
                <MessageList  />
                <MessageInput />
              </Window>
              <Thread/>
            </Channel>
          </Chat>
        </div>
      </div>
      {unreadCount > 0 && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        {unreadCount}
      </span>
    )}
    </div>
    
  );
  
};

export default ChatModal;
