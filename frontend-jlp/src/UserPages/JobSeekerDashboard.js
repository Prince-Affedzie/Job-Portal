import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaClipboardList, FaUserCircle, FaBriefcase, FaChartLine, FaRegCalendarCheck, FaTasks } from "react-icons/fa";
import { MdWorkOutline, MdNotifications, MdOutlineRecommend ,MdOutlineWarning} from "react-icons/md";
import Navbar from "../Components/MyComponents/Navbar";
import { userContext } from "../Context/FetchUser";
import { notificationContext } from "../Context/NotificationContext";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, fetchUserInfo, fetchRecentApplications, recentApplications, minitasks } = useContext(userContext);
  console.log(recentApplications)
  const {notifications}  = useContext( notificationContext)
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (recentApplications !== null) {
      setLoading(false);
    }
  }, [recentApplications]);

  const calculateProfileCompletion = () => {
    let fieldsCompleted = 0;
    const fieldsToCheck = [
      user?.name,
      user?.email,
      user?.skills?.length > 0,
      user?.education.lenth> 0,
      user?.workExperience.length> 0,
      user?.Bio,
      user?.profileImage,
    ];
    fieldsToCheck.forEach((field) => {
      if (field) fieldsCompleted++;
    });
    return Math.round((fieldsCompleted / fieldsToCheck.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  
  // Tasks that need attention (profile completion suggestions)
  const profileTasks = [
    { id: 1, title: "Add profile picture", completed: !!user?.profileImage },
    { id: 2, title: "Fill your bio section", completed: !!user?.Bio },
    { id: 3, title: "Add skills to your profile", completed: user?.skills?.length > 0 },
    { id: 4, title: "Add education details", completed: !!user?.education.lenth>0 },
    { id: 5, title: "Add work experience", completed: !!user?.workExperience.length>0}
  ].filter(task => !task.completed);

  // Application stats
  const applicationStats = {
    total: recentApplications?.length || 0,
    pending: recentApplications?.filter(app => app.status === "Pending").length || 0,
    successful: recentApplications?.filter(app => app.status === "Accepted" || app.status === "Hired").length || 0
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="relative">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-white"
                  />
                ) : (
                  <FaUserCircle className="w-16 h-16 text-white" />
                )}
                <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${profileCompletion === 100 ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {user?.name || "Job Seeker"}!</h1>
                <p className="text-blue-100">{user?.skills?.[0] || "Complete your profile to showcase your skills"}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/user/modify/profile')}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center gap-2 transition-all"
              >
                <FaUserCircle />
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/manage/mini_tasks')}
                className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium flex items-center gap-2 hover:bg-opacity-90 transition-all shadow"
              >
                <FaClipboardList />
                Manage Your Mini Task Jobs
              </button>
            </div>
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
              
              {profileTasks.length > 0 ? (
                <div className="space-y-3 mt-4">
                  <p className="text-sm text-gray-600 font-medium">Complete these tasks to improve your profile:</p>
                  {profileTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center text-sm">
                      <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
                      <span className="text-gray-700">{task.title}</span>
                    </div>
                  ))}
                  {profileTasks.length > 3 && (
                    <button 
                      onClick={() => navigate('/user/modify/profile')}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      +{profileTasks.length - 3} more tasks
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-green-600 mt-2 font-medium">Great job! Your profile is complete.</p>
              )}
            </div>
            
            {/* Application Stats */}
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
              <div className="mt-4">
                <Link 
                  to="/view/applied/jobs"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  View all applications
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Middle and Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Navigation */}
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
                    Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab("applications")}
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "applications" 
                        ? "border-b-2 border-indigo-600 text-indigo-600" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <FaBriefcase />
                    Applications
                  </button>
                  <button 
                    onClick={() => setActiveTab("minitasks")}
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "minitasks" 
                        ? "border-b-2 border-indigo-600 text-indigo-600" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <FaTasks />
                    Mini Tasks
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <FaRegCalendarCheck className="text-green-500" />
                       Your Recent Applications
                      </h3>
                      
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent mx-auto rounded-full"></div>
                          <p className="mt-2 text-sm text-gray-500">Loading activity...</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {recentApplications && recentApplications.length > 0 ? (
                            recentApplications.slice(0, 3).map((app) => (
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
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 py-3">No recent activity found.</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <MdOutlineRecommend className="text-indigo-500" />
                       Your Mini Job Applications
                      </h3>
                      
                      {loading ? (
                        <p className="text-sm text-gray-500">Loading applications...</p>
                      ) : minitasks && minitasks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {minitasks.slice(0, 2).map((task) => (
                            <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-800">{task.title}</h4>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">₵{task.budget}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">By {task.employer.name}</p>
                              <p className="text-xs text-gray-600 mt-2">Employer Phone: {task.employer.phone}</p>
                              <div className="mt-3">
                                <button onClick={()=>navigate(`/view/mini_task/info/${task._id}`)} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded">
                                  View Details
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No recommendations available.</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Applications Tab */}
                {activeTab === "applications" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-800">Your Job Applications</h3>
                      <Link 
                        to="/view/applied/jobs"
                        className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200"
                      >
                        View All
                      </Link>
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
                        <button onClick={()=>navigate('/job/listings')} className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded">
                          Browse Jobs
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentApplications.slice(0, 6).map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                {app.job.company.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{app.job.title}</p>
                                <p className="text-xs text-gray-500">{app.job.company}</p>
                                <p className="text-xs text-gray-500">Company Email: {app.job.companyEmail || 'N/A'}</p>
                                <p className="text-xs text-gray-500">{`Your Application Status: ${app.status}`}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className={`text-xs font-medium px-2 py-1 rounded mr-3 ${
                                app.status === "Pending" 
                                  ? "bg-yellow-100 text-yellow-800" 
                                  : app.status === "Accepted" || app.status === "Offered"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}>
                                {app.status}
                              </span>
                              {/*<button className="text-gray-400 hover:text-indigo-600" onClick={()=>navigate(`/job/details/${job._id}`)}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                              </button>*/}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Mini Tasks Tab */}
                {activeTab === "minitasks" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-800">Your Mini Tasks Applications</h3>
                      <button 
                        onClick={() => navigate('/mini_task/applications')}
                        className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200"
                      >
                       View All
                      </button>
                    </div>
                    
                    {loading ? (
                      <p className="text-sm text-gray-500">Loading mini tasks...</p>
                    ) : minitasks.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {minitasks.slice(0,8).map((task) => (
                          <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-800">{task.title}</h4>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">₵{task.budget}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">Employer: {task.employer.name}</p>
                            <p className="text-xs text-gray-600">Contact: {task.employer.phone}</p>
                            <p className="text-xs text-gray-600">Job Status: {task.status}</p>
                            <div className="mt-3 flex justify-between items-center">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                             task.assignedTo === null 
                           ? 'bg-yellow-100 text-yellow-700' 
                           : task.assignedTo === user?._id 
                           ? 'bg-green-100 text-green-700' 
                           : 'bg-gray-100 text-gray-700'
                           }`}>
                          {task.assignedTo === null 
                            ? "Not Assigned Yet. Keep your Hope alive." 
                            : task.assignedTo === user?._id 
                            ? "Assigned to You" 
                         : "Assigned to Someone Else"}
                        </span>                             
                          { <button onClick={()=>navigate(`/view/mini_task/info/${task._id}`)} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded">
                                View Details
                              </button> }
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <FaTasks className="mx-auto text-4xl text-gray-400" />
                        <p className="mt-2 text-gray-600">No mini tasks applications found.</p>
                        <button onClick={()=>navigate('/mini_task/listings')} className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded">
                          Find Mini Tasks
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
    <h2 className="text-lg font-bold text-gray-800">Recent Notifications</h2>
    <button className="text-indigo-600 hover:text-indigo-800 text-sm" onClick={()=>navigate('/view/all_notifications')}>View All</button>
  </div>
  
  <div className="space-y-3">
    {loading ? (
      <div className="text-center py-4">
        <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent mx-auto rounded-full"></div>
        <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
      </div>
    ) : notifications && notifications.length > 0 ? (
      <div className="space-y-3">
        {notifications.slice(0,3).map((notification) => (
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
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <MdNotifications className="mx-auto text-4xl text-gray-400" />
        <p className="mt-2 text-gray-600">No new notifications</p>
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