import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import { 
  FaSearch, 
  FaBriefcase, 
  FaBuilding, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaClock,
  FaFilter,
  FaSort,
  FaChevronDown,
  FaChevronRight,
  FaExternalLinkAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEye,
  FaMoneyBillWave,
  FaUserTie
} from "react-icons/fa";
import moment from "moment";
import Navbar from "../../Components/Common/Navbar";
import { getRecentApplications } from "../../APIS/API";
import Pagination from "../../Components/Common/Pagination";

const ViewApplications = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(6);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [searchQuery, filter, sortBy, applications]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await getRecentApplications();
      if (response.status === 200) {
        setApplications(response.data);
        setFilteredApplications(response.data);
      } else {
        setApplications([]);
        setFilteredApplications([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortApplications = () => {
    let filtered = [...applications];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(app => 
        app.job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job?.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter(app => app.status.toLowerCase() === filter);
    }

    // Apply sorting
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "alphabetical") {
      filtered.sort((a, b) => {
        const titleA = a.job?.title || "";
        const titleB = b.job?.title || "";
        return titleA.localeCompare(titleB);
      });
    }

    setFilteredApplications(filtered);
    setCurrentPage(1);
  };

  // Get Status Badge Class
  const getStatusClass = (status) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      reviewing: "bg-purple-100 text-purple-800",
      shortlisted: "bg-teal-100 text-teal-800",
      offered: "bg-indigo-100 text-indigo-800",
      interview: "bg-pink-100 text-pink-800",
      default: "bg-gray-100 text-gray-800"
    };
    return statusMap[status.toLowerCase()] || statusMap.default;
  };

  // Pagination
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  const renderTimeAgo = (date) => {
    return moment(date).fromNow();
  };

  const toggleFilters = () => setIsFilterExpanded(!isFilterExpanded);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-lg text-gray-600">Track and manage your job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="text-sm font-medium text-gray-500">Total Applications</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">{applications.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="text-sm font-medium text-gray-500">Pending</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {applications.filter(app => app.status.toLowerCase() === "pending").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="text-sm font-medium text-gray-500">Accepted</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {applications.filter(app => app.status.toLowerCase() === "accepted").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="text-sm font-medium text-gray-500">Rejected</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {applications.filter(app => app.status.toLowerCase() === "rejected").length}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by job title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaFilter className="mr-2" />
                Filters
                {isFilterExpanded ? <FaChevronDown className="ml-2" /> : <FaChevronRight className="ml-2" />}
              </button>
            </div>
          </div>

          {isFilterExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="interview">Interview</option>
                  <option value="offered">Offered</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {currentApplications.length > 0 ? (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
    {currentApplications.map((app) => (
      <div 
        key={app._id} 
        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        {/* Card Header */}
        <div className="p-5 pb-3">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FaBriefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {app.job?.title || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {app.job?.company || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(app.status)}`}>
              {app.status}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-5 pb-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Applied</p>
                <p className="font-medium text-gray-900">
                  {renderTimeAgo(app.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                <FaClock className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium text-gray-900 capitalize">
                  {app.status.toLowerCase()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                <FaBuilding className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Company</p>
                <p className="font-medium text-gray-900 line-clamp-1">
                  {app.job?.company || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center">
           {/* <button
              onClick={() => setSelectedApplication(app)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <FaEye className="w-4 h-4" />
              View Details
            </button> */}
            
            {app.status.toLowerCase() === "accepted" && (
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                <FaCheckCircle className="w-4 h-4" />
                Accepted
              </button>
            )}
            
            {app.status.toLowerCase() === "interviewing" && (
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <FaUserTie className="w-4 h-4" />
                Interview Scheduled
              </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="text-center bg-white py-16 rounded-lg shadow">
    <div className="mx-auto max-w-md px-4">
      <img
        src="/images/no-applications.svg"
        alt="No applications found"
        className="mx-auto h-48 w-48"
      />
      <h3 className="mt-6 text-xl font-medium text-gray-900">No applications found</h3>
      <p className="mt-2 text-sm text-gray-500">
        Try adjusting your search filters or apply for new positions.
      </p>
      <div className="mt-6">
        <button
          onClick={()=>navigate('/job/listings')}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Browse Available Jobs
        </button>
      </div>
      </div>
      </div>
      )}
       </>
        )}

        {/* Pagination */}
        {filteredApplications.length > applicationsPerPage && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedApplication(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {selectedApplication.job?.title || "N/A"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {selectedApplication.job?.company || "N/A"}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(selectedApplication.status)}`}>
                        {selectedApplication.status}
                      </span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-700">
                          Applied {moment(selectedApplication.createdAt).format("MMMM D, YYYY")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaUserTie className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-700">
                          {selectedApplication.job?.employmentType || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaMoneyBillWave className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-700">
                          {selectedApplication.job?.salary || "Salary not specified"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-700">
                          {selectedApplication.job?.location || "Location not specified"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900">Job Description</h4>
                      <p className="mt-2 text-sm text-gray-600">
                        {selectedApplication.job?.description || "No description available."}
                      </p>
                    </div>
                    
                    {selectedApplication.job?.skillsRequired?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900">Required Skills</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedApplication.job.skillsRequired.map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900">Application Status</h4>
                      <div className="mt-2">
                        <div className="overflow-hidden bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              selectedApplication.status === "accepted" ? "bg-green-500" :
                              selectedApplication.status === "rejected" ? "bg-red-500" :
                              selectedApplication.status === "interview" ? "bg-yellow-500" :
                              "bg-blue-500"
                            }`}
                            style={{ width: 
                              selectedApplication.status === "accepted" ? "100%" :
                              selectedApplication.status === "rejected" ? "100%" :
                              selectedApplication.status === "interview" ? "75%" :
                              "50%"
                            }}
                          ></div>
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-gray-600">
                          <span>Applied</span>
                          {selectedApplication.status === "interview" && <span>Interview</span>}
                          <span>{
                            selectedApplication.status === "accepted" ? "Accepted" :
                            selectedApplication.status === "rejected" ? "Rejected" :
                            selectedApplication.status === "interview" ? "Interview" :
                            "In Review"
                          }</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Add action for primary button (e.g., contact employer)
                    setSelectedApplication(null);
                  }}
                >
                  Contact Employer
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedApplication(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;