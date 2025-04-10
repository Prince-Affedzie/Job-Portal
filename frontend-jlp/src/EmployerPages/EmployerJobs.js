import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBriefcase, FaEye, FaUsers, FaEdit, FaTrash, FaRedo, FaTimes } from "react-icons/fa";
import Sidebar from "../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import { jobsCreatedContext } from "../Context/EmployerContext1";
import "../Styles/EmployerJobs.css";
import {removeJob,modifyJobState } from '../APIS/API'

const EmployerJobs = () => {
  const { Jobs, loading,fetchJobs } = useContext(jobsCreatedContext);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = Jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(Jobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const closeJob = async(id,state) => {
    try{
      const response = await modifyJobState(id,state)
      if(response.status===200){
       toast.success("Job Closed successfully")
       fetchJobs()
      }else{
       toast.error(response.errorMessage||"Oops Closed Job. Please try again later.")
      }

    }catch(error){
     const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
           console.log(errorMessage);
           toast.error(errorMessage);
    }
  };

  const reopenJob = async(id,state) => {
     try{
       const response = await modifyJobState(id,state)
       if(response.status===200){
        toast.success("Job opened successfully")
        fetchJobs()
       }else{
        toast.error(response.errorMessage||"Oops reopen Job. Please try again later.")
       }

     }catch(error){
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
            console.log(errorMessage);
            toast.error(errorMessage);
     }
  };

  const deleteJob = async(id) => {
     try{
      const response = await  removeJob(id)
      if(response.status ===200){
        toast.success("Job deleted Successfully")
        fetchJobs()

      }else{
        toast.error(response.message || "Oops Couldn't delete Job. Please try again later.")
      }

     }catch(error){
       const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
            console.log(errorMessage);
            toast.error(errorMessage);
     }
  };

  return (
    <div className="emp-table-container">
      <ToastContainer/>
      <EmployerNavbar />
      <Sidebar />

      <div className="emp-table-content">
        <div className="emp-table-header">
          <h2>My Job Postings</h2>
          <Link to="/v1/post_job/form" className="emp-post-btn">
            <FaBriefcase /> Post New Job
          </Link>
        </div>

        {loading ? (
          <p className="emp-loading">Loading jobs...</p>
        ) : Jobs.length === 0 ? (
          <p className="emp-no-jobs">You haven't posted any jobs yet.</p>
        ) : (
          <>
            <div className="emp-table-wrapper">
              <table className="emp-job-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Applicants</th>
                    <th>Views</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentJobs.map((job) => (
                    <tr key={job._id}>
                      <td>{job.title}</td>
                      <td>{job.noOfApplicants}</td>
                      <td>{job.views || 'N/A'}</td>
                      <td>
                        <span
                          className={`emp-status ${
                            job.status === "Active" ? "active" : "closed"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="emp-action-buttons">
                        {job.status === "Opened" ? (
                          <button className="emp-btn close" onClick={() => closeJob(job._id,{state:"Closed"})}>
                            <FaTimes />
                          </button>
                        ) : (
                          <button className="emp-btn reopen" onClick={() => reopenJob(job._id,{state:"Opened"})}>
                            <FaRedo />
                          </button>
                        )}
                        <Link to={`/employer/edit_job/${job._id}`} className="emp-btn edit">
                          <FaEdit />
                        </Link>
                        <button className="emp-btn delete" onClick={() => deleteJob(job._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`page-btn ${currentPage === index + 1 ? "active-page" : ""}`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployerJobs;
