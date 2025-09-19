import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaTimes } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { notificationContext } from "../../Context/NotificationContext";

export const NotificationToast = () => {
  const [visible, setVisible] = useState(false);
  const { notifications, fetchNotifications } = useContext(notificationContext);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    if (!notifications) {
      fetchNotifications();
    }
  }, [notifications, fetchNotifications]);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Get the most recent unread notification
      const unread = notifications.filter(n => !n.read);
      if (unread.length > 0) {
        const newestNotification = unread[0];
        
        // Only update if it's a different notification
        if (!currentNotification || newestNotification.id !== currentNotification.id) {
          setCurrentNotification(newestNotification);
          setVisible(true);
        }
      } else {
        setVisible(false);
      }
    }
  }, [notifications, currentNotification]);

  useEffect(() => {
    let timer;
    if (visible && currentNotification) {
      timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [visible, currentNotification]);

  if (!currentNotification || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-80 overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center">
                <FaBell className="text-blue-500 mr-2" />
                <span className="font-medium text-blue-800">New Notification</span>
              </div>
              <button 
                onClick={() => setVisible(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-gray-800 mb-2 line-clamp-2">
                {currentNotification.title || "You have a new notification"}
              </p>
              
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">
                  {new Date(currentNotification.createdAt).toLocaleTimeString()}
                </span>
                <Link 
                  to="/view/all_notifications"
                  onClick={() => setVisible(false)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};