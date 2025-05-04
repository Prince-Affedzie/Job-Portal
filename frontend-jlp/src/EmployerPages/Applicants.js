import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaEye, FaEnvelope, FaBan, FaFilter, FaSort, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../Components/EmployerDashboard/EmployerNavbar";
import { getAllApplications, modifyApplication, manageInterviewInvite } from '../APIS/API';
import ApplicantInfoModal from '../Components/EmployerDashboard/ApplicantsInfoModal';

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [paginationStates, setPaginationStates] = useState({});
  const applicantsPerPage = 5;
  const [currentJobPage, setCurrentJobPage] = useState(1);
  const jobsPerPage = 3;
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
    
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApplicant(null);
    setIsModalOpen(false);
  };

  const modifyAppStatus = async (id, status) => {
    try {
      const response = await modifyApplication(id, status);
      if (response.status === 200) {
        toast.success(`Application ${status.status} successfully`);
        setApplications(prev =>
          prev.map(app => app._id === id ? { ...app, status: status.status } : app)
        );
      } else {
        toast.error(response.errorMessage || `Oops! Couldn't finish operation.`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    }
  };

  const sendInterviewInvite = async (applicant) => {
    try {
      const interviewState = !applicant.inviteForInterview;
      const response = await manageInterviewInvite(applicant._id, interviewState);
      if (response.status === 200) {
        toast.success(`${interviewState ? 'Interview invitation sent' : 'Invitation withdrawn'} successfully`);
        setApplications(prev =>
          prev.map(app => app._id === applicant._id ? { ...app, inviteForInterview: interviewState } : app)
        );
      } else {
        toast.error(response.error || "Oops! An unknown error occurred.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const groupedByJob = filteredApplications.reduce((acc, app) => {
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

  const handlePageChange = (jobId, newPage) => {
    setPaginationStates(prev => ({
      ...prev,
      [jobId]: newPage,
    }));
  };

  // Page-level pagination
  const groupedEntries = Object.entries(groupedByJob);
  const totalJobPages = Math.ceil(groupedEntries.length / jobsPerPage);
  const startJobIndex = (currentJobPage - 1) * jobsPerPage;
  const endJobIndex = startJobIndex + jobsPerPage;
  const visibleJobSections = groupedEntries.slice(startJobIndex, endJobIndex);

  // Card view for mobile
  const ApplicantCard = ({ app }) => {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-gray-900">{app.user?.name}</h3>
            <p className="text-sm text-gray-600">{app.user?.email}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            app.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
            app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {app.status}
          </span>
        </div>
        
        <div className="flex mb-3">
          <a
            href={`https://your-cdn-url.com/${app.resume}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
          >
            <FaEye className="mr-1" /> View Resume
          </a>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => openModal(app)} 
            className="inline-flex items-center justify-center px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
          >
            <FaEye className="mr-1" /> View Profile
          </button>
          <button
            className={`inline-flex items-center justify-center px-2 py-2 rounded-md text-xs ${
              app.status === "Accepted" 
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            onClick={() => app.status !== "Accepted" && modifyAppStatus(app._id, { status: "Accepted" })}
            disabled={app.status === "Accepted"}
          >
            <FaCheck className="mr-1" /> Accept
          </button>
          <button
            className="inline-flex items-center justify-center px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs"
            onClick={() => modifyAppStatus(app._id, { status: "Rejected" })}
          >
            <FaTimes className="mr-1" /> Reject
          </button>
         {/* <button
            className={`inline-flex items-center justify-center px-2 py-2 rounded-md text-xs ${
              app.inviteForInterview 
                ? "bg-amber-600 text-white hover:bg-amber-700" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={() => sendInterviewInvite(app)}
          >
            {app.inviteForInterview ? <FaBan className="mr-1" /> : <FaEnvelope className="mr-1" />}
            {app.inviteForInterview ? "Withdraw" : "Invite"}
          </button>*/}
        </div>
      </div>
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <EmployerNavbar onMenuClick={toggleSidebar} />
      {/* Sidebar with mobile responsive behavior */}
      <div className={`sidebar-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar />
      </div>

      <div className={`flex-1 p-4 md:p-6 transition-all duration-300 ${isMobileView ? 'ml-0' : 'ml-64'} mt-16`}>
        <div className="mb-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Job Applicants</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search applicants..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <FaSearch />
              </span>
            </div>
            
            <select
              className="py-2 px-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : groupedEntries.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow text-center">
            <div className="text-gray-500 mb-4 text-5xl">📋</div>
            <p className="text-lg text-gray-600">No applicants found matching your criteria.</p>
          </div>
        ) : (
          visibleJobSections.map(([jobId, { jobTitle, applicants }]) => {
            const currentPage = paginationStates[jobId] || 1;
            const totalPages = Math.ceil(applicants.length / applicantsPerPage);
            const indexOfLast = currentPage * applicantsPerPage;
            const indexOfFirst = indexOfLast - applicantsPerPage;
            const currentApplicants = applicants.slice(indexOfFirst, indexOfLast);

            return (
              <div key={jobId} className="bg-white rounded-lg shadow-md overflow-hidden mb-8 transition-all hover:shadow-lg">
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-4 py-3 sm:px-6 sm:py-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white flex items-center">
                    <FaSort className="mr-2" /> {jobTitle}
                  </h3>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentApplicants.map((app) => (
                        <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{app.user?.name}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-600">{app.user?.email}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <a
                              href={app.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                            >
                              <FaEye className="mr-1" /> View
                            </a>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              app.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                              app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-2">
                              <button 
                                onClick={() => openModal(app)} 
                                className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
                              >
                                <FaEye className="mr-1" /> Profile
                              </button>
                              <button
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                                  app.status === "Accepted" 
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                                    : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                                onClick={() => app.status !== "Accepted" && modifyAppStatus(app._id, { status: "Accepted" })}
                                disabled={app.status === "Accepted"}
                              >
                                <FaCheck className="mr-1" /> Accept
                              </button>
                              <button
                                className="inline-flex items-center px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs"
                                onClick={() => modifyAppStatus(app._id, { status: "Rejected" })}
                              >
                                <FaTimes className="mr-1" /> Reject
                              </button>
                              <button
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                                  app.inviteForInterview 
                                    ? "bg-amber-600 text-white hover:bg-amber-700" 
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                                onClick={() => sendInterviewInvite(app)}
                              >
                                {app.inviteForInterview ? <FaBan className="mr-1" /> : <FaEnvelope className="mr-1" />}
                                {app.inviteForInterview ? "Withdraw" : "Invite"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden p-4">
                  {currentApplicants.map(app => (
                    <ApplicantCard key={app._id} app={app} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 p-4 bg-gray-50">
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentPage === 1 
                          ? "bg-gray-200 text-gray-600 cursor-not-allowed" 
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      onClick={() => handlePageChange(jobId, currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Prev
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentPage === totalPages 
                          ? "bg-gray-200 text-gray-600 cursor-not-allowed" 
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      onClick={() => handlePageChange(jobId, currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Pagination for job sections */}
        {totalJobPages > 1 && (
          <div className="flex justify-center items-center gap-2 sm:gap-4 mt-6">
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-colors ${
                currentJobPage === 1 
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
              onClick={() => setCurrentJobPage(currentJobPage - 1)}
              disabled={currentJobPage === 1}
            >
              ← Prev Jobs
            </button>
            <span className="text-sm text-gray-600 font-medium">
              {currentJobPage} of {totalJobPages}
            </span>
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-colors ${
                currentJobPage === totalJobPages 
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
              onClick={() => setCurrentJobPage(currentJobPage + 1)}
              disabled={currentJobPage === totalJobPages}
            >
              Next Jobs →
            </button>
          </div>
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