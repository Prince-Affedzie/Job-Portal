import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaBriefcase,
  FaUsers,
  FaEye,
  FaMoneyBill,
  FaBell,
} from "react-icons/fa";
import Sidebar from "../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import Footer from "../Components/Footer";
import "../Styles/EmployerDashboard.css";
import { jobsCreatedContext } from "../Context/EmployerContext1";

const EmployerDashboard = () => {
  const { Jobs, loading } = useContext(jobsCreatedContext);

  const stats = {
    jobsPosted: Jobs.length,
    totalApplicants: Jobs.reduce((total, job) => total + (job.noOfApplicants || 0), 0),
    profileViews: 3200,
    paymentsProcessed: 2500,
  };

  const notifications = [
    { id: 1, message: "John Doe applied for 'Frontend Developer'" },
    { id: 2, message: "Payment of $500 received for 'UI/UX Designer'" },
    { id: 3, message: "Your job 'React Developer' has been viewed 120 times" },
  ];

  return (

    <div>
      <EmployerNavbar/>
    <div className="employer-dashboard-container">
      
      
      
       <Sidebar/>
      <div className="employer-dashboard-content">
       
        {/* Header */}
        <div className="employer-dashboard-header">
         
          <h2>Welcome to Your Dashboard</h2>
          <Link to="/v1/post_job/form" className="employer-post-job-btn">
            <FaPlus /> Post New Job
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="employer-dashboard-summary">
          {[
            {
              icon: <FaBriefcase />,
              value: stats.jobsPosted,
              label: "Jobs Posted",
            },
            {
              icon: <FaUsers />,
              value: stats.totalApplicants,
              label: "Total Applicants",
            },
            {
              icon: <FaEye />,
              value: stats.profileViews.toLocaleString(),
              label: "Profile Views",
            },
            {
              icon: <FaMoneyBill />,
              value: `$${stats.paymentsProcessed}`,
              label: "Payments Processed",
            },
          ].map((item, index) => (
            <div className="employer-card" key={index}>
              <div className="employer-icon">{item.icon}</div>
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Jobs Section */}
        <div className="employer-recent-jobs">
          <h3>Recent Jobs</h3>
          {loading ? (
            <div className="employer-job-list-loading">Loading jobs...</div>
          ) : Jobs.length === 0 ? (
            <div className="employer-job-list-empty">No jobs posted yet.</div>
          ) : (
            <div className="employer-job-list-d">
              {Jobs.slice(0, 3).map((job) => (
                <div className="employer-job-card-d" key={job._id}>
                  <h4>{job.title}</h4>
                  <p>{job.noOfApplicants} Applicants</p>
                  <Link
                    to="/employer/applicants"
                    className="employer-view-applicants-btn"
                  >
                    View Applicants
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Section */}
        <div className="employer-notifications">
          <h3>Recent Notifications</h3>
          <ul>
            {notifications.map((note) => (
              <li key={note.id}>
                <FaBell className="employer-notification-icon" /> {note.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
     
    </div>
    
    </div>
  );
};

export default EmployerDashboard;
