// MyMiniTaskApplications.jsx
import React, { useState, useEffect, useContext } from 'react';
import '../Styles/UserMinitaskApp.css';
import { userContext } from "../Context/FetchUser";
import Navbar from '../Components/MyComponents/Navbar';

const MyMiniTaskApplications = () => {
  const { loading, user, minitasks, fetchAppliedMiniTasks } = useContext(userContext);
  const [filter, setFilter] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 5; // Change this number if you want more/less per page

  useEffect(() => {
    if (!minitasks && user) {
      fetchAppliedMiniTasks();
    }
  }, []);

  const filteredApplications = minitasks.filter(app => {
    if (filter === 'all') return true;
    return app.status.toLowerCase() === filter.toLowerCase();
  });

  // Calculate pagination details
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  const getApplicationStatus = (task) => {
    const isAssigned = task.assignedTo && task.assignedTo === user._id;
    if (task.status === "Completed" && isAssigned) return { text: "Completed", className: "status-completed" };
    if (task.status === "In-progress" && isAssigned) return { text: "In Progress (You are assigned)", className: "status-in-progress" };
    if (task.status === "Open" && !task.assignedTo) return { text: "Applied (Awaiting decision)", className: "status-applied" };
    if (task.status === "Open" && !isAssigned && task.assignedTo) return { text: "Not Selected", className: "status-not-selected" };
    if (task.status === "Open" && isAssigned && task.assignedTo) return { text: "Selected", className: "status-in-progress" };
    if (task.status === "Closed" && !isAssigned) return { text: "Closed (Not selected)", className: "status-closed" };
    return { text: task.status, className: `status-${task.status.toLowerCase()}` };
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // optional: scroll to top when page changes
  };

  return (
    <div>
      <Navbar />
      <div className="my-mini-applications-container">
        <h1 className="page-title">Your MiniTask Applications</h1>

        <div className="mini-filter-container">
          <span>Filter by status:</span>
          <div className="mini-filter-buttons">
            {['all', 'open', 'in-progress', 'completed', 'closed'].map(status => (
              <button
                key={status}
                className={filter === status ? 'active' : ''}
                onClick={() => { setFilter(status); setCurrentPage(1); }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading your applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="no-applications">
            {filter === 'all' 
              ? "You haven't applied to any minitasks yet." 
              : `No ${filter} applications.`}
          </div>
        ) : (
          <div>
            <div className="mini-list">
              {currentApplications.map((task) => {
                const statusInfo = getApplicationStatus(task);

                return (
                  <div key={task._id} className="mini-list-item">
                    <div className="mini-list-top">
                      <div>
                        <h2>{task.title}</h2>
                        <p className="mini-list-category">{task.category} • Budget: ₵{task.budget}</p>
                        <p className="mini-list-category"> • Employer Contact: {task.employer.phone}</p>
                      </div>
                      <span className={`mini-status ${statusInfo.className}`}>
                        {statusInfo.text}
                      </span>
                    </div>

                    <div className="mini-list-bottom">
                      <div>
                        <strong>Location:</strong> {task.locationType === "remote" ? "Remote" : (task.address ? `${task.address.suburb}, ${task.address.city}` : "On-site")}
                      </div>
                      <div>
                        <strong>Deadline:</strong> {new Date(task.deadline).toDateString()}
                      </div>
                      <div className="mini-skills-container">
                        {task.skillsRequired.map((skill, index) => (
                          <span key={index} className="mini-skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mini-list-actions">
                      <button
                        className="view-details-btn"
                        onClick={() => window.location.href = `/minitasks/${task._id}`}
                      >
                        View Details
                      </button>
                      {(task.assignedTo && task.assignedTo === user?._id && task.status === "In-progress") && (
                        <button
                          className="submit-proof-btn"
                          onClick={() => window.location.href = `/minitasks/${task._id}/submit-proof`}
                        >
                          Submit Proof
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMiniTaskApplications;
