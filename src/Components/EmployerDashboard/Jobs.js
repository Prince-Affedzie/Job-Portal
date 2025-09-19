import React, { useState, useEffect } from "react";
import "../../Styles/EmployerDashboard.css";
import EmployerNavbar from "./EmployerNavbar";

const JobsWithApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Fetch Jobs
  useEffect(() => {
    fetch("/api/jobs") // Replace with actual API endpoint
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  // Fetch Applicants
  useEffect(() => {
    fetch("/api/applicants") // Replace with actual API endpoint
      .then((res) => res.json())
      .then((data) => setApplicants(data))
      .catch((err) => console.error("Error fetching applicants:", err));
  }, []);

  const toggleApplicants = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <div className="dashboard-section">
      <EmployerNavbar/>
      <h2>My Job Postings</h2>
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Posted Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <React.Fragment key={job.id}>
              <tr>
                <td>{job.title}</td>
                <td>{job.postedDate}</td>
                <td>
                  <button
                    className="view-applicants-btn"
                    onClick={() => toggleApplicants(job.id)}
                  >
                    {expandedJobId === job.id ? "Hide Applicants" : "View Applicants"}
                  </button>
                </td>
              </tr>
              {expandedJobId === job.id && (
                <tr>
                  <td colSpan="3">
                    <div className="applicants-list">
                      <h4>Applicants</h4>
                      <ul>
                        {applicants
                          .filter((applicant) => applicant.jobId === job.id)
                          .map((applicant) => (
                            <li key={applicant.id}>
                              {applicant.name} -{" "}
                              <span className="status">{applicant.status}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobsWithApplicants;
