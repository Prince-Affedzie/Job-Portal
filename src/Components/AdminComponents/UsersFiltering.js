import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Calendar, 
  Star, 
  Shield,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCcw
} from "lucide-react";

const UserFilterComponent = ({ users = [], onFilteredUsers, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    role: "all",
    isActive: "all",
    isVerified: "all", 
    vettingStatus: "all",
    region: "all",
    city: "all",
    profileCompleted: "all",
    miniTaskEligible: "all",
    ratingRange: "all",
    dateRange: "all",
    customDateFrom: "",
    customDateTo: ""
  });

  // Extract unique values from users for filter options
  const filterOptions = {
    regions: [...new Set(users.map(user => user.location?.region).filter(Boolean))],
    cities: [...new Set(users.map(user => user.location?.city).filter(Boolean))],
    roles: [...new Set(users.map(user => user.role).filter(Boolean))]
  };

  // Apply filters to users
  const applyFilters = (usersToFilter, currentFilters) => {
    return usersToFilter.filter(user => {
      // Search term filter
      if (currentFilters.searchTerm.trim()) {
        const searchLower = currentFilters.searchTerm.toLowerCase();
        const matchesSearch = 
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.phone?.toLowerCase().includes(searchLower) ||
          user.Bio?.toLowerCase().includes(searchLower) ||
          user.location?.city?.toLowerCase().includes(searchLower) ||
          user.location?.region?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Role filter
      if (currentFilters.role !== "all" && user.role !== currentFilters.role) {
        return false;
      }

      // Active status filter
      if (currentFilters.isActive !== "all") {
        const isActiveFilter = currentFilters.isActive === "true";
        if (user.isActive !== isActiveFilter) return false;
      }

      // Verification status filter
      if (currentFilters.isVerified !== "all") {
        const isVerifiedFilter = currentFilters.isVerified === "true";
        if (user.isVerified !== isVerifiedFilter) return false;
      }

      // Vetting status filter
      if (currentFilters.vettingStatus !== "all" && user.vettingStatus !== currentFilters.vettingStatus) {
        return false;
      }

      // Location filters
      if (currentFilters.region !== "all" && user.location?.region !== currentFilters.region) {
        return false;
      }

      if (currentFilters.city !== "all" && user.location?.city !== currentFilters.city) {
        return false;
      }

      // Profile completed filter
      if (currentFilters.profileCompleted !== "all") {
        const profileCompletedFilter = currentFilters.profileCompleted === "true";
        if (user.profileCompleted !== profileCompletedFilter) return false;
      }

      // Mini task eligible filter
      if (currentFilters.miniTaskEligible !== "all") {
        const miniTaskEligibleFilter = currentFilters.miniTaskEligible === "true";
        if (user.miniTaskEligible !== miniTaskEligibleFilter) return false;
      }

      // Rating range filter
      if (currentFilters.ratingRange !== "all") {
        const userRating = user.rating || 0;
        switch (currentFilters.ratingRange) {
          case "5":
            if (userRating < 5) return false;
            break;
          case "4-5":
            if (userRating < 4) return false;
            break;
          case "3-4":
            if (userRating < 3 || userRating >= 4) return false;
            break;
          case "2-3":
            if (userRating < 2 || userRating >= 3) return false;
            break;
          case "1-2":
            if (userRating < 1 || userRating >= 2) return false;
            break;
          case "0-1":
            if (userRating >= 1) return false;
            break;
        }
      }

      // Date range filter
      if (currentFilters.dateRange !== "all") {
        const userDate = new Date(user.createdAt);
        const now = new Date();
        
        switch (currentFilters.dateRange) {
          case "today":
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (userDate < today) return false;
            break;
          case "week":
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            if (userDate < weekAgo) return false;
            break;
          case "month":
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            if (userDate < monthAgo) return false;
            break;
          case "3months":
            const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
            if (userDate < threeMonthsAgo) return false;
            break;
          case "6months":
            const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
            if (userDate < sixMonthsAgo) return false;
            break;
          case "year":
            const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
            if (userDate < yearAgo) return false;
            break;
          case "custom":
            if (currentFilters.customDateFrom) {
              const fromDate = new Date(currentFilters.customDateFrom);
              if (userDate < fromDate) return false;
            }
            if (currentFilters.customDateTo) {
              const toDate = new Date(currentFilters.customDateTo);
              toDate.setHours(23, 59, 59, 999);
              if (userDate > toDate) return false;
            }
            break;
        }
      }

      return true;
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    
    // Reset city when region changes
    if (filterKey === 'region' && value !== filters.region) {
      newFilters.city = 'all';
    }

    // Reset custom dates when date range changes
    if (filterKey === 'dateRange' && value !== 'custom') {
      newFilters.customDateFrom = '';
      newFilters.customDateTo = '';
    }

    setFilters(newFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    const resetFilters = {
      searchTerm: "",
      role: "all",
      isActive: "all",
      isVerified: "all",
      vettingStatus: "all",
      region: "all",
      city: "all",
      profileCompleted: "all",
      miniTaskEligible: "all",
      ratingRange: "all",
      dateRange: "all",
      customDateFrom: "",
      customDateTo: ""
    };
    setFilters(resetFilters);
  };

  // Apply filters and notify parent component
  useEffect(() => {
    const filteredUsers = applyFilters(users, filters);
    onFilteredUsers?.(filteredUsers);
    onFiltersChange?.(filters);
  }, [users, filters]);

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchTerm.trim()) count++;
    if (filters.role !== "all") count++;
    if (filters.isActive !== "all") count++;
    if (filters.isVerified !== "all") count++;
    if (filters.vettingStatus !== "all") count++;
    if (filters.region !== "all") count++;
    if (filters.city !== "all") count++;
    if (filters.profileCompleted !== "all") count++;
    if (filters.miniTaskEligible !== "all") count++;
    if (filters.ratingRange !== "all") count++;
    if (filters.dateRange !== "all") count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900">Filter Users</h3>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all duration-200"
            >
              Advanced
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, bio, or location..."
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
          {filters.searchTerm && (
            <button
              onClick={() => handleFilterChange('searchTerm', '')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors duration-200"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-6 border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Role Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Role
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="employer">Employer</option>
              <option value="client">Client</option>
              <option value="job_seeker">Job Seeker</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Verification
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.isVerified}
              onChange={(e) => handleFilterChange('isVerified', e.target.value)}
            >
              <option value="all">All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Region
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="all">All Regions</option>
              {filterOptions.regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vetting Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Vetting Status
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={filters.vettingStatus}
                onChange={(e) => handleFilterChange('vettingStatus', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="not_applied">Not Applied</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                City
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                disabled={filters.region === 'all'}
              >
                <option value="all">All Cities</option>
                {filterOptions.cities
                  .filter(city => {
                    if (filters.region === 'all') return true;
                    const user = users.find(u => u.location?.city === city && u.location?.region === filters.region);
                    return !!user;
                  })
                  .map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
              </select>
            </div>

            {/* Profile Completed */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Profile Completed
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={filters.profileCompleted}
                onChange={(e) => handleFilterChange('profileCompleted', e.target.value)}
              >
                <option value="all">All</option>
                <option value="true">Completed</option>
                <option value="false">Incomplete</option>
              </select>
            </div>

            {/* Mini Task Eligible */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Mini Task Eligible
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={filters.miniTaskEligible}
                onChange={(e) => handleFilterChange('miniTaskEligible', e.target.value)}
              >
                <option value="all">All</option>
                <option value="true">Eligible</option>
                <option value="false">Not Eligible</option>
              </select>
            </div>

            {/* Rating Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Rating Range
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={filters.ratingRange}
                onChange={(e) => handleFilterChange('ratingRange', e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4-5">4-5 Stars</option>
                <option value="3-4">3-4 Stars</option>
                <option value="2-3">2-3 Stars</option>
                <option value="1-2">1-2 Stars</option>
                <option value="0-1">Below 1 Star</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Registration Date
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {filters.dateRange === 'custom' && (
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-700">Custom Date Range</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      value={filters.customDateFrom}
                      onChange={(e) => handleFilterChange('customDateFrom', e.target.value)}
                      placeholder="From"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      value={filters.customDateTo}
                      onChange={(e) => handleFilterChange('customDateTo', e.target.value)}
                      placeholder="To"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applied Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="p-4 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-blue-800 font-medium">Active filters:</span>
            {filters.searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: "{filters.searchTerm}"
                <button onClick={() => handleFilterChange('searchTerm', '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.role !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Role: {filters.role}
                <button onClick={() => handleFilterChange('role', 'all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.isActive !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Status: {filters.isActive === 'true' ? 'Active' : 'Inactive'}
                <button onClick={() => handleFilterChange('isActive', 'all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.isVerified !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Verification: {filters.isVerified === 'true' ? 'Verified' : 'Unverified'}
                <button onClick={() => handleFilterChange('isVerified', 'all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {/* Add more filter tags as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilterComponent;