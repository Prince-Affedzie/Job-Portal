import React, { useEffect, useState } from 'react';
import { Loader2, X, Clock, CheckCircle, XCircle, RefreshCw, FileText, MessageSquare, Image, Download, ExternalLink, AlertTriangle } from 'lucide-react';
import { clientgetTaskSubmissions, reviewSubmission } from '../APIS/API';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../Components/MyComponents/Navbar';

const ClientViewSubmissions = () => {
  const { taskId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});
  const [statuses, setStatuses] = useState({});
  const [filter, setFilter] = useState('all');
  const [taskDetails, setTaskDetails] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await clientgetTaskSubmissions(taskId);
      if (res.status === 200) {
        setSubmissions(res.data);
        
        // Get task details from first submission if available
        if (res.data.length > 0 && res.data[0].taskId) {
          setTaskDetails(res.data[0].taskId);
        }
        
        // Initialize feedback and status states
        const initialFeedbacks = {};
        const initialStatuses = {};
        res.data.forEach((sub) => {
          initialFeedbacks[sub._id] = sub.feedback || '';
          initialStatuses[sub._id] = sub.status;
        });
        setFeedbacks(initialFeedbacks);
        setStatuses(initialStatuses);
      }
    } catch (err) {
      toast.error("Failed to load submissions. Please try again.");
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [taskId]);

  const handleReviewSubmit = async (submissionId) => {
    const status = statuses[submissionId];
    const feedback = feedbacks[submissionId];

    setReviewLoading(submissionId);
    try {
      const res = await reviewSubmission(submissionId, { status, feedback });
      if (res.status === 200) {
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub._id === submissionId ? { ...sub, status, feedback } : sub
          )
        );
        toast.success('Review submitted successfully.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            "An unexpected error occurred. Please try again.";
      console.error('Failed to submit review:', error);
      toast.error(errorMessage);
    } finally {
      setReviewLoading(null);
    }
  };

  const getFileType = (url) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
      return 'image';
    } else if (/\.(pdf)$/i.test(url)) {
      return 'pdf';
    } else {
      return 'other';
    }
  };

  const getFileIcon = (url) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
      return <Image size={16} className="mr-1" />;
    } else if (/\.(pdf)$/i.test(url)) {
      return <FileText size={16} className="mr-1" />;
    } else if (/\.(doc|docx)$/i.test(url)) {
      return <FileText size={16} className="mr-1" />;
    } else {
      return <Download size={16} className="mr-1" />;
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
          icon: <Clock size={16} className="mr-1" />,
          text: 'Pending Review'
        };
      case 'approved':
        return {
          color: 'bg-green-100 text-green-700 border-green-300',
          icon: <CheckCircle size={16} className="mr-1" />,
          text: 'Approved'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-700 border-red-300',
          icon: <XCircle size={16} className="mr-1" />,
          text: 'Rejected'
        };
      case 'revision_requested':
        return {
          color: 'bg-orange-100 text-orange-700 border-orange-300',
          icon: <AlertTriangle size={16} className="mr-1" />,
          text: 'Revision Requested'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          icon: <Clock size={16} className="mr-1" />,
          text: status
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handlePreview = (url, type) => {
    setPreviewUrl(url);
    setPreviewType(type);
  };

  const getFilteredSubmissions = () => {
    if (filter === 'all') return submissions;
    return submissions.filter(sub => sub.status === filter);
  };

  const filteredSubmissions = getFilteredSubmissions();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Review Submissions</h1>
            {taskDetails && (
              <p className="text-gray-500">
                Task: <span className="font-medium text-gray-700">{taskDetails.title}</span>
              </p>
            )}
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <button 
              onClick={fetchSubmissions}
              className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-1 border border-gray-300 rounded-md bg-white shadow-sm hover:shadow transition"
            >
              <RefreshCw size={16} className="mr-1" /> Refresh
            </button>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Submissions</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="revision_requested">Revision Requested</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <span className="ml-2 text-gray-600">Loading submissions...</span>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="text-gray-400" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Submissions Found</h2>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? "Freelancers haven't submitted any work for this task yet." 
                : `No submissions with status: ${filter}`}
            </p>
            <Link 
              to="/dashboard" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {filteredSubmissions.map((submission) => {
              const statusDetails = getStatusDetails(submission.status);
              
              return (
                <div
                  key={submission._id}
                  className="border border-gray-200 rounded-lg shadow-sm hover:shadow transition bg-white"
                >
                  {/* Header */}
                  <div className="border-b border-gray-100 p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {submission.submittedBy?.name || 'Unknown Freelancer'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Submitted: {formatDate(submission.createdAt)}
                      </p>
                    </div>
                    <span className={`flex items-center px-3 py-1 text-xs rounded-full font-medium border ${statusDetails.color}`}>
                      {statusDetails.icon} {statusDetails.text}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    {/* Message */}
                    <div className="mb-4">
                      <div className="flex items-center text-gray-700 font-medium mb-2">
                        <MessageSquare size={16} className="mr-2" /> Freelancer's Message
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                        {submission.message || <span className="italic text-gray-400">No message provided</span>}
                      </div>
                    </div>

                    {/* Files */}
                    <div className="mb-6">
                      <h4 className="flex items-center text-gray-700 font-medium mb-2">
                        <FileText size={16} className="mr-2" /> Submitted Files
                      </h4>
                      
                      {submission.files?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {submission.files.map((url, idx) => {
                            const fileType = getFileType(url);
                            
                            return (
                              <div key={idx} className="relative group">
                                {fileType === 'image' ? (
                                  <div 
                                    className="h-36 rounded-md border border-gray-200 overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => handlePreview(url, 'image')}
                                  >
                                    <img
                                      src={url}
                                      alt={`Submission ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                                      <ExternalLink className="text-white" size={20} />
                                    </div>
                                  </div>
                                ) : (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-3 h-36 border border-gray-200 rounded-md hover:bg-gray-50 transition text-gray-700 hover:text-blue-600"
                                  >
                                    {getFileIcon(url)}
                                    <span className="text-sm truncate">File {idx + 1}</span>
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No files attached.</p>
                      )}
                    </div>

                    {/* Review Section */}
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <h4 className="text-gray-700 font-medium mb-3">Your Review</h4>
                      
                      {/* Status dropdown */}
                      <div className="mb-3">
                        <label className="block text-sm text-gray-600 mb-1">Status</label>
                        <select
                          value={statuses[submission._id]}
                          onChange={(e) => setStatuses({ ...statuses, [submission._id]: e.target.value })}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pending">Pending Review</option>
                          <option value="approved">Approve Work</option>
                          <option value="revision_requested">Request Revision</option>
                          <option value="rejected">Reject Work</option>
                        </select>
                      </div>

                      {/* Feedback textarea */}
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1">Feedback</label>
                        <textarea
                          value={feedbacks[submission._id]}
                          onChange={(e) => setFeedbacks({ ...feedbacks, [submission._id]: e.target.value })}
                          placeholder={statuses[submission._id] === 'approved' 
                            ? "Share positive feedback about this work..." 
                            : statuses[submission._id] === 'revision_requested'
                            ? "Explain what needs to be revised..."
                            : "Provide your feedback here..."}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                        />
                      </div>

                      {/* Submit Review Button */}
                      <button
                        onClick={() => handleReviewSubmit(submission._id)}
                        disabled={reviewLoading === submission._id}
                        className={`w-full flex items-center justify-center gap-2 ${
                          statuses[submission._id] === 'approved' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : statuses[submission._id] === 'rejected'
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white py-2 rounded-md text-sm font-medium transition`}
                      >
                        {reviewLoading === submission._id ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            {statuses[submission._id] === 'approved' && <CheckCircle size={16} />}
                            {statuses[submission._id] === 'rejected' && <XCircle size={16} />}
                            {statuses[submission._id] === 'revision_requested' && <AlertTriangle size={16} />}
                            <span>
                              {statuses[submission._id] === 'approved' 
                                ? 'Approve Submission' 
                                : statuses[submission._id] === 'rejected'
                                ? 'Reject Submission'
                                : statuses[submission._id] === 'revision_requested'
                                ? 'Request Changes'
                                : 'Submit Review'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">File Preview</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setPreviewUrl(null);
                  setPreviewType(null);
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-2 max-h-[80vh] overflow-auto">
              {previewType === 'image' && (
                <img src={previewUrl} alt="Preview" className="max-w-full mx-auto" />
              )}
              {previewType === 'pdf' && (
                <iframe 
                  src={previewUrl} 
                  title="PDF Preview" 
                  className="w-full h-[70vh]"
                />
              )}
              {previewType === 'other' && (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="mb-4">This file type cannot be previewed</p>
                  <a 
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                  >
                    <Download size={16} className="mr-2" /> Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientViewSubmissions;
//Okay thanks , but looking at my current infrastructure of work submission from the freealncer to the client and how it's managed, comparing it to big platforms, what am i missing , or what improvements can i do to ensure standardization