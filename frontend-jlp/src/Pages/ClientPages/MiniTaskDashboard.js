import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBriefcase, FaComments, FaMoneyBillWave, FaBell, FaSearch, 
  FaPlus, FaCheckCircle,FaPlayCircle, FaClock, FaUser, FaExclamationTriangle,
  FaSpinner, FaExclamationCircle, FaFilter, FaEye, FaEdit, FaTrash
} from 'react-icons/fa';
import { ClientNavbar } from '../../Components/ClientComponents/ClientNavbar';
import { ClientSidebar } from '../../Components/ClientComponents/ClientSidebar';
import { notificationContext } from '../../Context/NotificationContext';
import { userContext } from "../../Context/FetchUser";

import { useClientMicroJobs } from '../../Context/ClientMicroJobsContext';
import { Link } from 'react-router-dom';

const MicroTaskDashboard = () => {
  const navigate = useNavigate()
  const { notifications, fetchNotifications } = useContext(notificationContext);
  const { 
    microJobs, loading, error, refetch, 
    getActiveJobs, getPendingJobs, getCompletedJobs,getInProgressJobs, getDraftJobs,getAssignedJobs 
  } = useClientMicroJobs();

    const { user } = useContext(userContext);
  
  

  const [activeTab, setActiveTab] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const unreadNotifications = notifications?.filter(n => !n.read) || [];
  const activeJobs = getActiveJobs();
  const pendingJobs = getPendingJobs();
  const completedJobs = getCompletedJobs();
  const assignedJobs = getAssignedJobs()
  const draftJobs = getDraftJobs();
  const inProgressJobs =getInProgressJobs();

  // Calculate total spent
  const totalSpent = completedJobs.reduce((total, job) => {
    const amount = parseFloat(job.budget || job.price || 0);
    return total + amount;
  }, 0);

  // Stats data with real values
  const stats = [
    { 
      title: 'Active Tasks', 
      value: activeJobs.length.toString(), 
      icon: <FaBriefcase className="text-blue-500" />, 
      color: 'bg-blue-50',
      change: '+2 from last week',
      trend: 'positive'
    },
     { 
      title: 'In Progress', 
      value:  inProgressJobs.length.toString(), 
      icon: <FaPlayCircle className="text-orange-500" />, 
      color: 'bg-orange-50',
      change: '+1 from last week',
      trend: 'positive'
    },
    { 
      title: 'Pending Review', 
      value: pendingJobs.length.toString(), 
      icon: <FaClock className="text-yellow-500" />, 
      color: 'bg-yellow-50',
      change: '+1 from last week',
      trend: 'neutral'
    },
    { 
      title: 'Total Spent', 
      value: `₵${totalSpent.toLocaleString()}`, 
      icon: <FaMoneyBillWave className="text-green-500" />, 
      color: 'bg-green-50',
      change: `₵${(totalSpent * 0.15).toFixed(0)} this week`,
      trend: 'positive'
    },
    /*{ 
      title: 'Unread Messages', 
      value: unreadNotifications.length.toString(), 
      icon: <FaComments className="text-purple-500" />, 
      color: 'bg-purple-50',
      change: `${unreadNotifications.length > 0 ? 'New messages' : 'No new messages'}`,
      trend: unreadNotifications.length > 0 ? 'positive' : 'neutral'
    }*/
  ];

  // Filter jobs based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'active':
        setFilteredJobs(activeJobs);
        break;
     case 'in-progress':
        setFilteredJobs(inProgressJobs);
        break;
      case 'pending':
        setFilteredJobs(pendingJobs);
        break;
      case 'completed':
        setFilteredJobs(completedJobs);
        break;
      case 'draft':
        setFilteredJobs(draftJobs);
        break;
      default:
        setFilteredJobs(microJobs);
    }
  }, [activeTab, microJobs, activeJobs, pendingJobs, completedJobs, draftJobs,inProgressJobs]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  // Get status badge styling

  //Open", "In-progress","Review","Rejected","Completed", "Closed","Assigned"
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: <FaCheckCircle className="mr-1" />, label: 'Active' };
      case 'In-progress':
         return { bg: 'bg-orange-100', text: 'text-orange-800', icon: <FaPlayCircle className="mr-1" />, label: 'In Progress' };
      case 'Review':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <FaExclamationTriangle className="mr-1" />, label: 'Review' };
      case 'Assigned':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: <FaCheckCircle className="mr-1" />, label: 'Assigned' };
      case 'Completed':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: <FaCheckCircle className="mr-1" />, label: 'Completed' };
      case 'Closed':
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: null, label: 'Closed' };
    }
  };


  const handleEditTask = (task) => {
    navigate(`/edit_task/${task._id}`, { state: { task } });
  };


  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <div className="flex-1 overflow-auto">
          <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FaSpinner className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">Loading your micro jobs...</h2>
              <p className="text-gray-500 mt-2">This will just take a moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <div className="flex-1 overflow-auto">
          <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto p-6">
              <FaExclamationCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={refetch}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ClientSidebar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />

        {/* Dashboard Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome back,{user?.name || 'N/A'}</h2>
            <p className="opacity-90 text-sm md:text-base">
              You have {activeJobs.length} active {activeJobs.length === 1 ? 'task' : 'tasks'} 
              {inProgressJobs.length > 0 ? ` ${inProgressJobs.length} in progress,` : ''}
              {pendingJobs.length > 0 ? ` and ${pendingJobs.length} awaiting your review` : ''}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-blue-500 bg-opacity-25 px-3 py-1 rounded-full text-xs">
                {microJobs.length} total tasks
              </span>
              <span className="bg-green-500 bg-opacity-25 px-3 py-1 rounded-full text-xs">
                {completedJobs.length} completed
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                    <p className={`text-xs mt-2 ${
                      stat.trend === 'positive' ? 'text-green-600' : 
                      stat.trend === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="text-lg font-semibold text-gray-800">Your Micro Jobs</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setActiveTab('all')}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        activeTab === 'all' 
                          ? 'bg-blue-100 text-blue-600 font-medium' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All ({microJobs.length})
                    </button>
                    <button 
                      onClick={() => setActiveTab('active')}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        activeTab === 'active' 
                          ? 'bg-green-100 text-green-600 font-medium' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Active ({activeJobs.length})
                    </button>
                    <button 
                      onClick={() => setActiveTab('pending')}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        activeTab === 'pending' 
                          ? 'bg-yellow-100 text-yellow-600 font-medium' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Review ({pendingJobs.length})
                    </button>
                    <button 
                      onClick={() => setActiveTab('in-progress')}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        activeTab === 'completed' 
                          ? 'bg-blue-100 text-blue-600 font-medium' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      In-Progress ({inProgressJobs.length})
                    </button>
                  </div>
                </div>

                {filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <FaBriefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-gray-500 font-medium">No {activeTab !== 'all' ? activeTab : ''} jobs found</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {activeTab === 'all' 
                        ? "You haven't posted any micro jobs yet." 
                        : `You don't have any ${activeTab} jobs at the moment.`
                      }
                    </p>
                    {activeTab === 'all' && (
                      <Link
                        to="/post/mini_task"
                        className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        Post Your First Job
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.slice(0,5).map(job => {
                      const statusBadge = getStatusBadge(job.status);
                      return (
                        <Link to={`/client_view/task/${job._id}`}   key={job.id || job._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-full flex-shrink-0 ${statusBadge.bg} ${statusBadge.text}`}>
                              <FaBriefcase className="text-sm" />
                            </div>
                            <div className="min-w-0 flex-1">
                             <h4 className="font-medium text-gray-800 truncate max-w-[200px] sm:max-w-xs md:max-w-sm">
                                {job.title || 'Untitled Job'}
                            </h4>
                              <div className="flex flex-wrap items-center text-xs text-gray-500 mt-1 gap-2">
                                <span>{job.budget || job.price || '$0'}</span>
                                <span>•</span>
                                <span>{job.applicants?.length || 0} applicants </span>
                                <span>•</span>
                                <span className="truncate">Assigned to: {job.assignedTo?.name || 'Not assigned'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2 mt-3 sm:mt-0 sm:pl-4 w-full sm:w-auto">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                              {statusBadge.icon}
                              {statusBadge.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(job.deadline || job.createdAt)}
                            </div>
                            <div className="flex space-x-2 mt-1 sm:justify-end">
                              <Link to={`/client_view/task/${job._id}`} className="p-1 text-gray-400 hover:text-blue-500">
                                <FaEye size={14} />
                              </Link>
                              <button onClick={()=>handleEditTask(job)} className="p-1 text-gray-400 hover:text-green-500">
                                <FaEdit size={14} />
                              </button>
                             {/* <button className="p-1 text-gray-400 hover:text-red-500">
                                <FaTrash size={14} />
                              </button>*/}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  {unreadNotifications.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadNotifications.length} new
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {unreadNotifications.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No new notifications</p>
                  ) : (
                    unreadNotifications.slice(0, 5).map(notification => (
                      <div key={notification._id} className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt || new Date()).toLocaleDateString()} • 
                          {new Date(notification.createdAt || new Date()).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 5 && (
                  <Link
                    to="/view/all_notifications"
                    className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all notifications
                  </Link>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/post/mini_task"
                    className="flex items-center justify-between p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span className="font-medium">Post New Task</span>
                    <FaPlus />
                  </Link>
                  <button className="w-full flex items-center justify-between p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                    <span className="font-medium">Review Submissions</span>
                    <FaCheckCircle />
                  </button>
                  <Link to='/messages' className="w-full flex items-center justify-between p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                    <span className="font-medium">Message Taskers</span>
                    <FaComments />
                  </Link >
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-5 text-white">
                <h3 className="text-lg font-semibold mb-3">Performance Insights</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-bold">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Response Time</span>
                    <span className="font-bold">2.4h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tasker Satisfaction</span>
                    <span className="font-bold">4.8/5</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-400 border-opacity-30">
                  <p className="text-xs opacity-80">Updated 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MicroTaskDashboard;