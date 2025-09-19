import React, { useState, useEffect } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMiniTaskInfo, applyToMiniTask, bidOnMiniTask } from "../../APIS/API";
import Navbar from "../../Components/Common/Navbar";
import ProcessingOverlay from "../../Components/Common/ProcessingOverLay";
import { FaCheckCircle, FaHandPointer, FaClock, FaMoneyBillWave, FaComment, 
  FaCalendarAlt, FaMapMarkerAlt, FaUser, FaShieldAlt, FaExclamationTriangle, 
  FaPhone, FaBuilding, FaTag, FaInfoCircle } from "react-icons/fa";
import { Shield } from 'lucide-react';

import { NotificationToast } from "../../Components/Common/NotificationToast";

const BidModal = ({ 
  showBidModal, 
  setShowBidModal, 
  bidData, 
  setBidData, 
  submitBid, 
  isProcessing 
}) => {
  const handleBidChange = (e) => {
    const { name, value } = e.target;
    setBidData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!showBidModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="mt-10 bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Place Your Bid</h3>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={() => setShowBidModal(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaMoneyBillWave className="text-blue-500" />
              Your Proposed Amount (₵)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={bidData.amount}
              onChange={handleBidChange}
              placeholder="Enter your proposed amount"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="timeline" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaCalendarAlt className="text-blue-500" />
              Proposed Timeline (days)
            </label>
            <input
              type="number"
              id="timeline"
              name="timeline"
              value={bidData.timeline}
              onChange={handleBidChange}
              placeholder="How many days will you need?"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaComment className="text-blue-500" />
              Message to Client (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={bidData.message}
              onChange={handleBidChange}
              placeholder="Introduce yourself and explain why you're the right fit for this task..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>
        </div>
        
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button 
            className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            onClick={() => setShowBidModal(false)}
          >
            Cancel
          </button>
          <button 
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={submitBid}
            disabled={isProcessing}
          >
            {isProcessing ? "Submitting..." : "Submit Bid"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ScamAlert = ({ showScamAlert, setShowScamAlert }) => {
  if (!showScamAlert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600 text-lg" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Protect Yourself From Scams</h3>
          </div>
          
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <span>Never pay money upfront to secure a task</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <span>Avoid sharing personal financial information</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <span>Be cautious of employers with no reviews or history</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <span>Meet in public places for in-person tasks</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <span>Report suspicious activity immediately</span>
            </li>
          </ul>
        </div>
        
        <div className="p-6 bg-gray-50 rounded-b-xl">
          <button 
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            onClick={() => setShowScamAlert(false)}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

const MiniTaskInfo = () => {
  const { Id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScamAlert, setShowScamAlert] = useState(false);
  const [applyClicked, setApplyClicked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidData, setBidData] = useState({
    amount: "",
    message: "",
    timeline: ""
  });

  useEffect(() => {
    const getTask = async () => {
      try {
        const response = await getMiniTaskInfo(Id);
        if (response.status === 200) {
          setTask(response.data);
        }
      } catch (err) {
        console.error("Error fetching task:", err);
        toast.error("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };
    getTask();
  }, [Id]);

  const handleApplyOrBid = async (taskId) => {
    if (task.biddingType === "open-bid") {
      setShowBidModal(true);
      return;
    }
    
    await handleFixedApplication(taskId);
  };

  const handleFixedApplication = async (taskId) => {
    setIsProcessing(true);
     
    try {
      const response = await applyToMiniTask(taskId)
      if(response.status === 200) {
        setApplyClicked(true);
        toast.success("You've shown interest in this job! Stay Tuned — the client might reach out soon.")
      } else {
        toast.error("An Error Occured. Please try again Later")
      }
    } catch(error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
        
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const submitBid = async () => {
    if (!bidData.amount || !bidData.timeline) {
      toast.error("Please provide both amount and timeline for your bid");
      return;
    }

    setIsProcessing(true);
     
    try {
      const response = await bidOnMiniTask(Id, bidData);
      if(response.status === 200) {
        setApplyClicked(true);
        setShowBidModal(false);
        toast.success("Your bid has been submitted successfully!");
      } else {
        toast.error("An Error Occured. Please try again Later")
      }
    } catch(error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
        
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    if (applyClicked) return "Interest Sent!";
    
    if (task.biddingType === "open-bid") {
      return "Place a Bid";
    }
    
    return "Show Interest";
  };

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
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Navbar />
      <ProcessingOverlay 
        show={isProcessing} 
        message={task.biddingType === "open-bid" ? "Submitting your bid..." : "Submitting your Interest..."}
      />
      
      <ScamAlert showScamAlert={showScamAlert} setShowScamAlert={setShowScamAlert} />
      <BidModal 
        showBidModal={showBidModal}
        setShowBidModal={setShowBidModal}
        bidData={bidData}
        setBidData={setBidData}
        submitBid={submitBid}
        isProcessing={isProcessing}
      />
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    {task.title}
                  </h1>
                  
                  {/* Bidding type badge */}
                  {task.biddingType && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                      task.biddingType === "open-bid" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {task.biddingType === "open-bid" ? (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                          </svg>
                          Open for Bids
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                          </svg>
                          Fixed Budget
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  {/* Status Badge */}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    task.status.toLowerCase() === 'open' 
                      ? 'bg-green-100 text-green-800'
                      : task.status.toLowerCase() === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                  
                  {/* Deadline */}
                  <span className="flex items-center text-gray-600 text-sm">
                    <FaClock className="mr-2 text-gray-400" />
                    Due: {moment(task.deadline).format("MMMM DD, YYYY")}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="lg:text-right">
              <button 
                className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  applyClicked 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } ${
                  isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                } min-w-[140px]`}
                onClick={() => handleApplyOrBid(task._id)}
                disabled={isProcessing || applyClicked}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : applyClicked ? (
                  <>
                    <FaCheckCircle className="mr-2" />
                    {task.biddingType === "open-bid" ? "Bid Sent!" : "Interest Sent!"}
                  </>
                ) : (
                  <>
                    <FaHandPointer className="mr-2" />
                    {getButtonText()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" />
                Task Details
              </h3>
              
              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed">{task.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMoneyBillWave className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-semibold text-gray-900">₵{task.budget}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{task.locationType || "Not specified"}</p>
                  </div>
                </div>

                {task.address && (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaBuilding className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Region</p>
                        <p className="font-semibold text-gray-900">{task.address.region || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">City</p>
                        <p className="font-semibold text-gray-900">{task.address.city || "N/A"}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Skills Required Card */}
            {task.skillsRequired && task.skillsRequired.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaTag className="text-blue-500" />
                  Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {task.skillsRequired.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Employer Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                About the Employer
              </h3>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {task.employer.profileImage ? (
                    <img 
                      src={task.employer.profileImage} 
                      alt={`${task.employer.name}'s avatar`}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-blue-600">
                      {task.employer.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{task.employer.name}</h4>
                    {task.employer.isVerified ? (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        Unverified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FaPhone className="text-gray-400" />
                    <span>{task.employer.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Tips Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  < Shield className="text-blue-500" />
                  Safety First
                </h3>
                <button 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                  onClick={() => setShowScamAlert(true)}
                >
                  Learn More
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaExclamationTriangle className="text-red-600 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">Financial Protection</h4>
                      <p className="text-red-700 text-sm">
                        Never pay any initial money or incentives to anyone. This platform does not require upfront payments.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaMapMarkerAlt className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Onsite Jobs</h4>
                      <p className="text-blue-700 text-sm">
                        Meet in public places, share your location, and verify employer identity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className={`w-full mt-4 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  applyClicked 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={() => handleApplyOrBid(task._id)}
                disabled={isProcessing || applyClicked}
              >
                {getButtonText()}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <NotificationToast />
    </div>
  );
};

export default MiniTaskInfo;