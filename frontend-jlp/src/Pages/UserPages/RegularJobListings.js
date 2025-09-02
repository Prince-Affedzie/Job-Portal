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
          locationQuery={locationTerm}
          onLocationChange={setLocationTerm}
        />

      {/* Header Section */}
      <header className="job-header">
       {/* <div className="search-bar">
          <FaSearch className="search-icon-jl" />
          <input 
            type="text" 
            placeholder="Search for jobs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>*/}

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
            // Skeleton Loader when data is loading
            <>
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="job-card skeleton">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-meta"></div>
                  <div className="skeleton-button"></div>
                </div>
              ))}
            </>
          )  : jobs.length > 0 ? (
            currentJobs.map((job) => (
              <div key={job._id} className="job-card">
                <Link to={`/job/details/${job._id}`}>
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <span className="job-type">{job.jobType}</span>
                  </div>
                  <p className="company-name">Company: {job.company || 'Anonymous'}</p>
                  <p className="job-listing-description">{job.description.slice(0,400)+"..."}</p>
                  
                  <div className="job-meta">
                    <span ><FaMapMarkerAlt /> {job.location.city || "N/A"}, {job.location.street || 'N/A'}</span>
                    <span><FaMoneyBillWave  display={'hidden'} className="icon" /> ₵{job.salary || 'N/A'} ({job.paymentStyle || 'N/A'})</span>
                    <span><FaClock className="icon" /> {moment(job.createdAt).fromNow()}</span>
                    
                  </div>
                  <div className="job-listings-job-tags">
                  {job.jobTags?.map((tag)=>(
                   
                     <span className= "tag">{tag}</span>
                    
                    ))}
                     </div>
                 { /*<button className="apply-button">Apply Now</button>*/}
                </Link>
              </div>
            ))
          ) : (
            <p>No jobs match your criteria.</p>
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
