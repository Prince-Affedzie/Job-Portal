import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Star, Award, 
  Briefcase, FileText, Shield, Clock, CheckCircle, 
  XCircle, AlertCircle, Download, MessageCircle, ExternalLink,
  ArrowLeft, Edit, Ban, CheckCircle2, Eye
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskerDetails, updateTaskerStatus } from '../../APIS/adminApi';
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";

const AdminTaskerDetailPage = () => {
  const { taskerId } = useParams();
  const navigate = useNavigate();
  const [tasker, setTasker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTaskerDetails();
  }, [taskerId]);

  const fetchTaskerDetails = async () => {
    try {
      setLoading(true);
      const response = await getTaskerDetails(taskerId);
      if (response.status === 200) {
        setTasker(response.data);
      }
    } catch (error) {
      console.error('Error fetching tasker details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setActionLoading(true);
      const response = await updateTaskerStatus(taskerId, { isActive: newStatus });
      if (response.status === 200) {
        setTasker(prev => ({ ...prev, isActive: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVettingUpdate = async (newStatus) => {
    try {
      setActionLoading(true);
      const response = await updateTaskerStatus(taskerId, { vettingStatus: newStatus });
      if (response.status === 200) {
        setTasker(prev => ({ ...prev, vettingStatus: newStatus }));
      }
    } catch (error) {
      console.error('Error updating vetting:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingState isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />;
  }

  if (!tasker) {
    return <NotFoundState isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} navigate={navigate} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => navigate('/admin/view_all_taskers')}
                  className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Tasker Profile
                  </h1>
                  <p className="text-gray-600 mt-1">Comprehensive admin view & management</p>
                </div>
              </div>

             {/* <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </button>
              </div>*/}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="relative mx-auto mb-4">
                      {tasker.profileImage ? (
                        <img
                          src={tasker.profileImage}
                          alt={tasker.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                          {tasker.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                        tasker.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">{tasker.name}</h2>
                    <p className="text-blue-600 font-medium">Professional Tasker</p>
                    
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold text-gray-900">{tasker.rating || 0}</span>
                      <span className="text-gray-500 text-sm">({tasker.numberOfRatings || 0})</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      <StatusBadge status={tasker.isActive} label={tasker.isActive ? 'Active' : 'Inactive'} active />
                      <StatusBadge status={tasker.isVerified} label="Verified" verified />
                      <VettingBadge status={tasker.vettingStatus} />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <InfoItem icon={<Mail className="w-4 h-4 text-gray-600" />} text={tasker.email} />
                    <InfoItem icon={<Phone className="w-4 h-4 text-gray-600" />} text={tasker.phone || 'Not provided'} />
                    <InfoItem icon={<MapPin className="w-4 h-4 text-gray-600" />} 
                      text={tasker.location ? `${tasker.location.city}, ${tasker.location.region}` : 'Not set'} />
                    <InfoItem icon={<Calendar className="w-4 h-4 text-gray-600" />} 
                      text={`Joined ${new Date(tasker.createdAt).toLocaleDateString()}`} />
                  </div>

                  <div className="mt-6 space-y-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-blue-600" />
                      Admin Actions
                    </h3>
                    
                    <button
                      onClick={() => handleStatusUpdate(!tasker.isActive)}
                      disabled={actionLoading}
                      className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                        tasker.isActive 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      } disabled:opacity-50`}
                    >
                      {actionLoading ? 'Updating...' : tasker.isActive ? 'Deactivate Account' : 'Activate Account'}
                    </button>

                    {tasker.vettingStatus === 'pending' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleVettingUpdate('approved')}
                          disabled={actionLoading}
                          className="py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVettingUpdate('rejected')}
                          disabled={actionLoading}
                          className="py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-blue-600" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <StatItem label="Profile" value={tasker.profileCompleted ? 'Complete' : 'Incomplete'} />
                    <StatItem label="MiniTask" value={tasker.miniTaskEligible ? 'Eligible' : 'Not Eligible'} />
                    <StatItem label="Applied Tasks" value={tasker.appliedMiniTasks?.length || 0} />
                    <StatItem label="Portfolio" value={tasker.workPortfolio?.length || 0} />
                    <StatItem label="Experience" value={tasker.workExperience?.length || 0} />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200">
                    <nav className="flex overflow-x-auto p-4 gap-1">
                      {[
                        { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
                        { id: 'skills', label: 'Skills', icon: <Briefcase className="w-4 h-4" /> },
                        { id: 'experience', label: 'Experience', icon: <FileText className="w-4 h-4" /> },
                        { id: 'ratings', label: 'Ratings', icon: <Star className="w-4 h-4" /> },
                        { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                            activeTab === tab.id
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6">
                    {activeTab === 'overview' && <OverviewTab tasker={tasker} />}
                    {activeTab === 'skills' && <SkillsTab tasker={tasker} />}
                    {activeTab === 'experience' && <ExperienceTab tasker={tasker} />}
                    {activeTab === 'ratings' && <RatingsTab tasker={tasker} />}
                    {activeTab === 'security' && <SecurityTab tasker={tasker} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// === TAB COMPONENTS ===
const OverviewTab = ({ tasker }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Personal Information">
        <InfoRow label="Full Name" value={tasker.name} />
        <InfoRow label="Email" value={tasker.email} />
        <InfoRow label="Phone" value={tasker.phone || '—'} />
        <InfoRow label="Bio" value={tasker.Bio || 'No bio provided'} />
      </Card>

      <Card title="Location">
        <InfoRow label="City" value={tasker.location?.city || '—'} />
        <InfoRow label="Region" value={tasker.location?.region || '—'} />
        <InfoRow label="Town" value={tasker.location?.town || '—'} />
        <InfoRow label="Street" value={tasker.location?.street || '—'} />
      </Card>
    </div>

    <Card title="Availability">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${
          tasker.availability?.status === 'available' ? 'bg-green-500' :
          tasker.availability?.status === 'busy' ? 'bg-yellow-500' :
          tasker.availability?.status === 'away' ? 'bg-orange-500' :
          tasker.availability?.status === 'suspended' ? 'bg-red-500' : 'bg-gray-500'
        }`} />
        <span className="font-semibold capitalize">{tasker.availability?.status || 'unknown'}</span>
        {tasker.availability?.lastActiveAt && (
          <span className="text-sm text-gray-500">
            Last active: {new Date(tasker.availability.lastActiveAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </Card>

    <Card title="Payment Methods">
      {tasker.paymentMethods?.length > 0 ? (
        <div className="space-y-3">
          {tasker.paymentMethods.map((method, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold capitalize">{method.provider} {method.type?.replace('_', ' ')}</div>
                <div className="text-sm text-gray-600">{method.accountNumber}</div>
              </div>
              {method.isDefault && (
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">Default</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No payment methods added</p>
      )}
    </Card>
  </div>
);

const SkillsTab = ({ tasker }) => (
  <div className="space-y-6">
    <Card title="Skills">
      {tasker.skills?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tasker.skills.map((skill, i) => (
            <span key={i} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      ) : <p className="text-gray-500">No skills listed</p>}
    </Card>

    <Card title="Work Portfolio">
      {tasker.workPortfolio?.length > 0 ? (
        <div className="space-y-4">
          {tasker.workPortfolio.map((item, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
              {item.description && <p className="text-gray-600 mb-3">{item.description}</p>}
              {item.files?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Attachments:</span>
                  {item.files.map((file, fi) => (
                    <a key={fi} href={file.publicUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      <ExternalLink className="w-4 h-4" /> {file.name}
                    </a>
                  ))}
                </div>
              )}
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  <ExternalLink className="w-4 h-4" /> View Project
                </a>
              )}
            </div>
          ))}
        </div>
      ) : <p className="text-gray-500">No portfolio items</p>}
    </Card>
  </div>
);

const ExperienceTab = ({ tasker }) => (
  <div className="space-y-6">
    <Card title="Work Experience">
      {tasker.workExperience?.length > 0 ? (
        <div className="space-y-4">
          {tasker.workExperience.map((exp, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                <div>
                  <h4 className="font-bold text-gray-900">{exp.jobTitle}</h4>
                  <p className="text-blue-600">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                </span>
              </div>
              {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
            </div>
          ))}
        </div>
      ) : <p className="text-gray-500">No experience listed</p>}
    </Card>

    <Card title="Education">
      {tasker.education?.length > 0 ? (
        <div className="space-y-4">
          {tasker.education.map((edu, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <h4 className="font-bold text-gray-900">{edu.certification}</h4>
                  <p className="text-blue-600">{edu.institution}</p>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {edu.startedOn && new Date(edu.startedOn).getFullYear()} - {edu.yearOfCompletion ? new Date(edu.yearOfCompletion).getFullYear() : 'Present'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-500">No education added</p>}
    </Card>
  </div>
);

const RatingsTab = ({ tasker }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Average Rating">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{tasker.rating || 0}</div>
          <div className="flex justify-center mt-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-5 h-5 ${s <= Math.floor(tasker.rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
      </Card>

      <Card title="Total Reviews">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{tasker.numberOfRatings || 0}</div>
          <p className="text-gray-600 mt-1">reviews</p>
        </div>
      </Card>

      <Card title="Performance">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {tasker.rating >= 4.5 ? 'Excellent' : tasker.rating >= 3.5 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>
      </Card>
    </div>

    <Card title="Recent Reviews">
      {tasker.ratingsReceived?.length > 0 ? (
        <div className="space-y-4">
          {tasker.ratingsReceived.slice(0, 5).map((r, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 font-semibold">{r.rating}/5</span>
                </div>
                <span className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              {r.feedback && <p className="text-gray-600">{r.feedback}</p>}
            </div>
          ))}
        </div>
      ) : <p className="text-gray-500">No reviews yet</p>}
    </Card>
  </div>
);

const SecurityTab = ({ tasker }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Account Security">
        <SecurityItem label="Email Verified" status={tasker.isVerified} />
        <SecurityItem label="Profile Complete" status={tasker.profileCompleted} />
        <SecurityItem label="ID Card Uploaded" status={!!tasker.idCard} />
      </Card>

      <Card title="Vetting Status">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium">Current Status</span>
          <VettingBadge status={tasker.vettingStatus} />
        </div>
        {tasker.vettingStatus === 'pending' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-800">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Awaiting admin review</span>
          </div>
        )}
        {tasker.vettingStatus === 'approved' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Fully vetted and approved</span>
          </div>
        )}
        {tasker.vettingStatus === 'rejected' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <XCircle className="w-4 h-4" />
            <span className="text-sm">Vetting failed</span>
          </div>
        )}
      </Card>
    </div>

    <Card title="Account Activity">
      <ActivityItem label="Account Created" date={tasker.createdAt} />
      <ActivityItem label="Last Updated" date={tasker.updatedAt} />
      <ActivityItem label="Last Active" date={tasker.availability?.lastActiveAt} />
    </Card>
  </div>
);

// === HELPER COMPONENTS ===
const Card = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    {title && <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>}
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-200 last:border-0 gap-1">
    <span className="font-medium text-gray-700 text-sm">{label}</span>
    <span className="text-gray-900 text-sm">{value}</span>
  </div>
);

const SecurityItem = ({ label, status }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
    <span className="font-medium text-gray-700 text-sm">{label}</span>
    {status ? (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Verified</span>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-red-600">
        <XCircle className="w-4 h-4" />
        <span className="text-sm">Missing</span>
      </div>
    )}
  </div>
);

const ActivityItem = ({ label, date }) => (
  <div className="flex justify-between py-3 border-b border-gray-200 last:border-0">
    <span className="font-medium text-gray-700 text-sm">{label}</span>
    <span className="text-sm text-gray-500">
      {date ? new Date(date).toLocaleDateString() : 'Never'}
    </span>
  </div>
);

const StatusBadge = ({ status, label, active, verified }) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
  if (active) return <span className={`${base} ${status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
    {status ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}{label}
  </span>;
  if (verified) return <span className={`${base} ${status ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
    {status ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}{label}
  </span>;
};

const VettingBadge = ({ status }) => {
  const config = {
    pending: { color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3 h-3" /> },
    approved: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
    rejected: { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" /> },
    not_applied: { color: 'bg-gray-100 text-gray-600', icon: null }
  };
  const { color, icon } = config[status] || config.not_applied;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${color}`}>
      {icon}{status.replace('_', ' ')}
    </span>
  );
};

const InfoItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-gray-700">
    {icon}
    <span className="text-sm">{text}</span>
  </div>
);

const StatItem = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <span className="text-gray-600 text-sm">{label}</span>
    <span className="font-bold text-gray-900 text-sm">{value}</span>
  </div>
);

// === STATES ===
const LoadingState = ({ isSidebarOpen, setIsSidebarOpen }) => (
  <div className="flex h-screen bg-gray-50">
    <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading tasker profile...</p>
      </div>
    </div>
  </div>
);

const NotFoundState = ({ isSidebarOpen, setIsSidebarOpen, navigate }) => (
  <div className="flex h-screen bg-gray-50">
    <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tasker Not Found</h3>
        <p className="text-gray-600 mb-6">The tasker profile you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/admin/view_all_taskers')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Taskers
        </button>
      </div>
    </div>
  </div>
);

export default AdminTaskerDetailPage;