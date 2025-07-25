import { Briefcase } from "lucide-react";
import {EmptyState} from "./EmptyState";

export const WorkExperience = ({ user }) => {
  if (!user.workExperience?.length) {
    return (
      <EmptyState 
        icon={<Briefcase size={24} />}
        title="No Work Experience"
        description="This user hasn't added any work experience yet."
      />
    );
  }

  return (
    <div className="card experience-card">
      <div className="card-header">
        <Briefcase size={18} />
        <h3>Work Experience</h3>
      </div>
      
      <div className="experience-list">
        {user.workExperience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <h4>{exp.jobTitle}</h4>
              <span className="company">{exp.company}</span>
              <span className="date-range">
                {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
              </span>
            </div>
            {exp.description && (
              <p className="experience-description">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};