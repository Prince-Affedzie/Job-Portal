import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DollarSign,
  User,
  Clock,
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp
} from "lucide-react";
import { getSingleMinitask } from '../../APIS/API';
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import dayjs from "dayjs";

const AdminTaskBidsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (taskId) fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await getSingleMinitask(taskId);
      if (res.status === 200) {
        setTask(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch task:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMM DD, YYYY [at] h:mm A");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Accepted": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Accepted": return <CheckCircle className="w-4 h-4" />;
      case "Rejected": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredBids = task?.bids?.filter(bid => {
    const matchesStatus = filterStatus === "all" || bid.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      bid.bidder?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.message?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <NotificationCenter/>
      
      <div className="flex-1 flex flex-col">
        <AdminNavbar 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
             {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (<>
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Task
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">Bids for "{task.title}"</h1>
                  <p className="text-gray-600 mt-1">
                    {task.bids?.length || 0} total bids • {task.category}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(task.budget || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search bids by name or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bids List */}
            <div className="space-y-4">
              {filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <div key={bid._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Bidder Information */}
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          {bid.bidder?.profileImage ? (
                            <img 
                              src={bid.bidder.profileImage} 
                              alt={bid.bidder.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {bid.bidder?.name || "Unknown Bidder"}
                              </h3>
                              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bid.status)}`}>
                                {getStatusIcon(bid.status)}
                                <span className="ml-1">{bid.status}</span>
                              </div>
                            </div>

                            <div className="mt-2 space-y-1">
                              {bid.bidder?.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{bid.bidder.email}</span>
                                </div>
                              )}
                              
                              {bid.bidder?.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{bid.bidder.phone}</span>
                                </div>
                              )}

                              {bid.bidder?.rating && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                                  <span>{bid.bidder.rating} rating</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bid Message */}
                        {bid.message && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MessageSquare className="w-4 h-4 mr-2 text-gray-400" />
                              <span>Bid Message</span>
                            </div>
                            <p className="text-gray-700">{bid.message}</p>
                          </div>
                        )}
                      </div>

                      {/* Bid Details */}
                      <div className="lg:w-1/3 space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Bid Amount</span>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 text-blue-600 mr-1" />
                              <span className="text-xl font-bold text-blue-700">
                                {formatCurrency(bid.amount)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {bid.timeline && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Clock className="w-4 h-4 mr-2 text-gray-400" />
                              <span>Proposed Timeline</span>
                            </div>
                            <p className="text-gray-700">{bid.timeline}</p>
                          </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Bid Submitted</span>
                          </div>
                          <p className="text-gray-700">{formatDate(bid.createdAt)}</p>
                        </div>

                        {/* Action Buttons 
                        <div className="flex space-x-2 pt-4">
                          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                            Accept Bid
                          </button>
                          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                            Reject Bid
                          </button>
                        </div>*/}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== "all" 
                      ? "No bids match your search criteria." 
                      : "This task hasn't received any bids yet."
                    }
                  </p>
                </div>
              )}
            </div>
            </>)}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTaskBidsPage;