import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaClipboardList, 
  FaUserCircle, 
  FaBriefcase, 
  FaChartLine, 
  FaRegCalendarCheck, 
  FaTasks 
} from "react-icons/fa";
import { 
  MdWorkOutline, 
  MdNotifications, 
  MdOutlineRecommend, 
  MdOutlineWarning,
  MdDashboard
} from "react-icons/md";
import Navbar from "../../Components/Common/Navbar";
import { userContext } from "../../Context/FetchUser";
import { notificationContext } from "../../Context/NotificationContext";
import VerifyTooltip from "../../Components/Common/VerifyToolTip";
import { UserGuide } from "../../Components/Common/NewUserGuide";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, fetchUserInfo, fetchRecentApplications, recentApplications, minitasks } = useContext(userContext);
  const { notifications } = useContext(notificationContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Add a state for user onboarding if they're new
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (recentApplications !== null) {
      setLoading(false);
    }
  }, [recentApplications]);

  // Detect if user is likely new (no applications, incomplete profile)
  useEffect(() => {
    if (user && recentApplications) {
      const isNewUser = calculateProfileCompletion() < 30 && recentApplications.length === 0;
      setShowGuide(isNewUser);
    }
  }, [user, recentApplications]);

  const calculateProfileCompletion = () => {
    let fieldsCompleted = 0;
    const fieldsToCheck = [
      user?.name,
      user?.email,
      user?.skills?.length > 0,
      user?.education?.length > 0,
      user?.workExperience?.length > 0,
      user?.Bio,
      user?.profileImage,
    ];
    fieldsToCheck.forEach((field) => {
      if (field) fieldsCompleted++;
    });
    return Math.round((fieldsCompleted / fieldsToCheck.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  
  // Application stats
  const applicationStats = {
    total: recentApplications?.length || 0,
    pending: recentApplications?.filter(app => app.status === "Pending").length || 0,
    successful: recentApplications?.filter(app => app.status === "Accepted" || app.status === "Hired").length || 0
  };

  // Top priority tasks based on profile completion
  const getTopPriorityTask = () => {
    if (!user?.profileImage) return { 
      id: 1, 
      title: "Add profile picture", 
      desc: "Upload a professional photo to help employers recognize you", 
      link: "/user/modify/profile", 
      linkText: "Upload Photo"
    };
    
    if (!user?.skills?.length) return { 
      id: 2, 
      title: "Add your skills", 
      desc: "Highlight your key abilities to match with the right jobs", 
      link: "/user/modify/profile", 
      linkText: "Add Skills"
    };
    
    if (!user?.education?.length) return { 
      id: 3, 
      title: "Add education details", 
      desc: "List your academic qualifications to strengthen your profile", 
      link: "/user/modify/profile", 
      linkText: "Add Education" 
    };
    
    if (!user?.workExperience?.length) return { 
      id: 4, 
      title: "Add work experience", 
      desc: "Share your professional background to stand out", 
      link: "/user/modify/profile", 
      linkText: "Add Experience" 
    };
    
    if (!user?.Bio) return { 
      id: 5, 
      title: "Complete your bio", 
      desc: "Tell potential employers about yourself", 
      link: "/user/modify/profile", 
      linkText: "Add Bio" 
    };
    
    return null;
  };

  const topTask = getTopPriorityTask();

  // Render the user guide for new users
 
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {user && <VerifyTooltip isVerified={user.isVerified} />}
        
        {/* New User Guide (only shown to new users) */}
        <UserGuide 
         showGuide={showGuide}
         setShowGuide={setShowGuide}
         profileCompletion={profileCompletion}
         topTask={topTask}
          />
        {/* Welcome Banner - Simplified */}
        <div className="mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="relative">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-100">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-gray-400" />
                  )}
                </div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${
                  profileCompletion === 100 ? 'bg-green-400' : 'bg-yellow-400'
                }`}></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.name || "Job Seeker"}!</h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <MdDashboard />
                  Dashboard Overview
                </p>
              </div>
            </div>
            {/* Single most important action button */}
            <button
              onClick={() => navigate('/mini_task/listings')}
              className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium flex items-center gap-2 hover:bg-opacity-90 transition-all shadow"
            >
              <FaBriefcase />
             Find Quick Jobs
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Profile Completion Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Profile Completion</h2>
                <span className={`text-sm font-bold px-2 py-1 rounded ${
                  profileCompletion === 100 
                    ? 'bg-green-100 text-green-800' 
                    : profileCompletion >= 70 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {profileCompletion}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    profileCompletion === 100 
                      ? 'bg-green-500' 
                      : profileCompletion >= 80 
                        ? 'bg-blue-500' 
                        : 'bg-yellow-500'
                  }`}
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              
              {/* Focus on single top priority task instead of showing all */}
              {topTask ? (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-2">{topTask.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{topTask.desc}</p>
                  <button 
                    onClick={() => navigate(topTask.link)}
                    className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded"
                  >
                    {topTask.linkText}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-green-600 mt-2 font-medium">Great job! Your profile is complete.</p>
              )}
              
              {/* Access to full profile */}
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => navigate('/user/modify/profile')}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  View full profile
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Quick Links Section - NEW */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h2>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/job/listings')}
                  className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FaBriefcase className="text-blue-600 text-xl mb-2" />
                  <span className="text-sm text-gray-700 font-medium">Find Regular Jobs</span>
                </button>

                <button 
                  onClick={() => navigate('/mini_task/listings')}
                  className="flex flex-col items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <FaTasks className="text-purple-600 text-xl mb-2" />
                  <span className="text-sm text-gray-700 font-medium">Find Mini Jobs</span>
                </button>
                
                
                <button 
                  onClick={() => navigate('/view/applied/jobs')}
                  className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FaRegCalendarCheck className="text-green-600 text-xl mb-2" />
                  <span className="text-sm text-gray-700 font-medium"> My Regular Job Applications</span>
                </button>
                
                <button 
                  onClick={() => navigate('/mini_task/applications')}
                  className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <FaRegCalendarCheck className="text-amber-600 text-xl mb-2" />
                  <span className="text-sm text-gray-700 font-medium"> My Mini Job Applications</span>
                </button>

               <button 
                onClick={() => navigate('/manage/mini_tasks')}
              className="flex flex-col items-center justify-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors col-span-2 mt-2 border-2 border-indigo-200"
             >
                <MdWorkOutline className="text-indigo-600 text-xl mb-2" />
                <span className="text-sm text-gray-700 font-medium">Manage My Posted Mini Jobs</span>
            </button>
              </div>
            </div>
            
            {/* Application Stats
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Application Stats</h2>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-blue-700">{applicationStats.total}</div>
                  <div className="text-xs text-gray-600 mt-1">Total</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-yellow-700">{applicationStats.pending}</div>
                  <div className="text-xs text-gray-600 mt-1">Pending</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-green-700">{applicationStats.successful}</div>
                  <div className="text-xs text-gray-600 mt-1">Successful</div>
                </div>
              </div>
            </div> */}
          </div>
          
          {/* Middle and Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Simplified Tabs Navigation */}
            <div className="bg-white rounded-xl shadow">
              <div className="border-b">
                <div className="flex overflow-x-auto">
                  <button 
                    onClick={() => setActiveTab("overview")}
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "overview" 
                        ? "border-b-2 border-indigo-600 text-indigo-600" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <FaChartLine />
                   Job Applications Overview
                  </button>
                  {/*<button 
                    onClick={() => setActiveTab("applications")}
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "applications" 
                        ? "border-b-2 border-indigo-600 text-indigo-600" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <FaBriefcase />
                    Applications
                  </button>*/}
                  {/*<button 
                    onClick={() => setActiveTab("minitasks")}
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "minitasks" 
                        ? "border-b-2 border-indigo-600 text-indigo-600" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <FaTasks />
                    Mini Jobs
                  </button>*/}
                </div>
              </div>
              
              <div className="p-6">
                {/* Overview Tab - Simplified content */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Recent Job Applications */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-800 flex items-center gap-2">
                          <FaRegCalendarCheck className="text-green-500" />
                         My Regular Job Applications
                        </h3>
                        {recentApplications && recentApplications.length > 0 && (
                          <button 
                            onClick={() => navigate('/view/applied/jobs')}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            View all
                          </button>
                        )}
                      </div>
                      
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent mx-auto rounded-full"></div>
                          <p className="mt-2 text-sm text-gray-500">Loading activity...</p>
                        </div>
                      ) : recentApplications && recentApplications.length > 0 ? (
                        <div className="space-y-3">
                          {recentApplications.slice(0, 3).map((app) => (
                            <div key={app.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <FaBriefcase className="text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{app.job.title}</p>
                                <p className="text-xs text-gray-500">{app.job.company}</p>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                app.status === "Pending" 
                                  ? "bg-yellow-100 text-yellow-800" 
                                  : app.status === "Accepted" || app.status === "Hired"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}>
                                {app.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <p className="text-sm text-gray-500">No recent job applications found.</p>
                          <button 
                            onClick={() => navigate('/job/listings')}
                            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            Browse available jobs
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Recent Mini Tasks - Simplified */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-800 flex items-center gap-2">
                          <MdOutlineRecommend className="text-indigo-500" />
                          My Mini Job Applications
                        </h3>
                        {minitasks && minitasks.length > 0 && (
                          <button 
                            onClick={() => navigate('/mini_task/applications')}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            View all
                          </button>
                        )}
                      </div>
                      
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent mx-auto rounded-full"></div>
                          <p className="mt-2 text-sm text-gray-500">Loading mini tasks...</p>
                        </div>
                      ) : minitasks && minitasks.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                          {minitasks.slice(0, 2).map((task) => (
                            <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-800">{task.title}</h4>
                                  <p className="text-xs text-gray-600 mt-1">By {task.employer.name}</p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">₵{task.budget}</span>
                              </div>
                              {/*<button 
                                onClick={() => navigate(`/view/mini_task/info/${task._id}`)} 
                                className="mt-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded"
                              >
                                View Details
                              </button> */}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <p className="text-sm text-gray-500">No mini task applications found.</p>
                          <button 
                            onClick={() => navigate('/mini_task/listings')}
                            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            Browse mini tasks
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Applications Tab, important- Currently Commented Out */}
                {activeTab === "applications" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-800">Your Job Applications</h3>
                      <button 
                        onClick={() => navigate('/view/applied/jobs')}
                        className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200"
                      >
                        View All
                      </button>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent mx-auto rounded-full"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading applications...</p>
                      </div>
                    ) : recentApplications.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <MdWorkOutline className="mx-auto text-4xl text-gray-400" />
                        <p className="mt-2 text-gray-600">You haven't applied for any jobs yet.</p>
                        <button 
                          onClick={() => navigate('/job/listings')} 
                          className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded"
                        >
                          Browse Jobs
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentApplications.slice(0, 5).map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                {app.job.company.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{app.job.title}</p>
                                <p className="text-xs text-gray-500">{app.job.company}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                              app.status === "Pending" 
                                ? "bg-yellow-100 text-yellow-800" 
                                : app.status === "Accepted" || app.status === "Offered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Mini Tasks Tab, important- Currently Commented Out */}
                {activeTab === "minitasks" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-800">Your Mini Tasks</h3>
                      <button 
                        onClick={() => navigate('/mini_task/applications')}
                        className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200"
                      >
                        View All
                      </button>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent mx-auto rounded-full"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading mini tasks...</p>
                      </div>
                    ) : minitasks.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {minitasks.slice(0, 4).map((task) => (
                          <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-800">{task.title}</h4>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">₵{task.budget}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">Employer: {task.employer.name}</p>
                            <div className="mt-3">
                              <button 
                                onClick={() => navigate(`/view/mini_task/info/${task._id}`)} 
                                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <FaTasks className="mx-auto text-4xl text-gray-400" />
                        <p className="mt-2 text-gray-600">You haven't applied for any mini tasks yet.</p>
                        <button 
                          onClick={() => navigate('/mini_task/listings')} 
                          className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4px-4 rounded">
                            Browse mini tasks
                          </button>
                        </div>
                      )}
                    </div>
                
                )}
              </div>
            </div>
            
            {/* Recent Notifications */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <MdNotifications className="text-amber-500" />
                  Recent Notifications
                </h2>
                <button 
                  onClick={() => navigate('/view/all_notifications')}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent mx-auto rounded-full"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                  </div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`flex items-start p-3 border-l-4 ${
                          notification.type === 'success' ? 'border-green-500 bg-green-50' : 
                          notification.type === 'warning' ? 'border-yellow-500 bg-yellow-50' : 
                          'border-blue-500 bg-blue-50'
                        } rounded-r-lg`}
                      >
                        {notification.type === 'success' ? (
                          <FaRegCalendarCheck className="text-green-500 mt-0.5 mr-3" />
                        ) : notification.type === 'warning' ? (
                          <MdOutlineWarning className="text-yellow-500 mt-0.5 mr-3" />
                        ) : (
                          <MdNotifications className="text-blue-500 mt-0.5 mr-3" />
                        )}
                        <div>
                          <p className="text-sm text-gray-800 font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <MdNotifications className="mx-auto text-2xl text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;