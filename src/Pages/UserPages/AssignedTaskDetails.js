import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMiniTaskInfo } from "../../APIS/API";
import Navbar from "../../Components/Common/Navbar";
import { userContext } from "../../Context/FetchUser";
import WorkSubmissionModal from '../../Components/Common/WorkSubmissionModal';
import ReportForm from "../../Components/Common/ReportForm";
import MarkDoneSwitch from '../../Components/MiniTaskManagementComponents/MarkDoneButton';
import {Upload} from 'lucide-react'

import { 
  FaCheckCircle, FaClock, FaMoneyBillWave, FaCalendarAlt, 
  FaMapMarkerAlt, FaUser, FaShieldAlt, FaExclamationTriangle, 
  FaPhone, FaBuilding, FaTag, FaInfoCircle, FaStar,FaFlag,
  FaBriefcase, FaFileAlt, FaCertificate, FaAward, FaLock
} from "react-icons/fa";
import { Shield, Mail, MapPin, Calendar, DollarSign, UserCheck } from 'lucide-react';

const AfterApplicationTaskDetailsPage = () => {
  const { Id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("task");
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  

  const openSubmitModal = () => {
    setModalOpen(true);
  };

  const handleReportIssue = (task) => {
    setShowReportModal(true);
  };


  useEffect(() => {
    const getTaskDetails = async () => {
      try {
        setLoading(true)
        const response = await getMiniTaskInfo(Id);
        if (response.status === 200) {
          setTask(response.data);
        }
      } catch (err) {
        console.error("Error fetching task details:", err);
        toast.error("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };
    getTaskDetails();
  }, [Id]);

  useEffect(()=>{
    console.log(task)
  },[])

  const renderSkeleton = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    const colors = {
      'assigned': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'review': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800',
      'open': 'bg-green-100 text-green-800',
      'pending': 'bg-orange-100 text-orange-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return moment(date).format("MMMM DD, YYYY");
  };

  // Check if task is assigned to current user
  const isAssignedToUser =  !!task?.assignedTo && String(task?.assignedTo) === String(user?._id);

  if (loading || !task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20">
          {renderSkeleton()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <ToastContainer />
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {task.title}
                    </h1>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status?.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created: {formatDate(task.createdAt)}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      Deadline: {formatDate(task.deadline)}
                    </span>
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Budget: ₵{task.budget}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Status */}
            {isAssignedToUser ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="text-center">
                  <FaCheckCircle className="text-blue-600 text-xl sm:text-2xl mx-auto mb-1 sm:mb-2" />
                  <p className="font-semibold text-blue-900 text-sm sm:text-base">Assigned to You</p>
                  <p className="text-xs sm:text-sm text-blue-700 mt-1">
                    {task.assignmentAccepted ? 'Accepted' : 'Pending Acceptance'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="text-center">
                  <UserCheck className="text-gray-600 text-xl sm:text-2xl mx-auto mb-1 sm:mb-2" />
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Available Task</p>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">
                    The Task is Still Open
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation - Hide employer tab if not assigned */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("task")}
              className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                activeTab === "task" 
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
                  : "text-gray-600 hover:text-gray-700 hover:bg-gray-50 border border-transparent"
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="truncate">Task Details</span>
            </button>
            
            {isAssignedToUser && (
              <button
                onClick={() => setActiveTab("employer")}
                className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  activeTab === "employer" 
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
                    : "text-gray-600 hover:text-gray-700 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="truncate">Employer</span>
              </button>
            )}
            
            <button
              onClick={() => setActiveTab("requirements")}
              className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                activeTab === "requirements" 
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
                  : "text-gray-600 hover:text-gray-700 hover:bg-gray-50 border border-transparent"
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="truncate">Requirements</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "task" && (
              <>
                {/* Task Overview */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-500" />
                    Task Overview
                  </h3>
                  
                  <div className="prose prose-gray max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed text-lg">{task.description}</p>
                  </div>

                  {/* Key Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaMoneyBillWave className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="font-semibold text-gray-900 text-lg">₵{task.budget}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="text-green-600 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p className="font-semibold text-gray-900 text-lg">{formatDate(task.deadline)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-purple-600 text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location Type</p>
                        <p className="font-semibold text-gray-900 capitalize">{task.locationType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaBriefcase className="text-orange-600 text-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold text-gray-900">{task.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location Details */}
                  {task.address && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        Location Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Region</p>
                          <p className="font-medium text-gray-900">{task.address.region || "Not specified"}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">City</p>
                          <p className="font-medium text-gray-900">{task.address.city || "Not specified"}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Suburb</p>
                          <p className="font-medium text-gray-900">{task.address.suburb || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Task Timeline */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-blue-900">Task Created</span>
                      <span className="text-blue-700">{formatDate(task.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium text-yellow-900">Deadline</span>
                      <span className="text-yellow-700">{formatDate(task.deadline)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "employer" && isAssignedToUser && task.employer && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  Employer Profile
                </h3>
                
                {/* Employer Header */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="w-18 h-18 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {task.employer.profileImage ? (
                      <img 
                        src={task.employer.profileImage} 
                        alt={`${task.employer.name}'s avatar`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-blue-600">
                        {task.employer.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-gray-900">{task.employer.name}</h4>
                      {task.employer.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          <FaCheckCircle className="mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{task.employer.Bio || "No bio available"}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Email</span>
                    </div>
                    <p className="text-gray-700">{task.employer.email}</p>
                  </div>
                  
                  {task.employer.phone && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <FaPhone className="text-gray-600" />
                        <span className="font-medium text-gray-900">Phone</span>
                      </div>
                      <p className="text-gray-700">{task.employer.phone}</p>
                    </div>
                  )}
                </div>

                {/* Employer Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{task.employer.rating || 0}</p>
                    <p className="text-sm text-blue-700">Rating</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{task.employer.numberOfRatings || 0}</p>
                    <p className="text-sm text-green-700">Reviews</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {task.employer.tasksPosted || 'N/A'}
                    </p>
                    <p className="text-sm text-purple-700">Tasks Posted</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {task.employer.completionRate ? `${task.employer.completionRate}%` : 'N/A'}
                    </p>
                    <p className="text-sm text-orange-700">Completion Rate</p>
                  </div>
                </div>

                {/* Location */}
                {task.employer.location && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <p className="text-sm text-gray-600">Region</p>
                        <p className="font-medium">{task.employer.location.region || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">City</p>
                        <p className="font-medium">{task.employer.location.city || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Town</p>
                        <p className="font-medium">{task.employer.location.town || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "requirements" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaCertificate className="text-blue-500" />
                  Task Requirements
                </h3>

                {/* Skills Required */}
                {task.skillsRequired && task.skillsRequired.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaTag className="text-blue-500" />
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {task.skillsRequired.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Requirements */}
                {task.verificationRequired && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                      <FaShieldAlt className="text-yellow-600" />
                      Verification Required
                    </h4>
                    <p className="text-yellow-700 text-sm">
                      This task requires verification upon completion. Make sure to provide proof of work as specified by the employer.
                    </p>
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Special Instructions</h4>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700">
                      {task.specialInstructions || "No special instructions provided. Please communicate with the employer for any specific requirements."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Actions - Only show if assigned */}
            {isAssignedToUser ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                   <button onClick={() => openSubmitModal()} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium">
                    <Upload/>
                    Submit Work
                  </button>
                  <button onClick={() => navigate(`/freelancer/${task._id}/view_task_submissions`)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                    <FaFileAlt />
                    View your Submissions
                  </button>
                   <button onClick={() => handleReportIssue() } className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                     <FaFlag className="w-3 h-3 flex-shrink-0" />
                      <span className="sr-only sm:not-sr-only sm:inline">Report</span>
                  </button>
                  <div className="w-full">
                    <MarkDoneSwitch taskId={task._id} userRole={user.role} initialMarked={task.markedDoneByTasker} />
                  </div>
                 
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaLock className="text-gray-500" />
                  Task Actions
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm mb-2">
                    Employer information and task actions will become available once this task is assigned to you.
                  </p>
                  <p className="text-gray-500 text-xs">
                    Please stay tuned and patience for employer's decision!
                  </p>
                </div>
              </div>
            )}

            {/* Safety Guidelines */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="text-blue-500" />
                Safety Guidelines
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700 text-sm">
                      Never share personal financial information
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-700 text-sm">
                      Meet in public places for onsite work
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-green-700 text-sm">
                      Keep all communication on the platform
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Progress - Only show if assigned */}
            {isAssignedToUser && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Completion</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-sm text-gray-600">Days Worked</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {moment(task.deadline).diff(moment(), 'days')}
                      </p>
                      <p className="text-sm text-gray-600">Days Left</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Work Submission Modal */}
        {modalOpen && (
          <WorkSubmissionModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            taskId={task._id}
            task={task}
          />
        )}

        {/* Report Form Modal */}
              {showReportModal && (
                <ReportForm
                  isOpen={showReportModal}
                  onClose={() => setShowReportModal(false)}
                  task={task}
                  currentUser={user}
                  onReportSubmitted={() => {}}
                />
              )}
      </div>
    </div>
  );
};

export default AfterApplicationTaskDetailsPage;