import { useState, useContext, useEffect } from "react";
import { Link ,useNavigate } from "react-router-dom";
import { FaBell, FaBriefcase, FaEnvelope, FaUserCircle, FaStar, FaClipboardList, FaMoneyBillWave, FaEye, FaHandshake } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import { userContext } from "../Context/FetchUser";

const JobSeekerDashboard = () => {
  const navigate = useNavigate()
  const { user, fetchUserInfo ,fetchRecentApplications,recentApplications} = useContext(userContext);
  const [loading, setLoading] = useState(true);

  const [jobsApplied, setJobsApplied] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const data = {
    totalEarnings: 5000,
    activeProposals: 3,
    jobInvitations: 2,
    profileViews: 120,
    jobMatches: 15,
    employerInteractions: 5,
  };

  useEffect(() => {
    // Simulating API Call with setTimeout
    setTimeout(() => {
      setJobsApplied([
        { id: 1, title: "Frontend Developer", company: "TechCorp", status: "Pending" },
        { id: 2, title: "UI/UX Designer", company: "DesignHub", status: "Interview" },
      ]);
      setRecommendedJobs([
        { id: 3, title: "React Developer", company: "InnovateX", rating: 4.8 },
        { id: 4, title: "Backend Engineer", company: "CodeSolutions", rating: 4.5 },
      ]);
      setMessages([{ id: 1, text: "You have 2 unread messages." }]);
      setNotifications([{ id: 1, text: "You have 3 new job alerts." }]);
      
    }, 1000);
  }, []);

  useEffect(() => {
    if (recentApplications !== null) {
      setLoading(false);
    }
  }, [recentApplications]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <div className="flex items-center gap-4">
            {user?.profileImage ? (
              <img
                src={`http://localhost:5000/Uploads/profile_images/${user.profileImage}`}
                alt="Profile"
                className="w-16 h-16 rounded-full border"
              />
            ) : (
              <FaUserCircle className="w-16 h-16 text-gray-400" />
            )}
            <div>
              <h2 className="text-lg font-semibold">{user?.name || "Guest User"}</h2>
              {user?.skills?.length > 0 ? (
                <p className="text-gray-500">{user.skills[0]}</p>
              ) : (
                <p className="text-gray-400">No skills available</p>
              )}
            </div>
          </div>
          <button className="mt-4 w-full bg-gray-200 p-2 rounded-md text-gray-700 hover:bg-gray-300" onClick={()=>navigate('/user/modify/profile')}>
            Edit Profile
          </button>
          <button
           onClick={() => navigate('/manage/mini_tasks')}
          className="mt-2 w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center gap-2"
          >
          <FaClipboardList />
          Manage Mini Tasks
         </button>

        </div>

        {/* Earnings & Activity Insights */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Earnings & Proposals</h2>
            <div className="space-y-2">
              <p className="text-gray-600"><FaMoneyBillWave className="inline mr-2" /> Total Earnings: ₵{data.totalEarnings}</p>
              <p className="text-gray-600"><FaBriefcase className="inline mr-2" /> Active Proposals: {data.activeProposals}</p>
              <p className="text-gray-600"><FaHandshake className="inline mr-2" /> Job Invitations: {data.jobInvitations}</p>
            </div>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Activity Insights</h2>
            <div className="space-y-2">
              <p className="text-gray-600"><FaEye className="inline mr-2" /> Profile Views: {data.profileViews}</p>
              <p className="text-gray-600"><FaClipboardList className="inline mr-2" /> Job Matches: {data.jobMatches}</p>
              <p className="text-gray-600"><FaUserCircle className="inline mr-2" /> Employer Interactions: {data.employerInteractions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Applications */}
      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow-lg p-6 rounded-lg md:col-span-2">
    <h2 className="text-lg font-semibold mb-4">Recent Job Applications</h2>

    {loading ? (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Fetching your applied jobs...</p>
      </div>
    ) : recentApplications === null ? (
      <div className="text-gray-500 text-center">Loading applications...</div>
    ) : recentApplications.length === 0 ? (
      <p className="text-gray-500">No job applications yet.</p>
    ) : (
      <ul className="space-y-3">
        {recentApplications.slice(0, 4).map((app) => (
          <li key={app.id} className="bg-gray-100 p-4 rounded-md flex justify-between items-center">
            <span>{app.job.title} at {app.job.company}</span>
            <span
              className={`text-sm font-semibold ${
                app.status === "Pending" ? "text-blue-600" : "text-green-600"
              }`}
            >
              {app.status}
            </span>
          </li>
        ))}
        <div className="mt-4 flex justify-center">
          <Link
            to="/view/applied/jobs"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md"
          >
            View All
          </Link>
        </div>
      </ul>
    )}
  </div>
        {/* Messages & Notifications */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Messages & Notifications</h2>
          {loading ? (
            <p className="text-gray-400">Loading messages...</p>
          ) : (
            <>
              {messages.length > 0 ? messages.map((msg) => (
                <div key={msg.id} className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold"><FaEnvelope className="inline mr-2" /> Messages</h3>
                  <p className="text-gray-500">{msg.text}</p>
                </div>
              )) : <p className="text-gray-500">No new messages.</p>}

              {notifications.length > 0 ? notifications.map((note) => (
                <div key={note.id} className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold"><FaBell className="inline mr-2" /> Notifications</h3>
                  <p className="text-gray-500">{note.text}</p>
                </div>
              )) : <p className="text-gray-500">No notifications.</p>}
            </>
          )}
        </div>
      </div>

      {/* Job Recommendations */}
      <div className="max-w-6xl mx-auto mt-6 bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Job Recommendations</h2>
        {loading ? (
          <p className="text-gray-400">Loading job recommendations...</p>
        ) : recommendedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-gray-500">{job.company}</p>
                <p className="text-yellow-500"><FaStar className="inline mr-1" /> {job.rating}</p>
                <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No job recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
