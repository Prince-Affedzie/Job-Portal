import React from 'react';
import StartChatButton from "../MessagingComponents/StartChatButton";

const BidCard = ({ bid, onAccept, onViewProfile, onChat, isAccepted, isProcessing, compact }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <img 
            src={bid.bidder.profileImage|| '/default-avatar.png'} 
            alt={bid.bidder.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{bid.bidder.name}</h3>
            <p className="text-sm text-gray-500">{bid.bidder.title || 'Freelancer'}</p>
          </div>
        </div>
        {bid.bidder.verificationStatus && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Verified</span>
        )}
      </div>
      
      <div className="mb-4 flex-grow">
        <p className="text-gray-700 text-sm mb-2">{bid.message}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Bid Amount:</span>
          <span className="font-semibold">${bid.amount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Timeline:</span>
          <span className="text-sm">{bid.timeline}</span>
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => onViewProfile(bid.bidder)}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
          >
            View Profile
          </button>
          
        </div>
        
        <button
          onClick={() => onAccept(bid._id, bid.bidder.name)}
          disabled={isProcessing || isAccepted}
          className={`w-full py-2 rounded-md text-sm font-medium ${
            isAccepted 
              ? 'bg-green-600 text-white' 
              : isProcessing
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isAccepted ? 'Accepted' : isProcessing ? 'Processing...' : 'Accept Bid'}
        </button>
      </div>
    </div>
  );
};

export default BidCard;