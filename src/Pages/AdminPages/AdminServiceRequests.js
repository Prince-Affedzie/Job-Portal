import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllServiceRequests } from "../../APIS/adminApi";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Icons
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  FlagIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  TagIcon,
  ArrowPathIcon,
  FireIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ClipboardDocumentCheckIcon
} from "@heroicons/react/24/outline";

dayjs.extend(relativeTime);

// Status Configuration
const STATUS_CONFIG = {
  Pending: {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: ClockIcon,
    label: "Pending",
    badgeColor: "bg-gray-500"
  },
  Quoted: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: ChatBubbleLeftRightIcon,
    label: "Quoted",
    badgeColor: "bg-blue-500"
  },
  Booked: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: CalendarIcon,
    label: "Booked",
    badgeColor: "bg-purple-500"
  },
  "In-progress": {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: ArrowPathIcon,
    label: "In Progress",
    badgeColor: "bg-amber-500"
  },
  Review: {
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: DocumentTextIcon,
    label: "Review",
    badgeColor: "bg-indigo-500"
  },
  Canceled: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircleIcon,
    label: "Canceled",
    badgeColor: "bg-red-500"
  },
  Completed: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircleIcon,
    label: "Completed",
    badgeColor: "bg-green-500"
  },
  Closed: {
    color: "bg-gray-800 text-gray-100 border-gray-700",
    icon: ClipboardDocumentCheckIcon,
    label: "Closed",
    badgeColor: "bg-gray-800"
  }
};

// Urgency Configuration
const URGENCY_CONFIG = {
  flexible: {
    color: "bg-green-100 text-green-700",
    label: "Flexible",
    icon: CalendarDaysIcon
  },
  urgent: {
    color: "bg-red-100 text-red-700",
    label: "Urgent",
    icon: FireIcon
  },
  scheduled: {
    color: "bg-blue-100 text-blue-700",
    label: "Scheduled",
    icon: ClockIcon
  }
};

// Service Types (you can modify based on your data)
const SERVICE_TYPES = [
  "Cleaning",
  "Plumbing", 
  "Electrical",
  "Moving",
  "Assembly",
  "Handyman",
  "Painting",
  "Gardening",
  "Other"
];

const AdminServiceRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    totalBudget: 0,
    urgentCount: 0
  });

  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [dateRange, setDateRange] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(10);

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      const res = await getAllServiceRequests();
      if (res.status === 200) {
        const requestsData = res.data;
        setRequests(requestsData);
        setFilteredRequests(requestsData);
        updateStats(requestsData);
      }
    } catch (error) {
      console.error("Failed to load service requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (data) => {
    const statsData = {
      total: data.length,
      pending: data.filter(r => r.status === "Pending").length,
      inProgress: data.filter(r => r.status === "In-progress").length,
      completed: data.filter(r => r.status === "Completed").length,
      totalBudget: data.reduce((sum, req) => sum + (req.budget || 0), 0),
      urgentCount: data.filter(r => r.urgency === "urgent").length
    };
    setStats(statsData);
  };

  // Apply filters
  useEffect(() => {
    let result = [...requests];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(req =>
        req.type.toLowerCase().includes(searchLower) ||
        req.description.toLowerCase().includes(searchLower) ||
        (req.client?.name && req.client.name.toLowerCase().includes(searchLower)) ||
        (req.client?.email && req.client.email.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter(req => req.status === statusFilter);
    }

    // Type filter
    if (typeFilter) {
      result = result.filter(req => req.type === typeFilter);
    }

    // Urgency filter
    if (urgencyFilter) {
      result = result.filter(req => req.urgency === urgencyFilter);
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = dayjs();
      result = result.filter(req => {
        const createdAt = dayjs(req.createdAt);
        switch(dateRange) {
          case "today":
            return createdAt.isSame(now, 'day');
          case "week":
            return createdAt.isAfter(now.subtract(1, 'week'));
          case "month":
            return createdAt.isAfter(now.subtract(1, 'month'));
          default:
            return true;
        }
      });
    }

    setFilteredRequests(result);
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter, urgencyFilter, dateRange, requests]);

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
    setUrgencyFilter("");
    setDateRange("all");
  };

  const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color} border`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const UrgencyBadge = ({ urgency }) => {
    const config = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.flexible;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <NotificationCenter />

      <div className={`lg:pl-64 flex flex-col flex-1 overflow-hidden`}>
        <AdminNavbar 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Service Requests</h1>
                <p className="text-gray-600 mt-1">Manage and monitor all service requests</p>
              </div>
              <button
                onClick={fetchServiceRequests}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
                  <DocumentTextIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-amber-50 text-amber-600 mr-4">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
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
                <div className="p-3 rounded-lg bg-red-50 text-red-600 mr-4">
                  <FireIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Urgent</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.urgentCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FunnelIcon className="w-5 h-5 text-gray-500" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Clear all
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search requests
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="search"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Search by service type, description, or client..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    {Object.keys(STATUS_CONFIG).map(status => (
                      <option key={status} value={status}>
                        {STATUS_CONFIG[status].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <select
                    id="type"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {SERVICE_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency
                  </label>
                  <select
                    id="urgency"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                  >
                    <option value="">All Urgency Levels</option>
                    {Object.keys(URGENCY_CONFIG).map(urgency => (
                      <option key={urgency} value={urgency}>
                        {URGENCY_CONFIG[urgency].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    id="dateRange"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </div>

              {/* Results info */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <FunnelIcon className="w-4 h-4 mr-1" />
                  {filteredRequests.length} of {requests.length} requests
                </div>
                <div className="flex items-center gap-2">
                  <span>Show:</span>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={requestsPerPage}
                    onChange={(e) => {
                      setRequestsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Requests List */}
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading service requests...</p>
              </div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600 mb-6">
                  {requests.length === 0
                    ? "No service requests have been submitted yet."
                    : "No requests match your current filters."}
                </p>
                {(search || statusFilter || typeFilter || urgencyFilter) && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Requests Grid */}
              <div className="space-y-4 mb-6">
                {currentRequests.map((request) => (
                  <div key={request._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.type}</h3>
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <StatusBadge status={request.status} />
                                <UrgencyBadge urgency={request.urgency} />
                              </div>
                            </div>
                            <div className="text-right">
                              {request.budget && (
                                <div className="text-xl font-bold text-gray-900">
                                  GHS {request.budget.toLocaleString()}
                                </div>
                              )}
                              <div className="text-sm text-gray-500">
                                {dayjs(request.createdAt).format("MMM DD, YYYY")}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {request.description}
                          </p>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Client</p>
                              <div className="flex items-center gap-2">
                                {request.client?.profileImage ? (
                                  <img
                                    src={request.client.profileImage}
                                    alt={request.client.name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                ) : (
                                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <UserIcon className="w-3 h-3 text-indigo-600" />
                                  </div>
                                )}
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {request.client?.name || "Unknown"}
                                </span>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 mb-1">Location</p>
                              <div className="flex items-center gap-1 text-sm text-gray-900">
                                <MapPinIcon className="w-4 h-4 text-gray-400" />
                                {request.address?.suburb || request.address?.city || "Not specified"}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 mb-1">Preferred Date</p>
                              <div className="flex items-center gap-1 text-sm text-gray-900">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                {request.preferredDate 
                                  ? dayjs(request.preferredDate).format("MMM DD") 
                                  : "Flexible"}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500 mb-1">Offers</p>
                              <div className="flex items-center gap-1 text-sm text-gray-900">
                                <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />
                                {request.offers?.length || 0} offers
                              </div>
                            </div>
                          </div>

                          {/* Media Preview */}
                          {request.media && request.media.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <PhotoIcon className="w-4 h-4" />
                                <span>{request.media.filter(m => m.type === 'image').length} images</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <VideoCameraIcon className="w-4 h-4" />
                                <span>{request.media.filter(m => m.type === 'video').length} videos</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Section - Actions */}
                        <div className="lg:w-48 flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                            <button
                              onClick={() => navigate(`/admin/${request._id}/service_request_info`)}
                              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <EyeIcon className="w-4 h-4" />
                              View Details
                            </button>
                            {/*<button
                              onClick={() => navigate(`/admin/service-requests/${request._id}/edit`)}
                              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </button>*/}
                          </div>

                          <button
                            onClick={() => setExpandedRequest(expandedRequest === request._id ? null : request._id)}
                            className="w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            {expandedRequest === request._id ? (
                              <>
                                Show Less <ChevronUpIcon className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                Show More <ChevronDownIcon className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedRequest === request._id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Full Description</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                  {request.description}
                                </p>
                              </div>

                              {request.requirements && request.requirements.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h4>
                                  <ul className="space-y-1">
                                    {request.requirements.map((req, index) => (
                                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Timeline</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs text-gray-500">Created</p>
                                    <p className="text-sm font-medium">
                                      {dayjs(request.createdAt).format("MMM DD, YYYY h:mm A")}
                                    </p>
                                  </div>
                                  {request.preferredDate && (
                                    <div>
                                      <p className="text-xs text-gray-500">Preferred Date</p>
                                      <p className="text-sm font-medium">
                                        {dayjs(request.preferredDate).format("MMM DD, YYYY")}
                                        {request.preferredTime && ` at ${request.preferredTime}`}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Client Details</h4>
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center gap-3 mb-2">
                                    {request.client?.profileImage ? (
                                      <img
                                        src={request.client.profileImage}
                                        alt={request.client.name}
                                        className="w-10 h-10 rounded-full"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <UserIcon className="w-5 h-5 text-indigo-600" />
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-medium text-gray-900">{request.client?.name || "Unknown"}</p>
                                      <p className="text-xs text-gray-500">{request.client?.email || "No email"}</p>
                                    </div>
                                  </div>
                                  {request.client?.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <PhoneIcon className="w-4 h-4" />
                                      {request.client.phone}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Location Details</h4>
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="space-y-1">
                                    {request.address?.suburb && (
                                      <p className="text-sm text-gray-900">{request.address.suburb}</p>
                                    )}
                                    {request.address?.city && (
                                      <p className="text-sm text-gray-900">{request.address.city}</p>
                                    )}
                                    {request.address?.region && (
                                      <p className="text-sm text-gray-900">{request.address.region}</p>
                                    )}
                                    {!request.address?.suburb && !request.address?.city && (
                                      <p className="text-sm text-gray-500 italic">Location not specified</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {request.assignedTasker && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Assigned Tasker</h4>
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                      {request.assignedTasker?.profileImage ? (
                                        <img
                                          src={request.assignedTasker.profileImage}
                                          alt={request.assignedTasker.name}
                                          className="w-10 h-10 rounded-full"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                          <UserIcon className="w-5 h-5 text-amber-600" />
                                        </div>
                                      )}
                                      <div>
                                        <p className="font-medium text-gray-900">{request.assignedTasker?.name}</p>
                                        <p className="text-xs text-gray-500">Tasker Assigned</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium">{indexOfFirstRequest + 1}-{Math.min(indexOfLastRequest, filteredRequests.length)}</span> of{" "}
                      <span className="font-medium">{filteredRequests.length}</span> requests
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          currentPage === 1
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => paginate(pageNum)}
                                className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                                  currentPage === pageNum
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            pageNum === currentPage - 2 ||
                            pageNum === currentPage + 2
                          ) {
                            return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                          }
                          return null;
                        })}
                      </div>
                      
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          currentPage === totalPages
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminServiceRequests;