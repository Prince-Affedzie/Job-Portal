import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, MapPin, Star, CheckCircle, Clock, User, Mail, Phone, Calendar, Award, X, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllTaskers } from '../../APIS/adminApi';
import { TaskerCard } from "../../Components/AdminComponents/TaskerCard";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";

const AdminTaskersManagementPage = () => {
  const [taskers, setTaskers] = useState([]);
  const [filteredTaskers, setFilteredTaskers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter state
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'All',
    vettingStatus: 'All',
    verification: 'All',
    minRating: '',
    maxRating: '',
    location: { region: '', city: '' },
    skills: [],
    profileCompletion: 'All',
    miniTaskEligible: 'All',
    dateRange: { start: '', end: '' },
    hasPortfolio: 'All',
    hasExperience: 'All'
  });

  // Available options
  const STATUS_OPTIONS = [
    { value: 'All', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const VETTING_OPTIONS = [
    { value: 'All', label: 'All Vetting' },
    { value: 'not_applied', label: 'Not Applied' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const BOOLEAN_OPTIONS = [
    { value: 'All', label: 'All' },
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ];

  const REGION_OPTIONS = [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Volta', 
    'Eastern', 'Northern', 'Upper East', 'Upper West', 'Brong-Ahafo'
  ];

  const COMMON_SKILLS = [
    'Cleaning', 'Driving', 'Cooking', 'Teaching', 'Babysitting',
    'Gardening', 'Painting', 'Plumbing', 'Electrical', 'Carpentry',
    'Writing', 'Design', 'Programming', 'Marketing', 'Sales',
    'Photography', 'Videography', 'Music', 'Fitness', 'Beauty'
  ];

  // Sort options
  const SORT_OPTIONS = [
    { key: 'name', label: 'Name' },
    { key: 'rating', label: 'Rating' },
    { key: 'createdAt', label: 'Join Date' },
    { key: 'numberOfRatings', label: 'Reviews' },
    { key: 'vettingStatus', label: 'Vetting Status' }
  ];

  // Items per page options
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

  // Fetch taskers (job_seeker role)
  useEffect(() => {
    const fetchTaskers = async () => {
      try {
        setLoading(true);
       
        const response = await getAllTaskers();
        if(response.status === 200){
            setTaskers(response.data || []);
        }
        
      } catch (error) {
        console.error('Error fetching taskers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskers();
  }, []);

  // Filter and sort taskers
  useEffect(() => {
    if (!taskers.length) return;

    let filtered = taskers.filter(tasker => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          tasker.name?.toLowerCase().includes(searchLower) ||
          tasker.email?.toLowerCase().includes(searchLower) ||
          tasker.phone?.includes(filters.searchTerm) ||
          tasker.skills?.some(skill => skill.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'All') {
        const isActive = filters.status === 'active';
        if (tasker.isActive !== isActive) return false;
      }

      // Vetting status filter
      if (filters.vettingStatus !== 'All' && tasker.vettingStatus !== filters.vettingStatus) {
        return false;
      }

      // Verification filter
      if (filters.verification !== 'All') {
        const isVerified = filters.verification === 'true';
        if (tasker.isVerified !== isVerified) return false;
      }

      // Rating filter
      if (filters.minRating || filters.maxRating) {
        const rating = tasker.rating || 0;
        const min = parseFloat(filters.minRating) || 0;
        const max = parseFloat(filters.maxRating) || 5;
        if (rating < min || rating > max) return false;
      }

      // Location filter
      if (filters.location.region || filters.location.city) {
        if (filters.location.region && tasker.location?.region !== filters.location.region) {
          return false;
        }
        if (filters.location.city && !tasker.location?.city?.toLowerCase().includes(filters.location.city.toLowerCase())) {
          return false;
        }
      }

      // Skills filter
      if (filters.skills.length > 0) {
        const taskerSkills = tasker.skills?.map(s => s.toLowerCase()) || [];
        const hasMatchingSkill = filters.skills.some(skill => 
          taskerSkills.includes(skill.toLowerCase())
        );
        if (!hasMatchingSkill) return false;
      }

      // Profile completion filter
      if (filters.profileCompletion !== 'All') {
        const isCompleted = filters.profileCompletion === 'true';
        if (tasker.profileCompleted !== isCompleted) return false;
      }

      // MiniTask eligibility filter
      if (filters.miniTaskEligible !== 'All') {
        const isEligible = filters.miniTaskEligible === 'true';
        if (tasker.miniTaskEligible !== isEligible) return false;
      }

      // Portfolio filter
      if (filters.hasPortfolio !== 'All') {
        const hasPortfolio = filters.hasPortfolio === 'true';
        const taskerHasPortfolio = tasker.workPortfolio?.length > 0;
        if (taskerHasPortfolio !== hasPortfolio) return false;
      }

      // Experience filter
      if (filters.hasExperience !== 'All') {
        const hasExperience = filters.hasExperience === 'true';
        const taskerHasExperience = tasker.workExperience?.length > 0;
        if (taskerHasExperience !== hasExperience) return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const joinDate = new Date(tasker.createdAt);
        const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

        if (start && joinDate < start) return false;
        if (end && joinDate > new Date(end.setHours(23, 59, 59, 999))) return false;
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested values
      if (sortConfig.key === 'location') {
        aValue = a.location?.city || '';
        bValue = b.location?.city || '';
      }

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTaskers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [taskers, filters, sortConfig]);

  // Pagination calculations
  const paginationData = useMemo(() => {
    const totalItems = filteredTaskers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredTaskers.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      currentItems,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages
    };
  }, [filteredTaskers, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedFilter = (parent, child, value) => {
    setFilters(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [child]: value }
    }));
  };

  const toggleSkill = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'All',
      vettingStatus: 'All',
      verification: 'All',
      minRating: '',
      maxRating: '',
      location: { region: '', city: '' },
      skills: [],
      profileCompletion: 'All',
      miniTaskEligible: 'All',
      dateRange: { start: '', end: '' },
      hasPortfolio: 'All',
      hasExperience: 'All'
    });
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (paginationData.hasPrevious) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (paginationData.hasNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'location') {
        if (value.region || value.city) count++;
      } else if (key === 'dateRange') {
        if (value.start || value.end) count++;
      } else if (key === 'skills') {
        if (value.length > 0) count++;
      } else if (value !== 'All' && value !== '') {
        count++;
      }
    });
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Statistics
  const stats = useMemo(() => {
    const total = taskers.length;
    const showing = filteredTaskers.length;
    const active = taskers.filter(t => t.isActive).length;
    const verified = taskers.filter(t => t.isVerified).length;
    const approved = taskers.filter(t => t.vettingStatus === 'approved').length;

    return { total, showing, active, verified, approved };
  }, [taskers, filteredTaskers]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading taskers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <AdminNavbar 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Taskers Management</h1>
              <p className="text-gray-600 mt-2">Manage and monitor all taskers in the system</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard
                title="Total Taskers"
                value={stats.total}
                icon={<User className="w-6 h-6" />}
                color="blue"
              />
              <StatCard
                title="Showing"
                value={stats.showing}
                icon={<Filter className="w-6 h-6" />}
                color="green"
              />
              <StatCard
                title="Active"
                value={stats.active}
                icon={<CheckCircle className="w-6 h-6" />}
                color="emerald"
              />
              <StatCard
                title="Verified"
                value={stats.verified}
                icon={<Award className="w-6 h-6" />}
                color="purple"
              />
              <StatCard
                title="Approved"
                value={stats.approved}
                icon={<Star className="w-6 h-6" />}
                color="amber"
              />
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex-1 w-full lg:max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search taskers by name, email, skills..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filters.searchTerm}
                        onChange={(e) => updateFilter('searchTerm', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.status}
                      onChange={(e) => updateFilter('status', e.target.value)}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>

                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.vettingStatus}
                      onChange={(e) => updateFilter('vettingStatus', e.target.value)}
                    >
                      {VETTING_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>

                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear ({activeFilterCount})
                    </button>
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="0.0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.minRating}
                      onChange={(e) => updateFilter('minRating', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Rating</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="5.0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.maxRating}
                      onChange={(e) => updateFilter('maxRating', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.location.region}
                      onChange={(e) => updateNestedFilter('location', 'region', e.target.value)}
                    >
                      <option value="">All Regions</option>
                      {REGION_OPTIONS.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.location.city}
                      onChange={(e) => updateNestedFilter('location', 'city', e.target.value)}
                    />
                  </div>
                </div>

                {/* Skills Filter */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_SKILLS.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          filters.skills.includes(skill)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Header with Pagination Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
              <div className="text-sm text-gray-600">
                Showing {paginationData.startIndex} to {paginationData.endIndex} of {paginationData.totalItems} taskers
                {paginationData.totalItems !== stats.showing && ` (filtered from ${stats.total} total)`}
              </div>
              
              <div className="flex items-center gap-4">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ITEMS_PER_PAGE_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>

                {/* Sort options */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <div className="flex gap-1">
                    {SORT_OPTIONS.map(option => (
                      <button
                        key={option.key}
                        onClick={() => handleSort(option.key)}
                        className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                          sortConfig.key === option.key
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                        <ChevronUp className="w-4 h-4" />
                        {sortConfig.key === option.key && (
                          <span className="text-xs">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Taskers List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              {paginationData.currentItems.length === 0 ? (
                <div className="p-12 text-center">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No taskers found</h3>
                  <p className="text-gray-600">
                    {taskers.length === 0 
                      ? "No taskers registered yet." 
                      : "Try adjusting your filters to see more results."
                    }
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {paginationData.currentItems.map(tasker => (
                    <TaskerCard key={tasker._id} tasker={tasker} />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Component */}
            {paginationData.totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={paginationData.totalPages}
                totalItems={paginationData.totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={goToPage}
                onPrevious={goToPreviousPage}
                onNext={goToNextPage}
                hasPrevious={paginationData.hasPrevious}
                hasNext={paginationData.hasNext}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems,
  itemsPerPage,
  onPageChange, 
  onPrevious, 
  onNext, 
  hasPrevious, 
  hasNext 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages} • {totalItems} total items
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`p-2 rounded-lg border ${
            hasPrevious 
              ? 'border-gray-300 hover:bg-gray-50 text-gray-700' 
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`min-w-[40px] px-3 py-2 rounded-lg border text-sm font-medium ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : page === '...'
                  ? 'border-transparent text-gray-500 cursor-default'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`p-2 rounded-lg border ${
            hasNext 
              ? 'border-gray-300 hover:bg-gray-50 text-gray-700' 
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AdminTaskersManagementPage;