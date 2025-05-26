import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const highlightMatch = (text, search) => {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const RoomList = ({ loading, rooms, setRooms, socket, selectedRoomId, setSelectedRoomId, currentUserId, onlineUserIds }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedUpdate = useMemo(() => debounce((val) => setSearchTerm(val), 300), []);

  useEffect(() => {
    debouncedUpdate(searchInput);
    return () => debouncedUpdate.cancel();
  }, [searchInput]);

  const filteredRooms = rooms.filter((room) => {
    const otherUser = room.participants.find((p) => p._id !== currentUserId);
    return (
      otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.job?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const now = dayjs();
    const date = dayjs(timestamp);
    if (now.diff(date, 'day') >= 1) {
      return date.format('MMM D'); // e.g., "May 18"
    } else {
      return date.format('h:mm A'); // e.g., "2:15 PM"
    }
  };


  
   useEffect(() => {
      if (!socket) return;
  
      const handleRoomUpdate = (updatedRoom) => {
        setRooms(prev => {
          const roomExists = prev.find(r => r._id.toString() === updatedRoom._id.toString());
          if (roomExists) {
            return prev.map(r => r._id === updatedRoom._id ? {
              ...r,
              ...updatedRoom, // This brings in lastMessage, lastMessageAt, unreadCounts
            } : r);
          } else {
            return [updatedRoom, ...prev];
          }
        });
      };

       const handleMessageSeen = ({ messageId, userId, roomId }) => {
      // Only update if the current user marked the message as seen
      if (userId === currentUserId) {
        setRooms(prev => 
          prev.map(room => {
            if (room._id === roomId) {
              return {
                ...room,
                unreadCounts: {
                  ...room.unreadCounts,
                  [currentUserId]: 0 // Reset unread count for the current user
                }
              };
            }
            return room;
          })
        );
      }
    };
  
      socket.on("updatedRoom", (room) => {
        handleRoomUpdate(room);
      });

     socket.on("messageSeen", handleMessageSeen);
  
      return () => {
        socket.off("updatedRoom");
       socket.off('messageSeen');
      };
    }, [socket, setRooms,currentUserId]);

  return (
    <div className="w-full md:w-75 bg-white  h-full overflow-y-auto">
      <h2 className="text-lg font-semibold p-4 border-b">Chats</h2>

      {/* Search */}
      <div className="relative px-4 pb-3">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search by name or Job Title..."
          className="w-full pl-8 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:border-blue-400"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Room List */}
      {loading ? (
        <div className="space-y-4 px-4 py-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-200 rounded w-2/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">
          No matching chats. You must have a connection with clients or freelancers first.
        </div>
      ) : (
        filteredRooms.map((room) => {
          const otherUser = room.participants.find((p) => p._id !== currentUserId);
          const isOnline = onlineUserIds.includes(otherUser?._id);
          const unreadCount = room.unreadCounts?.[currentUserId] || 0;

          return (
            <div
              key={room._id}
              onClick={() => setSelectedRoomId(room._id)}
              className={`p-3 cursor-pointer border-b hover:bg-gray-100 transition ${
                selectedRoomId === room._id ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative w-10 h-10 shrink-0">
                  <img
                    src={otherUser?.profileImage || '/default-avatar.png'}
                    alt={otherUser?.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-col flex-1 min-w-0">
                  {/* Top Row: Name and Time */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">
                      {highlightMatch(otherUser?.name || 'User', searchTerm)}
                    </span>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                      {formatTime(room.lastMessageAt)}
                    </span>
                  </div>

                  {/* Job Title */}
                  <span className="text-xs text-indigo-600 font-medium truncate">
                    {highlightMatch(room.job?.title || room.jobTitle || 'Untitled Job', searchTerm)}
                  </span>

                  {/* Last Message + Unread Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 truncate max-w-[160px]">
                      {room.lastMessage || 'No messages yet'}
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 ml-2">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default RoomList;
