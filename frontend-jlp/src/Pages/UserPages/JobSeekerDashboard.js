import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUserCircle, 
  FaBriefcase, 
  FaTasks,
  FaRegCalendarCheck,
  FaClipboardCheck
} from "react-icons/fa";
import { 
  MdNotifications, 
  MdOutlineRecommend,
  MdDashboard,
  MdOutlineWarning
} from "react-icons/md";
import Navbar from "../../Components/Common/Navbar";
import { userContext } from "../../Context/FetchUser";
import { notificationContext } from "../../Context/NotificationContext";
import VerifyTooltip from "../../Components/Common/VerifyToolTip";
import { UserGuide } from "../../Components/Common/NewUserGuide";
import { NotificationToast } from "../../Components/Common/NotificationToast";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, recentApplications, minitasks } = useContext(userContext);
  const { notifications } = useContext(notificationContext);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    if (recentApplications !== null) setLoading(false);
  }, [recentApplications]);

  // Check if user is new (incomplete profile + no applications)
  useEffect(() => {
    if (user && recentApplications) {
      const isNewUser = calculateProfileCompletion() < 30 && recentApplications.length === 0;
      setShowGuide(isNewUser);
    }
  }, [user, recentApplications]);

  const calculateProfileCompletion = () => {
    const fieldsToCheck = [
      user?.name,
      user?.email,
      user?.skills?.length > 0,
      user?.education?.length > 0,
      user?.workExperience?.length > 0,
      user?.Bio,
      user?.profileImage,
    ];
    const completed = fieldsToCheck.filter(Boolean).length;
    return Math.round((completed / fieldsToCheck.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  
  // Get highest priority profile task
  const getTopPriorityTask = () => {
    const tasks = [
      { 
        id: 1, 
        title: "Add profile picture", 
        desc: "Upload a professional photo to help employers recognize you", 
        link: "/user/modify/profile", 
        condition: !user?.profileImage
      },
      { 
        id: 2, 
        title: "Add your skills", 
        desc: "Highlight your key abilities to match with the right jobs", 
        link: "/user/modify/profile", 
        condition: !user?.skills?.length
      },
      { 
        id: 3, 
        title: "Add education", 
        desc: "List your academic qualifications", 
        link: "/user/modify/profile", 
        condition: !user?.education?.length
      },
      { 
        id: 4, 
        title: "Add work experience", 
        desc: "Share your professional background", 
        link: "/user/modify/profile", 
        condition: !user?.workExperience?.length
      },
      { 
        id: 5, 
        title: "Complete your bio", 
        desc: "Tell employers about yourself", 
        link: "/user/modify/profile", 
        condition: !user?.Bio
      }
    ];
    
    return tasks.find(task => task.condition) || null;
  };

  const topTask = getTopPriorityTask();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Verification badge */}
        {user && <VerifyTooltip isVerified={user.isVerified} />}
        
        {/* New user onboarding guide */}
        <UserGuide 
          showGuide={showGuide}
          setShowGuide={setShowGuide}
          profileCompletion={profileCompletion}
          topTask={topTask}
        />
        
        {/* Welcome header with profile and CTA */}
        <header className="mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-100">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
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
            
            <button
              onClick={() => navigate('/mini_task/listings')}
              className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium flex items-center gap-2 hover:bg-opacity-90 transition-all shadow"
            >
              <FaBriefcase />
              Find Quick Jobs
            </button>
          </div>
        </header>

        {/* Dashboard content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Profile and quick actions */}
          <div className="space-y-6">
            {/* Profile completion card */}
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Profile Completion</h2>
                <span className={`text-sm font-bold px-2 py-1 rounded ${
                  profileCompletion === 100 ? 'bg-green-100 text-green-800' 
                  : profileCompletion >= 70 ? 'bg-blue-100 text-blue-800' 
                  : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {profileCompletion}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className={`h-2.5 rounded-full ${
                    profileCompletion === 100 ? 'bg-green-500' 
                    : profileCompletion >= 80 ? 'bg-blue-500' 
                    : 'bg-yellow-500'
                  }`}
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              
              {/* Priority task */}
              {topTask ? (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-2">{topTask.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{topTask.desc}</p>
                  <button 
                    onClick={() => navigate(topTask.link)}
                    className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded"
                  >
                    Complete Now
                  </button>
                </div>
              ) : (
                <p className="text-sm text-green-600 mt-2 font-medium">Profile complete!</p>
              )}
              
              <button 
                onClick={() => navigate('/user/modify/profile')}
                className="mt-4 w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-end"
              >
                View full profile →
              </button>
            </section>
            
            {/* Quick links */}
            <section className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/job/listings')}
                  className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FaBriefcase className="text-blue-600 text-xl mb-2" />
                  <span className="text-sm text-gray-700 font-medium">Regular Jobs</span>
                </button>

                <button 
                  onClick={() => navigate('/mini_task/listings')}
                  className="flex flex-col items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <FaTasks className="text-purple-600 text-xl mb-2" />
                  <span className="text-sm text-gray-700 font-medium">Micro Jobs</span>
                </button>
                
                <button 
                  onClick={() => navigate('/view/applied/jobs')}
                  className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FaRegCalendarCheck className="text-green-600 text-xl mb-2" />
                  <span className="text-sm text-gray-700 font-medium">Regular Job Applications</span>
                </button>
                
                <button 
                  onClick={() => navigate('/mini_task/applications')}
                  className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <FaClipboardCheck className="text-amber-600 text-xl mb-2" />
                  <span className="text-sm text-gray-700 font-medium">Micro Job Applications</span>
                </button>

                {/*<button 
                  onClick={() => navigate('/manage/mini_tasks')}
                  className="flex flex-col items-center justify-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors col-span-2 border-2 border-indigo-200"
                >
                  <MdOutlineRecommend className="text-indigo-600 text-xl mb-2" />
                  <span className="text-sm text-gray-700 font-medium">Manage My Micro Jobs</span>
                </button>*/}
              </div>
            </section>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application activity */}
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaRegCalendarCheck className="text-green-500" />
                  Regular Job Applications
                </h2>
                {recentApplications?.length > 0 && (
                  <button 
                    onClick={() => navigate('/view/applied/jobs')}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View all
                  </button>
                )}
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent mx-auto rounded-full"></div>
                </div>
              ) : recentApplications?.length > 0 ? (
                <div className="space-y-3">
                  {recentApplications.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <FaBriefcase className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{app.job.title}</p>
                        <p className="text-xs text-gray-500 truncate">{app.job.company}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                        app.status === "Pending" ? "bg-yellow-100 text-yellow-800" 
                        : app.status === "Accepted" || app.status === "Hired" ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500">No Regular Job applications</p>
                  <button 
                    onClick={() => navigate('/job/listings')}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Browse Regular jobs
                  </button>
                </div>
              )}
            </section>
            
            {/* Mini tasks activity */}
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaClipboardCheck className="text-indigo-500" />
                   My Micro Job Applications
                </h2>
                {minitasks?.length > 0 && (
                  <button 
                    onClick={() => navigate('/mini_task/applications')}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View all
                  </button>
                )}
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent mx-auto rounded-full"></div>
                </div>
              ) : minitasks?.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {minitasks.slice(0, 2).map((task) => (
                    <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-800 truncate">{task.title}</h4>
                          <p className="text-xs text-gray-600 mt-1 truncate">By {task.employer.name}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">₵{task.budget}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500">No micro job applications</p>
                  <button 
                    onClick={() => navigate('/mini_task/listings')}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Browse micro jobs
                  </button>
                </div>
              )}
            </section>
            
            {/* Notifications */}
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <MdNotifications className="text-amber-500" />
                  Recent Notifications
                </h2>
                <button 
                  onClick={() => navigate('/view/all_notifications')}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  View all
                </button>
              </div>
              
              {notifications?.length > 0 ? (
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
                      <div className="mt-0.5 mr-3">
                        {notification.type === 'success' ? (
                          <FaRegCalendarCheck className="text-green-500" />
                        ) : notification.type === 'warning' ? (
                          <MdOutlineWarning className="text-yellow-500" />
                        ) : (
                          <MdNotifications className="text-blue-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{notification.title}</p>
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
            </section>
            <NotificationToast/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobSeekerDashboard;