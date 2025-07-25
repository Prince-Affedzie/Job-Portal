import { Building, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "./EmptyState";

export const AppliedJobs = ({ user }) => {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 3; // Number of jobs to show initially

  if (!user.appliedJobs?.length) {
    return (
      <EmptyState 
        icon={<Building size={24} />}
        title="No Applications"
        description="This user hasn't applied to any jobs yet."
      />
    );
  }

  const displayedJobs = showAll 
    ? user.appliedJobs 
    : user.appliedJobs.slice(0, initialDisplayCount);

  return (
    <div className="card">
      <div className="card-header">
        <Building size={18} />
        <h3>Applied Jobs ({user.appliedJobs.length})</h3>
      </div>
      
      <div className="jobs-list">
        {displayedJobs.map((job, index) => (
          <div key={index} className="job-item">
            <Building className="job-icon" />
            <span className="job-title">{job.title || `Job #${index + 1}`}</span>
            {job.company && <span className="job-company">{job.company}</span>}
          </div>
        ))}
      </div>

      {user.appliedJobs.length > initialDisplayCount && (
        <button 
          className="view-more-button"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp size={16} />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              View All {user.appliedJobs.length} Jobs
            </>
          )}
        </button>
      )}
    </div>
  );
};