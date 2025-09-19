import React from 'react';
import { FaSort, FaSortUp, FaSortDown,FaRegStar, FaStar, FaCheckCircle } from 'react-icons/fa';

const ApplicantScoreTable = ({ 
  applicants, 
  sortConfig, 
  onSort, 
  onViewProfile,
  onAssign,
  isProcessing,
  assignedApplicantId
}) => {
  const requestSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSort(key, direction);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-300 ml-1" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="text-blue-500 ml-1" /> 
      : <FaSortDown className="text-blue-500 ml-1" />;
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      i < Math.floor(rating) 
        ? <FaStar key={i} className="text-yellow-400 inline text-xs" />
        : <FaRegStar key={i} className="text-yellow-400 inline text-xs opacity-40" />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center">
                  Applicant
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('skillsScore')}
              >
                <div className="flex items-center">
                  Skills
                  {getSortIcon('skillsScore')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('expScore')}
              >
                <div className="flex items-center">
                  Experience
                  {getSortIcon('expScore')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('totalScore')}
              >
                <div className="flex items-center">
                  Total Score
                  {getSortIcon('totalScore')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applicants.map((applicant) => (
              <tr key={applicant._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={applicant.profileImage || "/default-profile.png"}
                        alt={applicant.name}
                        onError={(e) => { e.target.src = "/default-profile.png" }}
                      />
                      {applicant.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                          <FaCheckCircle className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{applicant.name}({applicant.phone})</div>
                      <div className="text-sm text-gray-500">
                        {renderStars(applicant.rating)}
                        <span className="ml-1 text-xs">({applicant.numberOfRatings || 0})</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ScoreCell value={applicant.skillsScore} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ScoreCell value={applicant.expScore} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      applicant.totalScore > 75 ? 'bg-green-100 text-green-800' :
                      applicant.totalScore > 50 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {applicant.totalScore}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onViewProfile(applicant)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    {assignedApplicantId !== applicant._id ? (
                      <button
                        onClick={() => onAssign(applicant._id, applicant.name)}
                        disabled={isProcessing}
                        className={`${
                          isProcessing ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        Assign
                      </button>
                    ) : (
                      <span className="text-green-600">Assigned</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ScoreCell = ({ value }) => (
  <div className="flex items-center">
    <div className="w-16 mr-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full bg-blue-500"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
    <span className="text-sm font-medium">{value}%</span>
  </div>
);

export default ApplicantScoreTable;