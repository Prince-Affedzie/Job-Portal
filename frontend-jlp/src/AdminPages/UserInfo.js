import { useParams, useNavigate } from "react-router-dom";
import { Edit, ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, User, Shield, CheckCircle, XCircle, Clock, Award, Building, Globe, Star, BookOpen, Target, Activity, Users, Eye, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { getSingleUser } from "../APIS/API";
import AdminNavbar from "../Components/AdminComponents/AdminNavbar";
import AdminSidebar from "../Components/AdminComponents/Adminsidebar";

const StatusBadge = ({ status, label, variant = "default" }) => {
  const variants = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inactive: "bg-red-50 text-red-700 border-red-200",
    verified: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    default: "bg-slate-50 text-slate-700 border-slate-200"
  };

  const icons = {
    active: CheckCircle,
    inactive: XCircle,
    verified: Shield,
    pending: Clock,
    default: User
  };

  const Icon = icons[variant] || icons.default;

  return (
    <span className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border ${variants[variant] || variants.default} transition-all duration-200 hover:scale-105`}>
      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
      <span className="truncate">{label}</span>
    </span>
  );
};

const InfoCard = ({ title, children, icon: Icon, gradient = "from-blue-50 to-indigo-50" }) => {
  return (
    <div className="group relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
      <div className="relative bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            {Icon && (
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            )}
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">{title}</h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, icon: Icon }) => {
  return (
    <div className="flex items-start gap-2 sm:gap-3 py-1 sm:py-2">
      {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <dt className="text-xs sm:text-sm font-medium text-slate-600">{label}</dt>
        <dd className="text-xs sm:text-sm text-slate-900 mt-1 break-words">{value || "Not provided"}</dd>
      </div>
    </div>
  );
};

const ExperienceCard = ({ experience, index }) => {
  const startDate = experience.startDate ? new Date(experience.startDate).toLocaleDateString() : "Unknown";
  const endDate = experience.endDate ? new Date(experience.endDate).toLocaleDateString() : "Present";
  
  return (
    <div className="relative pl-4 sm:pl-6 pb-4 sm:pb-6 border-l-2 border-slate-200 last:border-l-0 last:pb-0">
      <div className="absolute -left-1.5 sm:-left-2 top-0 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg"></div>
      <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{experience.jobTitle}</h4>
            <p className="text-blue-600 font-medium text-sm">{experience.company}</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full self-start sm:whitespace-nowrap">
            {startDate} - {endDate}
          </span>
        </div>
        {experience.description && (
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{experience.description}</p>
        )}
      </div>
    </div>
  );
};

const EducationCard = ({ education, index }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-sm">
          <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{education.degree}</h4>
          <p className="text-emerald-600 font-medium text-sm truncate">{education.institution}</p>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full mt-2 inline-block">
            Class of {education.yearOfCompletion}
          </span>
        </div>
      </div>
    </div>
  );
};

const SkillTag = ({ skill }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-xs sm:text-sm font-medium rounded-full border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 hover:scale-105">
      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
      <span className="truncate max-w-[120px] sm:max-w-none">{skill}</span>
    </span>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16">
      <div className="relative">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-slate-200 rounded-full"></div>
        <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-slate-600 font-medium text-sm sm:text-base">Loading user details...</p>
      <p className="text-xs sm:text-sm text-slate-500">Please wait while we fetch the information</p>
    </div>
  );
};

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

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatLocation = (location) => {
    if (!location) return "Location not provided";
    return [location.street, location.town, location.city, location.region]
      .filter(Boolean)
      .join(", ") || "Location not provided";
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Hidden on mobile */}
      
        <AdminSidebar />
     

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
       

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 mb-3 sm:mb-4 text-sm sm:text-base"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                Back to Users
              </button>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">User Details</h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">Complete profile information and activity overview</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {loading ? (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
                  <LoadingSpinner />
                </div>
              ) : !user ? (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-12 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">User Not Found</h3>
                  <p className="text-slate-600 mb-6 text-sm sm:text-base">The user you're looking for doesn't exist or has been removed.</p>
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    Go Back
                  </button>
                </div>
              ) : (
                <>
                  {/* Profile Header */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="h-20 sm:h-24 lg:h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-6 -mt-10 sm:-mt-12 lg:-mt-16">
                        {/* Profile Image and Status */}
                        <div className="relative flex flex-col items-center sm:items-start">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt="Profile"
                              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl object-cover border-4 border-white shadow-xl"
                            />
                          ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-xl">
                              <span className="text-white font-bold text-lg sm:text-2xl lg:text-3xl">
                                {getUserInitials(user.name)}
                              </span>
                            </div>
                          )}
                          <div className="mt-2 sm:absolute sm:-bottom-2 sm:-right-2 sm:mt-0">
                            <StatusBadge
                              status={user.isActive}
                              label={user.isActive ? "Active" : "Inactive"}
                              variant={user.isActive ? "active" : "inactive"}
                            />
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                          <div className="flex flex-col gap-4">
                            <div>
                              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 break-words">{user.name}</h2>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-slate-600 text-sm sm:text-base">
                                <span className="flex items-center justify-center sm:justify-start gap-1">
                                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="break-all">{user.email}</span>
                                </span>
                                <span className="flex items-center justify-center sm:justify-start gap-1">
                                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                  {user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1) || "User"}
                                </span>
                              </div>
                              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                                <StatusBadge
                                  status={user.isVerified}
                                  label={user.isVerified ? "Verified" : "Unverified"}
                                  variant={user.isVerified ? "verified" : "pending"}
                                />
                                <StatusBadge
                                  status={user.profileCompleted}
                                  label={user.profileCompleted ? "Complete" : "Incomplete"}
                                  variant={user.profileCompleted ? "active" : "pending"}
                                />
                              </div>
                            </div>

                            {/* Edit Button */}
                            <div className="flex justify-center sm:justify-start">
                              <button
                                onClick={() => navigate(`/admin/edit/user/${user._id}`)}
                                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg sm:rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                Edit User
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg">
                          <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Work Experience</p>
                          <p className="text-lg sm:text-2xl font-bold text-slate-900">{user.workExperience?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl shadow-lg">
                          <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Education</p>
                          <p className="text-lg sm:text-2xl font-bold text-slate-900">{user.education?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
                          <Target className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Skills</p>
                          <p className="text-lg sm:text-2xl font-bold text-slate-900">{user.skills?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg sm:rounded-xl shadow-lg">
                          <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Applied Jobs</p>
                          <p className="text-lg sm:text-2xl font-bold text-slate-900">{user.appliedJobs?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    {/* Contact Information */}
                    <InfoCard title="Contact Information" icon={Mail} gradient="from-blue-50 to-cyan-50">
                      <InfoItem label="Email Address" value={user.email} icon={Mail} />
                      <InfoItem label="Phone Number" value={user.phone} icon={Phone} />
                      <InfoItem label="Location" value={formatLocation(user.location)} icon={MapPin} />
                    </InfoCard>

                    {/* Account Status */}
                    <InfoCard title="Account Status" icon={Shield} gradient="from-emerald-50 to-teal-50">
                      <InfoItem 
                        label="Account Status" 
                        value={
                          <StatusBadge
                            status={user.isActive}
                            label={user.isActive ? "Active" : "Inactive"}
                            variant={user.isActive ? "active" : "inactive"}
                          />
                        }
                        icon={Activity}
                      />
                      <InfoItem 
                        label="Verification Status" 
                        value={
                          <StatusBadge
                            status={user.isVerified}
                            label={user.isVerified ? "Verified" : "Pending Verification"}
                            variant={user.isVerified ? "verified" : "pending"}
                          />
                        }
                        icon={Shield}
                      />
                      <InfoItem 
                        label="Profile Completion" 
                        value={user.profileCompleted ? "Complete" : "Incomplete"}
                        icon={User}
                      />
                      <InfoItem 
                        label="Mini Task Eligible" 
                        value={user.miniTaskEligible ? "Yes" : "No"}
                        icon={Award}
                      />
                    </InfoCard>
                  </div>

                  {/* Bio Section */}
                  {user.Bio && (
                    <InfoCard title="About" icon={BookOpen} gradient="from-purple-50 to-pink-50">
                      <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{user.Bio}</p>
                    </InfoCard>
                  )}

                  {/* Skills Section */}
                  {user.skills && user.skills.length > 0 && (
                    <InfoCard title="Skills & Expertise" icon={Target} gradient="from-amber-50 to-orange-50">
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <SkillTag key={index} skill={skill} />
                        ))}
                      </div>
                    </InfoCard>
                  )}

                  {/* Work Experience */}
                  {user.workExperience && user.workExperience.length > 0 && (
                    <InfoCard title="Work Experience" icon={Briefcase} gradient="from-blue-50 to-indigo-50">
                      <div className="space-y-3 sm:space-y-4">
                        {user.workExperience.map((experience, index) => (
                          <ExperienceCard key={index} experience={experience} index={index} />
                        ))}
                      </div>
                    </InfoCard>
                  )}

                  {/* Education */}
                  {user.education && user.education.length > 0 && (
                    <InfoCard title="Education" icon={GraduationCap} gradient="from-emerald-50 to-green-50">
                      <div className="grid gap-3 sm:gap-4">
                        {user.education.map((education, index) => (
                          <EducationCard key={index} education={education} index={index} />
                        ))}
                      </div>
                    </InfoCard>
                  )}

                  {/* Applied Jobs */}
                  {user.appliedJobs && user.appliedJobs.length > 0 && (
                    <InfoCard title="Applied Jobs" icon={Building} gradient="from-cyan-50 to-blue-50">
                      <div className="grid gap-2 sm:gap-3">
                        {user.appliedJobs.map((job, index) => (
                          <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
                              <Building className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <span className="font-medium text-slate-900 text-sm sm:text-base truncate">{job.title || `Job #${index + 1}`}</span>
                          </div>
                        ))}
                      </div>
                    </InfoCard>
                  )}

                  {/* Empty States */}
                  {(!user.workExperience || user.workExperience.length === 0) && (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center">
                      <Briefcase className="w-8 h-8 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-2">No Work Experience</h3>
                      <p className="text-slate-600 text-sm sm:text-base">This user hasn't added any work experience yet.</p>
                    </div>
                  )}

                  {(!user.education || user.education.length === 0) && (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center">
                      <GraduationCap className="w-8 h-8 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-2">No Education Records</h3>
                      <p className="text-slate-600 text-sm sm:text-base">This user hasn't added any education information yet.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;