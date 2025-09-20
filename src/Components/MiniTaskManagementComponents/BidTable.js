import React from 'react';
import StartChatButton from "../MessagingComponents/StartChatButton";

const BidTable = ({ bids, sortConfig, onSort, onViewProfile, onAccept, isProcessing, acceptedBidId, isMobile }) => {
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    onSort(key, direction);
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) return;
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              onClick={() => requestSort('bidder.name')}
            >
              Freelancer
            </th>
            <th 
              scope="col" 
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              onClick={() => requestSort('amount')}
            >
              Bid Amount
            </th>
            <th 
              scope="col" 
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              onClick={() => requestSort('timeline')}
            >
              Timeline
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Message
            </th>
            <th scope="col" className="relative px-3 py-3.5">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {bids.map((bid) => (
            <tr key={bid._id}>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img className="h-10 w-10 rounded-full object-cover" src={bid.bidder.profileImage|| '/default-avatar.png'} alt={bid.bidder.name} />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{bid.bidder.name}</div>
                    <div className="text-gray-500">{bid.bidder.title || 'Freelancer'}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                <span className="font-semibold">₵{bid.amount}</span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                {bid.timeline}
              </td>
              <td className="px-3 py-4 text-sm text-gray-900">
                <div className="max-w-xs truncate">{bid.message}</div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onViewProfile(bid.bidder)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Profile
                  </button>
                  
                  <button
                    onClick={() => onAccept(bid._id, bid.bidder.name)}
                    disabled={isProcessing || acceptedBidId === bid._id}
                    className={`px-3 py-1 rounded text-sm ${
                      acceptedBidId === bid._id
                        ? 'bg-green-100 text-green-800'
                        : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                    }`}
                  >
                    {acceptedBidId === bid._id ? 'Accepted' : 'Accept'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BidTable;