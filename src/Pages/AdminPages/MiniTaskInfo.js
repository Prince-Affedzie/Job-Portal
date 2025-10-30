import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar, DollarSign, User, MapPin, CheckCircle, Clock, ArrowLeft,
  ChevronRight, AlertCircle, FileText, Tag, Users, Building, Star,
  ExternalLink, Edit3, Save, Mail, Phone, Award, FileCheck,
  Shield, TrendingUp, Briefcase, XCircle, MoreVertical,
  Home, Clock as ClockIcon, UserCheck, FileCheck2, Activity, Eye, Download
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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('[data-sidebar]');
      const navbarToggle = document.querySelector('[data-navbar-toggle]');
      
      if (isSidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target) && 
          navbarToggle && 
          !navbarToggle.contains(event.target) &&
          window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  if (loading) return <LoadingSkeleton isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />;
  if (!task) return <NotFound isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar with proper positioning */}
      <div 
        data-sidebar
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:inset-auto`}
      >
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <NotificationCenter />

      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <AdminNavbar 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />

        {/* Main Content with proper sidebar offset */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? 'md:ml-64' : 'ml-0'
          }`}
        >
          <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Breadcrumbs + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4" /> 
                  <span className="hidden xs:inline">Back</span>
                </button>
                <span className="text-gray-400">/</span>
                <span className="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">
                  MiniTask #{task._id.slice(-6)}
                </span>
              </div>

              <div className="relative self-end sm:self-auto">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all border border-gray-200"
                >
                  <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </button>
                {showActions && (
                  <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50">
                    <button
                      onClick={() => { navigate(`/admin/curate_task_pool/${task._id}`); setShowActions(false); }}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 text-left rounded-lg hover:bg-indigo-50 flex items-center gap-2 sm:gap-3 text-gray-700 text-sm sm:text-base"
                    >
                      <Users className="w-4 h-4" /> Curate Task Pool
                    </button>
                    <button
                      onClick={() => { navigate(`/admin/view_task_pool/${task._id}`); setShowActions(false); }}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 text-left rounded-lg hover:bg-indigo-50 flex items-center gap-2 sm:gap-3 text-gray-700 text-sm sm:text-base"
                    >
                      <Eye className="w-4 h-4" /> View Task Pool
                    </button>
                    <hr className="my-2" />
                    <button className="w-full px-3 py-2 sm:px-4 sm:py-3 text-left rounded-lg hover:bg-indigo-50 flex items-center gap-2 sm:gap-3 text-gray-700 text-sm sm:text-base">
                      <Download className="w-4 h-4" /> Export Data
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Hero Card */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {config.label}
                      </span>
                      <span className="text-sm text-gray-600">
                        Created {fromNow(task.createdAt)}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                      {task.title}
                    </h1>
                    <p className="text-gray-600 flex items-center mt-1 flex-wrap gap-1 text-sm sm:text-base">
                      <Building className="w-4 h-4 flex-shrink-0" />
                      {task.category} {task.subcategory && `→ ${task.subcategory}`}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => navigate(`/admin/minitask/${task._id}/applicants`, { state: { applicants: task.applicants } })}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Users className="w-4 h-4" />
                      {applicantCount} Applicants
                    </button>
                    <button
                      onClick={() => navigate(`/admin/${task._id}/mini_task_info/bids`)}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <TrendingUp className="w-4 h-4" />
                      {task.bids?.length || 0} Bids
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="p-4 sm:p-6 border-t border-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatCard
                    icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />}
                    label="Budget"
                    value={`GHS ${task.budget?.toLocaleString()}`}
                    sub={task.biddingType === "fixed" ? "Fixed" : "Open"}
                  />
                  <StatCard
                    icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />}
                    label="Deadline"
                    value={formatDate(task.deadline)}
                    sub={dayjs(task.deadline).isBefore() ? "Overdue" : `${dayjs(task.deadline).fromNow(true)} left`}
                    overdue={dayjs(task.deadline).isBefore()}
                  />
                  <StatCard
                    icon={<Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />}
                    label="Applicants"
                    value={applicantCount}
                    sub="Tap to review"
                    onClick={() =>navigate(`/admin/minitask/${task._id}/applicants`, { state: { applicants: task.applicants } })}
                  />
                  <StatCard
                    icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />}
                    label="Bids"
                    value={task.bids?.length || 0}
                    sub={task.biddingType}
                    onClick={() => navigate(`/admin/${task._id}/mini_task_info/bids`)}
                  />
                </div>
              </div>
            </div>

            {/* Sticky Tabs */}
            <div className="top-2 sm:top-4 z-10 bg-white/80 backdrop-blur-md rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-1">
              <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
                {[
                  { id: "overview", label: "Overview", icon: <Home className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { id: "employer", label: "Employer", icon: <User className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { id: "applicants", label: "Applicants", icon: <Users className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { id: "completion", label: "Completion", icon: <FileCheck2 className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { id: "activity", label: "Activity", icon: <Activity className="w-3 h-3 sm:w-4 sm:h-4" /> },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all min-w-fit ${
                      tab === t.id
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Main Content */}
              <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                {tab === "overview" && <OverviewTab task={task} formatDate={formatDate} />}
                {tab === "employer" && <EmployerTab task={task} navigate={navigate} formatDate={formatDate} />}
                {tab === "applicants" && <ApplicantsTab task={task} navigate={navigate} />}
                {tab === "completion" && <CompletionTab task={task} formatDate={formatDate} />}
                {tab === "activity" && <ActivityTab task={task} formatDate={formatDate} />}
              </div>

              {/* Sidebar */}
              <div className="space-y-4 sm:space-y-6">
                {/* Status Update */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    Update Status
                  </h3>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    {Object.keys(STATUS_CONFIG).map(s => (
                      <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusChange}
                    disabled={status === task.status || updating}
                    className={`mt-3 w-full py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                      status === task.status || updating
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg"
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

                {/* Task Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    Task Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="ID" value={task._id.slice(-8)} />
                    <InfoRow label="Created" value={formatDate(task.createdAt)} />
                    <InfoRow label="Updated" value={formatDate(task.updatedAt)} />
                    <InfoRow label="Type" value={task.biddingType} />
                  </div>
                </div>

                {/* Assigned Tasker */}
                {task.assignedTo && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                      Assigned To
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {task.assignedTo.profileImage ? (
                          <img src={task.assignedTo.profileImage} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                            {task.assignedTo.name?.[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{task.assignedTo.name}</p>
                          <p className="text-xs text-gray-600 truncate max-w-[120px] sm:max-w-none">{task.assignedTo.phone}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.assignmentAccepted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {task.assignmentAccepted ? "Accepted" : "Pending"}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/tasker_info/${task.assignedTo._id}`)}
                      className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      View Profile <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* FAB - Hidden on smallest screens */}
        <button
          onClick={() => navigate(`/admin/minitask/${task._id}/applicants`, { state: { applicants: task.applicants } })}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40"
        >
          <div className="relative">
            {applicantCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
                {applicantCount > 99 ? '99+' : applicantCount}
              </span>
            )}
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </button>
      </div>
    </div>
  );
};

// === COMPONENTS ===
const StatCard = ({ icon, label, value, sub, overdue, onClick }) => (
  <div
    className={`bg-white border border-gray-200 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
      onClick ? 'cursor-pointer active:scale-95' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{label}</p>
        <p className={`text-base sm:text-lg md:text-xl font-bold truncate ${
          overdue ? 'text-red-600' : 'text-gray-900'
        }`}>
          {value}
        </p>
        <p className="text-xs text-gray-500 mt-1 truncate">{sub}</p>
      </div>
      <div className="p-1 sm:p-2 bg-gray-50 rounded-lg ml-2 flex-shrink-0">
        {icon}
      </div>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600 truncate pr-2">{label}</span>
    <span className="font-medium text-gray-900 text-right truncate pl-2">{value}</span>
  </div>
);

// === TABS ===
const OverviewTab = ({ task, formatDate }) => (
  <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
        Description
      </h2>
      <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
        {task.description || "—"}
      </p>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
        Skills Required
      </h2>
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {task.skillsRequired?.length > 0 ? task.skillsRequired.map(s => (
          <span key={s} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium">
            {s}
          </span>
        )) : <p className="text-gray-500 italic text-sm">None specified</p>}
      </div>
    </div>

    {/* Requirements Section - Add this */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
        Requirements
      </h2>
      {task.requirements?.length > 0 ? (
        <div className="space-y-3">
          {task.requirements.map((requirement, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {requirement}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
          <p className="text-gray-500 text-sm sm:text-base">No specific requirements listed</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">The employer didn't specify any additional requirements</p>
        </div>
      )}
    </div>


    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
        Location
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
        <div>
          <p className="text-gray-500 mb-1 text-xs sm:text-sm">Type</p>
          <span className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
            task.locationType === "remote" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
          }`}>
            {task.locationType || "Not specified"}
          </span>
        </div>
        {task.locationType === "on-site" && task.address && (
          <>
            <InfoRow label="City" value={task.address.city} />
            <InfoRow label="Suburb" value={task.address.suburb} />
          </>
        )}
      </div>
    </div>
  </>
);

const EmployerTab = ({ task, navigate, formatDate }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
      <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
      Employer Information
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <InfoRow label="Name" value={task.employer?.name || "N/A"} />
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <InfoRow label="Email" value={task.employer?.email || "N/A"} />
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <InfoRow label="Phone" value={task.employer?.phone || "N/A"} />
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <InfoRow label="Member Since" value={task.employer?.createdAt ? formatDate(task.employer.createdAt) : "N/A"} />
        <InfoRow label="Tasks Posted" value={task.employer?.tasksCount || 0} />
        <button
          onClick={() => navigate(`/admin/get/user_info/${task.employer?._id}`)}
          className="w-full mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
        >
          View Full Profile <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const ApplicantsTab = ({ task, navigate }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
      Applicants ({task.applicants?.length || 0})
    </h2>
    {task.applicants?.length > 0 ? (
      <div className="space-y-3 sm:space-y-4">
        {task.applicants.slice(0, 5).map(a => (
          <div key={a._id} className="p-3 sm:p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              {a.profileImage ? (
                <img src={a.profileImage} alt={a.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {a.name?.[0]}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{a.name}</h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 flex-shrink-0" /> 
                    <span className="truncate">{a.email}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
              <span className="font-medium text-sm">{a.rating || "N/A"}</span>
            </div>
          </div>
        ))}
        {task.applicants.length > 5 && (
          <button
            onClick={() => navigate(`/admin/minitask/${task._id}/applicants`)}
            className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm"
          >
            View All {task.applicants.length} Applicants
          </button>
        )}
      </div>
    ) : (
      <div className="text-center py-8 sm:py-12 text-gray-500">
        <User className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
        <p className="text-sm sm:text-base">No applicants yet.</p>
      </div>
    )}
  </div>
);

const CompletionTab = ({ task, formatDate }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
      <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
      Completion Status
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div>
        <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Verification</h3>
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg flex justify-between items-center">
          <span className="text-sm">Required</span>
          <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
            task.verificationRequired ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {task.verificationRequired ? "Yes" : "No"}
          </span>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Proof</h3>
        {task.proofOfCompletion ? (
          <a href={task.proofOfCompletion} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm p-3 sm:p-4 bg-gray-50 rounded-lg">
            <ExternalLink className="w-4 h-4" /> View Document
          </a>
        ) : <p className="text-gray-500 text-sm p-3 sm:p-4 bg-gray-50 rounded-lg">None submitted</p>}
      </div>
      <div>
        <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Employer</h3>
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg flex justify-between items-center">
          <span className="text-sm">Marked Done</span>
          <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
            task.markedDoneByEmployer ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}>
            {task.markedDoneByEmployer ? "Yes" : "No"}
          </span>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Tasker</h3>
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg flex justify-between items-center">
          <span className="text-sm">Marked Done</span>
          <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
            task.markedDoneByTasker ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}>
            {task.markedDoneByTasker ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const ActivityTab = ({ task, formatDate }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
      <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
      Activity Timeline
    </h2>
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-3">
        <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
        <div>
          <p className="font-medium text-sm sm:text-base">Task Created</p>
          <p className="text-xs sm:text-sm text-gray-500">{formatDate(task.createdAt)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
        <div>
          <p className="font-medium text-sm sm:text-base">Last Updated</p>
          <p className="text-xs sm:text-sm text-gray-500">{formatDate(task.updatedAt)}</p>
        </div>
      </div>
    </div>
  </div>
);

// === STATES ===
const LoadingSkeleton = ({ isSidebarOpen, setIsSidebarOpen }) => (
  <div className="h-screen bg-gray-50">
    <div 
      data-sidebar
      className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:inset-auto`}
    >
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
    
    {isSidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="bg-white rounded-xl h-40 sm:h-48 animate-pulse"></div>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-lg sm:rounded-xl h-24 sm:h-32 animate-pulse"></div>
          ))}
        </div>
        <div className="bg-white rounded-xl h-48 sm:h-64 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const NotFound = ({ isSidebarOpen, setIsSidebarOpen, navigate }) => (
  <div className="h-screen bg-gray-50 flex items-center justify-center p-4">
    <div 
      data-sidebar
      className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:inset-auto`}
    >
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
    
    {isSidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    <div className={`text-center p-6 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
      <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Task Not Found</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">The task you're looking for doesn't exist or may have been removed.</p>
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
      >
        Go Back
      </button>
    </div>
  </div>
);

export default AdminMiniTaskDetailPage;