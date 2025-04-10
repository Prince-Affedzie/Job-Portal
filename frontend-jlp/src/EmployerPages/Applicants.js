import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import "../Styles/Applicants.css";
import { getAllApplications,modifyApplication } from '../APIS/API';
import ApplicantInfoModal from '../Components/EmployerDashboard/ApplicantsInfoModal';

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

const [selectedApplicant, setSelectedApplicant] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const openModal = (applicant) => {
  setSelectedApplicant(applicant);
  setIsModalOpen(true);
};

const closeModal = () => {
  setSelectedApplicant(null);
  setIsModalOpen(false);
};

  useEffect(() => {
    
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await getAllApplications();
        if (response.status === 200) {
          setApplications(response.data);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const modifyAppStatus =async(id,status)=>{
    try{

      const response = await modifyApplication(id,status)
      if(response.status===200){
        toast.success(`Application ${status.status} successfully`)

      }else{
        toast.error(response.errorMessage||`Oops Couldn't finish operation . Please try again later.`)

      }

    }catch(error){
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  }

  // Group applications by job ID
  const groupedByJob = applications.reduce((acc, app) => {
    const jobId = app.job?._id;
    if (!jobId) return acc;
    if (!acc[jobId]) {
      acc[jobId] = {
        jobTitle: app.job.title,
        applicants: [],
      };
    }
    acc[jobId].applicants.push(app);
    return acc;
  }, {});

  return (
    <div className="applicants-container">
      <ToastContainer/>
      <EmployerNavbar />
      <Sidebar />

      <div className="applicants-content">
        <h2 className="page-title">Job Applicants</h2>

        {loading ? (
          <p>Loading...</p>
        ) : Object.keys(groupedByJob).length === 0 ? (
          <p className="no-applicants">No applicants found.</p>
        ) : (
          Object.entries(groupedByJob).map(([jobId, { jobTitle, applicants }]) => (
            <div key={jobId} className="job-section">
              <h3 className="job-title">{jobTitle}</h3>

              <div className="applicants-table-container">
                <table className="applicants-table">
                  <thead>
                    <tr>
                      <th>Applicant Name</th>
                      <th>Email</th>
                      <th>Resume</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => (
                      <tr key={app._id}>
                        <td>{app.user?.name}</td>
                        <td>{app.user?.email}</td>
                        <td>
                          <a
                            href={`https://your-cdn-url.com/${app.resume}`} // Replace with your actual file host
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-btn"
                          >
                            <FaEye /> View
                          </a>
                        </td>
                        <td>{app.status}</td>
                        <td className="action-buttons">
                        <button onClick={() => openModal(app)} className="info-btn">
                        <FaEye /> View Info
                         </button>
                          <button className="accept-btn" onClick={()=>modifyAppStatus(app._id,{status:"Accepted"})}>
                            <FaCheck /> Accept
                          </button>
                          <button className="reject-btn" onClick={()=>modifyAppStatus(app._id,{status:"Rejected"})}>
                            <FaTimes /> Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
        <ApplicantInfoModal
       isOpen={isModalOpen}
      onClose={closeModal}
      applicant={selectedApplicant}
      />

      </div>
    </div>
  );
};



export default Applicants;
