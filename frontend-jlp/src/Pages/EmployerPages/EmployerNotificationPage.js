// src/pages/EmployerNotificationsPage.jsx
import React, { useContext,useEffect } from 'react';
import { notificationContext } from '../../Context/NotificationContext';
import { FaBell, FaClock } from 'react-icons/fa';
import '../../Styles/NotificationPage.css';
import EmployerNavbar from '../../Components/EmployerDashboard/EmployerNavbar';
import { markNotificationAsRead } from '../../APIS/API';

const EmployerNotificationsPage = () => {

  const { notifications } = useContext(notificationContext);

  const markAllNotificationAsRead =async(ids)=>{
    try{
      const response = await markNotificationAsRead(ids)
      if(response.status ===200){
        console.log('All Notifications marked read')
      }
  
    }catch(err){
      console.log(err)
    }
  }
    useEffect(() => {
      // Only mark unread notifications as read
      const unread = notifications.filter(n => !n.read);
      console.log(unread)
      if (unread.length > 0) {
        markAllNotificationAsRead({ids:unread.map(n => n._id)});   
      }
    }, [notifications]);
    
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
