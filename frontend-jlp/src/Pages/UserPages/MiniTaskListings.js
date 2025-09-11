import { useState, useEffect } from "react";
import { FaSearch, FaClock, FaFilter, FaTimes,FaCheckCircle,FaMapMarkerAlt,FaTag } from "react-icons/fa";
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
import ProcessingOverlay from "../../Components/Common/ProcessingOverLay";
import Pagination from "../../Components/Common/Pagination";
import { NotificationToast } from "../../Components/Common/NotificationToast";
import MicroJobBanner from "../../Components/Ui/MicroJobBanner"

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
     
       <MicroJobBanner 
       searchQuery={searchQuery}
       onSearchChange={setSearchQuery}
       categoryQuery={selectedCategory}
       onCategoryChange={setSelectedCategory}
       onSearchSubmit={fetchTasks} // Changed to call your fetch function directly
      title="Find Quick Gigs & Earn Fast"
      subtitle="Complete micro tasks in your spare time and get paid quickly."
      theme="blue"
      categoryOptions={categoryOptions}
      />

    
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
        <button
          className="mini-task-filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="mini-task-icon" /> Click To Apply Filters
        </button>
      </header>

      <div className="mini-task-content">
        {/* Sidebar */}
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
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubCategory(""); // Reset subcategory
          }}
          className="
            w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-slate-100
          "
        >
          <option className="bg-slate-800" value="">All Categories</option>
          {Object.keys(categoryOptions).map((category) => (
            <option className="bg-slate-800" key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory filter (conditionally rendered) */}
      {selectedCategory && (
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Subcategory
          </label>
          <select
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            value={selectedSubCategory}
            className="
              w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              text-slate-100
            "
          >
            <option className="bg-slate-800" value="">All Subcategories</option>
            {categoryOptions[selectedCategory].map((sub) => (
              <option className="bg-slate-800" key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Mode of Delivery filter */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Mode of Delivery
        </label>
        <select 
          value={selectedmodeofDelivery} 
          onChange={(e) => setModeOfDelivery(e.target.value)}
          className="
            w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-slate-100
          "
        >
          <option className="bg-slate-800" value="">All Modes</option>
          <option className="bg-slate-800" value="remote">Remote</option>
          <option className="bg-slate-800" value="on-site">On-site</option>
        </select>
      </div>

      {/* Region filter */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Region
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
        {/* Task Listings */}
<section className="mini-task-list">
  {loading ? (
    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6 p-4">
      {Array(6).fill(0).map((_, index) => <SkeletonLoader key={index} />)}
    </div>
  ) : tasks.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6 p-4">
      {currentTasks.map((task) => (
        <div 
          key={task._id} 
          className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
          onClick={() => navigate(`/view/mini_task/info/${task._id}`)}
        >
          {/* Card Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {task.title}
                </h3>
                
                {/* Employer Info */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {task.employer?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span>{task.employer?.name || 'Anonymous'}</span>
                    {task.employer?.isVerified && (
                      <FaCheckCircle className="text-blue-500 text-xs ml-1" title="Verified Employer" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Budget Badge */}
              <div className="flex flex-col items-end gap-2">
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200 shadow-sm">
                  ₵{task.budget}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {task.description.length > 120 ? task.description.slice(0, 120) + "..." : task.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {task.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200">
                  <FaTag className="text-xs" />
                  {task.subcategory || task.category}
                </span>
              )}
              {task.location && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-md text-xs font-medium border border-gray-200">
                  <FaMapMarkerAlt className="text-xs" />
                  {task.location}
                </span>
              )}
              {task.modeofDelivery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium border border-purple-200">
                  {task.modeofDelivery === 'remote' ? '💻' : '📍'}
                  {task.modeofDelivery}
                </span>
              )}
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FaClock className="text-xs" />
                  <span>{timeAgo(task.deadline)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-blue-600 text-sm font-medium group-hover:gap-3 transition-all duration-200">
                <span>View Details</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500">No tasks match your current criteria. Try adjusting your filters.</p>
      </div>
    </div>
  )}
</section>
          <NotificationToast/>
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
