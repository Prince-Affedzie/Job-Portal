import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  FileText,
  DollarSign,
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  ChevronDown,
  Download,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { getAllPayments, updatePaymentStatus, releaseFunds, refundPayment } from '../../APIS/adminApi';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationCenter from "../../Services/alerts/NotificationCenter";
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";

const AdminPaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debug state
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    fetchAllPayments();
  }, []);

  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment => {
        const initiatorName = payment.initiator?.name || payment.initiator || 'Unknown';
        const beneficiaryName = payment.beneficiary?.name || payment.beneficiary || 'Unknown';
        const transactionRef = payment.transactionRef || '';
        const taskTitle = payment.taskId?.title || payment.taskTitle || '';

        return (
          initiatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
          taskTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (paymentMethodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.paymentMethod === paymentMethodFilter);
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentMethodFilter, payments]);

  // Pagination calculations
  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const fetchAllPayments = async () => {
    setLoading(true);
    try {
      const response = await getAllPayments();
      console.log("API Response:", response); // Debug log
      
      if (response.status === 200) {
        // Handle both array and object responses
        const paymentsData = Array.isArray(response.data) ? response.data : 
                           response.data.payments || response.data.data || [];
        
        setPayments(paymentsData);
        setDebugInfo(`Loaded ${paymentsData.length} payments`);
        
        // Log first payment for debugging
        if (paymentsData.length > 0) {
          console.log("First payment sample:", paymentsData[0]);
        }
      } else {
        setPayments([]);
        setDebugInfo('No payments data received');
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setDebugInfo(`Error: ${error.message}`);
      toast.error("Failed to load payments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Safe data access functions
  const getInitiatorName = (payment) => {
    return payment.initiator?.name || payment.initiator || 'Unknown Client';
  };

  const getBeneficiaryName = (payment) => {
    return payment.beneficiary?.name || payment.beneficiary || 'Unknown Tasker';
  };

  const getTaskTitle = (payment) => {
    return payment.taskId?.title || payment.taskTitle || 'No Task Title';
  };

  const getTransactionRef = (payment) => {
    return payment.transactionRef || payment.reference || 'No Reference';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: Clock },
      in_escrow: { color: 'bg-blue-50 text-blue-700 border border-blue-200', icon: DollarSign },
      released: { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: CheckCircle },
      refunded: { color: 'bg-purple-50 text-purple-700 border border-purple-200', icon: RefreshCw },
      failed: { color: 'bg-red-50 text-red-700 border border-red-200', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status ? status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      mobile_money: Smartphone,
      card: CreditCard,
      bank: Building,
      wallet: Wallet
    };
    const Icon = icons[method] || CreditCard;
    return <Icon className="w-4 h-4" />;
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      mobile_money: 'Mobile Money',
      card: 'Card',
      bank: 'Bank Transfer',
      wallet: 'Wallet'
    };
    return labels[method] || method || 'Unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount, currency = 'GHS') => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleReleaseFunds = async (paymentId,reference) => {
    setActionLoading(true);
    try {
      const response = await releaseFunds(reference);
      if (response.status === 200) {
        const updatedPayments = payments.map(payment => 
          payment._id === paymentId 
            ? { ...payment, status: 'released', updatedAt: new Date().toISOString() }
            : payment
        );
        setPayments(updatedPayments);
        toast.success("Funds released successfully!");
        setShowModal(false);
      } else {
        toast.error("Failed to release funds. Please try again.");
      }
    } catch (error) {
      console.error("Error releasing funds:", error);
      toast.error("An error occurred while releasing funds.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefundPayment = async (paymentId,reference) => {
    setActionLoading(true);
    try {
      const response = await refundPayment(reference);
      if (response.status === 200) {
        const updatedPayments = payments.map(payment => 
          payment._id === paymentId 
            ? { ...payment, status: 'refunded', updatedAt: new Date().toISOString() }
            : payment
        );
        setPayments(updatedPayments);
        toast.success("Payment refunded successfully!");
        setShowModal(false);
      } else {
        toast.error("Failed to refund payment. Please try again.");
      }
    } catch (error) {
      console.error("Error refunding payment:", error);
      toast.error("An error occurred while refunding payment.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    setActionLoading(true);
    try {
      const response = await updatePaymentStatus(paymentId, { status: newStatus });
      if (response.status === 200) {
        const updatedPayments = payments.map(payment => 
          payment._id === paymentId 
            ? { ...payment, status: newStatus, updatedAt: new Date().toISOString() }
            : payment
        );
        setPayments(updatedPayments);
        toast.success(`Payment status updated to ${newStatus.replace('_', ' ')}`);
        setShowModal(false);
      } else {
        toast.error("Failed to update payment status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("An error occurred while updating the payment status.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStats = () => {
    const total = payments.length;
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const pending = payments.filter(p => p.status === 'pending').length;
    
    const inEscrowPayments = payments.filter(p => p.status === 'in_escrow');
    const inEscrow = inEscrowPayments.length;
    const inEscrowAmount = inEscrowPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    const releasedPayments = payments.filter(p => p.status === 'released');
    const released = releasedPayments.length;
    const releasedAmount = releasedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    const refundedPayments = payments.filter(p => p.status === 'refunded');
    const refunded = refundedPayments.length;
    const refundedAmount = refundedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    const failed = payments.filter(p => p.status === 'failed').length;
    
    return { 
      total, 
      totalAmount, 
      pending, 
      inEscrow, 
      inEscrowAmount,
      released, 
      releasedAmount,
      refunded, 
      refundedAmount,
      failed 
    };
  };

  const getTaskStatus = (payment) => {
    if (payment.taskId?.status) {
      return payment.taskId.status;
    }
    return 'unknown';
  };

  const formatTaskStatus = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'assigned': 'Assigned',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'disputed': 'Disputed',
      'unknown': 'Unknown'
    };
    return statusMap[status] || status;
  };

  const getTaskStatusBadge = (status) => {
    const statusConfig = {
      pending: 'bg-amber-100 text-amber-800 border border-amber-200',
      assigned: 'bg-blue-100 text-blue-800 border border-blue-200',
      in_progress: 'bg-purple-100 text-purple-800 border border-purple-200',
      completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      cancelled: 'bg-red-100 text-red-800 border border-red-200',
      disputed: 'bg-orange-100 text-orange-800 border border-orange-200',
      unknown: 'bg-slate-100 text-slate-800 border border-slate-200'
    };

    return statusConfig[status] || statusConfig.unknown;
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="sticky top-0 z-40">
          <AdminNavbar 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isSidebarOpen={isSidebarOpen} 
          />
        </div>
        
        <NotificationCenter/>
        <ToastContainer/>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Management</h1>
              <p className="text-slate-600">Monitor and manage all task payments and transactions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Payments</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                    <p className="text-sm text-slate-500 mt-1">{formatCurrency(stats.totalAmount)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">In Escrow</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.inEscrow}</p>
                    <p className="text-sm text-slate-500 mt-1">{formatCurrency(stats.inEscrowAmount)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Released</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.released}</p>
                    <p className="text-sm text-slate-500 mt-1">{formatCurrency(stats.releasedAmount)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-50">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Refunded</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.refunded}</p>
                    <p className="text-sm text-slate-500 mt-1">{formatCurrency(stats.refundedAmount)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50">
                    <RefreshCw className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search by client, tasker, reference, or task..."
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:flex-none">
                    <select
                      className="appearance-none w-full bg-white border border-slate-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in_escrow">In Escrow</option>
                      <option value="released">Released</option>
                      <option value="refunded">Refunded</option>
                      <option value="failed">Failed</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
                  </div>

                  <div className="relative flex-1 lg:flex-none">
                    <select
                      className="appearance-none w-full bg-white border border-slate-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={paymentMethodFilter}
                      onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    >
                      <option value="all">All Methods</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="card">Card</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="wallet">Wallet</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
                  </div>

                  <button 
                    onClick={fetchAllPayments}
                    className="inline-flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="mx-auto h-8 w-8 text-slate-400 animate-spin mb-4" />
                  <p className="text-slate-600">Loading payments...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Parties
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Task & Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {currentPayments.map((payment) => (
                        <tr key={payment._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <div className="text-sm font-semibold text-slate-900 mb-1">
                                {getTransactionRef(payment)}
                              </div>
                              <div className="text-xs text-slate-500">
                                ID: {payment._id ? payment._id.slice(-8) : 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="font-medium text-slate-700">Client:</span>
                                <span className="text-slate-600">{getInitiatorName(payment)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="font-medium text-slate-700">Tasker:</span>
                                <span className="text-slate-600">{getBeneficiaryName(payment)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-sm font-semibold text-slate-900">
                                {formatCurrency(payment.amount, payment.currency)}
                              </div>
                              <div className="text-xs text-slate-500 line-clamp-1">
                                {getTaskTitle(payment)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                              {getPaymentMethodLabel(payment.paymentMethod)}
                            </div>
                            {payment.mobileMoneyNumber && (
                              <div className="text-xs text-slate-500 mt-1">
                                {payment.mobileMoneyNumber}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatDate(payment.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewPayment(payment)}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-all duration-200"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {currentPayments.length === 0 && (
                    <div className="text-center py-12">
                      <DollarSign className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No payments found</h3>
                      <p className="text-slate-500 max-w-sm mx-auto">
                        {searchTerm || statusFilter !== 'all' || paymentMethodFilter !== 'all'
                          ? 'Try adjusting your search or filter criteria.'
                          : payments.length === 0 
                            ? 'No payments have been made yet.' 
                            : 'No payments match your criteria.'
                        }
                      </p>
                      {payments.length === 0 && (
                        <button
                          onClick={fetchAllPayments}
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Try Again
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                      Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                      <span className="font-semibold">{Math.min(endIndex, totalItems)}</span> of{' '}
                      <span className="font-semibold">{totalItems}</span> payments
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={goToPrevPage}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`min-w-8 h-8 px-2 rounded-lg border text-sm font-medium transition-colors ${
                                  currentPage === pageNum
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronDown className="w-4 h-4 -rotate-90" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Detail Modal - Keep the same as before */}
            {showModal && selectedPayment && (
              // ... (modal code remains exactly the same as in the previous version)
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-all duration-300">
                <div className="relative top-4 mx-auto p-4 w-11/12 max-w-4xl shadow-2xl rounded-2xl bg-white transform transition-transform duration-300">
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Payment Details</h3>
                      <p className="text-slate-600 mt-1">Complete payment information and management</p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
                    >
                      <XCircle className="h-6 w-6 text-slate-400 hover:text-slate-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Payment Info */}
                    <div className="space-y-6">
                      {/* Payment Information */}
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          Payment Information
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600">Amount</span>
                            <span className="text-lg font-bold text-slate-900">
                              {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600">Transaction Ref</span>
                            <span className="text-sm text-slate-900 font-mono">
                              {selectedPayment.transactionRef || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600">Payment Method</span>
                            <div className="flex items-center gap-2">
                              {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                              <span className="text-sm text-slate-900">
                                {getPaymentMethodLabel(selectedPayment.paymentMethod)}
                              </span>
                            </div>
                          </div>
                          {selectedPayment.mobileMoneyNumber && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-slate-600">Mobile Number</span>
                              <span className="text-sm text-slate-900">{selectedPayment.mobileMoneyNumber}</span>
                            </div>
                          )}
                          {selectedPayment.paymentChannel && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-slate-600">Payment Channel</span>
                              <span className="text-sm text-slate-900">{selectedPayment.paymentChannel}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Task Information with Status */}
                      {selectedPayment.taskId && (
                        <div className="bg-slate-50 rounded-2xl p-6">
                          <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Task Information
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-slate-600">Task Title</span>
                              <p className="text-sm text-slate-900 font-medium mt-1">
                                {selectedPayment.taskId.title}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-slate-600">Task Status</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTaskStatusBadge(getTaskStatus(selectedPayment))}`}>
                                {formatTaskStatus(getTaskStatus(selectedPayment))}
                              </span>
                            </div>
                            {selectedPayment.taskId.description && (
                              <div>
                                <span className="text-sm font-medium text-slate-600">Description</span>
                                <p className="text-sm text-slate-700 mt-1">
                                  {selectedPayment.taskId.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Management */}
                    <div className="space-y-6">
                      {/* Parties Involved */}
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Parties Involved
                        </h4>
                        <div className="space-y-4">
                          <div className="bg-white rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="font-semibold text-slate-900">Client (Payer)</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900">{selectedPayment.initiator?.name}</p>
                            <p className="text-sm text-slate-600 mt-1">{selectedPayment.initiator?.email}</p>
                            <p className="text-sm text-slate-600">{selectedPayment.initiator?.phone}</p>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-green-200">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="font-semibold text-slate-900">Tasker (Receiver)</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900">{selectedPayment.beneficiary?.name}</p>
                            <p className="text-sm text-slate-600 mt-1">{selectedPayment.beneficiary?.email}</p>
                            <p className="text-sm text-slate-600">{selectedPayment.beneficiary?.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status Management */}
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Status Management</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Current Status</span>
                            {getStatusBadge(selectedPayment.status)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-4">
                            {selectedPayment.status !== 'released' && (
                              <button
                                onClick={() => handleReleaseFunds(selectedPayment._id,selectedPayment.transactionRef)}
                                disabled={actionLoading}
                                className="py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                              >
                                Release Funds
                              </button>
                            )}
                            {selectedPayment.status !== 'refunded' && (
                              <button
                                onClick={() => handleRefundPayment(selectedPayment._id,selectedPayment.transactionRef)}
                                disabled={actionLoading}
                                className="py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
                              >
                                Refund
                              </button>
                            )}
                            {selectedPayment.status !== 'failed' && (
                              <button
                                onClick={() => handleStatusUpdate(selectedPayment._id, 'failed')}
                                disabled={actionLoading}
                                className="py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                              >
                                Mark Failed
                              </button>
                            )}
                            {selectedPayment.status !== 'in_escrow' && (
                              <button
                                onClick={() => handleStatusUpdate(selectedPayment._id, 'in_escrow')}
                                disabled={actionLoading}
                                className="py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                              >
                                Hold in Escrow
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-slate-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Timeline</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-slate-200">
                            <span className="text-sm text-slate-600">Created</span>
                            <span className="text-sm font-medium text-slate-900">{formatDate(selectedPayment.createdAt)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-slate-600">Last Updated</span>
                            <span className="text-sm font-medium text-slate-900">{formatDate(selectedPayment.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPaymentManagement;