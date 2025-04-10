import { useState, useEffect, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import moment from "moment";
import "../Styles/ViewApplications.css";
import { userContext } from "../Context/FetchUser";
import Navbar from "../Components/Navbar";
import { getRecentApplications } from "../APIS/API";

const ViewApplications = () => {
  const { recentApplications, fetchRecentApplications } = useContext(userContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null); // Modal state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRecentApplications();
        if (response.status === 200) {
          setFilteredApplications(response.data);
        } else {
          setFilteredApplications([]);
        }
      } catch (err) {
        console.log(err);
        setFilteredApplications([]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = recentApplications.filter((app) =>
      app.job?.title.toLowerCase().includes(query)
    );

    setFilteredApplications(filtered);
  };

  // Get Status Badge Class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-badge status-pending";
      case "accepted":
        return "status-badge status-accepted";
      case "rejected":
        return "status-badge status-rejected";
      default:
        return "status-badge";
    }
  };

  return (
    <div>
      <Navbar />
      <div className="applications-container">
        <h1>My Applications</h1>

        {/* Search Bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Show Loader While Fetching Data */}
        {loading ? (
               <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
               <p className="text-lg font-medium text-gray-700">Fetching your Jobs Applications...</p>
             </div>
         ) : (
          <div className="applications-list">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <div key={app._id} className="application-card">
                  <h3><strong>Title:</strong>{app.job?.title || "N/A"}</h3>
                  <p><strong>Company:</strong> {app.job?.company || "N/A"}</p>
                  <p><strong>Applied On:</strong> {moment(app.createdAt).format("MMMM DD, YYYY")}</p>
                  <p><strong>Status:</strong> <span className={getStatusClass(app.status)}>{app.status}</span></p>
                  <button className="view-details-btn" onClick={() => setSelectedApplication(app)}>
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p>No applications found.</p>
            )}
          </div>
        )}
      </div>

      {/* Modal for Viewing Details */}
      {selectedApplication && (
     <div className="custom-modal-overlay">
    <div className="custom-modal-content">
      <button className="custom-close-btn" onClick={() => setSelectedApplication(null)}>&times;</button>
      <h2 className="modal-job-title">{selectedApplication.job?.title || "N/A"}</h2>

      <div className="modal-details">
        <p><strong>Company:</strong> {selectedApplication.job?.company || "N/A"}</p>
        <p><strong>Applied On:</strong> {moment(selectedApplication.createdAt).format("MMMM DD, YYYY")}</p>
        <p><strong>Job Status:</strong> 
          <span className={`badge badge-${selectedApplication.job?.status?.toLowerCase()}`}>
            {selectedApplication.job?.status || "N/A"}
          </span>
        </p>
        <p><strong>Application Status:</strong> 
          <span className={`badge badge-${selectedApplication.status?.toLowerCase()}`}>
            {selectedApplication.status}
          </span>
        </p>
        <p><strong>Job Description:</strong></p>
        <p className="job-description">{selectedApplication.job?.description || "No description available."}</p>

        <p><strong>Interview Invitation:</strong>  
          {selectedApplication.inviteForInterview ? (
            <span className="badge badge-success">Invited for Interview 🎉</span>
          ) : (
            <span className="badge badge-danger">Not Invited Yet ❌</span>
          )}
        </p>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default ViewApplications;
