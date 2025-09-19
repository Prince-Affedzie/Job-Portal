import { Briefcase, GraduationCap, Target, Activity } from "lucide-react";

const StatItem = ({ icon: Icon, label, value, color }) => (
  <div className="stat-item">
    <div className={`stat-icon bg-${color}-100 text-${color}-600`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

export const UserStats = ({ user }) => (
  <div className="stats-grid">
    <StatItem 
      icon={Briefcase} 
      label="Experience" 
      value={user.workExperience?.length || 0} 
      color="blue" 
    />
    <StatItem 
      icon={GraduationCap} 
      label="Education" 
      value={user.education?.length || 0} 
      color="emerald" 
    />
    <StatItem 
      icon={Target} 
      label="Skills" 
      value={user.skills?.length || 0} 
      color="purple" 
    />
    <StatItem 
      icon={Activity} 
      label="Applied Jobs" 
      value={user.appliedJobs?.length || 0} 
      color="amber" 
    />
  </div>
);