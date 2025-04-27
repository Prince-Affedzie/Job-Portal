// src/pages/EmployerNotificationsPage.jsx
import React, { useContext } from 'react';
import { notificationContext } from '../Context/NotificationContext';
import { FaBell, FaClock } from 'react-icons/fa';
import '../Styles/NotificationPage.css';
import EmployerNavbar from '../Components/EmployerDashboard/EmployerNavbar';

const EmployerNotificationsPage = () => {
  const { notifications } = useContext(notificationContext);

  return (
    <div>
      <EmployerNavbar />
      <div className="notifications-page">
        <div className="notifications-header">
          <h2>Employer Notifications</h2>
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

export default EmployerNotificationsPage;
