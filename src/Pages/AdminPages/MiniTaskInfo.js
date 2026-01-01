import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar, DollarSign, User, MapPin, CheckCircle, Clock, ArrowLeft,
  ChevronRight, AlertCircle, FileText, Tag, Users, Building, Star,
  ExternalLink, Edit3, Save, Mail, Phone, Award, FileCheck,
  Shield, TrendingUp, Briefcase, XCircle, MoreVertical,
  Home, Clock as ClockIcon, UserCheck, FileCheck2, Activity, Eye, Download,
  Image as ImageIcon, Video, Play, X, Maximize2, Download as DownloadIcon,
  ChevronLeft, ChevronRight as ChevronRightIcon, FileImage, FileVideo
} from "lucide-react";
import { getSingleMinitask, modifyMiniTaskStatus } from '../../APIS/API';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";

dayjs.extend(relativeTime);

// === STATUS CONFIG ===
const STATUS_CONFIG = {
  Pending: { color: "bg-gray-100 text-gray-700", icon: ClockIcon, label: "Pending" },
  Open: { color: "bg-emerald-100 text-emerald-700", icon: Award, label: "Open" },
  "In-progress": { color: "bg-blue-100 text-blue-700", icon: TrendingUp, label: "In Progress" },
  Assigned: { color: "bg-amber-100 text-amber-700", icon: Briefcase, label: "Assigned" },
  Review: { color: "bg-purple-100 text-purple-700", icon: FileCheck, label: "Review" },
  Rejected: { color: "bg-red-100 text-red-700", icon: XCircle, label: "Rejected" },
  Completed: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Completed" },
  Closed: { color: "bg-red-100 text-red-700", icon: Shield, label: "Closed" },
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
                alt="Task media"
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

        {/* Media counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {media.length}
        </div>

        {/* Download button */}
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-600" />
          Media Attachments
        </h3>
        <div className="text-center py-8">
          <FileImage className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No media attachments</p>
          <p className="text-gray-400 text-sm mt-1">No images or videos were uploaded for this task</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                    alt={`Task media ${index + 1}`}
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
                + {media.length - 8} more media files
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

const AdminMiniTaskDetailPage = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const [showActions, setShowActions] = useState(false);

  const showNotification = (type, text) => {
    NotificationCenter.show(type, text);
  };

  useEffect(() => {
    fetchTask();
  }, [Id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await getSingleMinitask(Id);
      if (res.status === 200) {
        setTask(res.data);
        setStatus(res.data.status);
      }
    } catch (err) {
      showNotification("error", "Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (status === task.status) return;
    try {
      setUpdating(true);
      const res = await modifyMiniTaskStatus(task._id, { status });
      if (res.status === 200) {
        setTask(prev => ({ ...prev, status }));
        showNotification("success", `Status updated to ${status}`);
      }
    } catch (err) {
      showNotification("error", "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (d) => dayjs(d).format("MMM DD, YYYY [at] h:mm A");
  const fromNow = (d) => dayjs(d).fromNow();

  const config = STATUS_CONFIG[task?.status] || STATUS_CONFIG.Pending;
  const StatusIcon = config.icon;

  const applicantCount = useMemo(() => task?.applicants?.length || 0, [task]);
  const bidCount = useMemo(() => task?.bids?.length || 0, [task]);

  // Stats card data
  const stats = useMemo(() => [
    {
      icon: <DollarSign className="w-5 h-5 text-blue-600" />,
      label: "Budget",
      value: `GHS ${task?.budget?.toLocaleString()}`,
      sub: task?.biddingType === "fixed" ? "Fixed Price" : "Open Bidding",
      color: "blue"
    },
    {
      icon: <Calendar className="w-5 h-5 text-orange-600" />,
      label: "Deadline",
      value: task ? dayjs(task.deadline).format("MMM DD") : "",
      sub: task ? (dayjs(task.deadline).isBefore() ? "Overdue" : `${dayjs(task.deadline).fromNow(true)} left`) : "",
      overdue: task ? dayjs(task.deadline).isBefore() : false,
      color: "orange"
    },
    {
      icon: <Users className="w-5 h-5 text-purple-600" />,
      label: "Applicants",
      value: applicantCount,
      sub: "View all",
      color: "purple",
      onClick: () => navigate(`/admin/minitask/${task?._id}/applicants`, { state: { applicants: task?.applicants } })
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-green-600" />,
      label: "Bids",
      value: bidCount,
      sub: task?.biddingType || "N/A",
      color: "green",
      onClick: () => navigate(`/admin/${task?._id}/mini_task_info/bids`)
    }
  ], [task, applicantCount, bidCount, navigate]);

  if (loading) return <LoadingSkeleton isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />;
  if (!task) return <NotFound isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <NotificationCenter />

      {/* Main Content Area - Fixed layout */}
      <div className={`lg:pl-64 flex flex-col flex-1`}>
        {/* Fixed Navbar */}
        <AdminNavbar 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />

        {/* Main Content Container */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Tasks
              </button>
              <div className="hidden sm:block text-gray-400">/</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Task ID:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  #{task._id.slice(-8)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/admin/${task._id}/modify_min_task`)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Task
              </button>
              
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
                      onClick={() => { navigate(`/admin/curate_task_pool/${task._id}`); setShowActions(false); }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                    >
                      <Users className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Curate Task Pool</div>
                        <div className="text-xs text-gray-500">Manage applicants</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { navigate(`/admin/view_task_pool/${task._id}`); setShowActions(false); }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                      <div>
                        <div className="font-medium">View Task Pool</div>
                        <div className="text-xs text-gray-500">See all applicants</div>
                      </div>
                    </button>
                    <hr className="my-2" />
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                      <Download className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Export Data</div>
                        <div className="text-xs text-gray-500">Download task details</div>
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
                  <span className="text-sm text-gray-600">
                    Posted {fromNow(task.createdAt)}
                  </span>
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  {task.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span className="text-sm">{task.category}</span>
                    {task.subcategory && (
                      <>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{task.subcategory}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{applicantCount} applicants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{bidCount} bids</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  onClick={() => navigate(`/admin/minitask/${task?._id}/applicants`, { state: { applicants: task?.applicants } })}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  View Applicants
                </button>
                <button
                  onClick={() => navigate(`/admin/${task._id}/mini_task_info/bids`)}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  View Bids
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                onClick={stat.onClick}
                className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  stat.onClick ? 'hover:border-gray-300 active:scale-[0.98]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.color === 'blue' ? 'bg-blue-50' : stat.color === 'orange' ? 'bg-orange-50' : stat.color === 'purple' ? 'bg-purple-50' : 'bg-green-50'}`}>
                    {stat.icon}
                  </div>
                  {stat.overdue && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                      Overdue
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className={`text-xl font-bold mb-2 ${stat.overdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Tabs Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs Navigation */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {[
                    { id: "overview", label: "Overview", icon: <Home className="w-4 h-4" /> },
                    { id: "media", label: "Media", icon: <ImageIcon className="w-4 h-4" />, count: task.media?.length },
                    { id: "employer", label: "Employer", icon: <User className="w-4 h-4" /> },
                    { id: "applicants", label: "Applicants", icon: <Users className="w-4 h-4" />, count: applicantCount },
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
                {tab === "overview" && <OverviewTab task={task} formatDate={formatDate} />}
                {tab === "media" && <MediaGallery media={task.media} />}
                {tab === "employer" && <EmployerTab task={task} navigate={navigate} formatDate={formatDate} />}
                {tab === "applicants" && <ApplicantsTab task={task} navigate={navigate} />}
                {tab === "activity" && <ActivityTab task={task} formatDate={formatDate} />}
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
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors mb-3"
                >
                  {Object.keys(STATUS_CONFIG).map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
                <button
                  onClick={handleStatusChange}
                  disabled={status === task.status || updating}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    status === task.status || updating
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
                      Save Status
                    </>
                  )}
                </button>
              </div>

              {/* Task Details Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  Task Details
                </h3>
                <div className="space-y-3">
                  <DetailRow label="Task ID" value={task._id.slice(-8)} copyable />
                  <DetailRow label="Created" value={formatDate(task.createdAt)} />
                  <DetailRow label="Updated" value={formatDate(task.updatedAt)} />
                  <DetailRow label="Type" value={task.biddingType} />
                  <DetailRow label="Location" value={
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      task.locationType === "remote" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {task.locationType}
                    </span>
                  } />
                  {task.address && (
                    <DetailRow label="Address" value={`${task.address.suburb}, ${task.address.city}`} />
                  )}
                </div>
              </div>

              {/* Assigned Tasker Card */}
              {task.assignedTo && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Assigned Tasker
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    {task.assignedTo.profileImage ? (
                      <img
                        src={task.assignedTo.profileImage}
                        alt={task.assignedTo.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {task.assignedTo.name?.[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{task.assignedTo.name}</p>
                      <p className="text-sm text-gray-600 truncate">{task.assignedTo.phone}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.assignmentAccepted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {task.assignmentAccepted ? "Accepted" : "Pending"}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/tasker_info/${task.assignedTo._id}`)}
                    className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    View Profile
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action FAB */}
        <button
          onClick={() => navigate(`/admin/minitask/${task._id}/applicants`)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40"
        >
          <div className="relative">
            <Users className="w-6 h-6" />
            {applicantCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {applicantCount > 99 ? '99+' : applicantCount}
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

// === COMPONENTS ===
const DetailRow = ({ label, value, copyable = false }) => (
  <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
      {copyable && (
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
          title="Copy to clipboard"
        >
          <FileText className="w-3 h-3" />
        </button>
      )}
    </div>
  </div>
);

// === TABS ===
const OverviewTab = ({ task, formatDate }) => (
  <div className="space-y-6">
    {/* Description */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        Description
      </h2>
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {task.description || "No description provided."}
        </p>
      </div>
    </div>

    {/* Skills Required */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-indigo-600" />
        Skills Required
      </h2>
      <div className="flex flex-wrap gap-2">
        {task.skillsRequired?.length > 0 ? (
          task.skillsRequired.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-gray-500 italic">No specific skills required</p>
        )}
      </div>
    </div>

    {/* Requirements */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-indigo-600" />
        Requirements
      </h2>
      {task.requirements?.length > 0 ? (
        <ul className="space-y-3">
          {task.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{requirement}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No additional requirements specified</p>
        </div>
      )}
    </div>

    {/* Location Details */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-indigo-600" />
        Location Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Type</h3>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
            task.locationType === "remote" 
              ? "bg-green-100 text-green-700" 
              : "bg-blue-100 text-blue-700"
          }`}>
            {task.locationType}
          </span>
        </div>
        {task.address && (
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Address</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-900">{task.address.suburb}</p>
              <p className="text-sm text-gray-900">{task.address.city}</p>
              {task.address.landmark && (
                <p className="text-sm text-gray-600">Near {task.address.landmark}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const EmployerTab = ({ task, navigate, formatDate }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          Employer Profile
        </h2>
        <p className="text-gray-600">Contact information and statistics</p>
      </div>
      <button
        onClick={() => navigate(`/admin/get/user_info/${task.employer?._id}`)}
        className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
      >
        View Full Profile
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        <div className="space-y-3">
          <DetailRow label="Full Name" value={task.employer?.name || "N/A"} />
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{task.employer?.email || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{task.employer?.phone || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
        <div className="space-y-3">
          <DetailRow label="Member Since" value={task.employer?.createdAt ? formatDate(task.employer.createdAt) : "N/A"} />
          <DetailRow label="Tasks Posted" value={task.employer?.tasksCount || 0} />
          <DetailRow label="Rating" value={
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{task.employer?.rating || "N/A"}</span>
            </div>
          } />
        </div>
      </div>
    </div>
  </div>
);

const ApplicantsTab = ({ task, navigate }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Applicants ({task.applicants?.length || 0})
        </h2>
        <p className="text-gray-600">People who have applied for this task</p>
      </div>
      <button
        onClick={() => navigate(`/admin/minitask/${task?._id}/applicants`, { state: { applicants: task?.applicants } })}
        className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium text-sm transition-colors"
      >
        View All Applicants
      </button>
    </div>

    {task.applicants?.length > 0 ? (
      <div className="space-y-4">
        {task.applicants.slice(0, 5).map(applicant => (
          <div key={applicant._id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {applicant.profileImage ? (
                  <img
                    src={applicant.profileImage}
                    alt={applicant.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {applicant.name?.[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{applicant.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{applicant.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{applicant.rating || "N/A"}</span>
                </div>
                <button
                  onClick={() => navigate(`/admin/tasker_info/${applicant._id}`)}
                  className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}

        {task.applicants.length > 5 && (
          <button
            onClick={() => navigate(`/admin/minitask/${task._id}/applicants`)}
            className="w-full py-3 text-center border-2 border-dashed border-gray-300 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 rounded-lg font-medium transition-colors"
          >
            Show {task.applicants.length - 5} more applicants
          </button>
        )}
      </div>
    ) : (
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No applicants yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          This task hasn't received any applications yet. Check back later or review the task visibility.
        </p>
      </div>
    )}
  </div>
);

const ActivityTab = ({ task, formatDate }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <Activity className="w-5 h-5 text-indigo-600" />
      Activity Timeline
    </h2>
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
        </div>
        <div className="flex-1 pb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Task Created</h3>
          <p className="text-sm text-gray-600">{formatDate(task.createdAt)}</p>
          <p className="text-sm text-gray-500 mt-1">Task was posted by employer</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <ClockIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
        </div>
        <div className="flex-1 pb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Last Updated</h3>
          <p className="text-sm text-gray-600">{formatDate(task.updatedAt)}</p>
          <p className="text-sm text-gray-500 mt-1">Task details were last modified</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <ClockIcon className="w-4 h-4 text-amber-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">Deadline</h3>
          <p className="text-sm text-gray-600">{formatDate(task.deadline)}</p>
          <p className={`text-sm font-medium mt-1 ${
            dayjs(task.deadline).isBefore() ? 'text-red-600' : 'text-green-600'
          }`}>
            {dayjs(task.deadline).isBefore() ? 'Deadline passed' : 'Active'}
          </p>
        </div>
      </div>
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
          {/* Breadcrumb skeleton */}
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          
          {/* Hero skeleton */}
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          
          {/* Content skeleton */}
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
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Task Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The task you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
        >
          Go Back to Tasks
        </button>
      </div>
    </div>
  </div>
);

export default AdminMiniTaskDetailPage;