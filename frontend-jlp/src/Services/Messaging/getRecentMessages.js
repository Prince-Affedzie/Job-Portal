export const getRecentMessages = async (client) => {
    const filters = { type: 'messaging', members: { $in: [client.userID] } };
    const sort = [{ last_message_at: -1 }];
    const channels = await client.queryChannels(filters, sort, { watch: true, state: true });
  
    const messages = channels.map((channel) => {
      const lastMessage = channel.state.messages[channel.state.messages.length - 1];
  
      return {
        id: channel.id,
        senderName: lastMessage?.user?.name || 'Unknown', // 🔐 safe access
        text: lastMessage?.text || 'No message yet.',
        time: lastMessage?.created_at || channel.state.last_message_at || 'Unknown time',
        channel,
      };
    });
  
    return messages;
  };
  