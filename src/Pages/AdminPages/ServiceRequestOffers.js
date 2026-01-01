import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { serviceRequestDetail } from "../../APIS/adminApi";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Icons
import {
  ArrowLeft,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Users,
  Star,
  Mail,
  Phone,
  MessageSquare,
  TrendingUp,
  Shield,
  MoreVertical,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  Check,
  Ban,
  MessageCircle,
  PhoneCall,
  ExternalLink,
  Download,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  ThumbsUp,
  ThumbsDown,
  Send,
  UserCheck,
  UserX,
  Building,
  Target,
  Percent,
  Clock as ClockIcon,
  Edit3
} from "lucide-react";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Offer Status Configuration
const OFFER_STATUS_CONFIG = {
  pending: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
    label: "Pending",
    action: "Review"
  },
  accepted: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    label: "Accepted",
    action: "View"
  },
  declined: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    label: "Declined",
    action: "View"
  }
};

// Sort Options
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First", icon: Clock },
  { value: "oldest", label: "Oldest First", icon: Clock },
  { value: "amount_high", label: "Amount (High to Low)", icon: DollarSign },
  { value: "amount_low", label: "Amount (Low to High)", icon: DollarSign },
  { value: "status", label: "By Status", icon: Shield }
];

// Filter Options
const FILTER_OPTIONS = [
  { value: "all", label: "All Offers", count: 0 },
  { value: "pending", label: "Pending", count: 0 },
  { value: "accepted", label: "Accepted", count: 0 },
  { value: "declined", label: "Declined", count: 0 }
];

// Offer Card Component
const OfferCard = ({ offer, request, onViewTasker, onAccept, onDecline, onViewDetails }) => {
  const statusConfig = OFFER_STATUS_CONFIG[offer.status] || OFFER_STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`bg-white rounded-xl border ${offer.status === 'accepted' ? 'border-green-300 shadow-sm' : 'border-gray-200'} hover:shadow-md transition-all`}>
      <div className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          {/* Left Section - Tasker Info */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0">
                {offer.tasker?.profileImage ? (
                  <img
                    src={offer.tasker.profileImage}
                    alt={offer.tasker.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {offer.tasker?.name?.[0] || "T"}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {offer.tasker?.name || "Unknown Tasker"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} border`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {dayjs(offer.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      GHS {offer.amount?.toLocaleString()}
                    </div>
                    {request.budget && (
                      <div className={`text-xs ${offer.amount <= request.budget ? 'text-green-600' : 'text-amber-600'}`}>
                        {offer.amount <= request.budget ? 'Within budget' : 'Above budget'}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tasker Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  {offer.tasker?.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{offer.tasker.rating}</span>
                      <span className="text-gray-400">rating</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">98%</span>
                    <span className="text-gray-400">completion</span>
                  </div>
                  {offer.tasker?.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{offer.tasker.phone}</span>
                    </div>
                  )}
                </div>
                
                {/* Offer Message */}
                {offer.message && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 italic line-clamp-2">
                      "{offer.message}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Section - Actions */}
          <div className="lg:w-48 flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <button
                onClick={() => onViewTasker(offer.tasker?._id)}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Profile
              </button>
              <button
                onClick={() => onViewDetails(offer)}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Details
              </button>
            </div>
            
            {/* Status Actions
            {offer.status === "pending" && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => onAccept(offer)}
                  className="px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Accept
                </button>
                <button
                  onClick={() => onDecline(offer)}
                  className="px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Ban className="w-3 h-3" />
                  Decline
                </button>
              </div>
            )}
            
            {offer.status === "accepted" && (
              <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-1 text-green-700 text-xs">
                  <CheckCircle className="w-3 h-3" />
                  <span className="font-medium">Offer Accepted</span>
                </div>
                <button
                  onClick={() => {}}
                  className="mt-1 w-full px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  Revoke Acceptance
                </button>
              </div>
            )}  */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Offer Details Modal
const OfferDetailsModal = ({ offer, isOpen, onClose, request }) => {
  const [selectedTab, setSelectedTab] = useState("details");
  const navigate = useNavigate();

  if (!isOpen || !offer) return null;

  const statusConfig = OFFER_STATUS_CONFIG[offer.status] || OFFER_STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative inline-block w-full max-w-4xl p-0 my-8 overflow-hidden text-left align-middle bg-white rounded-2xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {offer.tasker?.profileImage ? (
                  <img
                    src={offer.tasker.profileImage}
                    alt={offer.tasker.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {offer.tasker?.name?.[0] || "T"}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Offer from {offer.tasker?.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      Submitted {dayjs(offer.createdAt).format("MMM DD, YYYY [at] h:mm A")}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    GHS {offer.amount?.toLocaleString()}
                  </div>
                  {request.budget && (
                    <div className="text-sm text-gray-500">
                      {offer.amount <= request.budget ? (
                        <span className="text-green-600">Within budget (GHS {request.budget - offer.amount} under)</span>
                      ) : (
                        <span className="text-amber-600">GHS {offer.amount - request.budget} over budget</span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: "details", label: "Offer Details", icon: FileText },
                { id: "tasker", label: "Tasker Profile", icon: User },
                { id: "comparison", label: "Price Comparison", icon: TrendingUp }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors relative ${
                      selectedTab === tab.id
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {selectedTab === "details" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Offer Message</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {offer.message || "No message provided with this offer."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Submitted</span>
                        <span className="text-sm font-medium">
                          {dayjs(offer.createdAt).format("MMM DD, YYYY h:mm A")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status Updated</span>
                        <span className="text-sm font-medium">
                          {dayjs(offer.updatedAt || offer.createdAt).format("MMM DD, YYYY h:mm A")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Price Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Offer Amount</span>
                        <span className="text-lg font-bold text-gray-900">GHS {offer.amount?.toLocaleString()}</span>
                      </div>
                      {request.budget && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Client Budget</span>
                            <span className="text-sm font-medium">GHS {request.budget?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Difference</span>
                            <span className={`text-sm font-medium ${
                              offer.amount <= request.budget ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {offer.amount <= request.budget ? '-' : '+'}GHS {Math.abs(offer.amount - request.budget)?.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "tasker" && offer.tasker && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {offer.tasker.profileImage ? (
                    <img
                      src={offer.tasker.profileImage}
                      alt={offer.tasker.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {offer.tasker.name?.[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{offer.tasker.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      {offer.tasker.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{offer.tasker.rating}</span>
                          <span className="text-gray-500 text-sm">rating</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">98%</span>
                        <span className="text-gray-500 text-sm">completion</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">Contact Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {offer.tasker.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4" />
                          <span>{offer.tasker.email}</span>
                        </div>
                      )}
                      {offer.tasker.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone className="w-4 h-4" />
                          <span>{offer.tasker.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">Statistics</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completed Tasks</span>
                        <span className="text-sm font-medium">124</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Response Time</span>
                        <span className="text-sm font-medium">2.4 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Member Since</span>
                        <span className="text-sm font-medium">
                          {offer.tasker.createdAt ? dayjs(offer.tasker.createdAt).format("MMM YYYY") : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/tasker_info/${offer.tasker._id}`)}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Profile
                  </button>
                  {offer.tasker.phone && (
                    <a
                      href={`tel:${offer.tasker.phone}`}
                      className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      Call Tasker
                    </a>
                  )}
                </div>
              </div>
            )}

            {selectedTab === "comparison" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <h4 className="font-semibold">Price Comparison</h4>
                  </div>
                  <p className="text-sm text-blue-600">
                    This offer is {offer.amount <= request.budget ? 'within' : 'above'} the client's budget.
                    {offer.amount <= request.budget ? ' Good value for the client!' : ' May require negotiation.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Client's Maximum Budget</span>
                    <span className="text-lg font-bold text-gray-900">GHS {request.budget?.toLocaleString() || "Not set"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tasker's Offer</span>
                    <span className="text-lg font-bold text-gray-900">GHS {offer.amount?.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        offer.amount <= request.budget ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: request.budget 
                          ? `${Math.min(100, (offer.amount / request.budget) * 100)}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">0</span>
                    <span className={`font-medium ${
                      offer.amount <= request.budget ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {request.budget 
                        ? `${Math.round((offer.amount / request.budget) * 100)}% of budget`
                        : 'No budget set'
                      }
                    </span>
                    <span className="text-gray-500">GHS {request.budget?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Recommendation</h5>
                    <p className="text-sm text-gray-600">
                      {offer.amount <= request.budget
                        ? "This offer provides good value and is within the client's budget. Consider accepting if the tasker is qualified."
                        : "This offer exceeds the client's budget. Consider negotiating or looking at other offers."
                      }
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Average for this Service</h5>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Market Average</span>
                      <span className="text-lg font-bold text-gray-900">
                        GHS {(request.budget * 0.85)?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {offer.status === "pending" && (
                <>
                  <button
                    onClick={() => {}}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    Decline Offer
                  </button>
                  <button
                    onClick={() => {}}
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Accept Offer
                  </button>
                </>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const AdminServiceRequestOffers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    declined: 0,
    averageAmount: 0,
    lowestAmount: 0,
    highestAmount: 0
  });

  useEffect(() => {
    fetchRequestDetail();
  }, [id]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const res = await serviceRequestDetail(id);
      if (res.status === 200) {
        const requestData = res.data;
        setRequest(requestData);
        setOffers(requestData.offers || []);
        updateStats(requestData.offers || []);
      }
    } catch (err) {
      console.error("Failed to load service request:", err);
      navigate("/admin/service-requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (offersData) => {
    const amounts = offersData.map(o => o.amount).filter(Boolean);
    const statsData = {
      total: offersData.length,
      pending: offersData.filter(o => o.status === "pending").length,
      accepted: offersData.filter(o => o.status === "accepted").length,
      declined: offersData.filter(o => o.status === "declined").length,
      averageAmount: amounts.length > 0 ? Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length) : 0,
      lowestAmount: amounts.length > 0 ? Math.min(...amounts) : 0,
      highestAmount: amounts.length > 0 ? Math.max(...amounts) : 0
    };
    setStats(statsData);
    
    // Update filter counts
    FILTER_OPTIONS.forEach(option => {
      if (option.value === "all") option.count = offersData.length;
      if (option.value === "pending") option.count = statsData.pending;
      if (option.value === "accepted") option.count = statsData.accepted;
      if (option.value === "declined") option.count = statsData.declined;
    });
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...offers];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(offer => offer.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(offer =>
        offer.tasker?.name?.toLowerCase().includes(query) ||
        offer.message?.toLowerCase().includes(query) ||
        offer.amount?.toString().includes(query)
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount_high":
          return (b.amount || 0) - (a.amount || 0);
        case "amount_low":
          return (a.amount || 0) - (b.amount || 0);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredOffers(result);
  }, [offers, statusFilter, searchQuery, sortBy]);

  const handleViewTasker = (taskerId) => {
    navigate(`/admin/tasker_info/${taskerId}`);
  };

  const handleAcceptOffer = (offer) => {
    // Implement API call to accept offer
    console.log("Accepting offer:", offer);
    showNotification("info", "Accept offer functionality to be implemented");
  };

  const handleDeclineOffer = (offer) => {
    // Implement API call to decline offer
    console.log("Declining offer:", offer);
    showNotification("info", "Decline offer functionality to be implemented");
  };

  const handleViewOfferDetails = (offer) => {
    setSelectedOffer(offer);
    setShowOfferModal(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("newest");
  };

  const showNotification = (type, text) => {
    NotificationCenter.show(type, text);
  };

  const acceptedOffer = useMemo(() => 
    offers.find(o => o.status === "accepted"), 
    [offers]
  );

  if (loading) return <LoadingSkeleton isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />;
  if (!request) return <NotFound isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />;

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/admin/${id}/service_request_info`)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Request
              </button>
              <div className="hidden sm:block text-gray-400">/</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Offers for {request.type}</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Request ID: #{request._id.slice(-8)} • {offers.length} offers received
                </p>
              </div>
            </div>

            <button
              onClick={fetchRequestDetail}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Offers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <MessageSquare className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${(stats.pending / Math.max(stats.total, 1)) * 100}%` }} />
                  <div className="h-full bg-green-500 -ml-full" style={{ width: `${(stats.accepted / Math.max(stats.total, 1)) * 100}%` }} />
                  <div className="h-full bg-red-500 -ml-full" style={{ width: `${(stats.declined / Math.max(stats.total, 1)) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-500">
                  {stats.pending}P {stats.accepted}A {stats.declined}D
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average Offer</p>
                  <p className="text-2xl font-bold text-gray-900">GHS {stats.averageAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Range: GHS {stats.lowestAmount.toLocaleString()} - GHS {stats.highestAmount.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {stats.pending > 0 ? "Needs attention" : "All reviewed"}
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Budget Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {request.budget ? `GHS ${request.budget.toLocaleString()}` : "Not set"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {acceptedOffer 
                  ? `Accepted: GHS ${acceptedOffer.amount?.toLocaleString()}`
                  : "No offer accepted"
                }
              </p>
            </div>
          </div>

          {/* Accepted Offer Banner */}
          {acceptedOffer && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Offer Accepted!</h3>
                    <p className="text-sm text-gray-600">
                      {acceptedOffer.tasker?.name} was selected for GHS {acceptedOffer.amount?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewTasker(acceptedOffer.tasker?._id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Tasker
                  </button>
                  <button
                    onClick={() => navigate(`/admin/service-requests/${id}`)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Request
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filters Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
            <div className="p-5 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search offers by tasker name, amount, or message..."
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                      {(statusFilter !== "all" || sortBy !== "newest") && (
                        <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs">
                          Active
                        </span>
                      )}
                    </button>
                  </div>

                  <select
                    className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {SORT_OPTIONS.map(option => {
                      const Icon = option.icon;
                      return (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status Filter
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {FILTER_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            onClick={() => setStatusFilter(option.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              statusFilter === option.value
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {option.label}
                            <span className="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                              {option.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1" />

                    <button
                      onClick={clearFilters}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}

              {/* Results Info */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div>
                  Showing <span className="font-medium">{filteredOffers.length}</span> of{" "}
                  <span className="font-medium">{offers.length}</span> offers
                </div>
                <div className="flex items-center gap-2">
                  {statusFilter !== "all" && (
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                      {statusFilter} only
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Offers List */}
          {filteredOffers.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {offers.length === 0 ? "No offers received yet" : "No offers match your filters"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {offers.length === 0
                    ? "Taskers haven't submitted any offers for this service request yet."
                    : "Try adjusting your search or filters to find what you're looking for."}
                </p>
                {offers.length === 0 ? (
                  <button
                    onClick={() => navigate(`/admin/service-requests/${id}`)}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Back to Request
                  </button>
                ) : (
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
            <div className="space-y-4">
              {filteredOffers.map((offer, index) => (
                <OfferCard
                  key={index}
                  offer={offer}
                  request={request}
                  onViewTasker={handleViewTasker}
                  onAccept={handleAcceptOffer}
                  onDecline={handleDeclineOffer}
                  onViewDetails={handleViewOfferDetails}
                />
              ))}
            </div>
          )}

          {/* Export/Download Section */}
          {offers.length > 0 && (
            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Export Offers Data</h3>
                  <p className="text-sm text-gray-600">
                    Download all offers for this request in CSV or PDF format
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                  <button className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Offer Details Modal */}
      {selectedOffer && (
        <OfferDetailsModal
          offer={selectedOffer}
          request={request}
          isOpen={showOfferModal}
          onClose={() => {
            setShowOfferModal(false);
            setSelectedOffer(null);
          }}
        />
      )}
    </div>
  );
};

// === SKELETON LOADER ===
const LoadingSkeleton = ({ isSidebarOpen, setIsSidebarOpen }) => (
  <div className="min-h-screen bg-gray-50">
    <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    
    <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          {[1,2,3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// === NOT FOUND ===
const NotFound = ({ isSidebarOpen, setIsSidebarOpen, navigate }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    
    <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
      <div className="text-center">
        <div className="inline-block p-6 bg-red-50 rounded-full mb-6">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Service Request Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The service request you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate("/admin/service-requests")}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
        >
          Back to Requests
        </button>
      </div>
    </div>
  </div>
);

export default AdminServiceRequestOffers;