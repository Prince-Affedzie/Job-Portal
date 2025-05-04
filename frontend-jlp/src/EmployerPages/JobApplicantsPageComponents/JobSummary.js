import React from "react";
import { formatDate } from './Utils';

const JobDetailsSummary = ({ jobDetails }) => (
  <div className="job-details-summary">
    <div className="job-details-header">
      <h3>{jobDetails.title}</h3>
      <div className={`job-status ${jobDetails.status.toLowerCase()}`}>{jobDetails.status}</div>
    </div>
    <div className="job-details-meta">
      <div className="job-meta-item">
        <span className="meta-label">Location:</span>
        <span className="meta-value">{jobDetails.location}</span>
      </div>
      <div className="job-meta-item">
        <span className="meta-label">Salary:</span>
        <span className="meta-value">{jobDetails.salary}</span>
      </div>
      <div className="job-meta-item">
        <span className="meta-label">Posted:</span>
        <span className="meta-value">{formatDate(jobDetails.createdAt)}</span>
      </div>
      <div className="job-meta-item">
        <span className="meta-label">Total Applicants:</span>
        <span className="meta-value">{jobDetails.noOfApplicants}</span>
      </div>
    </div>
  </div>
);

export default JobDetailsSummary;