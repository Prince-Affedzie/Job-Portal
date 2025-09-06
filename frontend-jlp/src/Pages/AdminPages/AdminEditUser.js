import { useState, useEffect } from "react";
import { getSingleUser, modifyUserInfo } from "../../APIS/API";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";

const AdminEditUserPage = () => {
  const navigate = useNavigate();
  const { Id } = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    isVerified: false,
    isActive: false,
    profileCompleted: false,
    miniTaskEligible: false,
    role: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getSingleUser(Id);
        if (response.status === 200) {
          setUser(response.data);
          setFormData({
            isVerified: response.data.isVerified || false,
            isActive: response.data.isActive || false,
            profileCompleted: response.data.profileCompleted || false,
            miniTaskEligible: response.data.miniTaskEligible || false,
            role: response.data.role || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [Id]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await modifyUserInfo(Id, formData);
      if (response.status === 200) {
        toast.success("User updated successfully");
        navigate("/admin/usermanagement");
      } else {
        toast.error(response.message || "Update failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatRoleName = (role) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Navbar */}
      <AdminNavbar 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
          />
     
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
       
          <AdminSidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            />
       
        
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center mb-6 text-sm">
              <span 
                onClick={() => navigate("/admin/usermanagement")} 
                className="text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                User Management
              </span>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-600">Edit User</span>
            </div>
            
            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Edit User Profile
                </h2>
                {user && (
                  <p className="text-blue-100 mt-1">
                    {user.email || "No email available"}
                  </p>
                )}
              </div>
              
              {/* Form Content */}
              <div className="p-6">
                {loading && !formData.role ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading user details...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        User Role
                      </label>
                      <div className="relative">
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="block w-full pl-3 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          {["job_seeker", "admin", "employer"].map((role) => (
                            <option key={role} value={role}>
                              {formatRoleName(role)}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Status Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "isVerified", label: "Verified User", color: "green" },
                        { name: "isActive", label: "Active Account", color: "blue" },
                        { name: "profileCompleted", label: "Profile Completed", color: "indigo" },
                        { name: "miniTaskEligible", label: "Mini Task Eligible", color: "purple" },
                      ].map(({ name, label, color }) => (
                        <div 
                          key={name} 
                          className={`flex items-center p-4 border rounded-lg transition-all duration-300 ${
                            formData[name] 
                              ? `border-${color}-500 shadow-sm` 
                              : "border-gray-200"
                          }`}
                          style={{
                            background: formData[name] 
                              ? `linear-gradient(to right, var(--tw-${color}-100), var(--tw-${color}-50))` 
                              : "#f9fafb"
                          }}
                        >
                          {/* Status icon based on toggle state */}
                          <div className={`flex-shrink-0 rounded-full p-1 ${formData[name] ? `text-${color}-500` : "text-gray-400"}`}>
                            {formData[name] ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          
                          <label className="flex flex-1 items-center justify-between cursor-pointer ml-3">
                            <div>
                              <span className={`text-sm font-medium ${formData[name] ? `text-${color}-700` : "text-gray-700"}`}>
                                {label}
                              </span>
                              <p className={`text-xs mt-0.5 ${formData[name] ? `text-${color}-600` : "text-gray-500"}`}>
                                {formData[name] 
                                  ? name === "isVerified" ? "User is verified and trusted"
                                    : name === "isActive" ? "Account is currently active" 
                                    : name === "profileCompleted" ? "User has completed profile setup"
                                    : "User can access mini tasks"
                                  : "Currently disabled"
                                }
                              </p>
                            </div>

                            <div className="relative">
                              <input
                                type="checkbox"
                                name={name}
                                checked={formData[name]}
                                onChange={handleChange}
                                className="sr-only"
                              />
                              <div className="w-14 h-7 rounded-full shadow-inner transition-colors duration-300 flex items-center" 
                                style={{ 
                                  backgroundColor: formData[name] 
                                    ? `var(--tw-${color}-500)` 
                                    : "#d1d5db" 
                                }}>
                                <div className={`absolute text-xs font-bold text-white ${formData[name] ? "left-2" : "right-2"}`}>
                                  {formData[name] ? "ON" : "OFF"}
                                </div>
                                <div className={`absolute top-1 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                                  formData[name] ? "left-8" : "left-1"
                                }`}>
                                  {formData[name] && (
                                    <span className={`text-${color}-500 text-xs`}>✓</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2.5 rounded-lg font-medium flex-1 text-white ${
                          loading 
                            ? "bg-blue-400 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                        } transition-colors duration-200 flex justify-center items-center`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate("/admin/usermanagement")}
                        className="px-6 py-2.5 rounded-lg font-medium flex-1 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* User Info Card - Optional */}
            {user && (
              <div className="mt-6 bg-white rounded-xl shadow-md p-5">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  User Information
                </h3>
                <div className="text-sm text-gray-600">
                  <p>ID: {Id}</p>
                  {user.name && <p className="mt-1">Name: {user.name}</p>}
                  {user.createdAt && (
                    <p className="mt-1">
                      Member since: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditUserPage;