import { useParams, useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminContext } from "../Context/AdminContext";
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";
import { getSingleUser } from "../APIS/API";

const AdminUserDetails = () => {
  const { Id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
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

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 min-h-screen">
        <AdminNavbar />
        <div className="p-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow p-6">
            {loading ? (
              <div className="text-center py-10">
                <div className="w-10 h-10 mx-auto border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading user details...</p>
              </div>
            ) : !user ? (
              <div className="text-center">
                <p className="text-gray-500">User not found</p>
                <button
                  onClick={() => navigate(-1)}
                  className="mt-4 text-blue-600 underline"
                >
                  Go Back
                </button>
              </div>
            ) : (
                <div className="p-4 sm:p-6">
                    <button onClick={()=>navigate(`/admin/edit/user/${user._id}`)} className="text-gray-400 hover:text-green-600" title="Edit">
                         <Edit className="w-5 h-5" />
                    </button>
                {/* Contact & Profile Info Card */}
                <div className="mt-6 bg-gray-100 p-5 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Contact & Profile Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div><strong>Phone:</strong> {user.phone || "N/A"}</div>
                    <div><strong>Email:</strong> {user.email || "N/A"}</div>
                    <div><strong>Bio:</strong> {user.Bio || "No bio"}</div>
                    <div>
                      <strong>Skills:</strong>{" "}
                      {user.skills?.length > 0 ? user.skills.join(", ") : "None"}
                    </div>
                    <div>
                      <strong>Location:</strong>{" "}
                      {[user.location?.street, user.location?.town, user.location?.city, user.location?.region]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </div>
                  </div>
                </div>
              
                {/* Status & Verification Card */}
                <div className="mt-6 bg-gray-100 p-5 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Status & Verification</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div><strong>Profile Completed:</strong> {user.profileCompleted ? "Yes" : "No"}</div>
                    <div><strong>Mini Task Eligible:</strong> {user.miniTaskEligible ? "Yes" : "No"}</div>
                    <div><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</div>
                    <div><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</div>
                  </div>
                </div>
              
                {/* Education Card */}
                <div className="mt-6 bg-gray-100 p-5 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Education</h3>
                  {user.education?.length > 0 ? (
                    user.education.map((edu, idx) => (
                      <div key={idx} className="mb-2 text-sm">
                        <p><strong>{edu.degree}</strong> - {edu.institution} ({edu.yearOfCompletion})</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No education records</p>
                  )}
                </div>
              
                {/* Work Experience Card */}
                <div className="mt-6 bg-gray-100 p-5 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
                  {user.workExperience?.length > 0 ? (
                    user.workExperience.map((exp, idx) => (
                      <div key={idx} className="mb-4 text-sm">
                        <p className="font-medium">{exp.jobTitle} @ {exp.company}</p>
                        <p className="text-gray-600">
                          {new Date(exp.startDate).toLocaleDateString()} -{" "}
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                        </p>
                        <p className="mt-1">{exp.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No work experience</p>
                  )}
                </div>
              
                {/* Applied Jobs Card */}
                <div className="mt-6 bg-gray-100 p-5 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Applied Jobs</h3>
                  {user.appliedJobs?.length > 0 ? (
                    <ul className="list-disc ml-6 text-sm">
                      {user.appliedJobs.map((jobId, idx) => (
                        <li key={idx}>{jobId.title}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No jobs applied</p>
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

export default AdminUserDetails;
