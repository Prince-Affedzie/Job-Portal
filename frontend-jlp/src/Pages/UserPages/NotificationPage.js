// src/pages/NotificationsPage.jsx
import React, { useContext, useEffect } from 'react';
import { notificationContext } from '../../Context/NotificationContext';
import { FaBell, FaClock } from 'react-icons/fa';
import Navbar from '../../Components/Common/Navbar';
import { markNotificationAsRead } from '../../APIS/API';

const NotificationsPage = () => {
  const { notifications } = useContext(notificationContext);

  const markAllNotificationAsRead = async (ids) => {
    try {
      const response = await markNotificationAsRead(ids);
      if (response.status === 200) {
        // Notifications marked as read
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length > 0) {
      markAllNotificationAsRead({ ids: unread.map(n => n._id) });
    }
  }, [notifications]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBell className="text-blue-600" /> Notifications
          </h2>
          <p className="text-sm text-gray-500 mt-1">Here are the latest updates and alerts for your account.</p>
        </div>

        <div className="space-y-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((note) => (
              <div
                key={note._id}
                className={`flex items-start gap-4 p-4 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 bg-white ${note.read ? 'opacity-70' : 'opacity-100'}`}
              >
                <FaBell className="text-blue-500 w-5 h-5 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-1000 text-[15px] font-medium mb-1 leading-snug">{note.message}</p>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <FaClock className="w-3 h-3" />
                    {new Date(note.createdAt).toLocaleString()}
                  </div>

                  {note.detailsUrl && (
                    <div className="mt-2">
                      <button
                        onClick={() => window.location.href = note.detailsUrl}
                        className="text-blue-600 text-sm hover:underline font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg">You have no new notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
