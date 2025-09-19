import { useContext, useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  User, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  RotateCcw,
  FileSearch,
  Calendar,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Sidebar from "../../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../../Components/EmployerDashboard/EmployerNavbar";
import { jobsCreatedContext } from "../../Context/EmployerContext1";
import { removeJob, modifyJobState } from '../../APIS/API';

const EmployerJobs = () => {
  const navigate = useNavigate();
  const { Jobs, loading, fetchJobs } = useContext(jobsCreatedContext);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
   const [windowWidth, setWindowWidth] = useState(window.innerWidth);



  // Confirm modal states
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Action handlers
  const closeJob = async(id) => {
    try {
      const response = await modifyJobState(id, {state:"Closed"});
      if (response.status === 200) {
        toast.success("Job closed successfully");
        fetchJobs();
      } else {
        toast.error(response.errorMessage || "Couldn't close job. Please try again later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  const reopenJob = async(id) => {
    try {
      const response = await modifyJobState(id, {state:"Opened"});
      if (response.status === 200) {
        toast.success("Job reopened successfully");
        fetchJobs();
      } else {
        toast.error(response.errorMessage || "Couldn't reopen job. Please try again later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  const showDeleteConfirm = (id) => {
    setJobToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setJobToDelete(null);
  };

  const handleDeleteOk = async() => {
    if (!jobToDelete) return;
    
    try {
      const response = await removeJob(jobToDelete);
      if (response.status === 200) {
        toast.success("Job deleted successfully");
        fetchJobs();
      } else {
        toast.error(response.message || "Couldn't delete job. Please try again later.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsDeleteModalVisible(false);
      setJobToDelete(null);
    }
  };

   useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  

  // Filter jobs based on search term and status
  const filteredJobs = Jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredJobs.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <EmployerNavbar />
      <Sidebar />

      <div className="lg:ml-64 pt-10 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Postings Management</h1>
            <p className="text-gray-600">Manage and track your job postings and applications</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{Jobs.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileSearch className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-3xl font-bold text-green-600">
                    {Jobs.filter(job => job.status === "Opened").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {Jobs.reduce((sum, job) => sum + (job.noOfApplicants || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search job titles..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-80"
                  />
                </div>
                
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Opened">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              
              {/* Post New Job Button */}
              <Link to="/v1/post_job/form">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200">
                  <Plus className="w-4 h-4" />
                  Post New Job
                </button>
              </Link>
            </div>
          </div>

          {/* Job Listings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your job postings...</p>
                </div>
              </div>
            ) : filteredJobs.length === 0 && !searchTerm && statusFilter === "All" ? (
              <div className="text-center py-20">
                <FileSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                <p className="text-gray-600 mb-6">You haven't posted any jobs yet. Start by creating your first job posting.</p>
                <Link to="/v1/post_job/form">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors duration-200">
                    <Plus className="w-4 h-4" />
                    Post Your First Job
                  </button>
                </Link>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No matching jobs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div  style={{
      
                    display: windowWidth >= 1024 ? 'block' : 'none',
                }} 
               className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Job Title</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Applicants</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Views</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentItems.map((job) => (
                        <tr key={job._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <Link to={`/employer/view_job/${job._id}`} className="font-medium text-gray-900">{job.title}</Link>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                Posted on {new Date().toLocaleDateString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                            title="View Applicants"
                              onClick={() => navigate(`/employer/job/applicants/${job._id}`)}
                              className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                            >
                              <User className="w-4 h-4" />
                              <span className="font-medium">{job.noOfApplicants || 0}</span>
                              
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-700 rounded-lg">
                              <Eye className="w-4 h-4" />
                              <span className="font-medium">{job.interactions || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              job.status === 'Opened' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {job.status === "Opened" ? (
                                <button
                                  onClick={() => closeJob(job._id)}
                                  className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                                  title="Close Job"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => reopenJob(job._id)}
                                  className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                                  title="Reopen Job"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              )}
                              <Link to={`/employer/edit_job/${job._id}`}>
                                <button
                                  className="p-2 text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
                                  title="Edit Job"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </Link>
                              <button
                                onClick={() => showDeleteConfirm(job._id)}
                                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                                title="Delete Job"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                  {currentItems.map((job) => (
                    <div key={job._id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <Link to={`/employer/view_job/${job._id}`} className="font-medium text-gray-900">{job.title}</Link>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Posted on {new Date().toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          job.status === 'Opened' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      
                      <div className="flex gap-4 mb-4">
                        <button
                          onClick={() => navigate(`/employer/job/applicants/${job._id}`)}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg"
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">{job.noOfApplicants || 0} Applicants</span>
                        </button>
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-700 rounded-lg">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">{job.interactions || 0} Views</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {job.status === "Opened" ? (
                          <button
                            onClick={() => closeJob(job._id)}
                            className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                            <span className="text-sm">Close</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => reopenJob(job._id)}
                            className="flex items-center gap-2 px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span className="text-sm">Reopen</span>
                          </button>
                        )}
                        <Link to={`/employer/edit_job/${job._id}`}>
                          <button className="flex items-center gap-2 px-3 py-2 text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200">
                            <Edit className="w-4 h-4" />
                            <span className="text-sm">Edit</span>
                          </button>
                        </Link>
                        <button
                          onClick={() => showDeleteConfirm(job._id)}
                          className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-700">
                        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} items
                      </span>
                      <select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === currentPage;
                        const shouldShow = page <= 3 || page > totalPages - 3 || Math.abs(page - currentPage) <= 1;
                        
                        if (!shouldShow) {
                          if (page === 4 && currentPage > 6) return <span key={page} className="px-2">...</span>;
                          if (page === totalPages - 3 && currentPage < totalPages - 5) return <span key={page} className="px-2">...</span>;
                          return null;
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                              isCurrentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete Job</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this job posting? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOk}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerJobs;