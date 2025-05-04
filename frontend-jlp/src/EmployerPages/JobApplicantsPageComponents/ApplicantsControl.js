import React from "react";
import { FaSearch } from "react-icons/fa";

const ApplicantsControls = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
  return (
    <div className="applicants-controls">
      <div className="search-box applicant-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name, email, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filter-controls">
        <div className="status-filter">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Applicants</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interviewing</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsControls;