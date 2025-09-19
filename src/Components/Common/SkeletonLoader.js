import "../../Styles/SkeletonLoader.css";

const SkeletonLoader = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-meta"></div>
      <div className="skeleton-button"></div>
    </div>
  );
};

export default SkeletonLoader;
