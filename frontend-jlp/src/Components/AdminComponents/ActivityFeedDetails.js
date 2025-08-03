import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  ShopOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';

export const ActivityDetailsPanel = ({ 
  activity, 
  onClose 
}) => {
  if (!activity) return null;

  const getActivityIcon = () => {
    const iconStyle = { fontSize: '24px' };
    switch(activity.type) {
      case 'NEW_USER':
        return <UserOutlined style={{ ...iconStyle, color: '#20c997' }} />;
      case 'NEW_EMPLOYER_ACCOUNT':
        return <ShopOutlined style={{ ...iconStyle, color: '#fd7e14' }} />;
      case 'NEW_JOB_POSTING':
        return <ShoppingOutlined style={{ ...iconStyle, color: '#0d6efd' }} />;
      case 'NEW_MICRO_JOB_POSTING':
        return <ShoppingOutlined style={{ ...iconStyle, color: '#6610f2' }} />;
      case 'MICRO_JOB_COMPLETION':
        return <CheckCircleOutlined style={{ ...iconStyle, color: '#198754' }} />;
      case 'DISPUTE_RAISED':
        return <WarningOutlined style={{ ...iconStyle, color: '#ffc107' }} />;
      default:
        return <ClockCircleOutlined style={{ ...iconStyle, color: '#6c757d' }} />;
    }
  };

  const getActivityTypeLabel = () => {
    switch(activity.type) {
      case 'NEW_USER':
        return 'User Registration';
      case 'NEW_EMPLOYER_ACCOUNT':
        return 'Employer Account';
      case 'NEW_JOB_POSTING':
        return 'Job Posting';
      case 'NEW_MICRO_JOB_POSTING':
        return 'Micro Job';
      case 'MICRO_JOB_COMPLETION':
        return 'Job Completion';
      case 'DISPUTE_RAISED':
        return 'Dispute';
      default:
        return 'Activity';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-30 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Details Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-96 bg-white shadow-lg pointer-events-auto flex flex-col h-full max-h-screen"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {getActivityIcon()}
            <h2 className="text-lg font-medium text-gray-900">
              Activity Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
            aria-label="Close panel"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-6">
          {/* Activity Type */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Activity Type
            </h3>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getActivityTypeLabel()}
              </span>
              {!activity.isRead && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Date & Time
            </h3>
            <p className="text-sm text-gray-900">
              {new Date(activity.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Description
            </h3>
            <p className="text-sm text-gray-900">
              {activity.message || 'No additional details available'}
            </p>
          </div>

          {/* Additional Data - if available */}
          {activity.metadata && (
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Additional Information
              </h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(activity.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};