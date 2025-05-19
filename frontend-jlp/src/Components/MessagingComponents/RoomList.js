import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';

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

const RoomList = ({ loading,rooms, selectedRoomId, setSelectedRoomId, currentUserId, onlineUserIds }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search update
  const debouncedUpdate = useMemo(
    () => debounce((val) => setSearchTerm(val), 300),
    []
  );

  useEffect(() => {
    debouncedUpdate(searchInput);
    return () => debouncedUpdate.cancel();
  }, [searchInput]);

  // Filtered room list based on name match
  const filteredRooms = rooms.filter((room) => {
    const otherUser = room.participants.find((p) => p._id !== currentUserId);
    return( 
      otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.job?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  });

  return (
    <div className="w-full md:w-72 bg-white border-r h-full overflow-y-auto">
      <h2 className="text-lg font-semibold p-4 border-b">Chats</h2>

      {/* Search box */}
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

      {/* Room list */}
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
) :filteredRooms.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">No matching chats.You must have a Connection with Clients or Freelancers First. </div>
      ) : (
        filteredRooms.map((room) => {
          const otherUser = room.participants.find((p) => p._id !== currentUserId);
          const isOnline = onlineUserIds.includes(otherUser?._id);

          return (
            <div
              key={room._id}
              onClick={() => setSelectedRoomId(room._id)}
              className={`p-3 cursor-pointer border-b hover:bg-gray-100 ${
                selectedRoomId === room._id ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <img
                    src={otherUser?.profileImage || '/default-avatar.png'}
                    alt={otherUser?.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
 
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                   {highlightMatch(otherUser?.name || 'User', searchTerm)}
                  </span>
                  {room.unreadCount > 0 && (
                 <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 ml-2 whitespace-nowrap">
                 {room.unreadCount}
               </span>
                 )}
              </div>
                 <span className="text-xs font-medium text-indigo-600 truncate max-w-[160px]">
                    {room.job?.title || room.jobTitle || 'Untitled Job'}
                    </span>
                  <span className="text-xs text-gray-500 truncate max-w-[200px]">
                  {room.lastMessage || 'No messages yet'}
              </span>
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
