import { useState } from "react";
import { Briefcase, Bell, Settings } from "lucide-react";

const AdminNavbar = ({ notifications = [] }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex items-center justify-between relative z-20">
      <div className="flex items-center space-x-2">
        <Briefcase className="text-blue-600 w-6 h-6" />
        <h1 className="text-xl font-bold text-blue-600">WorkaFlow</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-gray-100 relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-30 border">
              <div className="p-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 border-b hover:bg-gray-50"
                    >
                      <p className="text-sm">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500 text-sm text-center">
                    No new notifications
                  </div>
                )}
              </div>
              <div className="p-2 text-center border-t">
                <button className="text-blue-600 text-sm hover:underline">
                  View All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Settings className="w-5 h-5" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            A
          </div>
          <span className="hidden md:block font-medium">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
