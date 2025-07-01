import React from "react";
import { 
  FaSearch, 
  FaFilter, 
  FaUsers, 
  FaClock,
  FaChevronDown 
} from "react-icons/fa";

const ApplicantsControls = ({ 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus 
}) => {
  // Status options with icons and colors
  const statusOptions = [
    { value: "all", label: "All Applicants", icon: FaUsers, color: "text-slate-600" },
    { value: "reviewing", label: "Reviewing", icon: FaClock, color: "text-amber-600" },
    { value: "shortlisted", label: "Shortlisted", icon: FaUsers, color: "text-blue-600" },
    { value: "interview", label: "Interviewing", icon: FaClock, color: "text-purple-600" },
    { value: "offered", label: "Offered", icon: FaUsers, color: "text-green-600" },
    { value: "rejected", label: "Rejected", icon: FaUsers, color: "text-red-600" }
  ];

  const currentStatus = statusOptions.find(option => option.value === filterStatus);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      {/* Header */}
     {/* <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <FaFilter className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Filter & Search</h3>
          <p className="text-sm text-slate-600">Find and organize applicants</p>
        </div>
      </div> */}

      {/* Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Search Box */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Search Applicants
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-2 text-xs text-slate-500">
              Press Esc or click × to clear search
            </p>
          )}
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Filter by Status
          </label>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-400 cursor-pointer"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <FaChevronDown className="text-slate-400" />
            </div>
          </div>
          
          {/* Status Indicator */}
          {currentStatus && (
            <div className="mt-2 flex items-center gap-2">
              <currentStatus.icon className={`text-xs ${currentStatus.color}`} />
              <span className="text-xs text-slate-600">
                Showing {currentStatus.label.toLowerCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-slate-600">Active Search</span>
          </div>
          
          {searchTerm && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-slate-600">
                Searching: "<span className="font-medium text-slate-800">{searchTerm}</span>"
              </span>
            </div>
          )}
          
          {filterStatus !== 'all' && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-600">
                Filter: <span className="font-medium text-slate-800">
                  {currentStatus?.label}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsControls;