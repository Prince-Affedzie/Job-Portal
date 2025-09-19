import { Mail, Phone, MapPin } from "lucide-react";

const ContactItem = ({ icon: Icon, label, value }) => (
  <div className="contact-item">
    <Icon className="contact-icon" />
    <div>
      <p className="contact-label">{label}</p>
      <p className="contact-value">{value || "Not provided"}</p>
    </div>
  </div>
);

const formatLocation = (location) => {
  if (!location) return "Not provided";
  return [location.street, location.town, location.city, location.region]
    .filter(Boolean)
    .join(", ");
};

export const ContactInfo = ({ user }) => (
  <div className="card">
    <div className="card-header">
      <h3>Contact Information</h3>
    </div>
    <div className="contact-list">
      <ContactItem icon={Mail} label="Email" value={user.email} />
      <ContactItem icon={Phone} label="Phone" value={user.phone} />
      <ContactItem 
        icon={MapPin} 
        label="Location" 
        value={formatLocation(user.location)} 
      />
    </div>
  </div>
);