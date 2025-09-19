import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUserCircle, 
  FaTasks,
  FaClipboardCheck,
  FaRocket,
  FaChartLine,
  FaWallet,
  FaStar,
  FaLightbulb,
  FaGavel,
  FaFileContract
} from "react-icons/fa";
import { 
  MdNotifications, 
  MdDashboard,
  MdOutlineTrendingUp,
  MdOutlineWork
} from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import Navbar from "../../Components/Common/Navbar";
import { userContext } from "../../Context/FetchUser";
import { notificationContext } from "../../Context/NotificationContext";
import VerifyTooltip from "../../Components/Common/VerifyToolTip";
import { UserGuide } from "../../Components/Common/NewUserGuide";
import { NotificationToast } from "../../Components/Common/NotificationToast";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, minitasks } = useContext(userContext);
  const { notifications } = useContext(notificationContext);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  // Extract applications and bids from minitasks
  const applications = minitasks?.applications || [];
  const bids = minitasks?.bids || [];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    if (minitasks !== null) setLoading(false);
  }, [minitasks]);

  // Check if user is new (incomplete profile + no applications)
  useEffect(() => {
    if (user && minitasks) {
      const totalApplications = applications.length + bids.length;
      const isNewUser = calculateProfileCompletion() < 30 && totalApplications === 0;
      setShowGuide(isNewUser);
    }
  }, [user, minitasks, applications, bids]);

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
        desc: "Upload a professional photo to build trust with clients", 
        link: "/user/modify/profile", 
        condition: !user?.profileImage
      },
      { 
        id: 2, 
        title: "Add your skills", 
        desc: "Showcase your expertise to attract better micro jobs", 
        link: "/user/modify/profile", 
        condition: !user?.skills?.length
      },
      { 
        id: 3, 
        title: "Add work experience", 
        desc: "Highlight your professional background", 
        link: "/user/modify/profile", 
        condition: !user?.workExperience?.length
      },
      { 
        id: 4, 
        title: "Complete your bio", 
        desc: "Tell clients about your capabilities", 
        link: "/user/modify/profile", 
        condition: !user?.Bio
      }
    ];
    
    return tasks.find(task => task.condition) || null;
  };

  const topTask = getTopPriorityTask();

  // Calculate micro job stats accounting for both applications and bids
  const getMicroJobStats = () => {
    const totalApplications = applications.length + bids.length;
    
    const activeApplications = [
      ...applications.filter(app => 
        app.status === 'Open' || app.status === 'In-progress'
      ),
      ...bids.filter(bid => 
        bid.task.status === 'Open' || bid.task.status === 'In-progress'
      )
    ].length;

    const completedJobs = [
      ...applications.filter(app => app.status === 'Completed'),
      ...bids.filter(bid => bid.task.status === 'Completed')
    ].length;

    const assignedJobs = [
      ...applications.filter(app => app.assignedTo === user?._id),
      ...bids.filter(bid => bid.task.assignedTo === user?._id)
    ].length;

    return { totalApplications, activeApplications, completedJobs, assignedJobs };
  };

  const stats = getMicroJobStats();

  // Get recent micro job activities (both applications and bids)
  const getRecentActivities = () => {
    const allActivities = [
      ...applications.map(app => ({
        type: 'application',
        id: app._id,
        title: app.title,
        employer: app.employer,
        budget: app.budget,
        status: app.status,
        biddingType: app.biddingType,
        createdAt: app.appliedAt || app.createdAt,
        assignedTo: app.assignedTo,
        assignmentAccepted: app.assignmentAccepted
      })),
      ...bids.map(bid => ({
        type: 'bid',
        id: bid.task._id,
        title: bid.task.title,
        employer: bid.task.employer,
        budget: bid.task.budget,
        status: bid.task.status,
        biddingType: bid.task.biddingType,
        bidAmount: bid.bid.amount,
        bidStatus: bid.bid.status,
        createdAt: bid.bid.createdAt,
        assignedTo: bid.task.assignedTo,
        assignmentAccepted: bid.task.assignmentAccepted
      }))
    ];

    // Sort by creation date (newest first)
    return allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const recentActivities = getRecentActivities().slice(0, 3);

  // Get status badge class based on status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In-progress': return 'bg-amber-100 text-amber-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Assigned': return 'bg-purple-100 text-purple-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get bid status badge class
  const getBidStatusClass = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        <header className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-lg border-4 border-white/20 bg-gray-100">
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
                <h1 className="text-2xl font-bold">Welcome back, {user?.name || "Freelancer"}!</h1>
                <p className="text-indigo-100 flex items-center gap-2">
                  <HiSparkles className="text-yellow-300" />
                  Ready to find your next micro job?
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/mini_task/listings')}
              className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              <FaRocket className="text-indigo-600" />
              Browse Micro Jobs
            </button>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MdOutlineWork className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <MdOutlineTrendingUp className="text-amber-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaStar className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaFileContract className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.assignedJobs}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Profile and quick actions */}
          <div className="space-y-6">
            {/* Profile completion card */}
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Profile Strength</h2>
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
                <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h3 className="font-medium text-indigo-800 mb-2 flex items-center gap-2">
                    <FaLightbulb className="text-indigo-600" />
                    {topTask.title}
                  </h3>
                  <p className="text-sm text-indigo-600 mb-3">{topTask.desc}</p>
                  <button 
                    onClick={() => navigate(topTask.link)}
                    className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    Complete Now
                  </button>
                </div>
              ) : (
                <div className="text-center py-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium">🎉 Profile complete! You're ready to work!</p>
                </div>
              )}
            </section>
            
            {/* Quick links */}
            <section className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Access</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/mini_task/listings')}
                  className="w-full flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
                    <FaTasks className="text-white text-lg" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Browse Micro Jobs</p>
                    <p className="text-sm text-gray-600">Find new opportunities</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/mini_task/applications')}
                  className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                    <FaClipboardCheck className="text-white text-lg" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">My Applications</p>
                    <p className="text-sm text-gray-600">Track your submissions</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/user/modify/profile')}
                  className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                    <FaUserCircle className="text-white text-lg" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Edit Profile</p>
                    <p className="text-sm text-gray-600">Improve your visibility</p>
                  </div>
                </button>
              </div>
            </section>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Micro jobs activity */}
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaClipboardCheck className="text-indigo-600" />
                  Recent Micro Job Activities
                </h2>
                {(applications.length > 0 || bids.length > 0) && (
                  <button 
                    onClick={() => navigate('/mini_task/applications')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View all
                  </button>
                )}
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent mx-auto rounded-full"></div>
                </div>
              ) : recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            By {activity.employer?.name || 'Unknown Client'}
                            {activity.type === 'bid' && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                Your bid: ₵{activity.bidAmount}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
                          ₵{activity.budget}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusClass(activity.status)}`}>
                            {activity.status}
                          </span>
                          {activity.type === 'bid' && (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getBidStatusClass(activity.bidStatus)}`}>
                              Bid: {activity.bidStatus}
                            </span>
                          )}
                          {activity.assignedTo === user?._id && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-medium">
                              Assigned to you
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {activity.type === 'application' ? 'Applied' : 'Bid'} {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <FaTasks className="mx-auto text-3xl text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">No micro job activities yet</p>
                  <p className="text-sm text-gray-500 mb-4">Start applying to micro jobs to see them here</p>
                  <button 
                    onClick={() => navigate('/mini_task/listings')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Find Micro Jobs
                  </button>
                </div>
              )}
            </section>
            
            {/* Performance Insights */}
            <section className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaChartLine className="text-purple-600" />
                Performance Insights
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <FaWallet className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Potential</p>
                      <p className="font-semibold text-gray-800">
                        ₵{recentActivities.reduce((total, activity) => {
                          const amount = activity.type === 'bid' ? activity.bidAmount : activity.budget;
                          return total + (parseFloat(amount) || 0);
                        }, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <FaStar className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="font-semibold text-gray-800">
                        {stats.totalApplications > 0 ? Math.round((stats.completedJobs / stats.totalApplications) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bidding vs Fixed breakdown */}
              {(applications.length > 0 || bids.length > 0) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Application Types:</p>
                  <div className="flex items-center gap-4 text-xs">
                    {applications.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FaFileContract className="text-blue-600" />
                        Fixed: {applications.length}
                      </span>
                    )}
                    {bids.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FaGavel className="text-purple-600" />
                        Bids: {bids.length}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </section>
            
            {/* Notifications */}
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <MdNotifications className="text-amber-500" />
                  Recent Activity
                </h2>
                <button 
                  onClick={() => navigate('/view/all_notifications')}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all
                </button>
              </div>
              
              {notifications?.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div 
                      key={notification.id} 
                      className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                        <MdNotifications className="text-indigo-600 text-sm" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <MdNotifications className="mx-auto text-2xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">No recent activity</p>
                </div>
              )}
            </section>
          </div>
        </div>

        <NotificationToast/>
      </main>
    </div>
  );
};

export default JobSeekerDashboard;