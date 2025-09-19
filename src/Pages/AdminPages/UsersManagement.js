import { Eye, Edit, Trash2, Search, User, Briefcase, Users, Plus, Filter, Download, MoreVertical, ArrowUpDown, Calendar, Mail, Phone, MapPin, Shield, Check, X, AlertCircle, TrendingUp, Activity, } from "lucide-react";
import {FaUserCircle} from "react-icons/fa";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAdminContext } from "../../Context/AdminContext";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import { useNavigate } from "react-router-dom";
import { removeUser } from '../../APIS/API'

const UserAvatar = ({ letter = "U", status = "Active", name }) => {
  const statusColor =
    status === "Active"
      ? "bg-emerald-400 shadow-emerald-200"
      : status === "Suspended"
      ? "bg-red-400 shadow-red-200"
      : "bg-slate-300 shadow-slate-200";

  const gradientBg = name 
    ? `bg-gradient-to-br from-${name.charCodeAt(0) % 2 === 0 ? 'blue' : 'purple'}-500 to-${name.charCodeAt(0) % 2 === 0 ? 'indigo' : 'pink'}-500`
    : "bg-gradient-to-br from-blue-500 to-indigo-500";

  return (
    <div className="relative group">
      <div className={`w-12 h-12 rounded-xl ${gradientBg} flex items-center justify-center text-white font-bold text-sm shadow-lg transform transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl`}>
        {letter}
      </div>
      <span
        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-3 ring-white ${statusColor} shadow-lg transform transition-all duration-200`}
      />
    </div>
  );
};

const StatusBadge = ({ status, isVerified }) => {
  const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105";
  let badgeClass = "";
  let icon = null;

  switch (status) {
    case "Active":
      badgeClass = "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm";
      icon = <Check className="w-3 h-3" />;
      break;
    case "Suspended":
      badgeClass = "bg-red-50 text-red-700 border border-red-200 shadow-sm";
      icon = <X className="w-3 h-3" />;
      break;
    case "Pending":
      badgeClass = "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm";
      icon = <AlertCircle className="w-3 h-3" />;
      break;
    default:
      badgeClass = "bg-slate-50 text-slate-600 border border-slate-200 shadow-sm";
      icon = <AlertCircle className="w-3 h-3" />;
  }

  return (
    <span className={`${baseClasses} ${badgeClass}`}>
      {icon}
      {status}
    </span>
  );
};

const VerificationBadge = ({ isVerified }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 ${
      isVerified 
        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
        : "bg-orange-50 text-orange-700 border border-orange-200 shadow-sm"
    }`}>
      {isVerified ? <Shield className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
      {isVerified ? "Verified" : "Pending"}
    </span>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 shadow-blue-500/25",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/25",
    amber: "from-amber-500 to-amber-600 shadow-amber-500/25",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/25"
  };

  return (
    <div className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
      <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
                {trend && (
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
                    {trendValue}
                  </span>
                )}
              </div>
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, icon: Icon, label, variant = "default", disabled = false }) => {
  const variants = {
    default: "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
    view: "text-blue-500 hover:text-blue-700 hover:bg-blue-50",
    edit: "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50",
    delete: "text-red-500 hover:text-red-700 hover:bg-red-50"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};

const AdminUserManagement = () => {
  const { loading, users, setUsers, fetchAllUsers } = useAdminContext();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const usersPerPage = 10;
  const navigate = useNavigate();
  
  const totalUser = users?.length || 0;
  const totalRecruiters = users?.filter((user) => user.role === 'employer') || [];
  const totalEmployers = users?.filter((user) => user.role === 'job_seeker') || [];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!users) fetchAllUsers();
  }, []);

  useEffect(() => {
    let filtered = users || [];

    if (roleFilter !== "All") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort functionality
    filtered.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, users, sortField, sortDirection]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleUserDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await removeUser(id);
      if (response.status === 200) {
        toast.success('User removed successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchAllUsers();
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } else {
        toast.error(response.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'employer':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'job_seeker':
        return <User className="w-4 h-4 text-emerald-600" />;
      default:
        return <User className="w-4 h-4 text-slate-600" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'employer':
        return 'Recruiter';
      case 'job_seeker':
        return 'Job Seeker';
      case 'admin':
        return 'Admin';
      default:
        return role;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/50">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Sidebar */}
     
          <AdminSidebar 
                isOpen={isSidebarOpen} 
               onClose={() => setIsSidebarOpen(false)}
                />

        <NotificationCenter/>
     

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
      
         <AdminNavbar 
                onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
                 isSidebarOpen={isSidebarOpen} 
                 />
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                <p className="text-slate-600 mt-1">Manage and monitor all platform users</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={() => navigate("/admin/add_new_user")}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={totalUser}
                icon={User}
                trend="up"
                trendValue="+12%"
                color="blue"
              />
              <StatCard
                title="Recruiters"
                value={totalRecruiters.length}
                icon={Briefcase}
                trend="up"
                trendValue="+8%"
                color="emerald"
              />
              <StatCard
                title="Job Seekers"
                value={totalEmployers.length}
                icon={Users}
                trend="up"
                trendValue="+15%"
                color="amber"
              />
              <StatCard
                title="Active Users"
                value={users?.filter(user => user.isActive)?.length || 0}
                icon={Activity}
                trend="up"
                trendValue="+5%"
                color="purple"
              />
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full">
            <div className="flex flex-col lg:flex-row gap-4 w-full">
            <div className="flex-1 relative min-w-0">
           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
          <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-0"
          value={searchTerm || ''}
         onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="lg:flex-shrink-0">
       <select
        className="w-full lg:w-auto px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        value={roleFilter || 'All'}
        onChange={(e) => setRoleFilter(e.target.value)}
       >
        <option value="All">All Roles</option>
        <option value="admin">Admin</option>
        <option value="employer">Recruiter</option>
        <option value="job_seeker">Job Seeker</option>
      </select>
      </div>
      </div>
    </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors duration-200"
                        >
                          User
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('role')}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors duration-200"
                        >
                          Role
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Verification
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-slate-500">Loading users...</p>
                          </div>
                        </td>
                      </tr>
                    ) : paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                             <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-100">
                                    {user?.profileImage ? (
                                      <img
                                      src={user.profileImage}
                                      alt="Profile"
                                      className="w-full h-full object-cover"
                                        />
                                      ) : (
                                      <FaUserCircle className="w-full h-full text-gray-400" />
                                        )}
                               </div>
                              <div>
                                <div className="font-semibold text-slate-900">{user.name}</div>
                                <div className="text-sm text-slate-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getRoleIcon(user.role)}
                              <span className="font-medium text-slate-700 capitalize">
                                {getRoleLabel(user.role)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={user.isActive ? "Active" : "Inactive"} />
                          </td>
                          <td className="px-6 py-4">
                            <VerificationBadge isVerified={user.isVerified} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <ActionButton
                                onClick={() => navigate(`/admin/get/user_info/${user._id}`)}
                                icon={Eye}
                                label="View Details"
                                variant="view"
                              />
                              <ActionButton
                                onClick={() => navigate(`/admin/edit/user/${user._id}`)}
                                icon={Edit}
                                label="Edit User"
                                variant="edit"
                              />
                              <ActionButton
                                onClick={() => handleUserDelete(user._id)}
                                icon={Trash2}
                                label="Delete User"
                                variant="delete"
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <User className="w-12 h-12 text-slate-300" />
                            <p className="text-slate-500">No users found</p>
                            <p className="text-sm text-slate-400">Try adjusting your search or filter criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                      Showing <span className="font-semibold">{indexOfFirstUser + 1}</span> to{' '}
                      <span className="font-semibold">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                      <span className="font-semibold">{filteredUsers.length}</span> users
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Previous
                      </button>
                      
                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white shadow-lg'
                                  : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;