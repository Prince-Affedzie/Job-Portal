import React from "react";

const StatusStats = ({ statusCounts, filterStatus, setFilterStatus }) => {
  const statuses = [
    { status: "all", label: "All Applicants", count: statusCounts.all },
    { status: "reviewing", label: "Reviewing", count: statusCounts.reviewing },
    { status: "shortlisted", label: "Shortlisted", count: statusCounts.shortlisted },
    { status: "interviewing", label: "Interviewing", count: statusCounts.interviewing },
    { status: "offered", label: "Offered", count: statusCounts.offered },
    { status: "rejected", label: "Rejected", count: statusCounts.rejected }
  ];
  
  return (
    <div className="applicant-status-stats">
      {statuses.map((stat) => (
        <button 
          key={stat.status}
          className={`status-stat ${filterStatus === stat.status ? 'active' : ''}`}
          onClick={() => setFilterStatus(stat.status)}
        >
          {stat.label}
          <span className="status-count">{stat.count}</span>
        </button>
      ))}
    </div>
  );
};

export default StatusStats;