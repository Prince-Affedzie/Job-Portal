import { Edit, ArrowLeft } from "lucide-react";
import StatusBadge from "./StatusBadge";

export const UserHeader = ({ user, navigate }) => (
  <div className="user-header">
    <button onClick={() => navigate(-1)} className="back-button">
      <ArrowLeft size={16} />
      Back to Users
    </button>
    
    <div className="header-content">
      <div className="profile-section">
        {user.profileImage ? (
          <img src={user.profileImage} alt="Profile" className="profile-image" />
        ) : (
          <div className="profile-initials">
            {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
        )}
        <StatusBadge 
          status={user.isActive} 
          label={user.isActive ? "Active" : "Inactive"} 
          variant={user.isActive ? "active" : "inactive"} 
        />
      </div>
      
      <div className="user-info">
        <h1>{user.name}</h1>
        <div className="meta-info">
          <span>{user.email}</span>
          <span>{user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1)}</span>
        </div>
        
        <div className="status-badges">
          <StatusBadge
            status={user.isVerified}
            label={user.isVerified ? "Verified" : "Unverified"}
            variant={user.isVerified ? "verified" : "pending"}
          />
          <StatusBadge
            status={user.profileCompleted}
            label={user.profileCompleted ? "Complete" : "Incomplete"}
            variant={user.profileCompleted ? "active" : "pending"}
          />
        </div>
      </div>
      
      <button 
        onClick={() => navigate(`/admin/edit/user/${user._id}`)} 
        className="edit-button"
      >
        <Edit size={16} />
        Edit User
      </button>
    </div>
  </div>
);