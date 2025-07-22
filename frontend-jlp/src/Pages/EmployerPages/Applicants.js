import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaEye, FaSearch, FaBriefcase, FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../Components/EmployerDashboard/SideBar";
import EmployerNavbar from "../../Components/EmployerDashboard/EmployerNavbar";
import { getAllApplications, modifyApplication } from '../../APIS/API';
import { useNavigate } from 'react-router-dom';
import InterviewInviteModal from "../../Components/EmployerDashboard/InterviewInviteModal";
import Pagination from '../../Components/EmployerDashboard/Pagination';

const Applicants = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);
  const [selectedApplicants, setSelectedApplicants] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForModal, setSelectedForModal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can change this number based on your design

 



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
        toast.error("No applications found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
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
        toast.error(response.errorMessage || `Operation failed.`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    }
  };

  const filteredApplications = applications.filter(app => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && app.status === 'Pending') ||
      (filter === 'accepted' && app.status === 'Accepted') ||
      (filter === 'rejected' && app.status === 'Rejected');
    
    return matchesSearch && matchesFilter;
  });

  const indexOfLastApplication = currentPage *itemsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);


  const groupedByJob = currentApplications.reduce((acc, app) => {
    const jobId = app.job?._id;
    if (!jobId) return acc;
    
    if (!acc[jobId]) {
      acc[jobId] = {
        jobTitle: app.job.title,
        jobId: jobId,
        applicants: [],
      };
    }
    acc[jobId].applicants.push(app);
    return acc;
  }, {});


  


 
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleJobExpansion = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const toggleApplicant = (jobId, applicantId) => {
    setSelectedApplicants(prev => {
      const currentJobSelections = prev[jobId] || [];
      const isSelected = currentJobSelections.includes(applicantId);
      return {
        ...prev,
        [jobId]: isSelected
          ? currentJobSelections.filter(id => id !== applicantId)
          : [...currentJobSelections, applicantId],
      };
    });
  };
  

  const openInviteModal = () => {
    // Flatten selected applicant IDs from all jobs into one array
    const selected = Object.values(selectedApplicants).flat();
  
    if (selected.length === 0) {
      alert("Select at least one applicant.");
      return;
    }
  
    setIsModalOpen(true);
    setSelectedForModal(selected); // We'll define this below
  };
  


  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <EmployerNavbar onMenuClick={toggleSidebar} />
      
      <div className={`fixed top-0 left-0 z-40 h-full transition-transform duration-300 ease-in-out transform ${
        sidebarOpen || !isMobileView ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      <div className={`flex-1 transition-all duration-300 ${isMobileView ? 'ml-0' : 'ml-64'} mt-16`}>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              <FaBriefcase className="inline-block mr-2 text-blue-600" />
              Job Applicants
            </h2>
            
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search applicants..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              <select 
                className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <button
                  onClick={openInviteModal}
                 className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                  >
                  Send Interview Invite
             </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : Object.keys(groupedByJob).length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <FaUserCircle className="mx-auto text-gray-300 text-6xl mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No applicants found</h3>
              <p className="text-gray-500">
                {searchTerm || filter !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "There are no applications yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByJob).map(([jobId, jobGroup]) => (
                <div key={jobId} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div 
                    onClick={() => toggleJobExpansion(jobId)}
                    className={`flex justify-between items-center cursor-pointer px-6 py-4 transition-colors duration-200 ${
                      expandedJob === jobId ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <FaBriefcase className={`mr-3 ${expandedJob === jobId ? 'text-white' : 'text-blue-600'}`} />
                      <span className="font-medium text-md">{jobGroup.jobTitle}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        expandedJob === jobId ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {jobGroup.applicants.length} applicant{jobGroup.applicants.length !== 1 && 's'}
                      </span>
                      <svg 
                        className={`ml-2 w-5 h-5 transition-transform duration-200 ${
                          expandedJob === jobId ? 'transform rotate-180 text-white' : 'text-gray-400'
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {expandedJob === jobId && (
                    <div className="p-6 divide-y divide-gray-100">
                      {jobGroup.applicants.map(app => (
                        <div key={app._id} className="py-4 first:pt-0 last:pb-0">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="mb-4 md:mb-0">
                              <div className="flex items-center">
                                <FaUserCircle className="text-gray-400 text-2xl mr-3" />
                                <div>
                                  <h4 className="font-medium text-gray-900">{app.user?.name || 'Unnamed Applicant'}</h4>
                                  <p className="text-sm text-gray-600">{app.user?.email || 'No email provided'}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(app.status)}`}>
                                {app.status}
                              </span>
                              
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => navigate(`/employer/applicant-profile`, {state: {app}})} 
                                  className="flex items-center px-3 py-1.5 text-sm rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                >
                                  <FaEye className="mr-1.5" /> View
                                </button>
                                
                                <button 
                                  onClick={() => app.status !== 'Accepted' && modifyAppStatus(app._id, { status: 'Accepted' })} 
                                  disabled={app.status === 'Accepted'}
                                  className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                                    app.status === 'Accepted' 
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                                  }`}
                                >
                                  <FaCheck className="mr-1.5" /> Accept
                                </button>
                                
                                <button 
                                  onClick={() => app.status !== 'Rejected' && modifyAppStatus(app._id, { status: 'Rejected' })} 
                                  disabled={app.status === 'Rejected'}
                                  className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                                    app.status === 'Rejected' 
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                                  }`}
                                >
                                  <FaTimes className="mr-1.5" /> Reject
                                </button>
                              <label className="emp-checkbox-label">
                              <input
                                 type="checkbox"
                                 checked={selectedApplicants[jobId]?.includes(app.user._id) || false}
                                 onChange={() => toggleApplicant(jobId, app.user._id)}
                                  className="form-checkbox h-5 w-5 text-blue-600"
                              />

                             <span className="emp-checkbox-text">Select to send Interview Invite</span>
                             </label>
                              
                              </div>
                            </div>
                          </div>
                          {/* Interview Invite Modal */}
                         {isModalOpen && (
                              <InterviewInviteModal
                              isOpen={isModalOpen}
                              onClose={() => setIsModalOpen(false)}
                              selectedApplicants={selectedForModal}
                              jobId={ app.job?._id || ""}
                              />
                             )}
                        </div>
                      ))}

                      
                    </div>
                  )}
                </div>
              ))}

               <Pagination
                           currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                                        />
            </div>
            
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Applicants;