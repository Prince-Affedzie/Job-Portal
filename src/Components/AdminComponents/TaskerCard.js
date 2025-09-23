import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { MapPin, Star, Mail, Phone, Calendar, User } from 'lucide-react';

export const TaskerCard = ({ tasker }) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate()

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getVettingColor = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      not_applied: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 mb-4"> {/* Added mb-4 for spacing */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {tasker.profileImage ? (
              <img 
                src={tasker.profileImage} 
                alt={tasker.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-gray-200">
                {tasker.name?.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3"> {/* Increased mb-2 to mb-3 */}
                <h3 className="text-lg font-semibold text-gray-900 truncate">{tasker.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tasker.isActive ? 'active' : 'inactive')}`}>
                    {tasker.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVettingColor(tasker.vettingStatus)}`}>
                    {tasker.vettingStatus?.replace('_', ' ')}
                  </span>
                  {tasker.isVerified && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Verified
                    </span>
                  )}
                  {tasker.miniTaskEligible && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Task Eligible
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{tasker.email}</span>
                </div>
                {tasker.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{tasker.phone}</span>
                  </div>
                )}
                {tasker.location?.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{tasker.location.city}, {tasker.location.region}</span>
                  </div>
                )}
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{tasker.rating || 0}/5</span>
                  <span className="text-gray-500">({tasker.numberOfRatings || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Joined {new Date(tasker.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Skills */}
              {tasker.skills?.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {tasker.skills.slice(0, 6).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {tasker.skills.length > 6 && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                        +{tasker.skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Portfolio: {tasker.workPortfolio?.length || 0} items</span>
                <span>Experience: {tasker.workExperience?.length || 0} positions</span>
                <span>Profile: {tasker.profileCompleted ? 'Complete' : 'Incomplete'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/admin/get/user_info/${tasker._id}`)}
              className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
            >
              {showDetails ? 'Hide Details' : 'View Details'}
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Manage
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Email:</strong> {tasker.email}</p>
                  <p><strong>Phone:</strong> {tasker.phone || 'Not provided'}</p>
                  <p><strong>Location:</strong> {tasker.location ? `${tasker.location.street}, ${tasker.location.city}, ${tasker.location.region}` : 'Not specified'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Professional Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Total Reviews:</strong> {tasker.numberOfRatings || 0}</p>
                  <p><strong>Portfolio Items:</strong> {tasker.workPortfolio?.length || 0}</p>
                  <p><strong>Work Experience:</strong> {tasker.workExperience?.length || 0} positions</p>
                  <p><strong>Education:</strong> {tasker.education?.length || 0} entries</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};