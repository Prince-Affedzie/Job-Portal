import React, { useEffect, useState, useRef, useCallback,useContext } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';
import { authenticateChat } from '../../APIS/API';
import 'stream-chat-react/dist/css/v2/index.css';
import {ChatContext} from '../../Context/ChatContext'


//const client = StreamChat.getInstance('c9tbyybnmgwt');

const ChatApp = ({ targetUserId, channelId }) => {
  const {client}  = useContext(ChatContext)
  const initializedUserIdRef = useRef(null);
  const [channel, setChannel] = useState(null);
  const [user, setUser] = useState(null);
  const membersRef = useRef([]);

  // Logs on rerender due to prop change
  useEffect(() => {
    console.log(" ChatApp rerendering with:", targetUserId);
  }, [targetUserId]);

  const createAndWatchChannel = useCallback(async (userData, token) => {
    const { id, name, image, targetUserData } = userData;

    // Connect user if not already connected
    if (!client.userID) {
      try {
        await client.connectUser({ id, name, image }, token);
        console.log(" Connected user to Stream:", client.userID);
      } catch (error) {
        console.error(" Failed to connect user:", error);
        return null;
      }
    }

    // Avoid duplicate member entries
    if (membersRef.current.length === 0) {
      membersRef.current = Array.from(new Set([id, targetUserData.id]));
    }

    const finalChannelId = channelId || `chat-${id}-${targetUserData.id}`;
    console.log(` Creating channel with ID: ${finalChannelId}`);
    console.log(` Members: ${membersRef.current}`);

    const newChannel = client.channel('messaging', finalChannelId, {
      image: 'https://getstream.io/random_png/?name=job-chat',
      //name: 'Job Chat',
      members: membersRef.current,
    });

    try {
      await newChannel.watch();
      console.log(" Channel watched successfully:", newChannel.id);
      return newChannel;
    } catch (err) {
      console.error(" Error watching channel:", err);
      return null;
    }
  }, [channelId]);

  useEffect(() => {
    if (!targetUserId || initializedUserIdRef.current === targetUserId) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        console.log("🚀 Fetching chat data for target:", targetUserId);
        const response = await authenticateChat(targetUserId);
        const { userData, token } = response.data;

        const newChannel = await createAndWatchChannel(userData, token);

        if (isMounted && newChannel) {
          console.log(" Setting user and channel:", userData.id, newChannel.id);
          setChannel(newChannel);
          setUser(userData);
          initializedUserIdRef.current = targetUserId;
        } else {
          console.warn(" Failed to create channel or not mounted");
        }
      } catch (error) {
        console.error(' Error setting up chat:', error);
      }
    };

    // Reset members when target user changes
    membersRef.current = [];
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [targetUserId, createAndWatchChannel]);

  // Disconnect on unmount
 

  if (!channel || !user) {
    return (
      <div>
        Loading chat...
       
      </div>
    );
  }

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default ChatApp;
