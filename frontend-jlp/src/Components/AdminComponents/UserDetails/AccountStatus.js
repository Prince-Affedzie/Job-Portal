import { Activity, Shield, User, Award } from "lucide-react";
import StatusBadge from "./StatusBadge";

const StatusItem = ({ icon: Icon, label, value, variant }) => (
  <div className="status-item">
    <Icon className="status-icon" />
    <p className="status-label">{label}</p>
    <div className="status-value">
      {typeof value === 'string' ? value : (
        <StatusBadge label={value.label} variant={variant} />
      )}
    </div>
  </div>
);

export const AccountStatus = ({ user }) => (
  <div className="card">
    <div className="card-header">
      <h3>Account Status</h3>
    </div>
    <div className="status-list">
      <StatusItem 
        icon={Activity} 
        label="Account Status" 
        value={{ label: user.isActive ? "Active" : "Inactive" }}
        variant={user.isActive ? "active" : "inactive"}
      />
      <StatusItem 
        icon={Shield} 
        label="Verification" 
        value={{ label: user.isVerified ? "Verified" : "Pending" }}
        variant={user.isVerified ? "verified" : "pending"}
      />
      <StatusItem 
        icon={User} 
        label="Profile" 
        value={user.profileCompleted ? "Complete" : "Incomplete"}
      />
      <StatusItem 
        icon={Award} 
        label="Task Eligible" 
        value={user.miniTaskEligible ? "Yes" : "No"}
      />
    </div>
  </div>
);