import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSingleUser } from "../../APIS/API";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import { UserHeader } from "../../Components/AdminComponents/UserDetails/UserHeader";
import { UserStats } from "../../Components/AdminComponents/UserDetails/UserStats";
import { ContactInfo } from "../../Components/AdminComponents/UserDetails/ContactInfo";
import { AccountStatus } from "../../Components/AdminComponents/UserDetails/AccountStatus";
import { IdVerification } from "../../Components/AdminComponents/UserDetails/IdVerification";
import { UserBio } from "../../Components/AdminComponents/UserDetails/UserBio";
import { UserSkills } from "../../Components/AdminComponents/UserDetails/UserSkills";
import { WorkExperience } from "../../Components/AdminComponents/UserDetails/WorkExperience";
import { UserEducation } from "../../Components/AdminComponents/UserDetails/UserEducation";
import { AppliedJobs } from "../../Components/AdminComponents/UserDetails/AppliedJobs";
import { LoadingSpinner } from "../../Components/AdminComponents/UserDetails/LoadingSpinner";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import { ChevronLeft, Edit, Shield, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import "../../Styles/UserDetails.css";

const AdminUserDetails = () => {
  const { Id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await getSingleUser(Id);
        if (response.status === 200) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [Id]);

  if (loading) {
    return (
      <div className="admin-user-details-container">
        <AdminSidebar />
        <NotificationCenter />
        <div className="admin-user-content">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-user-details-container">
        <AdminSidebar />
        <div className="admin-user-content">
          <div className="user-not-found">
            <div className="not-found-content">
              <Shield className="not-found-icon" />
              <h2>User Not Found</h2>
              <p>The user you're looking for doesn't exist or has been removed.</p>
              <button onClick={() => navigate(-1)} className="back-action-btn">
                <ChevronLeft className="btn-icon" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "professional", label: "Professional", icon: Shield },
    { id: "activity", label: "Activity", icon: Calendar },
  ];

  return (
    <div className="admin-user-details-container">
      <div className="admin-user-sidebar">
        <AdminSidebar />
      </div>
      
      <div className="admin-user-content">
        {/* Header with Navigation */}
        <AdminNavbar 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
          />

        {/* Main Content */}
        <div className="user-details-layout">
          {/* Sidebar Profile Card */}
          <div className="user-profile-sidebar">
            <div className="profile-card">
              <div className="profile-header">
                <div className="avatar-section">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="user-avatar" />
                  ) : (
                    <div className="avatar-fallback">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="online-status"></div>
                </div>
                
                <div className="profile-info">
                  <h1 className="user-name">{user.name}</h1>
                  <p className="user-email">{user.email}</p>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>

              <div className="profile-meta">
                <div className="meta-item">
                  <User className="meta-icon" />
                  <span>Member since</span>
                  <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
                </div>
                <div className="meta-item">
                  <Mail className="meta-icon" />
                  <span>Email Status</span>
                  <strong className={user.isVerified ? "status-verified" : "status-pending"}>
                    {user.isVerified ? "Verified" : "Pending"}
                  </strong>
                </div>
                <div className="meta-item">
                  <Shield className="meta-icon" />
                  <span>Account Status</span>
                  <strong className={user.isActive ? "status-active" : "status-inactive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <UserStats user={user} />
          </div>

          {/* Main Content Area */}
          <div className="user-details-main">
            {/* Navigation Tabs */}
            <div className="details-tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <Icon className="tab-icon" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "overview" && (
                <div className="tab-panel">
                  <div className="grid-layout">
                    <ContactInfo user={user} />
                    <AccountStatus user={user} />
                    <IdVerification user={user} />
                    <UserBio user={user} />
                  </div>
                </div>
              )}

              {activeTab === "professional" && (
                <div className="tab-panel">
                  <div className="grid-layout">
                    <UserSkills user={user} />
                    <WorkExperience user={user} />
                    <UserEducation user={user} />
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="tab-panel">
                  <AppliedJobs user={user} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;