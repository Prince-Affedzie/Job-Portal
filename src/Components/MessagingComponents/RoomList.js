import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, MessageCircle, Users, Clock, CheckCheck, Circle, User, Briefcase } from 'lucide-react';
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
      <mark key={index} className="bg-blue-100 text-blue-800 px-1 rounded-sm font-medium">
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
  }, [socket, setRooms, currentUserId]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarGradient = (name) => {
    if (!name) return 'from-gray-400 to-gray-600';
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-green-400 to-green-600',
      'from-red-400 to-red-600',
      'from-yellow-400 to-yellow-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-teal-400 to-teal-600',
      'from-orange-400 to-orange-600',
      'from-cyan-400 to-cyan-600'
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="w-full md:w-75 bg-gradient-to-b from-gray-50 to-white h-full flex flex-col shadow-lg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-500">{filteredRooms.length} conversations</p>
            </div>
          </div>

          {/* Enhanced Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or job title..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200 hover:bg-white"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 animate-pulse">
                <div className="w-14 h-14 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
                  <div className="h-3 bg-gray-200 rounded-lg w-2/3" />
                </div>
                <div className="w-12 h-3 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              {searchTerm ? 
                "Try searching with different keywords or check your spelling." :
                "You must have a connection with clients or freelancers first."
              }
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredRooms.map((room, index) => {
              const otherUser = room.participants.find((p) => p._id !== currentUserId);
              const isOnline = onlineUserIds.includes(otherUser?._id);
              const unreadCount = room.unreadCounts?.[currentUserId] || 0;
              const isSelected = selectedRoomId === room._id;
              const userName = otherUser?.name || 'Unknown User';
              const userInitials = getInitials(userName);

              return (
                <div
                  key={room._id}
                  onClick={() => setSelectedRoomId(room._id)}
                  className={`group relative p-3 m-2 cursor-pointer rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md ${
                    isSelected 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg' 
                      : 'bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Enhanced Avatar with Fallback */}
                    <div className="relative flex-shrink-0">
                      {otherUser?.profileImage ? (
                        <img
                          src={otherUser.profileImage}
                          alt={userName}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-lg"
                          onError={(e) => {
                            // If image fails to load, replace with fallback
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback Avatar - Always present but hidden if image loads */}
                      <div 
                        className={`w-14 h-14 rounded-full bg-gradient-to-br ${getAvatarGradient(userName)} flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white ${otherUser?.profileImage ? 'hidden' : 'flex'}`}
                      >
                        {userInitials}
                      </div>
                      
                      {/* Online Status Indicator */}
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Top Row: Name and Time */}
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold truncate max-w-[180px] ${
                          unreadCount > 0 ? 'text-blue-600' : 'text-gray-800'
                        } ${isSelected ? 'text-blue-900' : ''}`}>
                          {highlightMatch(userName, searchTerm)}
                        </h3>
                        <div className="flex items-center gap-2">
                          {room.lastMessageAt && (
                            <span className={`text-xs font-medium ${
                              unreadCount > 0 ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {formatTime(room.lastMessageAt)}
                            </span>
                          )}
                          {unreadCount > 0 && (
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Job Title with Icon */}
                      {room.job?.title || room.jobTitle ? (
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase size={12} className="text-indigo-500 flex-shrink-0" />
                          <span className="text-xs font-medium text-indigo-600 truncate">
                            {highlightMatch(room.job?.title || room.jobTitle, searchTerm)}
                          </span>
                        </div>
                      ) : null}

                      {/* Last Message */}
                      <div className="flex items-center gap-2">
                        <p className={`text-sm truncate max-w-[200px] ${
                          room.lastMessage 
                            ? unreadCount > 0 
                              ? 'text-gray-800 font-semibold' 
                              : 'text-gray-600'
                            : 'text-gray-400 italic'
                        }`}>
                          {room.lastMessage || 'No messages yet'}
                        </p>
                        {room.lastMessage && unreadCount === 0 && (
                          <CheckCheck size={14} className="text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Accent */}
                  <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full transition-all duration-200 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;