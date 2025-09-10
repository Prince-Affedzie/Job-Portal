import { useState, useEffect } from "react"; 
import { FaSearch, FaFilter, FaClock, FaDollarSign, FaTimes,FaMoneyBillWave,FaMapMarkerAlt  } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "../../Styles/JobListings.css";
import Navbar from "../../Components/Common/Navbar";
import Footer from "../../Components/Common/Footer";
import { getJobs } from "../../APIS/API"; // API function
import moment from "moment";
import debounce from "lodash.debounce"; // Optimize API calls
import Pagination from "../../Components/Common/Pagination";
import { NotificationToast } from "../../Components/Common/NotificationToast";
import JobBanner from "../../Components/Ui/Banner"

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
const categories = ["Administration",'Banking','Development','Marketing','Software Development','Administrative Assistance','Sales',
  'Accounting','Information Technology','Health','Education','Design','Engineering','Human Resources','Project Management','Customer Service',
   'Agriculture','Tourism and Hospitality','Consulting','Finance','Non-profit and NGO','Legal','Manufacturing','Logistics and Supply Chain',
   'others'
]
  const tasksPerPage = 30;
    const [currentPage, setCurrentPage] = useState(1);
  
  
    const totalPages = Math.ceil(jobs.length / tasksPerPage);
  
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentJobs = jobs.slice(indexOfFirstTask, indexOfLastTask);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm,setLocationTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedJobType, setSelectedJobType] = useState("All Types");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [minSalary, setMinSalary] = useState(""); 
  const [maxSalary, setMaxSalary] = useState("");

  // Fetch jobs from API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getJobs({
        search: searchTerm,
        category: selectedCategory,
        type: selectedJobType,
        location: selectedRegion !== "All Regions" ? selectedRegion : undefined,
      });

      if (response.status === 200) {
        setJobs(response.data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.log(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  // Debounced function to optimize API calls
  const debouncedFetchJobs = debounce(fetchJobs, 500);

  // Fetch jobs when filters change
  useEffect(() => {
    debouncedFetchJobs();
    return () => debouncedFetchJobs.cancel(); // Cleanup function
  }, [selectedCategory, selectedJobType, minSalary, maxSalary,selectedRegion]);

  const handleSearchSubmit = () => {
    // Trigger search when submit button is clicked
    debouncedFetchJobs();
  };

  return (
    <div>
       <Navbar />
    <div className="job-listings-container">
     

      {/* Banner */}
    <JobBanner 
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          locationQuery={selectedRegion}
          onLocationChange={setSelectedRegion}
        />

  
      <header className="job-header">
       

        <div className ="category-scroll-wrapper">
        <div className="category-scroll-bar">
        <button 
        className={selectedCategory === "All Categories" ? "active" : ""}
        onClick={() => setSelectedCategory("All Categories")}
         >
         All
        </button>
               {categories.map((category) => (
              <button 
              key={category} 
              className={selectedCategory === category ? "active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
         {category}
           </button>
        ))}
          </div>
        </div>

        <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter className="icon" />Click To Apply Filters
        </button>
      </header>

      <div className="content-container">
        {/* Sidebar (Filters) */}
<aside
  className={`
    fixed inset-y-0 left-0 z-50 w-72 h-full
    transform transition-transform duration-300 ease-in-out
    ${showFilters ? "translate-x-0" : "-translate-x-full"}
    md:relative md:z-auto md:translate-x-0 md:w-64 md:h-120
    bg-slate-800 shadow-xl md:shadow-none 
  `}
>
  {/* Sidebar content */}
  <div className="
    relative h-full md:h-auto w-full
    p-6 overflow-y-auto
    flex flex-col space-y-6
  ">
    {/* Header */}
    <div className="flex items-center justify-between border-b border-slate-700 pb-4">
      <h2 className="text-xl font-bold text-slate-100">Filters</h2>
      <button 
        onClick={() => setShowFilters(false)}
        className="
          md:hidden p-1 rounded-full hover:bg-slate-700
          text-slate-300 hover:text-white
          transition-colors
        "
      >
        <FaTimes className="h-5 w-5" />
      </button>
    </div>

    {/* Filter sections */}
    <div className="space-y-6">
      {/* Category filter */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Category
        </label>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="
            w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-slate-100
          "
        >
          <option className="bg-slate-800">All Categories</option>
          <option className="bg-slate-800">Development</option>
          <option className="bg-slate-800">Design</option>
          <option className="bg-slate-800">Marketing</option>
        </select>
      </div>

      {/* Job Type filter */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Job Type
        </label>
        <select 
          value={selectedJobType}
          onChange={(e) => setSelectedJobType(e.target.value)}
          className="
            w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-slate-100
          "
        >
          <option className="bg-slate-800">All Types</option>
          <option className="bg-slate-800">Full-Time</option>
          <option className="bg-slate-800">Part-Time</option>
          <option className="bg-slate-800">Contract</option>
          <option className="bg-slate-800">Freelance</option>
        </select>
      </div>

      {/* Location filter */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Location
        </label>
        <select 
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="
            w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-slate-100
          "
        >
          <option className="bg-slate-800">All Regions</option>
          <option className="bg-slate-800">Greater Accra</option>
          <option className="bg-slate-800">Ashanti</option>
          <option className="bg-slate-800">Central</option>
          <option className="bg-slate-800">Western</option>
          <option className="bg-slate-800">Northern</option>
          <option className="bg-slate-800">Eastern</option>
          <option className="bg-slate-800">Upper East</option>
          <option className="bg-slate-800">Upper West</option>
          <option className="bg-slate-800">Volta</option>
          <option className="bg-slate-800">Oti</option>
          <option className="bg-slate-800">North East</option>
          <option className="bg-slate-800">Bono</option>
          <option className="bg-slate-800">Bono East</option>
          <option className="bg-slate-800">Ahafo</option>
          <option className="bg-slate-800">Savannah</option>
          <option className="bg-slate-800">Western North</option>
        </select>
      </div>
    </div>

    {/* Apply button for mobile */}
    <button
      onClick={() => setShowFilters(false)}
      className="
        md:hidden w-full py-2 px-4 border border-transparent rounded-md shadow-sm
        text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        mt-auto
      "
    >
      Apply Filters
    </button>
  </div>
</aside>
 {/* Job Listings */}
<section className="job-listings">
  {loading ? (
    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6 p-4">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded mb-3"></div>
          <div className="h-3 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  ) : jobs.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6 p-4">
      {currentJobs.map((job) => (
        <div 
          key={job._id} 
          className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
        >
          <Link to={`/job/details/${job._id}`} className="block h-full">
            <div className="p-6">
              {/* Job Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {job.title}
                  </h3>
                  
                  {/* Company Name */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {job.company ? job.company.charAt(0).toUpperCase() : 'A'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {job.company || 'Anonymous Company'}
                    </span>
                  </div>
                </div>
                
                {/* Job Type Badge */}
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    job.jobType === 'Full-time' ? 'bg-green-50 text-green-700 border-green-200' :
                    job.jobType === 'Part-time' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    job.jobType === 'Contract' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    job.jobType === 'Internship' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {job.jobType}
                  </span>
                </div>
              </div>

              {/* Job Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {job.description.length > 150 ? job.description.slice(0, 150) + "..." : job.description}
              </p>

              {/* Job Tags */}
              {job.jobTags && job.jobTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.jobTags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {job.jobTags.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-200">
                      +{job.jobTags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Job Meta Information */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-xs text-gray-400 flex-shrink-0" />
                  <span className="truncate">
                    {job.location?.city || "Location"}, {job.location?.street || 'Not specified'}
                  </span>
                </div>
                
                {job.salary && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMoneyBillWave className="text-xs text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      ₵{job.salary} {job.paymentStyle && `(${job.paymentStyle})`}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaClock className="text-xs text-gray-400 flex-shrink-0" />
                  <span>{moment(job.createdAt).fromNow()}</span>
                </div>
              </div>
            </div>

            {/* Card Footer - Apply Button */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {job.applications ? `${job.applications} applicants` : 'Be the first to apply'}
                </div>
                
                <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold group-hover:gap-3 transition-all duration-200">
                  <span>View Details</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6H6a2 2 0 00-2 2v6a2 2 0 002 2h2m8-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
        </svg>
        <h3 className="text-xl font-bold text-gray-900 mb-3">No jobs found</h3>
        <p className="text-gray-500 mb-6">No jobs match your current search criteria. Try adjusting your filters or search terms.</p>
        <button 
          onClick={() => {
            // Add logic to clear filters or redirect to browse all jobs
            window.location.reload();
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Filters
        </button>
      </div>
    </div>
  )}
</section>
      </div>
      <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
      <Footer />
       <NotificationToast/>
    </div>
    </div>
  );
};

export default JobListings;
