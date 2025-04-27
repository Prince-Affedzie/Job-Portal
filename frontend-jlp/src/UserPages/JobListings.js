import { useState, useEffect } from "react"; 
import { FaSearch, FaFilter, FaClock, FaDollarSign, FaTimes,FaMoneyBillWave,FaMapMarkerAlt  } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/JobListings.css";
import Navbar from "../Components/MyComponents/Navbar";
import Footer from "../Components/MyComponents/Footer";
import { getJobs } from "../APIS/API"; // API function
import moment from "moment";
import debounce from "lodash.debounce"; // Optimize API calls

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedJobType, setSelectedJobType] = useState("All Types");
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
        minSalary,
        maxSalary
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

  // Debounced function to optimize API calls
  const debouncedFetchJobs = debounce(fetchJobs, 500);

  // Fetch jobs when filters change
  useEffect(() => {
    debouncedFetchJobs();
    return () => debouncedFetchJobs.cancel(); // Cleanup function
  }, [searchTerm, selectedCategory, selectedJobType, minSalary, maxSalary]);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="skeleton-loader">
      <div className="skeleton-header"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-meta"></div>
    </div>
  );

  return (
    <div>
       <Navbar />
    <div className="job-listings-container">
     

      {/* Banner */}
      <div className="banner">
        <h1>Find Your Next Job Opportunity</h1>
        <p>Explore thousands of jobs tailored for you.</p>
      </div>

      {/* Header Section */}
      <header className="job-header">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for jobs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter className="icon" /> Filters
        </button>
      </header>

      <div className="content-container">
        {/* Sidebar (Filters) */}
        <aside className={`job-listings-sidebar ${showFilters ? "show" : ""}`}>
          <button className="close-button" onClick={() => setShowFilters(false)}>
            <FaTimes style={{ color: "#fff" }} />
          </button>
          <h2 style={{ color: "#fff" }}>Filters</h2>

          <label style={{ color: "#fff" }}>Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option>All Categories</option>
            <option>Development</option>
            <option>Design</option>
            <option>Marketing</option>
          </select>

          <label style={{ color: "#fff" }}>Job Type</label>
          <select value={selectedJobType} onChange={(e) => setSelectedJobType(e.target.value)}>
            <option>All Types</option>
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Contract</option>
          </select>

          <label style={{ color: "#fff" }}>Minimum Salary (₵)</label>
          <input 
            type="number" 
            placeholder="Min salary" 
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />

          <label style={{ color: "#fff" }}>Maximum Salary (₵)</label>
          <input 
            type="number" 
            placeholder="Max salary" 
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
          />
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
            jobs.map((job) => (
              <div key={job._id} className="job-card">
                <Link to={`/job/details/${job._id}`}>
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <span className="job-type">{job.type}</span>
                  </div>
                  <p className="company-name">{job.company}</p>
                  <p className="job-listing-description">{job.description.slice(0,400)+"..."}</p>
                  
                  <div className="job-meta">
                    <span ><FaMapMarkerAlt /> {job.location.city || "N/A"}, {job.location.street || 'N/A'}</span>
                    <span><FaMoneyBillWave  display={'hidden'} className="icon" /> ₵{job.salary} ({job.paymentStyle})</span>
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
      <Footer />
    </div>
    </div>
  );
};

export default JobListings;
