import { useState } from "react";
import { Bell, Users, User, Globe, X } from "lucide-react";
import { toast } from "react-toastify";

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  selectedUser = null,
  notificationAPIs 
}) => {
  const [notificationType, setNotificationType] = useState("single");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const notificationTypes = [
    {
      id: "single",
      name: "Single User",
      description: "Send to a specific user",
      icon: User,
      color: "bg-blue-500",
      disabled: !selectedUser
    },
    {
      id: "role",
      name: "Role-based",
      description: "Send to all users with a specific role",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      id: "broadcast",
      name: "Broadcast",
      description: "Send to all users",
      icon: Globe,
      color: "bg-green-500"
    }
  ];

  const roles = [
   // { value: "admin", label: "Admin" },
    { value: "client", label: "Client" },
    { value: "job_seeker", label: "Job Seeker" }
  ];

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    if (notificationType === "role" && !selectedRole) {
      toast.error("Please select a role for role-based notifications");
      return;
    }

    if (notificationType === "single" && !selectedUser) {
      toast.error("No user selected for single user notification");
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      
      switch (notificationType) {
        case "single":
          response = await notificationAPIs.sendPersonalizedNotification(
            selectedUser._id,
            { title, message }
          );
          break;
        case "role":
          response = await notificationAPIs.sendroleBaseNotification({
            role: selectedRole,
            title,
            message
          });
          break;
        case "broadcast":
          response = await notificationAPIs.sendBroadCastNotification({
            title,
            message
          });
          break;
        default:
          throw new Error("Invalid notification type");
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(`Notification sent successfully!`);
        resetForm();
        onClose();
      } else {
        throw new Error(response.data?.message || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error(error.message || "Failed to send notification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setSelectedRole("");
    setNotificationType(selectedUser ? "single" : "role");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Send Notification</h3>
              <p className="text-sm text-slate-500">Send messages to users</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Notification Type Selection */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3">Notification Type</h4>
            <div className="grid grid-cols-3 gap-2">
              {notificationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setNotificationType(type.id)}
                  disabled={type.disabled}
                  className={`p-3 rounded-xl border transition-all duration-200 transform hover:scale-[1.02] ${
                    notificationType === type.id
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-200 hover:border-slate-300"
                  } ${type.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-2 rounded-lg ${type.color} mb-2`}>
                      <type.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-900">
                      {type.name}
                    </span>
                    {selectedUser && type.id === "single" && (
                      <div className="mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs truncate max-w-full">
                        {selectedUser.name}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Role Selection (for role-based notifications) */}
          {notificationType === "role" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              maxLength={100}
            />
            <div className="text-right text-xs text-slate-500 mt-1">
              {title.length}/100
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              rows="4"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              maxLength={500}
            />
            <div className="text-right text-xs text-slate-500 mt-1">
              {message.length}/500
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              "Send Notification"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;