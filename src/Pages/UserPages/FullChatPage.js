// src/pages/FullChatPage.jsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
  Thread,
  useChannelStateContext,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { authenticateChat } from '../../APIS/API';
import { ChatContext } from '../../Context/ChatContext';
import Navbar from '../../Components/Common/Navbar';
import Footer from '../../Components/Common/Footer';
import '../../Styles/FullChats.css'
import { 
  FaSearch, 
  FaEllipsisH, 
  FaArrowLeft, 
  FaPaperPlane, 
  FaPaperclip,
  FaSmile,
  FaUserCircle,
  FaCalendarAlt,
  FaCog,
  FaBell
} from 'react-icons/fa';

// Custom Channel Preview Component
const CustomChannelPreview = ({ channel, setActiveChannel, active }) => {
  const {client} = useContext( ChatContext)
  const { messages } = useChannelStateContext();
  const [lastMessage, setLastMessage] = useState('');
  const [unread, setUnread] = useState(0);
  const [channelData, setChannelData] = useState({
    name: '',
    image: '',
    online: false
  });

  useEffect(() => {
    const getChannelData = async () => {
      const members = Object.values(channel.state.members)
        .filter(member => member.user.id !== client.userID);
      
      const otherUser = members.length > 0 ? members[0].user : null;
      
      if (channel.data.name) {
        // Group channel
        setChannelData({
          name: channel.data.name,
          image: channel.data.image || '',
          online: false
        });
      } else if (otherUser) {
        // Direct message channel
        setChannelData({
          name: otherUser.name || 'Unknown User',
          image: otherUser.image || '',
          online: otherUser.online || false
        });
      }

      // Get unread count
      const count = await channel.countUnread();
      setUnread(count);
    };

    getChannelData();

    // Get last message
    const messageList = channel.state.messages;
    if (messageList.length > 0) {
      const lastMsg = messageList[messageList.length - 1];
      setLastMessage(lastMsg.text || 'Sent an attachment');
    } else {
      setLastMessage('No messages yet');
    }
  }, [channel, messages]);

  return (
    <div 
      className={`flex items-center p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${active ? 'bg-gray-100' : ''}`}
      onClick={() => setActiveChannel(channel)}
    >
      <div className="relative mr-3">
        {channelData.image ? (
          <img 
            src={channelData.image} 
            alt={channelData.name} 
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold">
            {channelData.name.charAt(0).toUpperCase()}
          </div>
        )}
        {channelData.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900 truncate">{channelData.name}</h4>
          <span className="text-xs text-gray-500">
            {new Date(channel.data.last_message_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
          {unread > 0 && (
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Custom Message Input Component
const CustomMessageInput = ({ ...props }) => {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = inputRef.current.value;
    if (message.trim()) {
      props.sendMessage({ text: message });
      inputRef.current.value = '';
    }
  };

  return (
    <div className="p-3 bg-white border-t" >
      <form onSubmit={handleSubmit} className="flex flex-row items-center">
        <button 
          type="button" 
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <FaPaperclip size={18} />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-blue-500 mx-2"
        />
        <button 
          type="button" 
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <FaSmile size={18} />
        </button>
        <button 
          type="submit" 
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          <FaPaperPlane size={16} />
        </button>
      </form>
    </div>
  );
};

// Custom Channel Header
const CustomChannelHeader = ({ setActiveChannel, channel }) => {
  const [channelData, setChannelData] = useState({
    name: '',
    image: '',
    online: false,
    lastActive: ''
  });

  /*useEffect(() => {
    if (channel) {
      const members = Object.values(channel.state.members)
        .filter(member => member.user.id !== client?.userID);
      
      const otherUser = members.length > 0 ? members[0].user : null;
      
      if (channel.data.name) {
        // Group channel
        setChannelData({
          name: channel.data.name,
          image: channel.data.image || '',
          online: false,
          members: members.length
        });
      } else if (otherUser) {
        // Direct message channel
        setChannelData({
          name: otherUser.name || 'Unknown User',
          image: otherUser.image || '',
          online: otherUser.online || false,
          lastActive: otherUser.last_active ? new Date(otherUser.last_active).toLocaleString() : 'Unknown'
        });
      }
    }
  }, [channel]); */

  return (
    <div className="p-3 bg-white border-b flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        {/* Back button for mobile */}
        <button 
          onClick={() => setActiveChannel(null)}
          className="md:hidden p-2 text-blue-600 mr-2"
        >
          <FaArrowLeft size={16} />
        </button>
        
        {/* User/Channel Avatar */}
        {channelData.image ? (
          <img 
            src={channelData.image} 
            alt={channelData.name} 
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold mr-3">
            {channelData.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* User/Channel Info */}
        <div>
          <h2 className="font-semibold text-gray-900">{channelData.name}</h2>
          <p className="text-xs text-gray-500">
            {channelData.online ? 'Online now' : 
              channelData.members ? `${channelData.members} members` : 
              `Last active: ${channelData.lastActive}`
            }
          </p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center">
        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
          <FaSearch size={16} />
        </button>
        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
          <FaBell size={16} />
        </button>
        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
          <FaEllipsisH size={16} />
        </button>
      </div>
    </div>
  );
};

// Sidebar Component
const ChatSidebar = ({ user, setActiveChannel, activeChannel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="h-full flex flex-col border-r bg-white">
      {/* Sidebar Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100">
            <FaCog size={18} />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100">
            <FaCalendarAlt size={18} />
          </button>
        </div>
      </div>
      
      {/* Search Box */}
      <div className="p-3">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" size={16} />
        </div>
      </div>
      
      {/* User Profile Summary */}
      <div className="p-3 border-b flex items-center">
        {user.image ? (
          <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
        ) : (
          <FaUserCircle size={40} className="text-gray-400 mr-3" />
        )}
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-xs text-green-500">Active now</p>
        </div>
      </div>
      
      {/* Channel List */}
      <div className="flex-1 overflow-y-auto">
        <ChannelList
          filters={{ members: { $in: [user.id] } }}
          sort={{ last_message_at: -1 }}
          options={{ state: true, watch: true }}
          Preview={(previewProps) => (
            <CustomChannelPreview 
              {...previewProps} 
              setActiveChannel={setActiveChannel}
              active={previewProps.channel?.id === activeChannel?.id}
            />
          )}
        />
      </div>
    </div>
  );
};

const FullChatPage = () => {
  const { client } = useContext(ChatContext);
  const [chatClient, setChatClient] = useState(null);
  const [user, setUser] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showThread, setShowThread] = useState(false);

  useEffect(() => {
    const setupChat = async () => {
      try {
        const response = await authenticateChat();
        const { userData, token } = response.data;

        await client.connectUser(
          {
            id: userData.id,
            name: userData.name,
            image: userData.image,
          },
          token
        );

        setChatClient(client);
        setUser(userData);
      } catch (error) {
        console.error('Error setting up Stream Chat:', error);
      }
    };

    setupChat();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => {
      if (client.userID) {
        client.disconnectUser();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [client]);

  if (!chatClient || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full bg-white shadow-lg rounded-lg overflow-hidden my-4">
        <Chat client={chatClient} theme="str-chat__theme-light">
          {isMobile ? (
            <>
              {/* Mobile View */}
              {!activeChannel ? (
                <div className="w-full h-[calc(100vh-120px)]">
                  <ChatSidebar 
                    user={user} 
                    setActiveChannel={setActiveChannel} 
                    activeChannel={activeChannel}
                  />
                </div>
              ) : (
                <Channel channel={activeChannel}>
                  <Window>
                    <CustomChannelHeader setActiveChannel={setActiveChannel} channel={activeChannel} />
                    <MessageList 
                      hideDeletedMessages
                      messageActions={["edit", "delete", "flag", "react"]}
                    />
                    <CustomMessageInput />
                  </Window>
                  {showThread && <Thread onClose={() => setShowThread(false)} />}
                </Channel>
              )}
            </>
          ) : (
            // Desktop View
            <div className="flex h-[calc(100vh-120px)]">
              <div className="w-1/3 lg:w-1/4">
                <ChatSidebar 
                  user={user} 
                  setActiveChannel={setActiveChannel} 
                  activeChannel={activeChannel}
                />
              </div>
              <div className="flex-1 bg-gray-50">
                {activeChannel ? (
                  <Channel channel={activeChannel}>
                    <Window>
                      <CustomChannelHeader setActiveChannel={setActiveChannel} channel={activeChannel} />
                      <MessageList 
                        hideDeletedMessages
                        messageActions={["edit", "delete", "flag", "react"]}
                        onThreadClick={() => setShowThread(true)}
                      />
                      <CustomMessageInput />
                    </Window>
                    {showThread && (
                      <div className="absolute right-0 top-0 bg-white h-full border-l w-1/3">
                        <Thread onClose={() => setShowThread(false)} />
                      </div>
                    )}
                  </Channel>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center p-6">
                      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <FaPaperPlane className="text-blue-600" size={32} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Messages</h3>
                      <p className="text-gray-500 mb-6">Select a conversation or start a new one</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Chat>
      </div>

      <Footer />
    </div>
  );
};

export default FullChatPage;