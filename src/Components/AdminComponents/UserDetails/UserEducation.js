import { GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "./EmptyState";

export const UserEducation = ({ user }) => {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 2; // Show 2 education items initially

  if (!user.education?.length) {
    return (
      <EmptyState 
        icon={<GraduationCap size={24} />}
        title="No Education Records"
        description="This user hasn't added education information yet."
      />
    );
  }

  const displayedEducation = showAll 
    ? user.education 
    : user.education.slice(0, initialDisplayCount);

  return (
    <div className="card">
      <div className="card-header">
        <GraduationCap size={18} />
        <h3>Education ({user.education.length})</h3>
      </div>
      
      <div className="education-list">
        {displayedEducation.map((edu, index) => (
          <div key={index} className="education-item">
            <h4>{edu.degree}</h4>
            <p className="institution">{edu.institution}</p>
            <p className="year">Class of {new Date(edu.yearOfCompletion).toDateString()}</p>
          </div>
        ))}
      </div>

      {user.education.length > initialDisplayCount && (
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
              View All {user.education.length} Education Records
            </>
          )}
        </button>
      )}
    </div>
  );
};