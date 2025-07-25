export const EmptyState = ({ icon, title, description }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <h4 className="empty-title">{title}</h4>
    <p className="empty-description">{description}</p>
  </div>
);