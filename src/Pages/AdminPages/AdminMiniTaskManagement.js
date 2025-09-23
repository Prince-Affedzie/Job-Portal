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
  EllipsisHorizontalIcon
} from "@heroicons/react/24/outline";

const statusOptions = ["Open", "In-progress", "Assigned", "Completed", "Closed","Pending"];
const locationOptions = ["remote", "on-site"];
const categoryOptions = [
  "Home Services", "Delivery & Errands", "Digital Services", "Writing & Assistance",
  "Learning & Tutoring", "Creative Tasks", "Event Support", "Others"
];

const statusColorMap = {
  Open: "bg-green-100 text-green-800",
  "In-progress": "bg-blue-100 text-blue-800",
  Assigned: "bg-orange-100 text-orange-800",
  Completed: "bg-yellow-100 text-yellow-800",
  Closed: "bg-red-100 text-red-800",
};

const locationColorMap = {
  remote: "bg-purple-100 text-purple-800",
  "on-site": "bg-indigo-100 text-indigo-800",
};

const AdminManageMiniTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(8);
  const [pageInput, setPageInput] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [locationType, setLocationType] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getAllMiniTasks();
      if (res.status === 200) {
        setTasks(res.data);
        setFiltered(res.data);
        setCurrentPage(1); // Reset to first page when data changes
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
    if (search) result = result.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
    if (status) result = result.filter((t) => t.status === status);
    if (locationType) result = result.filter((t) => t.locationType === locationType);
    if (category) result = result.filter((t) => t.category === category);
    setFiltered(result);
    setCurrentPage(1); // Reset to first page when filters change
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setLocationType("");
    setCategory("");
    setFiltered(tasks);
    setCurrentPage(1); // Reset to first page when clearing filters
    setMobileFiltersOpen(false);
  };

  // Auto-apply filters when any filter value changes
  useEffect(() => {
    applyFilters();
  }, [search, status, locationType, category, tasks]);

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filtered.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filtered.length / tasksPerPage);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // Handle page input change
  const handlePageInput = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) > 0 && Number(value) <= totalPages)) {
      setPageInput(value);
    }
  };

  // Handle page input submit
  const handlePageSubmit = (e) => {
    e.preventDefault();
    if (pageInput) {
      paginate(Number(pageInput));
      setPageInput("");
    }
  };

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis1");
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis2");
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      <NotificationCenter/>
      
      <div className="lg:pl-64 flex flex-col flex-1">
        <AdminNavbar 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-hidden">
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Manage Mini Tasks</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">View and manage all mini tasks in the system</p>
          </div>

          {/* Mobile filter button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
              {(status || locationType || category || search) && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Filters Section */}
          <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block bg-white rounded-lg shadow mb-4 md:mb-6 p-4 md:p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search by title
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <XMarkIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All statuses</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location Type
                </label>
                <select
                  id="location"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                >
                  <option value="">All locations</option>
                  {locationOptions.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All categories</option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <FunnelIcon className="h-4 w-4 mr-1" />
                Showing {filtered.length} of {tasks.length} tasks
              </div>
              
              {/* Items per page selector */}
              <div className="flex items-center">
                <label htmlFor="tasksPerPage" className="text-sm text-gray-500 mr-2">
                  Show:
                </label>
                <select
                  id="tasksPerPage"
                  className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={tasksPerPage}
                  onChange={(e) => {
                    setTasksPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="8">8</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tasks Grid/List */}
          {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <div className="mt-6">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {currentTasks.map((task) => (
                  <div key={task._id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{task.category}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[task.status] || "bg-gray-100 text-gray-800"}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Budget</p>
                          <p className="text-sm font-medium text-gray-900">GHS {task.budget}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Deadline</p>
                          <p className="text-sm font-medium text-gray-900">{dayjs(task.deadline).format("MMM DD, YYYY")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${locationColorMap[task.locationType] || "bg-gray-100 text-gray-800"}`}>
                            {task.locationType}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <button
                          onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                        >
                          {expandedTask === task._id ? (
                            <>
                              Less details <ChevronUpIcon className="h-4 w-4 ml-1" />
                            </>
                          ) : (
                            <>
                              More details <ChevronDownIcon className="h-4 w-4 ml-1" />
                            </>
                          )}
                        </button>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/${task._id}/mini_task_info`)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                            title="View details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/${task._id}/modify_min_task`)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                            title="Edit task"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(task._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Delete task"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      {expandedTask === task._id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Task Description</h4>
                              <p className="text-sm text-gray-500 mt-1">{task.description || "No description provided"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Additional Information</h4>
                              <p className="text-sm text-gray-500 mt-1">Created: {dayjs(task.createdAt).format("MMM DD, YYYY")}</p>
                              <p className="text-sm text-gray-500">Last updated: {dayjs(task.updatedAt).format("MMM DD, YYYY")}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="bg-white rounded-lg shadow px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstTask + 1}</span> to{" "}
                        <span className="font-medium">
                          {indexOfLastTask > filtered.length ? filtered.length : indexOfLastTask}
                        </span> of{" "}
                        <span className="font-medium">{filtered.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                            currentPage === 1 
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                              : "bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        
                        {/* Page numbers */}
                        {getPageNumbers().map((pageNumber, index) => 
                          pageNumber === "ellipsis1" || pageNumber === "ellipsis2" ? (
                            <span
                              key={index}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              <EllipsisHorizontalIcon className="h-5 w-5" />
                            </span>
                          ) : (
                            <button
                              key={index}
                              onClick={() => paginate(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNumber
                                  ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          )
                        )}
                        
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                            currentPage === totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Quick page jump */}
              {totalPages > 5 && (
                <div className="mt-4 flex justify-center">
                  <form onSubmit={handlePageSubmit} className="flex items-center">
                    <label htmlFor="pageJump" className="text-sm text-gray-700 mr-2">
                      Go to page:
                    </label>
                    <input
                      type="number"
                      id="pageJump"
                      min="1"
                      max={totalPages}
                      value={pageInput}
                      onChange={handlePageInput}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder="#"
                    />
                    <button
                      type="submit"
                      className="ml-2 px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Go
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Task
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this task? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
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