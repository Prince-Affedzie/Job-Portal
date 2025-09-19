import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaEdit, 
  FaUsers, 
  FaEye, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaMoneyBillWave,
  FaClock,
  FaBriefcase,
  FaGraduationCap,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaBuilding,
  FaEnvelope,
  FaTags,
  FaHandshake,
  FaLaptop,
  FaChartLine,
  FaCheckCircle,
  FaCopy,
  FaShare,
  FaLinkedin,
  FaGlobe,
  FaPhone,
  FaUserTie,
  FaBookmark,
  FaShieldAlt
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getJobById } from '../../APIS/API';
import Sidebar from '../../Components/EmployerDashboard/SideBar';
import EmployerNavbar from '../../Components/EmployerDashboard/EmployerNavbar';

const JobDetailPage = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await getJobById(Id);
        
        if (response.status === 200) {
          setJob(response.data);
        } else {
          toast.error("Failed to load job details");
        }
      } catch (error) {
        toast.error("An error occurred while loading job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [Id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Job link copied to clipboard!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job opportunity: ${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      handleCopyLink();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Opened': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-red-100 text-red-800 border-red-200';
      case 'Filled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDeliveryModeIcon = (mode) => {
    switch (mode) {
      case 'Remote': return <FaLaptop className="text-emerald-600" />;
      case 'In-Person': return <FaBuilding className="text-blue-600" />;
      case 'Hybrid': return <FaHandshake className="text-violet-600" />;
      default: return <FaBriefcase className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerNavbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerNavbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaExternalLinkAlt className="text-red-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Job Not Found
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">The requested job could not be loaded or may have been removed.</p>
              <button
                onClick={() => navigate('/employer/jobs')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <FaArrowLeft className="inline mr-2" />
                Return to Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EmployerNavbar />
      <div className="flex flex-1">
       <div className=" lg:block sm:hidden">
        <Sidebar />
      </div>
        
        <main className={`lg:ml-64 flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 mt-5
          
        `}>
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          {/* Header with Back Button */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              <FaArrowLeft className="mr-2" />
              Back to Jobs
            </button>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base"
              >
                <FaShare className="text-sm" />
                <span className="hidden sm:inline">Share</span>
              </button>
              
              <button
                onClick={() => navigate(`/employer/job/applicants/${Id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
              >
                <FaUsers className="text-sm" />
                <span>Applicants ({job.noOfApplicants || 0})</span>
              </button>
              
              <button
                onClick={() => navigate(`/employer/edit_job/${Id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
              >
                <FaEdit className="text-sm" />
                <span>Edit Job</span>
              </button>
            </div>
          </div>

          {/* Job Header Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="bg-blue-800 px-6 md:px-8 py-8 md:py-10 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h1 className="text-2xl md:text-3xl font-bold mb-3">
                        {job.title}
                      </h1>
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
                          <FaShieldAlt className="inline mr-2 text-xs" />
                          {job.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-blue-100">
                    {job.company && (
                      <div className="flex items-center gap-3 bg-blue-700/30 px-4 py-2 rounded-lg">
                        <FaBuilding className="text-sm" />
                        <span className="text-sm md:text-base">{job.company}</span>
                      </div>
                    )}
                    {job.location?.city && (
                      <div className="flex items-center gap-3 bg-blue-700/30 px-4 py-2 rounded-lg">
                        <FaMapMarkerAlt className="text-sm" />
                        <span className="text-sm md:text-base">
                          {job.location.city}{job.location.region && `, ${job.location.region}`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 bg-blue-700/30 px-4 py-2 rounded-lg">
                      <FaBriefcase className="text-sm" />
                      <span className="text-sm md:text-base">{job.jobType}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-start md:items-end gap-4">
                  <div className="bg-blue-700/30 rounded-lg px-4 py-3 border border-blue-600/30">
                    <p className="text-blue-100 text-sm mb-1">Posted</p>
                    <p className="text-white font-medium">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {job.deadLine && (
                    <div className="flex items-center gap-3 bg-amber-500/30 px-4 py-3 rounded-lg border border-amber-400/30">
                      <FaClock className="text-amber-200" />
                      <div>
                        <p className="text-amber-100 text-xs">Application Deadline</p>
                        <p className="text-white font-medium text-sm">
                          {new Date(job.deadLine).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FaEye className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Views</p>
                      <p className="text-lg font-bold text-gray-800">{job.interactions || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <FaUsers className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Applicants</p>
                      <p className="text-lg font-bold text-gray-800">{job.noOfApplicants || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      {getDeliveryModeIcon(job.deliveryMode)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Work Mode</p>
                      <p className="text-md font-semibold text-gray-800">{job.deliveryMode || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <FaMoneyBillWave className="text-yellow-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Salary</p>
                      <p className="text-md font-semibold text-gray-800">{job.salary || 'Negotiable'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                <nav className="flex min-w-max">
                  {[
                    { id: 'overview', label: 'Overview', icon: <FaEye className="mr-2" /> },
                    { id: 'requirements', label: 'Requirements', icon: <FaGraduationCap className="mr-2" /> },
                    { id: 'company', label: 'Company Info', icon: <FaBuilding className="mr-2" /> },
                    { id: 'applicants', label: 'Applicants', icon: <FaUserTie className="mr-2" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'applicants') {
                          navigate(`/employer/job/applicants/${Id}`);
                        } else {
                          setActiveTab(tab.id);
                        }
                      }}
                      className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {isMobile ? tab.icon : tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h3>
                      <div className="prose max-w-none text-gray-700 leading-relaxed">
                        <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                          {job.description}
                        </div>
                      </div>
                    </div>

                    {job.responsibilities && job.responsibilities.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h3>
                        <ul className="space-y-3">
                          {job.responsibilities.map((responsibility, index) => (
                            <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-gray-700">{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {job.jobTags && job.jobTags.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.jobTags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                            >
                              <FaTags className="text-xs" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'requirements' && (
                  <>
                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.skillsRequired.map((skill, index) => (
                            <span 
                              key={index} 
                              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FaMoneyBillWave className="text-gray-600" />
                          Payment Style
                        </h4>
                        <p className="text-lg text-gray-800">{job.paymentStyle || 'Not specified'}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-600" />
                          Application Deadline
                        </h4>
                        <p className="text-lg text-gray-800">
                          {job.deadLine ? new Date(job.deadLine).toLocaleDateString() : 'No deadline specified'}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'company' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job.company && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <FaBuilding className="text-gray-600" />
                            Company Name
                          </h4>
                          <p className="text-lg text-gray-800">{job.company}</p>
                        </div>
                      )}

                      {job.companyEmail && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <FaEnvelope className="text-gray-600" />
                            Company Email
                          </h4>
                          <div>
                            <a 
                              href={`mailto:${job.companyEmail}`} 
                              className="text-lg text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {job.companyEmail}
                            </a>
                          </div>
                        </div>
                      )}

                      {job.industry && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <FaChartLine className="text-gray-600" />
                            Industry
                          </h4>
                          <p className="text-lg text-gray-800">{job.industry}</p>
                        </div>
                      )}

                      {job.location && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-gray-600" />
                            Location Details
                          </h4>
                          <div className="text-gray-800">
                            {job.location.street && <p className="text-sm">{job.location.street}</p>}
                            {job.location.city && <p className="text-lg">{job.location.city}</p>}
                            {job.location.region && <p className="text-md">{job.location.region}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Social Media Links 
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Connect With Us</h4>
                      <div className="flex gap-3">
                        <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <FaLinkedin className="text-lg" />
                        </button>
                        <button className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <FaGlobe className="text-lg" />
                        </button>
                        <button className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <FaPhone className="text-lg" />
                        </button>
                      </div>
                    </div>*/}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Call to Action Footer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to manage this job?</h3>
                <p className="text-gray-600 max-w-md">
                  View applicants or make changes to your job posting
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={() => navigate(`/employer/job/applicants/${Id}`)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FaUsers className="text-lg" />
                  <span>View Applicants</span>
                </button>
                <button
                  onClick={() => navigate(`/employer/edit_job/${Id}`)}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FaEdit className="text-lg" />
                  <span>Edit Job</span>
                </button>
              </div>
            </div>
          </div>

          {/* Additional Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaBookmark className="text-green-600 text-lg" />
                </div>
                <h4 className="font-semibold text-gray-900">Job Performance</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">Track views, applications, and engagement metrics</p>
              <div className="flex items-center text-blue-600 font-medium text-sm">
                <span>View Analytics</span>
                <FaExternalLinkAlt className="ml-2 text-xs" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaShare className="text-blue-600 text-lg" />
                </div>
                <h4 className="font-semibold text-gray-900">Share & Promote</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">Increase visibility across social platforms</p>
              <div className="flex items-center text-blue-600 font-medium text-sm">
                <span>Share Job</span>
                <FaExternalLinkAlt className="ml-2 text-xs" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaUserTie className="text-purple-600 text-lg" />
                </div>
                <h4 className="font-semibold text-gray-900">Candidate Pipeline</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">Manage applications and interview process</p>
              <div className="flex items-center text-blue-600 font-medium text-sm">
                <span>Manage Pipeline</span>
                <FaExternalLinkAlt className="ml-2 text-xs" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobDetailPage;