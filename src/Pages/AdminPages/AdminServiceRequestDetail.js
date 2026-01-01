import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  serviceRequestDetail,
  updateServiceRequestStatus,
  cancelServiceRequest,
  deleteServiceRequest
} from "../../APIS/adminApi";
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
  Calendar,
  DollarSign,
  User,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Tag,
  Users,
  Building,
  Star,
  ExternalLink,
  Edit3,
  Save,
  Mail,
  Phone,
  Award,
  FileCheck,
  Shield,
  TrendingUp,
  Briefcase,
  XCircle,
  MoreVertical,
  Home,
  Clock as ClockIcon,
  UserCheck,
  FileCheck2,
  Activity,
  Eye,
  Download,
  Image as ImageIcon,
  Video,
  Play,
  X,
  Maximize2,
  Download as DownloadIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  FileImage,
  FileVideo,
  PhoneOutgoingIcon,
  MessageSquare,
  Trash2,
  Ban,
  Check,
  AlertTriangle,
  Map,
  Navigation,
  Globe,
  Wallet,
  CreditCard,
  ThumbUp,
  MessageCircle,
  Bell,
  Send,
  UserPlus,
  ClipboardList,
  Layers,
  Target
} from "lucide-react";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Status Configuration
const STATUS_CONFIG = {
  Pending: {
    color: "bg-gray-100 text-gray-700",
    icon: ClockIcon,
    label: "Pending",
    action: "Mark as Pending"
  },
  Quoted: {
    color: "bg-blue-100 text-blue-700",
    icon: MessageSquare,
    label: "Quoted",
    action: "Mark as Quoted"
  },
  Booked: {
    color: "bg-purple-100 text-purple-700",
    icon: Calendar,
    label: "Booked",
    action: "Mark as Booked"
  },
  "In-progress": {
    color: "bg-amber-100 text-amber-700",
    icon: TrendingUp,
    label: "In Progress",
    action: "Mark as In Progress"
  },
  Review: {
    color: "bg-indigo-100 text-indigo-700",
    icon: FileCheck,
    label: "Review",
    action: "Mark as Review"
  },
  Canceled: {
    color: "bg-red-100 text-red-700",
    icon: Ban,
    label: "Canceled",
    action: "Cancel Request"
  },
  Completed: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    label: "Completed",
    action: "Mark as Completed"
  },
  Closed: {
    color: "bg-gray-800 text-gray-100",
    icon: Shield,
    label: "Closed",
    action: "Close Request"
  }
};

// Urgency Configuration
const URGENCY_CONFIG = {
  flexible: {
    color: "bg-green-100 text-green-700",
    icon: Calendar,
    label: "Flexible"
  },
  urgent: {
    color: "bg-red-100 text-red-700",
    icon: AlertTriangle,
    label: "Urgent"
  },
  scheduled: {
    color: "bg-blue-100 text-blue-700",
    icon: ClockIcon,
    label: "Scheduled"
  }
};

// Media Viewer Component
const MediaViewer = ({ media, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentMedia = media?.[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  }, [media?.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [media?.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goNext, goPrev]);

  if (!isOpen || !media?.length) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative w-full h-full max-w-6xl mx-auto p-4 flex items-center">
        <button
          onClick={goPrev}
          className="absolute left-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          disabled={media.length <= 1}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex-1 h-full flex items-center justify-center">
          <div className="relative max-w-full max-h-[80vh]">
            {currentMedia?.type === 'image' ? (
              <img
                src={currentMedia.url}
                alt="Service media"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
              />
            )}
          </div>
        </div>

        <button
          onClick={goNext}
          className="absolute right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          disabled={media.length <= 1}
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {media.length}
        </div>

        <a
          href={currentMedia?.url}
          download
          className="absolute bottom-4 right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <DownloadIcon className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

// Media Gallery Component
const MediaGallery = ({ media }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  if (!media?.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-600" />
          Media Attachments
        </h3>
        <div className="text-center py-8">
          <FileImage className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No media attachments</p>
          <p className="text-gray-400 text-sm mt-1">No images or videos were uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              Media Attachments ({media.length})
            </h3>
            <button
              onClick={() => setViewerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {media.slice(0, 8).map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  setViewerOpen(true);
                }}
                className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={`Service media ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="relative w-full h-full bg-gray-900">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <div className="flex items-center gap-1 text-white text-xs">
                    {item.type === 'image' ? (
                      <FileImage className="w-3 h-3" />
                    ) : (
                      <FileVideo className="w-3 h-3" />
                    )}
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {media.length > 8 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setViewerOpen(true)}
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium"
              >
                + {media.length - 8} more files
              </button>
            </div>
          )}
        </div>
      </div>

      <MediaViewer
        media={media}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
};

// Offers List Component
const OffersList = ({ offers, requestId }) => {
  const navigate = useNavigate();

  if (!offers?.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          Offers (0)
        </h3>
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No offers received yet</p>
          <p className="text-gray-400 text-sm mt-1">Taskers can submit offers for this request</p>
        </div>
      </div>
    );
  }

  const acceptedOffer = offers.find(offer => offer.status === "accepted");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Offers ({offers.length})
          </h3>
          <p className="text-gray-600 text-sm mt-1">Tasker proposals for this service</p>
        </div>
        {acceptedOffer && (
          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            Offer Accepted
          </span>
        )}
      </div>

      <div className="space-y-4">
        {offers.map((offer, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg ${
              offer.status === "accepted"
                ? "border-green-300 bg-green-50"
                : offer.status === "declined"
                ? "border-red-200 bg-red-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Offer #{index + 1}</p>
                  <p className="text-sm text-gray-600">
                    {dayjs(offer.createdAt).format("MMM DD, YYYY [at] h:mm A")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    GHS {offer.amount?.toLocaleString()}
                  </p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    offer.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : offer.status === "declined"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {offer.status}
                  </span>
                </div>
                
                <button
                  onClick={() => navigate(`/admin/tasker/${offer.tasker}`)}
                  className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  View Tasker
                </button>
              </div>
            </div>

            {offer.message && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 italic">"{offer.message}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor = "red" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white rounded-2xl shadow-xl transform transition-all">
          <div className="flex items-center mb-5">
            <div className={`p-3 rounded-full ${confirmColor === "red" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"} mr-4`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">This action requires confirmation</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700">{message}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 ${
                confirmColor === "red"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-lg text-sm font-medium transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminServiceRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const [showActions, setShowActions] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showNotification = (type, text) => {
    NotificationCenter.show(type, text);
  };

  useEffect(() => {
    fetchRequestDetail();
  }, [id]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const res = await serviceRequestDetail(id);
      if (res.status === 200) {
        setRequest(res.data);
        setStatus(res.data.status);
      }
    } catch (err) {
      showNotification("error", "Failed to load service request");
      navigate("/admin/service-requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (status === request.status || updating) return;
    try {
      setUpdating(true);
      const res = await updateServiceRequestStatus(id, { status });
      if (res.status === 200) {
        setRequest(prev => ({ ...prev, status }));
        showNotification("success", `Status updated to ${status}`);
      }
    } catch (err) {
      showNotification("error", "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelRequest = async () => {
    try {
      const res = await cancelServiceRequest(id);
      if (res.status === 200) {
        setRequest(prev => ({ ...prev, status: "Canceled" }));
        setStatus("Canceled");
        showNotification("success", "Service request cancelled");
        setShowCancelModal(false);
      }
    } catch (err) {
      showNotification("error", "Failed to cancel request");
    }
  };

  const handleDeleteRequest = async () => {
    try {
      const res = await deleteServiceRequest(id);
      if (res.status === 200) {
        showNotification("success", "Service request deleted");
        navigate("/admin/service-requests");
      }
    } catch (err) {
      showNotification("error", "Failed to delete request");
    }
  };

  const formatDate = (d) => dayjs(d).format("MMM DD, YYYY [at] h:mm A");
  const formatTime = (t) => dayjs(t, "HH:mm").format("h:mm A");

  const config = STATUS_CONFIG[request?.status] || STATUS_CONFIG.Pending;
  const StatusIcon = config.icon;
  const UrgencyConfig = URGENCY_CONFIG[request?.urgency] || URGENCY_CONFIG.flexible;
  const UrgencyIcon = UrgencyConfig.icon;

  // Stats calculation
  const stats = useMemo(() => {
    if (!request) return [];
    
    return [
      {
        icon: <DollarSign className="w-5 h-5 text-blue-600" />,
        label: "Budget",
        value: request.budget ? `GHS ${request.budget.toLocaleString()}` : "Not specified",
        sub: "Client's budget"
      },
      {
        icon: <Calendar className="w-5 h-5 text-orange-600" />,
        label: "Preferred Date",
        value: request.preferredDate 
          ? dayjs(request.preferredDate).format("MMM DD") 
          : "Flexible",
        sub: request.preferredTime ? `at ${formatTime(request.preferredTime)}` : "Time flexible"
      },
      {
        icon: <Users className="w-5 h-5 text-purple-600" />,
        label: "Offers",
        value: request.offers?.length || 0,
        sub: request.offers?.some(o => o.status === "accepted") ? "One accepted" : "View all"
      },
      {
        icon: <UserCheck className="w-5 h-5 text-green-600" />,
        label: "Assigned",
        value: request.assignedTasker ? "Yes" : "No",
        sub: request.assignedTasker ? "Tasker assigned" : "Not assigned"
      }
    ];
  }, [request]);

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
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Requests
              </button>
              <div className="hidden sm:block text-gray-400">/</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Request ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  #{request._id.slice(-8)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
             {/* <button
                onClick={() => navigate(`/admin/service-requests/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>*/}
              
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                  Actions
                </button>
                
                {showActions && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        navigate(`/admin/${id}/service_request_offers`);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <div>
                        <div className="font-medium">View All Offers</div>
                        <div className="text-xs text-gray-500">{request.offers?.length || 0} offers</div>
                      </div>
                    </button>
                   {/* <button
                      onClick={() => {
                        // Navigate to assign tasker page
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                    >
                      <UserPlus className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Assign Tasker</div>
                        <div className="text-xs text-gray-500">Manually assign a tasker</div>
                      </div>
                    </button>*/}
                    <button
                      onClick={() => {
                        setShowCancelModal(true);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600"
                      disabled={request.status === "Canceled"}
                    >
                      <Ban className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Cancel Request</div>
                        <div className="text-xs text-red-500">Stop this service request</div>
                      </div>
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Delete Request</div>
                        <div className="text-xs text-red-500">Permanently remove</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {config.label}
                  </span>
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${UrgencyConfig.color}`}>
                    <UrgencyIcon className="w-4 h-4" />
                    {UrgencyConfig.label}
                  </span>
                  <span className="text-sm text-gray-600">
                    Created {dayjs(request.createdAt).fromNow()}
                  </span>
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  {request.type}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{request.client?.name || "Unknown Client"}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{request.offers?.length || 0} offers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {request.preferredDate 
                          ? dayjs(request.preferredDate).format("MMM DD, YYYY")
                          : "No date set"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  onClick={() => navigate(`/admin/${id}/service_request_offers`)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  View Offers
                </button>
                <button
                  onClick={() => navigate(`/admin/get/user_info/${request.client?._id}`)}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  View Client
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    index === 0 ? 'bg-blue-50 text-blue-600' :
                    index === 1 ? 'bg-orange-50 text-orange-600' :
                    index === 2 ? 'bg-purple-50 text-purple-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-xl font-bold mb-2 text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Tabs Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs Navigation */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {[
                    { id: "overview", label: "Overview", icon: <Home className="w-4 h-4" /> },
                    { id: "media", label: "Media", icon: <ImageIcon className="w-4 h-4" />, count: request.media?.length },
                    { id: "offers", label: "Offers", icon: <MessageSquare className="w-4 h-4" />, count: request.offers?.length },
                    { id: "client", label: "Client", icon: <User className="w-4 h-4" /> },
                    { id: "location", label: "Location", icon: <MapPin className="w-4 h-4" /> },
                    { id: "activity", label: "Activity", icon: <Activity className="w-4 h-4" /> },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-colors relative ${
                        tab === t.id
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {t.icon}
                      {t.label}
                      {t.count !== undefined && (
                        <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                          tab === t.id
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {t.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {tab === "overview" && <OverviewTab request={request} formatDate={formatDate} />}
                {tab === "media" && <MediaGallery media={request.media} />}
                {tab === "offers" && <OffersList offers={request.offers} requestId={request._id} />}
                {tab === "client" && <ClientTab request={request} navigate={navigate} formatDate={formatDate} />}
                {tab === "location" && <LocationTab request={request} />}
                {tab === "activity" && <ActivityTab request={request} formatDate={formatDate} />}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Status Update Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  Update Status
                </h3>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors mb-3"
                >
                  {Object.keys(STATUS_CONFIG).map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={status === request.status || updating}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    status === request.status || updating
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:from-indigo-700 hover:to-purple-700'
                  }`}
                >
                  {updating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Status
                    </>
                  )}
                </button>
              </div>

              {/* Request Details Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  Request Details
                </h3>
                <div className="space-y-3">
                  <DetailRow label="Request ID" value={request._id.slice(-8)} copyable />
                  <DetailRow label="Created" value={formatDate(request.createdAt)} />
                  <DetailRow label="Updated" value={formatDate(request.updatedAt)} />
                  <DetailRow label="Service Type" value={request.type} />
                  <DetailRow label="Urgency" value={
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${UrgencyConfig.color}`}>
                      {UrgencyConfig.label}
                    </span>
                  } />
                  {request.budget && (
                    <DetailRow label="Budget" value={`GHS ${request.budget.toLocaleString()}`} />
                  )}
                  {request.finalCost && (
                    <DetailRow label="Final Cost" value={`GHS ${request.finalCost.toLocaleString()}`} />
                  )}
                </div>
              </div>

              {/* Assigned Tasker Card */}
              {request.assignedTasker && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Assigned Tasker
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    {request.assignedTasker.profileImage ? (
                      <img
                        src={request.assignedTasker.profileImage}
                        alt={request.assignedTasker.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {request.assignedTasker.name?.[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{request.assignedTasker.name}</p>
                      <p className="text-sm text-gray-600 truncate">{request.assignedTasker.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/tasker_info/${request.assignedTasker._id}`)}
                    className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    View Profile
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Completion Status Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  Completion Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Client Marked Done</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.markedDoneByEmployer ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {request.markedDoneByEmployer ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tasker Marked Done</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.markedDoneByTasker ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {request.markedDoneByTasker ? "Yes" : "No"}
                    </span>
                  </div>
                  {request.funded && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Status</span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        Funded
                      </span>
                    </div>
                  )}
                  {request.feedback?.rating && (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{request.feedback.rating}/5</span>
                      </div>
                      {request.feedback.comment && (
                        <p className="text-sm text-gray-600 mt-1 italic">"{request.feedback.comment}"</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRequest}
        title="Cancel Service Request"
        message="Are you sure you want to cancel this service request? This action cannot be undone and will notify the client."
        confirmText="Cancel Request"
        confirmColor="red"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteRequest}
        title="Delete Service Request"
        message="This action will permanently delete the service request and all associated data. This cannot be undone."
        confirmText="Delete Request"
        confirmColor="red"
      />
    </div>
  );
};

// === COMPONENTS ===
const DetailRow = ({ label, value, copyable = false }) => (
  <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <div className="flex items-center gap-2 max-w-[60%]">
      <span className="text-sm font-medium text-gray-900 text-right truncate">{value}</span>
      {copyable && (
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 flex-shrink-0"
          title="Copy to clipboard"
        >
          <FileText className="w-3 h-3" />
        </button>
      )}
    </div>
  </div>
);

// === TABS ===
const OverviewTab = ({ request, formatDate }) => (
  <div className="space-y-6">
    {/* Description */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        Service Description
      </h2>
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {request.description || "No description provided."}
        </p>
      </div>
    </div>

    {/* Requirements */}
    {request.requirements && request.requirements.length > 0 && (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-indigo-600" />
          Requirements ({request.requirements.length})
        </h2>
        <ul className="space-y-3">
          {request.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Timeline */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-600" />
        Timeline
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Created</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(request.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Last Updated</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(request.updatedAt)}</p>
          </div>
        </div>
        
        {request.preferredDate && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Preferred Schedule</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {dayjs(request.preferredDate).format("dddd, MMMM DD, YYYY")}
              </span>
              {request.preferredTime && (
                <>
                  <span className="text-gray-300">•</span>
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {dayjs(request.preferredTime, "HH:mm").format("h:mm A")}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ClientTab = ({ request, navigate, formatDate }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          Client Information
        </h2>
        <p className="text-gray-600">Contact details and client profile</p>
      </div>
      <button
        onClick={() => navigate(`/admin/get/user_info/${request.client?._id}`)}
        className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
      >
        View Full Profile
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            {request.client?.profileImage ? (
              <img
                src={request.client.profileImage}
                alt={request.client.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {request.client?.name?.[0] || "U"}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-gray-900">{request.client?.name || "Unknown"}</p>
              <p className="text-sm text-gray-600">Client</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{request.client?.email || "No email"}</span>
            </div>
            {request.client?.phone && (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{request.client.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Member since {request.client?.createdAt ? formatDate(request.client.createdAt) : "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="space-y-2">
          {request.client?.phone && (
            <a
              href={`tel:${request.client.phone}`}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PhoneOutgoingIcon className="w-4 h-4" />
              Call Client
            </a>
          )}
          {request.client?.email && (
            <a
              href={`mailto:${request.client.email}`}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email Client
            </a>
          )}
          <button
            onClick={() => navigate(`/admin/service-requests?client=${request.client?._id}`)}
            className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            View All Requests
          </button>
        </div>
      </div>
    </div>
  </div>
);

const LocationTab = ({ request }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <MapPin className="w-5 h-5 text-indigo-600" />
      Location Details
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {request.address ? (
            <div className="space-y-3">
              {request.address.suburb && (
                <div>
                  <p className="text-xs text-gray-500">Suburb/Town</p>
                  <p className="text-sm font-medium text-gray-900">{request.address.suburb}</p>
                </div>
              )}
              {request.address.city && (
                <div>
                  <p className="text-xs text-gray-500">City</p>
                  <p className="text-sm font-medium text-gray-900">{request.address.city}</p>
                </div>
              )}
              {request.address.region && (
                <div>
                  <p className="text-xs text-gray-500">Region</p>
                  <p className="text-sm font-medium text-gray-900">{request.address.region}</p>
                </div>
              )}
              {(request.address.latitude && request.address.longitude) && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Coordinates</p>
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Globe className="w-4 h-4" />
                    {request.address.latitude.toFixed(6)}, {request.address.longitude.toFixed(6)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">No address information provided</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Map & Navigation</h3>
        <div className="bg-gray-900 rounded-lg h-48 flex items-center justify-center">
          <div className="text-center">
            <Map className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Map preview would be displayed here</p>
            <p className="text-gray-500 text-xs mt-1">Using coordinates: {request.address?.latitude}, {request.address?.longitude}</p>
          </div>
        </div>
        
        {request.address?.latitude && request.address?.longitude && (
          <div className="flex gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${request.address.latitude},${request.address.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Open in Maps
            </a>
            <button className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <DownloadIcon className="w-4 h-4" />
              Get Directions
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ActivityTab = ({ request, formatDate }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <Activity className="w-5 h-5 text-indigo-600" />
      Activity Timeline
    </h2>
    
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-green-600" />
          </div>
          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
        </div>
        <div className="flex-1 pb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Request Created</h3>
          <p className="text-sm text-gray-600">{formatDate(request.createdAt)}</p>
          <p className="text-sm text-gray-500 mt-1">Service request was submitted by client</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
        </div>
        <div className="flex-1 pb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Last Updated</h3>
          <p className="text-sm text-gray-600">{formatDate(request.updatedAt)}</p>
          <p className="text-sm text-gray-500 mt-1">Request details were last modified</p>
        </div>
      </div>

      {request.preferredDate && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
          </div>
          <div className="flex-1 pb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Preferred Service Date</h3>
            <p className="text-sm text-gray-600">
              {dayjs(request.preferredDate).format("dddd, MMMM DD, YYYY")}
              {request.preferredTime && ` at ${dayjs(request.preferredTime, "HH:mm").format("h:mm A")}`}
            </p>
            <p className={`text-sm font-medium mt-1 ${
              dayjs(request.preferredDate).isBefore() ? 'text-red-600' : 'text-green-600'
            }`}>
              {dayjs(request.preferredDate).isBefore() ? 'Date has passed' : 'Upcoming'}
            </p>
          </div>
        </div>
      )}

      {request.offers && request.offers.length > 0 && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Offers Received</h3>
            <p className="text-sm text-gray-600">{request.offers.length} offers submitted</p>
            {request.offers.some(o => o.status === "accepted") && (
              <p className="text-sm text-green-600 mt-1">✓ One offer accepted</p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

// === SKELETON LOADER ===
const LoadingSkeleton = ({ isSidebarOpen, setIsSidebarOpen }) => (
  <div className="min-h-screen bg-gray-50">
    <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    
    <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded-xl"></div>
              <div className="h-48 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
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
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
        >
          Back to Requests
        </button>
      </div>
    </div>
  </div>
);

export default AdminServiceRequestDetail;