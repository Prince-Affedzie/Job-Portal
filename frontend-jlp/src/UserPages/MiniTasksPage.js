import { useState, useEffect } from "react";
import { FaSearch, FaClock, FaFilter, FaTimes } from "react-icons/fa";
import { getMiniTasks } from "../APIS/API";
import "../Styles/MiniTaskPage.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import moment from "moment";
import debounce from "lodash.debounce"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SkeletonLoader from "../Components/SkeletonLoader";
import MiniTaskDetailsModal from "../Components/MiniTaskDetailsModal";
import { applyToMiniTask } from "../APIS/API";

const MiniTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask,setSelectedTask] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

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
           subcategory:selectedSubCategory
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
    try{
       const response = await applyToMiniTask(Id)
       if(response.status ===200){
        toast.success("Application Successful")
       }else{
        toast.error("An Error Occured. Please try again Later")
       }
    }catch(error){
       const errorMessage =
                 error.response?.data?.message ||
                error.response?.data?.error ||
                 "An unexpected error occurred. Please try again.";
                console.log(errorMessage);
                  toast.error(errorMessage);
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
    }, [selectedCategory,selectedSubCategory]);

  // Format time ago
  const timeAgo = (deadline) => {
    return deadline ? moment(deadline).fromNow() : "N/A";
  };

  return (
    <div className="mini-task-container">
      <Navbar />
      <ToastContainer/>

      {/* Hero Section */}
      <div className="mini-task-banner">
        <h1>Find Mini Tasks & Earn</h1>
        <p>Browse through short-term gigs and apply for tasks that match your skills.</p>
        <button className="mini-task-browse-btn">Browse Tasks</button>
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
          <FaFilter className="mini-task-icon" /> Filters
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
          <select><option>All Types</option><option>Remote</option></select>
        </aside>

        {/* Task Listings */}
        <section className="mini-task-list">
          {loading ? 
            Array(6).fill(0).map((_, index) => <SkeletonLoader key={index} />
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="mini-task-card">
                <div className="mini-task-details" onClick={() => setSelectedTask(task)}>
                  <h3 className="mini-task-title">{task.title}</h3>
                  <p className="mini-task-description">{task.description}</p>
                  <div className="mini-task-meta">
                    <FaClock /> {timeAgo(task.deadline)} | 
                    <span className="mini-task-budget">₵{task.budget}</span>
                  </div>
                </div>
                <button className="mini-task-apply-btn" onClick={()=> applyToTask(task._id)}>Apply Now</button>
               
              </div>
            ))
          )}
          {selectedTask && (
            <MiniTaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
          )}
          
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default MiniTaskPage;
