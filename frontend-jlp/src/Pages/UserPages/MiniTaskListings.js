import { useState, useEffect } from "react";
import { FaSearch, FaClock, FaFilter, FaTimes,FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getMiniTasks } from "../../APIS/API";
import "../../Styles/MiniTaskPage.css";
import Navbar from "../../Components/Common/Navbar";
import Footer from "../../Components/Common/Footer";
import moment from "moment";
import debounce from "lodash.debounce"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SkeletonLoader from "../../Components/Common/SkeletonLoader";
import MiniTaskDetailsModal from "../../Components/Common/MiniTaskDetailsModal";
import { applyToMiniTask } from "../../APIS/API";
import RequestStatusIndicator from "../../Components/Common/RequestStatusIndicator";
import LoadingButton from "../../Components/Common/LoadingButton";
import { useRequestStatus } from "../../hooks/useRequestStatus";
import ProcessingOverlay from "../../Components/Common/ProcessingOverLay";
import Pagination from "../../Components/Common/Pagination";

const MiniTaskPage = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask,setSelectedTask] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedmodeofDelivery,setModeOfDelivery] = useState('All Modes')
  const [isProcessing, setIsProcessing] = useState(false);
  const tasksPerPage = 30;
  const [currentPage, setCurrentPage] = useState(1);


  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
  const categoryOptions = {
    "Creative Tasks":["Graphic Design","Video Editing","Flyer Design","Poster Design","Logo Design","Voice Over"],
    "Delivery & Errands": ["Package Delivery", "Grocery Shopping", "Laundry","Line Waiting"],
    "Digital Services": ["Data Entry", "Virtual Assistant", "Social Media Help","Online Research",],
    "Event Support": ["Decoration", "Photography", "Setup Assistance"],
    "Home Services":["Cleaning","Home Repair","Plumbing","Electrical","Painting","Gardening","Furniture Assembly"],
    "Learning & Tutoring": ["Online Tutoring", "Homework Help", "Language Teaching","Career Mentoring"],
    "Writing & Assistance": ["Blog Writing", "Copywriting", "Content Writing","Resume/CV Writing","Transcription","Survey Participation"],
    "Others":["Miscellaneous","Miscellaneous"]
  };

 
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await getMiniTasks(
          {search:searchQuery,
           category :selectedCategory,
           subcategory:selectedSubCategory,
           location: selectedRegion !== "All Regions" ? selectedRegion : undefined,
           modeofDelivery:selectedmodeofDelivery !== "All Modes" ? selectedmodeofDelivery : undefined,
          }
        );
        if (response.status === 200) {
          setTasks(response.data);
          setFilteredTasks(response.data);
        } else {
          setTasks([]);
          setFilteredTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
        setFilteredTasks([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(()=>{
      fetchTasks();
    },[searchQuery])

   
  const applyToTask =async(Id)=>{
    
    setIsProcessing(true);
    try{
       
       const response = await applyToMiniTask(Id)
       if(response.status ===200){
       
        toast.success("You’ve shown interest in this job! Stay Tuned — the client might reach out soon.")
       }else{
        
        toast.error("An Error Occured. Please try again Later")
       }
    }catch(error){
      
       const errorMessage =
                 error.response?.data?.message ||
                error.response?.data?.error ||
                 "An unexpected error occurred. Please try again.";
                
                  toast.error(errorMessage);
                 
    }finally{
      setIsProcessing(false);
    }
  }

  

  // Handle Search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(query)
    );
    setFilteredTasks(filtered);
  };

  // Debounced function to optimize API calls
    const debouncedFetchJobs = debounce(fetchTasks, 500);
  
    // Fetch jobs when filters change
    useEffect(() => {
      debouncedFetchJobs();
      return () => debouncedFetchJobs.cancel(); // Cleanup function
    }, [selectedCategory,selectedSubCategory,selectedRegion,selectedmodeofDelivery]);

  // Format time ago
   const timeAgo = (deadline) => {
     return deadline ? moment(deadline).fromNow() : "N/A";
  };

  return (
    <div  className="mini-task-list-page">
        <Navbar />
        <ProcessingOverlay show={isProcessing} message="Submitting your Interest..." />
    <div className="mini-task-list-container">
    
      <ToastContainer/>

      {/* Hero Section */}
      <div className="mini-task-banner">
        <h1>Find Mini Tasks & Earn</h1>
        <p>Browse through short-term gigs and apply for tasks that match your skills.</p>
        {/*<button className="mini-task-browse-btn">Browse Tasks</button>*/}
      </div>

      {/* Category Cards Section */}
    {/* Category Cards Section */}
        <div className="mini-task-category-cards">
          <div
            className={`mini-task-category-card ${selectedCategory === "" ? "active" : ""}`}
              onClick={() => {
              setSelectedCategory("");
              setSelectedSubCategory("");
              }}
            >
          All
          </div>
            {Object.keys(categoryOptions).map((category) => (
          <div
           key={category}
             className={`mini-task-category-card ${selectedCategory === category ? "active" : ""}`}
              onClick={() => {
             setSelectedCategory(category);
            setSelectedSubCategory("");
          }}
         >
          {category}
          </div>
           ))}
        </div>

      {/* Header */}
      <header className="mini-task-header">
        <div className="mini-task-search-bar">
          <FaSearch className="mini-task-search-icon" />
          <input
            type="text"
            placeholder="Search for mini tasks..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <button
          className="mini-task-filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="mini-task-icon" /> Click To Apply Filters
        </button>
      </header>

      <div className="mini-task-content">
        {/* Sidebar */}
        <aside className={`mini-task-sidebar ${showFilters ? "show-sidebar" : ""}`}>
          <button className="mini-task-close-btn" onClick={() => setShowFilters(false)}>
            <FaTimes />
          </button>
          <h2 style={{color:"#fff"}}>Filters</h2>
          <select
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubCategory(""); // Reset subcategory
          }}
          >
            <option value="">All Categories</option>
           {Object.keys(categoryOptions).map((category) => (
           <option key={category} value={category}>{category}</option>
          ))}

          </select>
          {selectedCategory && (
          <select
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              value={selectedSubCategory}
            >
             <option value="">All Subcategories</option>
           {categoryOptions[selectedCategory].map((sub) => (
             <option key={sub} value={sub}>{sub}</option>
           ))}
       </select>
        )}
          <select value={selectedmodeofDelivery} onChange={(e) => setModeOfDelivery(e.target.value)}><option>All Modes</option>
          <option value='remote'>Remote</option>
          <option value='on-site'>On-site</option>
          </select>

          <label style={{ color: "#fff" }}>Region</label>
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
          <option>All Regions</option>
           <option>Greater Accra</option>
            <option>Ashanti</option>
            <option>Central</option>
            <option>Western</option>
            <option>Northern</option>
            <option>Eastern</option>
            <option>Upper East</option>
            <option>Upper West</option>
            <option>Volta</option>
            <option>Oti</option>
            <option>North East</option>
            <option>Bono</option>
            <option>Bono East</option>
            <option>Ahafo</option>
            <option>Savannah</option>
            <option>Western North</option>
         </select>

        </aside>

        {/* Task Listings */}
        <section className="mini-task-list">
          {loading ? 
            Array(6).fill(0).map((_, index) => <SkeletonLoader key={index} />
          ) : tasks.length > 0 ?(
            currentTasks.map((task) => (
              <div key={task.id} className="mini-task-card">
                <div className="mini-task-details"  onClick={() => navigate(`/view/mini_task/info/${task._id}`)}>
                  <h3 className="mini-task-title">{task.title}</h3>
                   {/* Employer + Verification */}
                  <div className="flex items-center text-sm text-gray-500 mt-1 mb-1">
                       <span>Posted by {task.employer?.name || "Anonymous"}</span>
                      {task.employer?.isVerified && (
                       <FaCheckCircle
                         className="text-blue-500 ml-1"
                         title="Verified Employer"
                       />
                         )}
                      </div>
                  <p className="mini-task-description">{task.description.slice(0,120)+"..."}</p>
                  <div className="mini-task-meta">
                    <FaClock /> {timeAgo(task.deadline)} | 
                    <span className="mini-task-budget">₵{task.budget}</span>
                  
                  </div>
                </div>

                {/*<button
                    className="mini-task-view-btn"
                    onClick={() => navigate(`/view/mini_task/info/${task._id}`)}
                  >
                    View Details
                  </button>*/}
               
              {/* <button className="mini-task-apply-btn" onClick={() => applyToTask(task._id)} disabled={isProcessing}>
                  I’m Interested
                 </button>*/}

               
                
                
               
              </div>
            ))
          ):(
            <p>No Tasks match your criteria.</p>
          )}
          {selectedTask && (
            <MiniTaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
          )}
          
        </section>
        
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Footer />
    </div>
   
    </div>
  );
};

export default MiniTaskPage;
