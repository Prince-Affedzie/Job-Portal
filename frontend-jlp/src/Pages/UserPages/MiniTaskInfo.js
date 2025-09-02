import React, { useState, useEffect } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMiniTaskInfo, applyToMiniTask, bidOnMiniTask } from "../../APIS/API"; // Added bidOnMiniTask import
import Navbar from "../../Components/Common/Navbar";
import '../../Styles/MiniTaskInfo.css';

import ProcessingOverlay from "../../Components/Common/ProcessingOverLay";
import {FaCheckCircle,FaHandPointer,FaClock, FaMoneyBillWave, FaComment, FaCalendarAlt}  from "react-icons/fa"
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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Place Your Bid</h3>
          <button 
            className="modal-close-btn"
            onClick={() => setShowBidModal(false)}
          >
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="amount">
              <FaMoneyBillWave className="icon" />
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
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="timeline">
              <FaCalendarAlt className="icon" />
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
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">
              <FaComment className="icon" />
              Message to Client (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={bidData.message}
              onChange={handleBidChange}
              placeholder="Introduce yourself and explain why you're the right fit for this task..."
              rows="4"
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn-secondary"
            onClick={() => setShowBidModal(false)}
          >
            Cancel
          </button>
          <button 
            className="btn-primary"
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
      } finally {
        setLoading(false);
      }
    };
    getTask();
  }, [Id]);


  const handleApplyOrBid = async (taskId) => {
    // For open-bid tasks, show the bid modal instead of immediately applying
    if (task.biddingType === "open-bid") {
      setShowBidModal(true);
      return;
    }
    
    // For fixed tasks, proceed with the normal application
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

  // Skeleton Loader
  const renderSkeleton = () => (
    <div className="skeleton-loader">
      <div className="skeleton-title"></div>
      <div className="skeleton-description"></div>
      <div className="skeleton-info"></div>
      <div className="skeleton-info"></div>
      <div className="skeleton-info"></div>
      <div className="skeleton-info"></div>
    </div>
  );

  // Scam Alert Modal
  const ScamAlert = () => (
    <div className="scam-alert-modal">
      <div className="scam-alert-content">
        <h3>⚠️ Protect Yourself From Scams</h3>
        <ul>
          <li>Never pay money upfront to secure a task</li>
          <li>Avoid sharing personal financial information</li>
          <li>Be cautious of employers with no reviews or history</li>
          <li>Meet in public places for in-person tasks</li>
          <li>Report suspicious activity immediately</li>
        </ul>
        <button 
          className="close-alert-btn" 
          onClick={() => setShowScamAlert(false)}
        >
          I Understand
        </button>
      </div>
    </div>
  );

  // Bid Modal
 

  if (loading || !task) {
    return (
      <div className="mini-task-container">
        <Navbar />
        <div className="mini-task-content">
          {renderSkeleton()}
        </div>
      </div>
    );
  }

  // Determine button text based on task type and state
  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    if (applyClicked) return "Interest Sent!";
    
    if (task.biddingType === "open-bid") {
      return "Place a Bid";
    }
    
    return "Show Interest";
  };

  return (
    <div className="mini-task-container">
      <ToastContainer/>
      <Navbar />
      <ProcessingOverlay show={isProcessing} message={
        task.biddingType === "open-bid" ? "Submitting your bid..." : "Submitting your Interest..."
      }/>
      
      {showScamAlert && <ScamAlert />}
      <BidModal 
        showBidModal={showBidModal}
        setShowBidModal={setShowBidModal}
        bidData={bidData}
        setBidData={setBidData}
        submitBid={submitBid}
        isProcessing={isProcessing}
      />
      
      {/* Header with visual enhancement */}
      <div className="task-header mx-auto mt-5 max-w-7xl px-6 py-4">
        <h1 className="text-2xl font-bold mb-3">{task.title}</h1>
        
        {/* Bidding type badge */}
       {task.biddingType && (
  <div className="mb-3">
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      task.biddingType === "open-bid" 
        ? "bg-blue-100 text-blue-800" 
        : "bg-green-100 text-green-800"
    }`}>
      {task.biddingType === "open-bid" ? (
        <>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Open for Bids
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          Fixed Budget
        </>
      )}
    </span>
  </div>
)}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Top row on mobile: Status and Deadline */}
          <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
            {/* Status Badge */}
            <span className={`status-badge ${task.status.toLowerCase()} px-3 py-1 rounded-full text-sm font-medium inline-block w-fit`}>
              {task.status}
            </span>
            
            {/* Deadline */}
            <span className="deadline flex items-center text-gray-200 text-sm">
              <FaClock className="mr-2 flex-shrink-0" />
              <span className="truncate">Due: {moment(task.deadline).format("MMMM DD, YYYY")}</span>
            </span>
          </div>
          
          {/* Button - Full width on mobile, auto width on larger screens */}
          <div className="w-full sm:w-auto sm:ml-auto">
            <button 
              className={`mini-task-apply-btn w-full sm:w-auto px-4 sm:px-7 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                applyClicked 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } ${
                isProcessing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={() => handleApplyOrBid(task._id)}
              disabled={isProcessing || applyClicked}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="whitespace-nowrap">Processing...</span>
                </span>
              ) : applyClicked ? (
                <span className="flex items-center justify-center">
                  <FaCheckCircle className="mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">{task.biddingType === "open-bid" ? "Bid Sent!" : "Interest Sent!"}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaHandPointer className="mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">{getButtonText()}</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mini-task-content">
        <div className="task-body">
          <div className="left-column">
            {/* Task Details */}
            <section className="card task-details">
              <h3>Task Details</h3>
              <div className="description">{task.description}</div>
              
              <div className="detail-row">
                <span className="label">Budget:</span>
                <span className="value budget">₵{task.budget}</span>
              </div>
              
              {task.biddingType === "open-bid" && (
                <div className="detail-row">
                  <span className="label">Bidding Type:</span>
                  <span className="value">Open for Bids</span>
                </div>
              )}
              
              <div className="detail-row">
                <span className="label">Location Type:</span>
                <span className="value">{task.locationType || "Not specified"}</span>
              </div>

              {task.address && (
                <div className="address-info">
                  <div className="detail-row">
                    <span className="label">Region:</span>
                    <span className="value">{task.address.region || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">City:</span>
                    <span className="value">{task.address.city || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Suburb:</span>
                    <span className="value">{task.address.suburb || "N/A"}</span>
                  </div>
                </div>
              )}
            </section>

            {/* Skills Required */}
            <section className="card skills-section">
              <h3>Skills Required</h3>
              {task.skillsRequired && task.skillsRequired.length > 0 ? (
                <div className="skills-container">
                  {task.skillsRequired.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              ) : (
                <p>No specific skills required</p>
              )}
            </section>
          </div>

          <div className="right-column">
            {/* Employer Info */}
            <section className="card employer-info">
              <h3>About the Employer</h3>
              <div className="employer-profile">
                <div className="employer-avatar">
                  {task.employer.profileImage ? (
                    <img src={task.employer.profileImage } alt={`${task.employer.name}'s avatar`} className="avatar-img" />
                  ) : (
                    <span>{task.employer.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="employer-details">
                  <h4 className="flex items-center gap-2">
                    {task.employer.name}
                    {task.employer.isVerified ? (
                      <span className="badge verified">Verified</span>
                    ) : (
                      <span className="badge unverified">Unverified</span>
                    )}
                  </h4>
                  <div className="phone-number">{task.employer.phone}</div>
                </div>
              </div>
            </section>

            {/* Safety Tips & Apply Button */}
            <section className="card safety-tips">
              <div className="safety-header">
                <h3>Safety First</h3>
                <button 
                  className="scam-info-btn"
                  onClick={() => setShowScamAlert(true)}
                >
                  Learn More
                </button>
              </div>
              <div className="safety-message">
                <div className="safety-icon">⚠️</div>
                <div className="safety-content">
                  <p className="safety-headline">Your Safety Is Our Priority</p>
                  <div className="safety-warnings">
                    <div className="warning-item">
                      <h4>Onsite Jobs</h4>
                      <p className="safety-text">
                        When meeting for onsite jobs, please arrange to meet in public places, 
                        share your location with someone you trust, and verify employer 
                        identity before proceeding.
                      </p>
                    </div>
                    
                    <div className="warning-item">
                      <h4>Financial Protection</h4>
                      <p className="safety-text">
                        <strong>Never pay any initial money or incentives</strong> to anyone. 
                        This platform does not require any upfront payments to secure tasks.
                        If someone asks for payment, it's a scam.
                      </p>
                    </div>
                  </div>
                  <p className="safety-pledge">We care about your wellbeing and financial security!</p>
                </div>
              </div>

              <button 
                className={`mini-task-apply-btn ${applyClicked ? 'applied' : ''}`}
                onClick={() => handleApplyOrBid(task._id)}
                disabled={isProcessing || applyClicked}
              >
                {getButtonText()}
              </button>
            </section>
          </div>
        </div>
        <NotificationToast/> 
      </div>
    </div>
  );
};

export default MiniTaskInfo;