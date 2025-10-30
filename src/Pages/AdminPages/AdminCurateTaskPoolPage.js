import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  Users,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Clock,
  UserCheck,
  X,
  Shield,
  Loader,
} from "lucide-react";
import { getSingleMinitask } from '../../APIS/API';
import { curateTaskPool, getAllTaskers } from '../../APIS/adminApi';
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import debounce from "lodash/debounce";

const AdminCurateTaskpoolPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [curating, setCurating] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showMessage, setShowMessage] = useState({ type: '', text: '', show: false });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    skills: [],
    location: '',
    minRating: 0,
    maxDistance: 50,
    availability: 'all',
  });
  const [matchedTaskers, setMatchedTaskers] = useState([]);
  const [selectedTaskers, setSelectedTaskers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allTaskers, setAllTaskers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const showNotification = useCallback((type, text) => {
    setShowMessage({ type, text, show: true });
    setTimeout(() => setShowMessage({ type: '', text: '', show: false }), 4000);
  }, []);

  const formatTaskerData = (tasker) => {
    const locationString = tasker.location
      ? [tasker.location.region, tasker.location.city, tasker.location.town, tasker.location.street]
          .filter(field => field && typeof field === 'string')
          .join(', ')
      : 'Location not specified';

    return {
      _id: tasker._id || '',
      name: tasker.name || 'Unknown Tasker',
      email: tasker.email || 'No email',
      phone: tasker.phone || 'No phone',
      rating: tasker.rating || 0,
      skills: Array.isArray(tasker.skills) ? tasker.skills : [],
      location: locationString,
      completedTasks: tasker.numberOfRatings || 0,
      responseRate: tasker.responseRate || 0,
      profileImage: tasker.profileImage || undefined,
      isActive: tasker.isActive || false,
      isVerified: tasker.isVerified || false,
    };
  };

  // Function to filter taskers based on search and filters
  const filterTaskers = useCallback((taskers, query, filterOptions) => {
    let filtered = [...taskers];

    // Search query filter
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(tasker => {
        const searchableFields = [
          tasker.name || '',
          tasker.email || '',
          tasker.phone || '',
          tasker.location || '',
          ...(tasker.skills || []),
        ].filter(field => typeof field === 'string');
        return searchableFields.some(field => field.toLowerCase().includes(q));
      });
    }

    // Rating filter
    if (filterOptions.minRating > 0) {
      filtered = filtered.filter(tasker => (tasker.rating || 0) >= filterOptions.minRating);
    }

    // Skills filter
    if (filterOptions.skills && filterOptions.skills.length > 0) {
      filtered = filtered.filter(tasker => {
        const taskerSkills = (tasker.skills || []).map(s => s.toLowerCase());
        return filterOptions.skills.some(skill => taskerSkills.includes(skill.toLowerCase()));
      });
    }

    // Availability filter
    if (filterOptions.availability === 'available') {
      filtered = filtered.filter(tasker => tasker.isActive);
    } else if (filterOptions.availability === 'verified') {
      filtered = filtered.filter(tasker => tasker.isVerified);
    }

    return filtered;
  }, []);

  const fetchAllTaskers = async () => {
    try {
      setLoading(true);
      const res = await getAllTaskers();
      if (res.status === 200) {
        const taskers = res.data.map(formatTaskerData) || [];
        console.log('Fetched taskers:', taskers);
        setAllTaskers(taskers);
        // Initially show all taskers
        setMatchedTaskers(taskers);
      } else {
        showNotification("error", "Failed to load taskers: Invalid response");
        setAllTaskers([]);
        setMatchedTaskers([]);
      }
    } catch (error) {
      console.error("Failed to fetch taskers:", error);
      showNotification("error", "Failed to load taskers");
      setAllTaskers([]);
      setMatchedTaskers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMiniTask = async () => {
    try {
      const res = await getSingleMinitask(taskId);
      if (res.status === 200) {
        setTask(res.data);
        // Don't automatically filter by skills - let admin choose
        // setFilters(prev => ({
        //   ...prev,
        //   skills: (res.data.skillsRequired || []).map(skill => skill.toLowerCase()),
        // }));
      } else {
        showNotification("error", "Failed to fetch task details: Invalid response");
      }
    } catch (error) {
      console.error("Failed to fetch task:", error);
      showNotification("error", "Failed to fetch task details");
    }
  };

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((query, filterOptions, taskers) => {
        console.log('Debounced search - Query:', query, 'Filters:', filterOptions, 'Taskers count:', taskers.length);
        setSearching(true);
        try {
          const filtered = filterTaskers(taskers, query, filterOptions);
          console.log('Filtered taskers:', filtered);
          setMatchedTaskers(filtered);
          setCurrentPage(1); // Reset to first page
        } catch (error) {
          console.error("Error in debounced search:", error);
          showNotification("error", "Failed to search taskers");
        } finally {
          setSearching(false);
        }
      }, 300),
    [filterTaskers, showNotification]
  );

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      await fetchAllTaskers();
      if (taskId) {
        await fetchMiniTask();
      }
    };
    initializeData();
  }, [taskId]);

  // Apply filters whenever search query, filters, or allTaskers change
  useEffect(() => {
    if (allTaskers.length > 0) {
      console.log('Applying filters - Query:', searchQuery, 'Filters:', filters, 'All taskers:', allTaskers.length);
      debouncedSearch(searchQuery, filters, allTaskers);
    }
    
    // Cleanup function
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, filters, allTaskers, debouncedSearch]);

  const handleCurateTaskpool = async () => {
    if (selectedTaskers.length === 0) {
      showNotification("error", "Please select at least one tasker");
      return;
    }

    try {
      setCurating(true);
      const selectedTaskerIds = selectedTaskers.map(tasker => tasker._id);
      const res = await curateTaskPool(taskId, { taskerIds: selectedTaskerIds });

      if (res.status === 200) {
        showNotification("success", `Taskpool curated successfully! ${selectedTaskers.length} taskers notified.`);
        setTimeout(() => navigate(`/admin/${taskId}/mini_task_info`), 2000);
      } else {
        showNotification("error", "Failed to curate taskpool: Invalid response");
      }
    } catch (error) {
        const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred";
      console.error("Failed to curate taskpool:", error);
      toast.error(errorMessage)
    } finally {
      setCurating(false);
    }
  };

  const toggleTaskerSelection = useCallback((tasker) => {
    setSelectedTaskers(prev =>
      prev.some(t => t._id === tasker._id)
        ? prev.filter(t => t._id !== tasker._id)
        : [...prev, tasker]
    );
  }, []);

  const paginatedTaskers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return matchedTaskers.slice(start, start + itemsPerPage);
  }, [matchedTaskers, currentPage]);

  const toggleSelectAll = useCallback(() => {
    setSelectedTaskers(prev =>
      prev.length === paginatedTaskers.length ? [] : [...paginatedTaskers]
    );
  }, [paginatedTaskers]);

  const getStatusConfig = (status) => {
    const configs = {
      Pending: { color: "text-gray-700 bg-gray-100 border-gray-300", icon: Clock },
      Open: { color: "text-emerald-700 bg-emerald-100 border-emerald-300", icon: Award },
      "In-progress": { color: "text-blue-700 bg-blue-100 border-blue-300", icon: Clock },
      Completed: { color: "text-green-700 bg-green-100 border-green-300", icon: CheckCircle },
    };
    return configs[status] || { color: "text-gray-700 bg-gray-100 border-gray-300", icon: Clock };
  };

  const handleManualSearch = () => {
    setSearching(true);
    try {
      const filtered = filterTaskers(allTaskers, searchQuery, filters);
      setMatchedTaskers(filtered);
      setCurrentPage(1);
      console.log('Manual search completed. Found:', filtered.length, 'taskers');
    } catch (error) {
      console.error("Error in manual search:", error);
      showNotification("error", "Failed to search taskers");
    } finally {
      setSearching(false);
    }
  };

  const totalPages = Math.ceil(matchedTaskers.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <AdminNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="flex-1 flex items-center justify-center">
            <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = task ? getStatusConfig(task.status) : { color: '', icon: Clock };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <NotificationCenter />
      <ToastContainer/>
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        
        {showMessage.show && (
          <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            showMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`} role="alert">
            <div className="flex items-center space-x-2">
              {showMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span>{showMessage.text}</span>
              <button onClick={() => setShowMessage({ type: '', text: '', show: false })} className="ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate(`/admin/${taskId}/mini_task_info`)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label="Back to task"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back to Task</span>
                    </button>
                    <div className="h-6 w-px bg-gray-300" />
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">Curate Taskpool</h1>
                      <p className="text-gray-600">
                        Select qualified taskers for: <strong>{task?.title || 'Task'}</strong>
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                    <statusConfig.icon className="w-4 h-4 mr-1" />
                    {task?.status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-1 sticky top-20 h-fit">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-500" />
                    Task Requirements
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Skills Required</p>
                      <div className="flex flex-wrap gap-1">
                        {task?.skillsRequired?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Budget</p>
                      <p className="font-medium text-gray-900">
                        GHS {task?.budget?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {task?.locationType === 'remote' ? 'Remote' : task?.address?.city || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-blue-500" />
                    Filters
                  </h3>
                  <div className="space-y-4">
                    {task?.skillsRequired && task.skillsRequired.length > 0 && (
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                          <input
                            type="checkbox"
                            checked={filters.skills.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({
                                  ...prev,
                                  skills: (task.skillsRequired || []).map(skill => skill.toLowerCase()),
                                }));
                              } else {
                                setFilters(prev => ({
                                  ...prev,
                                  skills: [],
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Match Task Skills</span>
                        </label>
                        {filters.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {filters.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Taskers
                      </label>
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by name, email, phone, skills, location..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          aria-label="Search taskers"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Rating
                      </label>
                      <select
                        value={filters.minRating}
                        onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        aria-label="Minimum rating filter"
                      >
                        <option value={0}>Any Rating</option>
                        <option value={3}>3.0+ Stars</option>
                        <option value={4}>4.0+ Stars</option>
                        <option value={4.5}>4.5+ Stars</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                      </label>
                      <select
                        value={filters.availability}
                        onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        aria-label="Availability filter"
                      >
                        <option value="all">All Taskers</option>
                        <option value="available">Available Now</option>
                        <option value="verified">Verified Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Distance (km)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.maxDistance}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
                        className="w-full"
                        aria-label="Maximum distance filter"
                      />
                      <span className="text-sm text-gray-600">{filters.maxDistance} km</span>
                    </div>
                    <button
                      onClick={handleManualSearch}
                      disabled={searching}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                      aria-label="Search taskers button"
                    >
                      {searching ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      <span>{searching ? "Searching..." : "Search Taskers"}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-3 space-y-6">
                {selectedTaskers.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Selected Taskers ({selectedTaskers.length})
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Ready to notify selected taskers
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setSelectedTaskers([])}
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                          aria-label="Clear all selected taskers"
                        >
                          <X className="w-4 h-4" />
                          <span>Clear All</span>
                        </button>
                        <button
                          onClick={handleCurateTaskpool}
                          disabled={curating}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                          aria-label="Curate taskpool"
                        >
                          {curating ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              <span>Curating...</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4" />
                              <span>Curate Taskpool</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedTaskers.map(tasker => (
                        <div
                          key={tasker._id}
                          className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">{tasker.name}</span>
                          <button
                            onClick={() => toggleTaskerSelection(tasker)}
                            className="text-green-600 hover:text-green-800"
                            aria-label={`Remove ${tasker.name} from selection`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">
                      Matching Taskers ({matchedTaskers.length})
                    </h3>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={toggleSelectAll}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        aria-label={selectedTaskers.length === paginatedTaskers.length ? "Deselect all taskers" : "Select all taskers"}
                      >
                        {selectedTaskers.length === paginatedTaskers.length ? "Deselect All" : "Select All"}
                      </button>
                      <p className="text-gray-600 text-sm">
                        {allTaskers.length} total taskers available
                      </p>
                    </div>
                  </div>

                  {searching ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
                    </div>
                  ) : paginatedTaskers.length > 0 ? (
                    <div className="space-y-4">
                      {paginatedTaskers.map(tasker => (
                        <div
                          key={tasker._id}
                          className={`p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
                            selectedTaskers.some(t => t._id === tasker._id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                          onClick={() => toggleTaskerSelection(tasker)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && toggleTaskerSelection(tasker)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                  selectedTaskers.some(t => t._id === tasker._id)
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-gray-300 hover:border-green-500'
                                }`}
                              >
                                {selectedTaskers.some(t => t._id === tasker._id) && (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                              </div>
                              {tasker.profileImage ? (
                                <img
                                  src={tasker.profileImage}
                                  alt={tasker.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Users className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold text-gray-900 text-lg">{tasker.name}</h4>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="font-medium text-gray-700">{tasker.rating.toFixed(1)}</span>
                                  </div>
                                  {tasker.isVerified && <Shield className="w-4 h-4 text-green-500" />}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{tasker.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{tasker.phone}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{tasker.location}</span>
                                  </div>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {tasker.skills.map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="text-sm text-gray-600">
                                <strong>{tasker.completedTasks}</strong> tasks
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>{tasker.responseRate}%</strong> response
                              </div>
                              {tasker.isActive && (
                                <div className="text-xs text-green-600 font-medium">Available</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No taskers found</h3>
                      <p className="text-gray-500 mb-6">
                        {allTaskers.length === 0
                          ? "No taskers available in the system. Please check the database or API."
                          : "Adjust your filters or search criteria to find matching taskers."}
                      </p>
                      <button
                        onClick={handleManualSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                        aria-label="Retry search"
                      >
                        Search Taskers
                      </button>
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="mt-6 flex justify-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                        aria-label="Previous page"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                        aria-label="Next page"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCurateTaskpoolPage;