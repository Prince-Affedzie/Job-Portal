import { useParams, useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { getSingleUser } from "../APIS/API";
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div  className="w-64 bg-white border-r">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <AdminNavbar />

        <div className="p-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {loading ? (
              <div className="text-center py-10">
                <div className="w-10 h-10 mx-auto border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading user details...</p>
              </div>
            ) : !user ? (
              <div className="text-center">
                <p className="text-gray-500">User not found</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">
                  Go Back
                </button>
              </div>
            ) : (
              <>
                {/* Header with Avatar and Basic Info */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.profileImage || "/images/default-avatar.png"}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover shadow-md"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/admin/edit/user/${user._id}`)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
                  >
                    <Edit className="w-4 h-4" />
                    Edit User
                  </button>
                </div>

                {/* Sections */}
                <div className="mt-10 grid grid-cols-1 gap-6">
                  {/* Contact & Profile Info */}
                  <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Contact & Profile Info</h3>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div><strong>Phone:</strong> {user.phone || "N/A"}</div>
                      <div><strong>Email:</strong> {user.email}</div>
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

                  {/* Status & Verification */}
                  <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Status & Verification</h3>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div><strong>Profile Completed:</strong> {user.profileCompleted ? "Yes" : "No"}</div>
                      <div><strong>Mini Task Eligible:</strong> {user.miniTaskEligible ? "Yes" : "No"}</div>
                      <div><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</div>
                      <div><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</div>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Education</h3>
                    {user.education?.length > 0 ? (
                      user.education.map((edu, idx) => (
                        <div key={idx} className="text-sm mb-2">
                          <p><strong>{edu.degree}</strong> - {edu.institution} ({edu.yearOfCompletion})</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No education records</p>
                    )}
                  </div>

                  {/* Work Experience */}
                  <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
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

                  {/* Applied Jobs */}
                  <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Applied Jobs</h3>
                    {user.appliedJobs?.length > 0 ? (
                      <ul className="list-disc pl-6 text-sm text-gray-700">
                        {user.appliedJobs.map((jobId, idx) => (
                          <li key={idx}>{jobId.title}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">No jobs applied</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
