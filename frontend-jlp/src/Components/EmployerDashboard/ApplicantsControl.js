import React from "react";
import { 
  FaSearch, 
  FaFilter, 
  FaUsers, 
  FaClock,
  FaChevronDown,
  FaSortAmountDown,
  FaSortNumericDown,
  FaStar,
  FaBriefcase
} from "react-icons/fa";

const ApplicantsControls = ({ 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  scoreFilters,
  setScoreFilters
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

  // Sort options with icons
  const sortOptions = [
    { value: "dateApplied", label: "Applied Date", icon: FaClock },
    { value: "name", label: "Name", icon: FaUsers },
    { value: "totalScore", label: "Total Score", icon: FaStar },
    { value: "skillsScore", label: "Skills Score", icon: FaSortNumericDown },
    { value: "experience", label: "Experience", icon: FaBriefcase }
  ];

  const currentStatus = statusOptions.find(option => option.value === filterStatus);
  const currentSort = sortOptions.find(option => option.value === sortBy);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 mt-8">
      {/* Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
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
        </div>

        {/* Sort Control */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Sort By
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-400 cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <FaSortAmountDown className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Score Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
        {/* Total Score Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Min Total Score ({scoreFilters.minTotalScore || '0'}%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={scoreFilters.minTotalScore || 0}
              onChange={(e) => setScoreFilters({
                ...scoreFilters,
                minTotalScore: Number(e.target.value)
              })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={() => setScoreFilters({
                ...scoreFilters,
                minTotalScore: null
              })}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Skills Score Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Min Skills Score ({scoreFilters.minSkillsScore || '0'}%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={scoreFilters.minSkillsScore || 0}
              onChange={(e) => setScoreFilters({
                ...scoreFilters,
                minSkillsScore: Number(e.target.value)
              })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={() => setScoreFilters({
                ...scoreFilters,
                minSkillsScore: null
              })}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Min Experience ({scoreFilters.minExperience || '0'} yrs)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="20"
              value={scoreFilters.minExperience || 0}
              onChange={(e) => setScoreFilters({
                ...scoreFilters,
                minExperience: Number(e.target.value)
              })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={() => setScoreFilters({
                ...scoreFilters,
                minExperience: null
              })}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Bar */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort Indicator */}
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
            <currentSort.icon className="text-blue-600 text-xs" />
            <span className="text-xs text-blue-800">
              Sorted by: {currentSort?.label} ({sortOrder === 'asc' ? '↑' : '↓'})
            </span>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            >
              {sortOrder === 'asc' ? 'Switch to Descending' : 'Switch to Ascending'}
            </button>
          </div>

          {/* Active Filters */}
          {searchTerm && (
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full">
              <FaSearch className="text-amber-600 text-xs" />
              <span className="text-xs text-amber-800">
                Search: "{searchTerm}"
              </span>
              <button
                onClick={() => setSearchTerm('')}
                className="text-amber-600 hover:text-amber-800 text-xs"
              >
                ×
              </button>
            </div>
          )}

          {filterStatus !== 'all' && (
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
              <currentStatus.icon className={`text-xs ${currentStatus.color}`} />
              <span className="text-xs text-green-800">
                Status: {currentStatus?.label}
              </span>
              <button
                onClick={() => setFilterStatus('all')}
                className="text-green-600 hover:text-green-800 text-xs"
              >
                ×
              </button>
            </div>
          )}

          {/* Score Filters Indicators */}
          {scoreFilters.minTotalScore !== null && (
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
              <FaStar className="text-purple-600 text-xs" />
              <span className="text-xs text-purple-800">
                Min Total: {scoreFilters.minTotalScore}%
              </span>
              <button
                onClick={() => setScoreFilters({
                  ...scoreFilters,
                  minTotalScore: null
                })}
                className="text-purple-600 hover:text-purple-800 text-xs"
              >
                ×
              </button>
            </div>
          )}

          {scoreFilters.minSkillsScore !== null && (
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
              <FaSortNumericDown className="text-indigo-600 text-xs" />
              <span className="text-xs text-indigo-800">
                Min Skills: {scoreFilters.minSkillsScore}%
              </span>
              <button
                onClick={() => setScoreFilters({
                  ...scoreFilters,
                  minSkillsScore: null
                })}
                className="text-indigo-600 hover:text-indigo-800 text-xs"
              >
                ×
              </button>
            </div>
          )}

          {scoreFilters.minExperience !== null && (
            <div className="flex items-center gap-2 bg-teal-50 px-3 py-1 rounded-full">
              <FaBriefcase className="text-teal-600 text-xs" />
              <span className="text-xs text-teal-800">
                Min Exp: {scoreFilters.minExperience} yrs
              </span>
              <button
                onClick={() => setScoreFilters({
                  ...scoreFilters,
                  minExperience: null
                })}
                className="text-teal-600 hover:text-teal-800 text-xs"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsControls;