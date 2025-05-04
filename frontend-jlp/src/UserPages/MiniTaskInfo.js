import React, { useState, useEffect } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMiniTaskInfo } from "../APIS/API";
import Navbar from "../Components/MyComponents/Navbar";
import '../Styles/MiniTaskInfo.css';
import { applyToMiniTask } from "../APIS/API";
import ProcessingOverlay from "../Components/MyComponents/ProcessingOverLay";


const MiniTaskInfo = () => {
  const { Id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScamAlert, setShowScamAlert] = useState(false);
  const [applyClicked, setApplyClicked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleApply =async(Id)=>{
      
     
      try{
         setIsProcessing(true);
         const response = await applyToMiniTask(Id)
         if(response.status ===200){
         
          toast.success("Application Successful")
         }else{
          
          toast.error("An Error Occured. Please try again Later")
         }
      }catch(error){
        
         const errorMessage =
                   error.response?.data?.message ||
                  error.response?.data?.error ||
                   "An unexpected error occurred. Please try again.";
                  
                    toast.error(errorMessage);
                   
      }finally{
        setIsProcessing(false);
      }
    }

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

  if (loading || !task) {
    return (
      <div className="mini-task-container">
        <Navbar />
        <ProcessingOverlay show={isProcessing} message="Submitting your Application..." />
        <div className="mini-task-content">
          {renderSkeleton()}
        </div>
      </div>
    );
  }

  return (
    <div className="mini-task-container">
    <ToastContainer/>
      <Navbar />
      
      {showScamAlert && <ScamAlert />}
      
   {/* Header with visual enhancement */}
      <div className="task-header">
          <h1>{task.title}</h1>
          <div className="task-meta">
            <span className={`status-badge ${task.status.toLowerCase()}`}>
              {task.status}
            </span>
            <span className="deadline">
              Due: {moment(task.deadline).format("MMMM DD, YYYY")}
            </span>
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
                  {task.employer.name.charAt(0).toUpperCase()}
                </div>
                <div className="employer-details">
                  <h4>{task.employer.name}</h4>
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
                className={`apply-btn ${applyClicked ? 'applied' : ''}`}
                onClick={()=> handleApply(task._id)}
                disabled={isProcessing}
              >
                {applyClicked ? "Application Sent!" : "Apply Now"}
              </button>
            </section>
          </div>
        </div>
         
      </div>
    </div>
  );
};

export default MiniTaskInfo;