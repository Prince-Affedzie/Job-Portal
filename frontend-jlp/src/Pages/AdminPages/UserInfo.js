import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSingleUser } from "../../APIS/API";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
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
import "../../Styles/UserDetails.css";

const AdminUserDetails = () => {
  const { Id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
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
      <div className="admin-container">
        <AdminSidebar />
        <NotificationCenter/>
        <div className="admin-content">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-container">
        <AdminSidebar />
        <div className="admin-content">
          <div className="not-found">
            <h2>User Not Found</h2>
            <p>The user you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => navigate(-1)} className="btn-primary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <AdminSidebar />
      </div>
      <div className="admin-content">
        <div className="user-details-container">
          <UserHeader user={user} navigate={navigate} />
          
          <div className="user-details-grid">
            <div className="left-column">
              <UserStats user={user} />
              <ContactInfo user={user} />
              <AccountStatus user={user} />
              <IdVerification user={user} />
            </div>
            
            <div className="right-column">
              <UserBio user={user} />
              <UserSkills user={user} />
              <WorkExperience user={user} />
              <UserEducation user={user} />
              <AppliedJobs user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;