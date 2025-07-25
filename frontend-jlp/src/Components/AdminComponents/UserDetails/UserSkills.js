import { Star } from "lucide-react";
import {EmptyState} from "./EmptyState";

export const UserSkills = ({ user }) => {
  if (!user.skills?.length) {
    return (
      <EmptyState 
        icon={<Star size={24} />}
        title="No Skills Added"
        description="This user hasn't added any skills yet."
      />
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>Skills & Expertise</h3>
      </div>
      <div className="skills-container">
        {user.skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            <Star className="skill-icon" />
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};