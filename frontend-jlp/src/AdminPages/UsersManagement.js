import { Eye, Edit, Trash2, Search,User as UserIcon, Briefcase as BriefcaseIcon, Users as UsersIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAdminContext } from "../Context/AdminContext";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import { useNavigate } from "react-router-dom";
import {removeUser} from '../APIS/API'

const UserAvatar = ({ letter = "U", status = "Active" }) => {
  const statusColor =
    status === "Active"
      ? "bg-green-400"
      : status === "Suspended"
      ? "bg-red-400"
      : "bg-gray-300";

  return (
    <div className="relative w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
      {letter}
      <span
        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${statusColor}`}
      />
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  let badgeClass = "";

  switch (status) {
    case "Active":
      badgeClass = "bg-green-100 text-green-700";
      break;
    case "Suspended":
      badgeClass = "bg-red-100 text-red-700";
      break;
    case "Pending":
      badgeClass = "bg-yellow-100 text-yellow-700";
      break;
    default:
      badgeClass = "bg-gray-100 text-gray-600";
  }

  return <span className={`${baseClasses} ${badgeClass}`}>{status}</span>;
};

const AdminUserManagement = () => {
  const { loading, users, setUsers, fetchAllUsers } = useAdminContext();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate()
  const totalUser = users.length
  let totalRecruiters = users.filter((user)=>user.role ==='employer')
  let totalEmployers = users.filter((user)=>user.role === 'job_seeker')
  const [sidebarOpen, setSidebarOpen] = useState(false);


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
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleUserDelete = async(id) => {
    try{
    const response = await removeUser(id)
    if(response.status ===200){
      toast.success('User Removed Successfully')
      fetchAllUsers()
      setUsers((prev) => prev.filter((user) => user.id !== id))
    }else{
      toast.error(response.message || "An Error Occured. Please try again.")
    }
  }catch(error){
   const errorMessage =
           error.response?.data?.message ||
           error.response?.data?.error ||
           "An unexpected error occurred. Please try again.";
         console.log(errorMessage);
         toast.error(errorMessage);
  }
   
  };

  

  return (
    <div className="flex h-screen bg-white">
      <ToastContainer/>
      {/* Sidebar - Left Panel */}
      <div className="w-64 bg-white border-r">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Navbar */}
        <div className="w-full shadow bg-white">
          <AdminNavbar />
        </div>

        {/* Page Content */}
        <div className="p-6">
          {/* Stat Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
           <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
           <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-xl font-semibold">{totalUser}</h3>
           </div>
           <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <UserIcon className="w-6 h-6" />
           </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
               <div>
              <p className="text-sm text-gray-500">Total Recruiters</p>
                <h3 className="text-xl font-semibold">{totalRecruiters.length}</h3>
             </div>
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
           <BriefcaseIcon className="w-6 h-6" />
          </div>
        </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
            <p className="text-sm text-gray-500">Total Job Seekers</p>
            <h3 className="text-xl font-semibold">{totalEmployers.length}</h3>
         </div>
        <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
         <UsersIcon className="w-6 h-6" />
      </div>
     </div>
    </div>

         <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
             <h2 className="text-xl font-semibold">User Management</h2>

              <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
               <button
                        onClick={() => navigate("/admin/add_new_user")}
                        className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-md shadow hover:bg-blue-700 transition duration-200"
                >
                   + Add New User
                </button>


                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                   type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                   </div>

                   <select
                   className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm focus:outline-none"
                    value={roleFilter}
                     onChange={(e) => setRoleFilter(e.target.value)}
                  >
                     <option value="All">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="employer">Recruiter</option>
                      <option value="job_seeker">Job Seeker</option>
                    </select>
                    </div>
               </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">User</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Role</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">isVerified</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <UserAvatar letter={user.avatar} status={user.status} />
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={user.isActive ? "Active" : "Inactive"} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.isVerified?"Verified":"Not Verified"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/admin/get/user_info/${user._id}`)}
                            className="text-gray-400 hover:text-blue-600"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={()=>navigate(`/admin/edit/user/${user._id}`)} className="text-gray-400 hover:text-green-600" title="Edit">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleUserDelete(user._id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 px-1">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages || 1}
            </p>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement
