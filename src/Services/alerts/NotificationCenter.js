import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaRegBell, 
  FaTimes, 
  FaCheck, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaRegCheckCircle,
  FaRegClock
} from 'react-icons/fa';
import { io } from 'socket.io-client';
import {fetchAllAlerts,markAllAlertAsRead,markAlertAsRead } from '../../APIS/API'

const NotificationCenter = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [toastAlert, setToastAlert] = useState(null);

  // Priority indicators
  const priorityIcons = {
    CRITICAL: <FaExclamationTriangle className="text-red-500" />,
    HIGH: <FaExclamationTriangle className="text-orange-400" />,
    MEDIUM: <FaInfoCircle className="text-blue-400" />,
    LOW: <FaRegCheckCircle className="text-green-500" />
  };

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_BACKEND_URL}/admin-alerts`, {
      withCredentials: true,
      transports: ['websocket']
    });

    // Initial load
    const fetchAlerts = async () => {
      const response = await fetchAllAlerts();
      const data = await response.data;
      setAlerts(data);
      setUnreadCount(data.filter(a => !a.isRead).length);
    };
    fetchAlerts();

    // Real-time updates
    socket.on('ADMIN_ALERT', (alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 19)]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast for high priority alerts
     // if (alert.priority === 'CRITICAL' || alert.priority === 'HIGH') {
        setToastAlert(alert);
        setTimeout(() => setToastAlert(null), 10000);
      //}
    });

    return () => socket.disconnect();
  }, []);

  const markAsRead = async (id) => {
    
    const res =await markAlertAsRead(id);
    if(res.status ===200){
    setAlerts(alerts.map(a => a._id === id ? { ...a, isRead: true } : a));
    setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
  };

  const markAllRead = async () => {
    const alertsIds = alerts.map(i =>i._id)
    const res =  await markAllAlertAsRead(alertsIds);
    if(res.status ===200){
    setAlerts(alerts.map(a => ({ ...a, isRead: true })));
    setUnreadCount(0);
   }
    
  };

  return (
    <div className="relative">
      {/* Notification Bell (Floating Action Button) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <div className="relative">
            <FaBell className="text-blue-600 text-xl" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          </div>
        ) : (
          <FaRegBell className="text-gray-500 text-xl" />
        )}
      </button>

      {/* Toast Notification (Top-right) */}
      {toastAlert && (
        <div className={`fixed top-4 right-4 z-50 w-80 p-4 rounded-lg shadow-lg border-l-4 ${
          toastAlert.priority === 'CRITICAL' 
            ? 'bg-red-50 border-red-500' 
            : 'bg-orange-50 border-orange-400'
        }`}>
          <div className="flex justify-between">
            <div className="flex items-start">
              {priorityIcons[toastAlert.priority]}
              <div className="ml-3">
                <p className="font-medium text-sm">{toastAlert.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(toastAlert.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setToastAlert(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <FaTimes size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 flex flex-col max-h-[70vh]">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold flex items-center">
              <FaBell className="mr-2 text-blue-500" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <div className="flex space-x-2">
              <button 
                onClick={markAllRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all read
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {alerts.map(alert => (
                  <li 
                    key={alert._id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer ${!alert.isRead ? 'bg-blue-50' : ''}`}
                    onClick={() => markAsRead(alert._id)}
                  >
                    <div className="flex items-start">
                      <div className="mt-1 flex-shrink-0">
                        {priorityIcons[alert.priority] || <FaRegClock className="text-gray-400" />}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className={`text-sm ${!alert.isRead ? 'font-medium' : 'text-gray-700'}`}>
                          {alert.message}
                        </p>
                        <div className="mt-1 flex justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(alert.createdAt).toLocaleTimeString()}
                          </span>
                          {alert.metadata && (
                            <span className="text-xs text-gray-400 truncate ml-2">
                              {Object.entries(alert.metadata)
                                .map(([key]) => key)
                                .join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;