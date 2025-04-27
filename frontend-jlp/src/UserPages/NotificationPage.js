// src/pages/NotificationsPage.jsx
import React, { useContext } from 'react';
import { notificationContext } from '../Context/NotificationContext';
import { FaBell, FaClock } from 'react-icons/fa';
import '../Styles/NotificationPage.css';
import Navbar from '../Components/MyComponents/Navbar';

const NotificationsPage = () => {
  const { notifications } = useContext(notificationContext);

  return (
    <div>
        <Navbar/>
    <div className="notifications-page">
    
      <div className="notifications-header">
        <h2>Notifications</h2>
      </div>

      <div className="notifications-feed">
        {notifications && notifications.length > 0 ? (
          notifications.map((note) => (
            <div key={note._id} className="notification-card">
              <FaBell className="notification-page-icon" />
              <div className="notification-content">
                <p className="notification-message">{note.message}</p>
                <span className="notification-time">
                  <FaClock /> {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-notifications">You have no new notifications</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default NotificationsPage;
