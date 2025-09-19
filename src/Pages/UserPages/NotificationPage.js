// src/pages/NotificationsPage.jsx
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { notificationContext } from '../../Context/NotificationContext';
import { 
  FaBell, 
  FaClock, 
  FaCheck, 
  FaCheckDouble, 
  FaTrash, 
  FaFilter,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa';
import Navbar from '../../Components/Common/Navbar';
import { ClientNavbar } from '../../Components/ClientComponents/ClientNavbar';
import { ClientSidebar } from '../../Components/ClientComponents/ClientSidebar';
//import { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, deleteAllNotifications } from '../../APIS/API';
import {markNotificationAsRead}  from '../../APIS/API';
import { userContext } from "../../Context/FetchUser";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationsPage = () => {
  const { notifications, refreshNotifications } = useContext(notificationContext);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(userContext);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(note => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !note.read;
    if (filter === 'read') return note.read;
    return true;
  });

  // Sort notifications by date (newest first)
  const sortedNotifications = [...filteredNotifications].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Mark a notification as read
 {/* const handleMarkAsRead = async (id) => {
    try {
      const response = await markNotificationAsRead(id);
      if (response.status === 200) {
        refreshNotifications();
        toast.success('Notification marked as read');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to mark notification as read');
    }
  };

  // Mark all notifications as read
 
  // Delete a notification
  const handleDeleteNotification = async (id) => {
    try {
      const response = await deleteNotification(id);
      if (response.status === 200) {
        refreshNotifications();
        toast.success('Notification deleted');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete notification');
    }
  };

  // Delete selected notifications
  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) {
      toast.info('No notifications selected');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await deleteAllNotifications({ ids: selectedNotifications });
      if (response.status === 200) {
        refreshNotifications();
        setSelectedNotifications([]);
        setShowDeleteConfirm(false);
        toast.success(`${selectedNotifications.length} notification(s) deleted`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete notifications');
    } finally {
      setIsProcessing(false);
    }
  };*/}



   const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    if (unreadIds.length === 0) {
      toast.info('All notifications are already read');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await markNotificationAsRead({ ids: unreadIds });
      if (response.status === 200) {
        refreshNotifications();
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to mark notifications as read');
    } finally {
      setIsProcessing(false);
    }
  };


  // Toggle selection of a notification
  const toggleSelection = (id) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(item => item !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  // Select all notifications
  const selectAll = () => {
    if (selectedNotifications.length === sortedNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(sortedNotifications.map(note => note._id));
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <FaInfoCircle className="text-blue-500 w-5 h-5" />;
      case 'success':
        return <FaCheckCircle className="text-green-500 w-5 h-5" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500 w-5 h-5" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500 w-5 h-5" />;
      default:
        return <FaBell className="text-blue-500 w-5 h-5" />;
    }
  };

  // Format date relative to now
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Auto-mark notifications as read when page loads
  useEffect(() => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length > 0) {
     markNotificationAsRead({ ids: unread.map(n => n._id) })
        .then(() => refreshNotifications())
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {user?.role === 'job_seeker' ? (
        <Navbar />
      ) : (
         <div>
        <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
       
         {/*<ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />*/}
        </div>
      )}
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
     
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FaBell className="text-white" /> Notifications
                </h2>
                <p className="text-blue-100 mt-2">
                  {notifications.length > 0 
                    ? `You have ${notifications.filter(n => !n.read).length} unread notifications`
                    : 'You have no notifications'
                  }
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex gap-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={handleMarkAllAsRead} 
                      disabled={isProcessing || notifications.filter(n => !n.read).length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaCheckDouble className="w-4 h-4" />
                      Mark all as read
                    </button>
                    
                    {selectedNotifications.length > 0 && (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                        Delete Selected ({selectedNotifications.length})
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        {notifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <FaFilter className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                <div className="flex gap-2">
                  {['all', 'unread', 'read'].map((filterType) => (
                    <button
                      key={filterType}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        filter === filterType
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setFilter(filterType)}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/*<label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === sortedNotifications.length && sortedNotifications.length > 0}
                    onChange={selectAll}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Select all
                </label>*/}
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {sortedNotifications.length > 0 ? (
            sortedNotifications.map((note) => (
              <div
                key={note._id}
                className={`flex items-start gap-4 p-5 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 bg-white ${
                  note.read ? 'opacity-80' : 'border-l-4 border-l-blue-500'
                }`}
              >
                {/* Selection checkbox */}
                {/*<input
                  type="checkbox"
                  checked={selectedNotifications.includes(note._id)}
                  onChange={() => toggleSelection(note._id)}
                  className="mt-1.5 rounded text-blue-600 focus:ring-blue-500"
                />
                
                {/* Notification icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(note.type)}
                </div>
                
                {/* Notification content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-gray-900 text-[15px] font-medium mb-1 leading-snug ${note.read ? '' : 'font-semibold'}`}>
                    {note.message}
                  </p>
                  
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-2">
                    <FaClock className="w-3 h-3" />
                    {formatRelativeTime(note.createdAt)}
                    <span className="mx-1">•</span>
                    {new Date(note.createdAt).toLocaleString()}
                  </div>

                  {note.detailsUrl && (
                    <div className="mt-3">
                      <button
                        onClick={() => window.location.href = note.detailsUrl}
                        className="text-blue-600 text-sm hover:underline font-medium inline-flex items-center gap-1"
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Action buttons 
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {!note.read && (
                    <button
                    
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Mark as read"
                    >
                      <FaCheck className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                  
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete notification"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>*/}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaBell className="text-gray-400 w-8 h-8" />
              </div>
              <p className="text-lg font-medium text-gray-600 mb-2">No notifications found</p>
              <p className="text-gray-500">
                {filter !== 'all' 
                  ? `You don't have any ${filter} notifications.`
                  : 'You have no notifications at this time.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedNotifications.length} selected notification(s)? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                /*onClick={handleDeleteSelected}*/
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {isProcessing ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;