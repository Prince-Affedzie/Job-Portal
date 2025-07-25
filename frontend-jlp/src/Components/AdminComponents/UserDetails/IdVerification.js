import { Shield, Eye, FileText } from "lucide-react";
import StatusBadge from "./StatusBadge";
import {EmptyState} from "./EmptyState";

export const IdVerification = ({ user }) => {
  if (!user.idCard) {
    return (
      <EmptyState 
        icon={<FileText size={24} />}
        title="No ID Card Uploaded"
        description="This user hasn't uploaded an ID card for verification."
      />
    );
  }

  return (
    <div className="card verification-card">
      <div className="card-header">
        <Shield size={18} />
        <h3>ID Verification</h3>
      </div>
      
      <div className="verification-content">
        <div className="id-card-preview">
          <img 
            src={user.idCard} 
            alt="User ID Card" 
            className="id-card-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg...";
            }}
          />
          <a 
            href={user.idCard} 
            target="_blank" 
            rel="noopener noreferrer"
            className="view-full-button"
          >
            <Eye size={14} />
            View Full Size
          </a>
        </div>
        
        <div className="verification-status">
          <span>Verification Status:</span>
          <StatusBadge
            status={true}
            label="Pending Review"
            variant="pending"
          />
        </div>
      </div>
    </div>
  );
};