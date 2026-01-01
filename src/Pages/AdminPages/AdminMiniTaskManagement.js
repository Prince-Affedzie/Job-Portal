import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMiniTasks, adminDeleteMiniTask } from "../../APIS/API";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import dayjs from "dayjs";

// Icons (using Heroicons)
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  TagIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";

const statusOptions = ["Open", "In-progress", "Assigned", "Completed", "Closed", "Pending"];
const locationOptions = ["remote", "on-site"];
const categoryOptions = [
  "Home Services", "Delivery & Errands", "Digital Services", "Writing & Assistance",
  "Learning & Tutoring", "Creative Tasks", "Event Support", "Others"
];

const statusConfig = {
  Open: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "○" },
  "In-progress": { color: "bg-blue-50 text-blue-700 border-blue-200", icon: "↻" },
  Assigned: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: "👤" },
  Completed: { color: "bg-green-50 text-green-700 border-green-200", icon: "✓" },
  Closed: { color: "bg-gray-100 text-gray-700 border-gray-200", icon: "✕" },
  Pending: { color: "bg-purple-50 text-purple-700 border-purple-200", icon: "⏱" },
};

const locationConfig = {
  remote: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: "🌐" },
  "on-site": { color: "bg-orange-50 text-orange-700 border-orange-200", icon: "📍" },
};

const AdminManageMiniTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    totalBudget: 0
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(10);
  const [pageInput, setPageInput] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [locationType, setLocationType] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getAllMiniTasks();
      if (res.status === 200) {
        const tasksData = res.data;
        setTasks(tasksData);
        setFiltered(tasksData);
        
        // Calculate stats
        const statsData = {
          total: tasksData.length,
          open: tasksData.filter(t => t.status === "Open").length,
          inProgress: tasksData.filter(t => t.status === "In-progress").length,
          completed: tasksData.filter(t => t.status === "Completed").length,
          totalBudget: tasksData.reduce((sum, task) => sum + (parseFloat(task.budget) || 0), 0)
        };
        setStats(statsData);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await adminDeleteMiniTask(id);
      if (res.status === 200) {
        setDeleteConfirm(null);
        fetchTasks();
      }
    } catch {
      console.error("Failed to delete task");
    }
  };

  const applyFilters = () => {
    let result = [...tasks];
    
    // Apply filters
    if (search) result = result.filter((t) => 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
    );
    if (status) result = result.filter((t) => t.status === status);
    if (locationType) result = result.filter((t) => t.locationType === locationType);
    if (category) result = result.filter((t) => t.category === category);
    
    // Apply sorting
    result.sort((a, b) => {
      switch(sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "budget_high":
          return (parseFloat(b.budget) || 0) - (parseFloat(a.budget) || 0);
        case "budget_low":
          return (parseFloat(a.budget) || 0) - (parseFloat(b.budget) || 0);
        case "deadline":
          return new Date(a.deadline) - new Date(b.deadline);
        default:
          return 0;
      }
    });
    
    setFiltered(result);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setLocationType("");
    setCategory("");
    setSortBy("newest");
    setFiltered(tasks);
    setCurrentPage(1);
    setMobileFiltersOpen(false);
  };

  useEffect(() => {
    applyFilters();
  }, [search, status, locationType, category, sortBy, tasks]);

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filtered.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filtered.length / tasksPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) endPage = 4;
      else if (currentPage >= totalPages - 2) startPage = totalPages - 3;
      
      if (startPage > 2) pageNumbers.push("ellipsis1");
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (endPage < totalPages - 1) pageNumbers.push("ellipsis2");
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <NotificationCenter />
      
      <div className="lg:pl-64 flex flex-col flex-1">
        <AdminNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Task Management</h1>
                <p className="text-gray-600 mt-1">Monitor and manage all tasks in the platform</p>
              </div>
              <button
                onClick={fetchTasks}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
                  <TagIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 mr-4">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Open Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-amber-50 text-amber-600 mr-4">
                  <CurrencyDollarIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">GHS {stats.totalBudget.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Filters Header */}
            <div className="p-5 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="relative max-w-lg">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tasks by title or description..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="hidden md:block">
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="budget_high">Budget (High to Low)</option>
                      <option value="budget_low">Budget (Low to High)</option>
                      <option value="deadline">Deadline (Soonest)</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    className="md:hidden flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FunnelIcon className="h-5 w-5 mr-2" />
                    Filters
                  </button>
                  
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              {/* Mobile Filters */}
              <div className={`mt-4 ${mobileFiltersOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locationOptions.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  
                  <select
                    className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Desktop Filters Bar */}
            <div className="hidden md:flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FunnelIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Filters:</span>
                </div>
                
                <select
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                
                <select
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locationOptions.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                
                <select
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                </select>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>{filtered.length} tasks found</span>
                <select
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                  value={tasksPerPage}
                  onChange={(e) => {
                    setTasksPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>

            {/* Tasks List */}
            <div className="p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading tasks...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <TagIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentTasks.map((task) => (
                    <div key={task._id} className="border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200">
                      <div className="p-5">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          {/* Task Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className={`p-2.5 rounded-lg ${statusConfig[task.status]?.color || "bg-gray-100"}`}>
                                <span className="text-sm font-medium">{statusConfig[task.status]?.icon || "○"}</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{task.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    <TagIcon className="h-3 w-3 mr-1.5" />
                                    {task.category}
                                  </span>
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${locationConfig[task.locationType]?.color || "bg-gray-100"}`}>
                                    <MapPinIcon className="h-3 w-3 mr-1.5" />
                                    {task.locationType}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">{task.description || "No description provided"}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Task Stats & Actions */}
                          <div className="lg:w-64">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center text-gray-500 mb-1">
                                  <CurrencyDollarIcon className="h-4 w-4 mr-1.5" />
                                  <span className="text-xs">Budget</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900">GHS {task.budget}</p>
                              </div>
                              
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center text-gray-500 mb-1">
                                  <CalendarIcon className="h-4 w-4 mr-1.5" />
                                  <span className="text-xs">Deadline</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                  {dayjs(task.deadline).format("MMM DD")}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusConfig[task.status]?.color || "bg-gray-100"}`}>
                                  {task.status}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => navigate(`/admin/${task._id}/mini_task_info`)}
                                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View details"
                                >
                                  <EyeIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => navigate(`/admin/${task._id}/modify_min_task`)}
                                  className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                  title="Edit task"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(task._id)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete task"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                                
                                <button
                                  onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  {expandedTask === task._id ? (
                                    <ChevronUpIcon className="h-5 w-5" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded Details */}
                        {expandedTask === task._id && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Task Details</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{task.description || "No description provided"}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Created</span>
                                    <span className="font-medium">{dayjs(task.createdAt).format("MMM DD, YYYY")}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Last Updated</span>
                                    <span className="font-medium">{dayjs(task.updatedAt).format("MMM DD, YYYY")}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Deadline</span>
                                    <span className="font-medium text-amber-600">{dayjs(task.deadline).format("MMM DD, YYYY")}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{indexOfFirstTask + 1}-{Math.min(indexOfLastTask, filtered.length)}</span> of{" "}
                    <span className="font-medium">{filtered.length}</span> tasks
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border ${
                        currentPage === 1
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400"
                      }`}
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    
                    {getPageNumbers().map((pageNumber, index) => (
                      pageNumber === "ellipsis1" || pageNumber === "ellipsis2" ? (
                        <span key={index} className="px-3 py-2 text-gray-400">
                          <EllipsisHorizontalIcon className="h-5 w-5" />
                        </span>
                      ) : (
                        <button
                          key={index}
                          onClick={() => paginate(pageNumber)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium min-w-[2.5rem] ${
                            currentPage === pageNumber
                              ? "bg-blue-600 text-white border border-blue-600"
                              : "border border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border ${
                        currentPage === totalPages
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400"
                      }`}
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setDeleteConfirm(null)} />
            
            <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white rounded-2xl shadow-xl transform transition-all">
              <div className="flex items-center mb-5">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                  <TrashIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">Are you sure you want to delete this task? All associated data will be permanently removed.</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageMiniTasks;