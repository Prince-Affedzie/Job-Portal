import React from 'react';
import { FaStar, FaRegStar, FaCheckCircle, FaTimesCircle, FaEllipsisV } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom'

const ApplicantScoreCard = ({ 
  applicant, 
  onAssign, 
  onViewProfile, 
  onChat, 
  isAssigned, 
  isProcessing 
}) => {
  const navigate = useNavigate()
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline opacity-70" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 inline opacity-40" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 flex items-start space-x-4">
        <div className="relative">
          <img
            src={applicant.profileImage || "/default-profile.png"}
            alt={applicant.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
            onError={(e) => { e.target.src = "/default-profile.png" }}
          />
          <div className={`absolute -bottom-1 -right-1 rounded-full p-1 flex items-center ${applicant.isVerified ? 'bg-blue-500' : 'bg-red-500'}`}>
            {applicant.isVerified ? (
              <>
                <FaCheckCircle className="text-white text-xs" />
                <span className="text-white text-[10px] ml-1 hidden sm:inline">Verified</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-white text-xs" />
                <span className="text-white text-[10px] ml-1 hidden sm:inline">Not Verified</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-800">{applicant.name}</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <FaEllipsisV />
            </button>
          </div>
          <p className="text-xs text-gray-500">{applicant.phone}</p>
          <div className="flex items-center mt-1">
            <div className="flex mr-2">
              {renderStars(applicant.rating)}
            </div>
            <span className="text-xs text-gray-500">
              {applicant.rating} ({applicant.numberOfRatings || 0})
            </span>
          </div>
        </div>
      </div>
      
      {/* Score Breakdown */}
      <div className="px-4 pb-3 space-y-3">
        <ScoreProgressBar 
          label="Skills Match" 
          value={applicant.skillsScore} 
          color="bg-blue-500"
        />
        <ScoreProgressBar 
          label="Experience" 
          value={applicant.expScore} 
          color="bg-purple-500"
        />
      </div>
      
      {/* Total Score */}
      <div className="px-4 py-2 bg-gray-50 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Total Match</span>
        <span className="text-lg font-bold text-blue-600">
          {applicant.totalScore}%
        </span>
      </div>
      
      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex space-x-2">
        <button
          onClick={() => onViewProfile(applicant)}
        className="text-xs bg-white hover:bg-blue-50 text-blue-600 py-1 px-3 rounded border border-blue-500 transition-colors shadow-sm"
        >
          View Profile
        </button>
        
        {!isAssigned ? (
          <button
            onClick={() => onAssign(applicant._id, applicant.name)}
            disabled={isProcessing}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              isProcessing 
                ? 'bg-blue-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isProcessing ? 'Assigning...' : 'Assign'}
          </button>
        ) : (
          <button
            onClick={() =>navigate('/messages')}
            className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Chat
          </button>
        )}
      </div>
    </div>
  );
};

const ScoreProgressBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export default ApplicantScoreCard;