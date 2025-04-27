import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaBriefcase, 
  FaEye, 
  FaUsers, 
  FaEdit, 
  FaTrash, 
  FaRedo, 
  FaTimes, 
  FaFilter,
  FaSearch,
  FaSortAmountDown,
  FaCalendarAlt,
  FaPlus
} from "react-icons/fa";
import Sidebar from "../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import { jobsCreatedContext } from "../Context/EmployerContext1";
import { removeJob, modifyJobState } from '../APIS/API';

const EmployerJobs = () => {
  const navigate = useNavigate()

  const { Jobs, loading, fetchJobs } = useContext(jobsCreatedContext);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const jobsPerPage = 10;

  // Filter jobs based on search term and status
  const filteredJobs = Jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Job action handlers
  const closeJob = async(id, state) => {
    try {
      const response = await modifyJobState(id, state);
      if (response.status === 200) {
        toast.success("Job closed successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchJobs();
      } else {
        toast.error(response.errorMessage || "Couldn't close job. Please try again later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  const reopenJob = async(id, state) => {
    try {
      const response = await modifyJobState(id, state);
      if (response.status === 200) {
        toast.success("Job reopened successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchJobs();
      } else {
        toast.error(response.errorMessage || "Couldn't reopen job. Please try again later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  const confirmDeleteJob = (id) => {
    setJobToDelete(id);
    setShowConfirmModal(true);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setJobToDelete(null);
  };

  const executeDelete = async() => {
    if (!jobToDelete) return;
    
    try {
      const response = await removeJob(jobToDelete);
      if (response.status === 200) {
        toast.success("Job deleted successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchJobs();
      } else {
        toast.error(response.message || "Couldn't delete job. Please try again later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setShowConfirmModal(false);
      setJobToDelete(null);
    }
  };

  // Badge color mapping for status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Opened':
        return 'bg-emerald-100 text-emerald-700';
      case 'Closed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <EmployerNavbar />
      <Sidebar />

      <div className="lg:ml-64 pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with stats cards */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Job Postings Management</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <FaBriefcase className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Jobs</p>
                    <h3 className="text-2xl font-bold text-gray-800">{Jobs.length}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-emerald-500">
                <div className="flex items-center">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    <FaEye className="text-emerald-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Active Jobs</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {Jobs.filter(job => job.status === "Opened").length}
                    </h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-amber-500">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <FaUsers className="text-amber-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Applicants</p>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {Jobs.reduce((sum, job) => sum + (job.noOfApplicants || 0), 0)}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Search job titles..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                
                <div className="ml-4">
                  <select
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Status</option>
                    <option value="Opened">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              
              <Link
                to="/v1/post_job/form"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <FaPlus />
                <span>Post New Job</span>
              </Link>
            </div>
          </div>

          {/* Job listings table */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading your job postings...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                <FaBriefcase className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Jobs Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "All"
                  ? "No jobs match your search criteria. Try adjusting your filters."
                  : "You haven't posted any jobs yet. Create your first job posting now!"}
              </p>
              <Link
                to="/v1/post_job/form"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-all duration-300"
              >
                <FaPlus />
                <span>Post Your First Job</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Views</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentJobs.map((job) => (
                        <tr key={job._id} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-500 mt-1 flex items-center">
                              <FaCalendarAlt size={12} className="mr-1" />
                              <span>Posted on {new Date().toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="bg-indigo-100 rounded-full p-2 mr-2">
                                <FaUsers onClick={()=>navigate(`/employer/job/applicants/${job._id}`)} className="text-indigo-600" />
                              </div>
                              <span className="font-medium">{job.noOfApplicants || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="bg-blue-100 rounded-full p-2 mr-2">
                                <FaEye className="text-blue-600" />
                              </div>
                              <span className="font-medium">{job.interactions || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {job.status === "Opened" ? (
                                <button 
                                  className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition duration-200 tooltip-container"
                                  onClick={() => closeJob(job._id, {state:"Closed"})}
                                >
                                  <FaTimes />
                                  <span className="tooltip">Close Job</span>
                                </button>
                              ) : (
                                <button 
                                  className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition duration-200 tooltip-container"
                                  onClick={() => reopenJob(job._id, {state:"Opened"})}
                                >
                                  <FaRedo />
                                  <span className="tooltip">Reopen Job</span>
                                </button>
                              )}
                              <Link 
                                to={`/employer/edit_job/${job._id}`} 
                                className="p-2 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition duration-200 tooltip-container"
                              >
                                <FaEdit />
                                <span className="tooltip">Edit Job</span>
                              </Link>
                              <button 
                                className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition duration-200 tooltip-container"
                                onClick={() => confirmDeleteJob(job._id)}
                              >
                                <FaTrash />
                                <span className="tooltip">Delete Job</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Empty space for when no results match filters */}
                {currentJobs.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No matching jobs found. Try adjusting your filters.
                  </div>
                )}
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">{indexOfFirstJob + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastJob, filteredJobs.length)}
                        </span>{" "}
                        of <span className="font-medium">{filteredJobs.length}</span> results
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded ${
                            currentPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-indigo-600 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          Previous
                        </button>
                        
                        <div className="flex space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Logic to show a window of 5 pages around current page
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => paginate(pageNum)}
                                className={`w-8 h-8 flex items-center justify-center rounded ${
                                  currentPage === pageNum
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded ${
                            currentPage === totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-indigo-600 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Confirmation Modal for Delete */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTrash className="text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Job
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this job posting? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={executeDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Additional CSS Styles */}
      <style jsx>{`
        .tooltip-container {
          position: relative;
        }
        
        .tooltip {
          visibility: hidden;
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #333;
          color: white;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }
        
        .tooltip-container:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default EmployerJobs;