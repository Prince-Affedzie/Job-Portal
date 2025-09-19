import React, { useEffect, useState } from 'react';
import { 
  Loader2, 
  X, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  FileText, 
  MessageSquare, 
  Image, 
  Download, 
  ExternalLink, 
  AlertTriangle,
  Calendar,
  Filter
} from 'lucide-react';
import { clientgetTaskSubmissions, reviewSubmission, getPreviewUrl } from '../../APIS/API';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClientNavbar } from '../../Components/ClientComponents/ClientNavbar';
import SubmittedFiles from '../../Components/MiniTaskManagementComponents/SubmittedFiles';
import { NotificationToast } from '../../Components/Common/NotificationToast';
import FilePreviewModal from '../../Components/MiniTaskManagementComponents/SubmissionsPreviewModal'

const ClientViewSubmissions = () => {
  const { taskId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(null);
  const [previewState, setPreviewState] = useState({
  open: false,
  url: null,
  type: null,
  name: null
});

  const [feedbacks, setFeedbacks] = useState({});
  const [statuses, setStatuses] = useState({});
  const [filter, setFilter] = useState('all');
  const [taskDetails, setTaskDetails] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const detailsRef = React.useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await clientgetTaskSubmissions(taskId);
      if (res.status === 200) {
        // Sort submissions by date (newest first)
        const sortedSubmissions = res.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSubmissions(sortedSubmissions);
        
        // Get task details from first submission if available
        if (sortedSubmissions.length > 0 && sortedSubmissions[0].taskId) {
          setTaskDetails(sortedSubmissions[0].taskId);
        }
        
        // Initialize feedback and status states
        const initialFeedbacks = {};
        const initialStatuses = {};
        sortedSubmissions.forEach((sub) => {
          initialFeedbacks[sub._id] = sub.feedback || '';
          initialStatuses[sub._id] = sub.status;
        });
        setFeedbacks(initialFeedbacks);
        setStatuses(initialStatuses);
        
        // Select the most recent submission by default
        if (sortedSubmissions.length > 0 && !selectedSubmission) {
          setSelectedSubmission(sortedSubmissions[0]);
        }
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
        
        // Update the selected submission if it's the one being reviewed
        if (selectedSubmission && selectedSubmission._id === submissionId) {
          setSelectedSubmission({...selectedSubmission, status, feedback});
        }
        
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

  const handlePreview = async (fileKey, previewURL) => {
  try {
    if (previewURL) {
      setPreviewState({
        open: true,
        url: previewURL,
        type: getFileType(fileKey),
        name: fileKey.split('/').pop() // Extract filename from URL
      });
    } else {
      toast.error('Failed to get preview URL.');
    }
  } catch (error) {
    toast.error('Error fetching preview URL.');
    console.error(error);
  }
};
  const getFileType = (url) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
      return 'image';
    }else if (/\.(mp4|webm|mov|avi|wmv)$/i.test(url)) {
    return 'video';
    } else if (/\.(pdf)$/i.test(url)) {
      return 'pdf';
    } else {
      return 'other';
    }
  };

  const getFileIcon = (url) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
      return <Image size={18} className="mr-2" />;
    }else if (/\.(mp4|webm|mov|avi|wmv)$/i.test(url)) {
      return 'video';
    } else if (/\.(pdf)$/i.test(url)) {
      return <FileText size={18} className="mr-2" />;
    } else if (/\.(doc|docx)$/i.test(url)) {
      return <FileText size={18} className="mr-2" />;
    } else {
      return <Download size={18} className="mr-2" />;
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          icon: <Clock size={16} className="mr-1" />,
          text: 'Pending Review',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      case 'approved':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: <CheckCircle size={16} className="mr-1" />,
          text: 'Approved',
          badge: 'bg-green-100 text-green-800'
        };
      case 'rejected':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: <XCircle size={16} className="mr-1" />,
          text: 'Rejected',
          badge: 'bg-red-100 text-red-800'
        };
      case 'revision_requested':
        return {
          color: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <AlertTriangle size={16} className="mr-1" />,
          text: 'Revision Requested',
          badge: 'bg-orange-100 text-orange-800'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <Clock size={16} className="mr-1" />,
          text: status,
          badge: 'bg-gray-100 text-gray-800'
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

  const getFilteredSubmissions = () => {
    if (filter === 'all') return submissions;
    return submissions.filter(sub => sub.status === filter);
  };

  const getSubmissionNumber = (submission) => {
    // Find the index of this submission in chronological order
    const allSubmissions = [...submissions].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
    const index = allSubmissions.findIndex(s => s._id === submission._id);
    return index + 1;
  };

  const filteredSubmissions = getFilteredSubmissions();

  return (
    <div className="min-h-screen bg-gray-50">
       <ClientNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center mb-1">
             
              <h1 className="text-xl font-bold text-gray-800">Review Submissions</h1>
            </div>
            {taskDetails && (
              <p className="text-sm text-gray-500">
                Task: <span className="font-medium text-gray-700">{taskDetails.title}</span>
              </p>
            )}
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button 
              onClick={fetchSubmissions}
              className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm hover:shadow transition"
            >
              <RefreshCw size={16} className="mr-2" /> Refresh
            </button>
            <div className="relative">
              <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm">
                <Filter size={16} className="text-gray-500 mr-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent text-gray-700 focus:outline-none"
                >
                  <option value="all">All Submissions</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="revision_requested">Revision Requested</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
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
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Submission List */}
            <div className="lg:w-1/3 xl:w-1/4">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-800">Submission History</h3>
                </div>
                <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
                  {filteredSubmissions.map((submission) => {
                    const statusDetails = getStatusDetails(submission.status);
                    const isSelected = selectedSubmission && selectedSubmission._id === submission._id;
                    
                    return (
                      <div
                        key={submission._id}
                        onClick={() => {
                          setSelectedSubmission(submission)
                          if (window.innerWidth < 1024) {
                          setTimeout(() => {
                          detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
                          }, 100); 
                          }} }
                        className={`p-4 cursor-pointer transition hover:bg-gray-50 ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                             <span className="font-medium text-gray-900">
                              Submission #{getSubmissionNumber(submission)}
                            </span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${statusDetails.badge}`}>
                            {statusDetails.text}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(submission.createdAt)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <FileText size={14} className="mr-1" />
                          {submission.files?.length || 0} file(s)
                          {submission.message && (
                            <span className="ml-3 flex items-center">
                              <MessageSquare size={14} className="mr-1" />
                              Message
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content - Selected Submission */}
            <div className="lg:w-2/3 xl:w-3/4" ref={detailsRef}>
              {selectedSubmission ? (
                <div className="bg-white rounded-lg shadow">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <h2 className="text-lg font-semibold text-gray-800">
                            {selectedSubmission.freelancerId?.name || 'Unknown Freelancer'}
                          </h2>
                          <span className={`ml-3 px-3 py-1 text-xs rounded-full flex items-center font-medium ${getStatusDetails(selectedSubmission.status).badge}`}>
                            {getStatusDetails(selectedSubmission.status).icon} {getStatusDetails(selectedSubmission.status).text}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted on {formatDate(selectedSubmission.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Task Information */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-2">Task Information</h3>
                    <p className="text-gray-700 text-sm font-medium">
                      {taskDetails?.title || 'Untitled Task'}
                    </p>
                  </div>

                  {/* Content Area */}
                  <div className="p-6">
                    {/* Message */}
                    {selectedSubmission.message && (
                      <div className="mb-6">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                          <MessageSquare size={18} className="mr-2" /> Freelancer's Message
                        </h3>
                        <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                          <p className="text-sm text-gray-700">
                            {selectedSubmission.message || <span className="italic text-gray-400">No message provided</span>}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Files */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                        <FileText size={18} className="mr-2" /> Submitted Files
                      </h3>
                      
                      <SubmittedFiles
                         files={selectedSubmission.files || []} 
                         onPreviewClick={handlePreview} 
                         selectedSubmission ={selectedSubmission}
            
                      />

                    </div>

                    {/* Review Section */}
                    <div className="border-t border-gray-100 pt-6 mt-6">
                      <h3 className="font-medium text-gray-800 mb-4">Your Review</h3>
                      
                      {/* Status dropdown */}
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-2">Status</label>
                        <select
                          value={statuses[selectedSubmission._id]}
                          onChange={(e) => setStatuses({ ...statuses, [selectedSubmission._id]: e.target.value })}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="pending">Pending Review</option>
                          <option value="approved">Approve Work</option>
                          <option value="revision_requested">Request Revision</option>
                          <option value="rejected">Reject Work</option>
                        </select>
                      </div>

                      {/* Feedback textarea */}
                      <div className="mb-5">
                        <label className="block text-sm text-gray-600 mb-2">Feedback</label>
                        <textarea
                          value={feedbacks[selectedSubmission._id]}
                          onChange={(e) => setFeedbacks({ ...feedbacks, [selectedSubmission._id]: e.target.value })}
                          placeholder={statuses[selectedSubmission._id] === 'approved' 
                            ? "Share positive feedback about this work..." 
                            : statuses[selectedSubmission._id] === 'revision_requested'
                            ? "Explain what needs to be revised..."
                            : "Provide your feedback here..."}
                          className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                        />
                      </div>

                      {/* Submit Review Button */}
                      <button
                        onClick={() => handleReviewSubmit(selectedSubmission._id)}
                        disabled={reviewLoading === selectedSubmission._id}
                        className={`w-full flex items-center justify-center gap-2 ${
                          statuses[selectedSubmission._id] === 'approved' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : statuses[selectedSubmission._id] === 'rejected'
                            ? 'bg-red-600 hover:bg-red-700'
                            : statuses[selectedSubmission._id] === 'revision_requested'
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white py-3 rounded-md text-sm font-medium transition`}
                      >
                        {reviewLoading === selectedSubmission._id ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            {statuses[selectedSubmission._id] === 'approved' && <CheckCircle size={16} />}
                            {statuses[selectedSubmission._id] === 'rejected' && <XCircle size={16} />}
                            {statuses[selectedSubmission._id] === 'revision_requested' && <AlertTriangle size={16} />}
                            <span>
                              {statuses[selectedSubmission._id] === 'approved' 
                                ? 'Approve Submission' 
                                : statuses[selectedSubmission._id] === 'rejected'
                                ? 'Reject Submission'
                                : statuses[selectedSubmission._id] === 'revision_requested'
                                ? 'Request Changes'
                                : 'Submit Review'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="text-gray-400" size={32} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">No Submission Selected</h2>
                  <p className="text-gray-500 mb-6">Select a submission from the list to view its details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
     {previewState.open && (
  <FilePreviewModal
    previewUrl={previewState.url}
    fileType={previewState.type}
    fileName={previewState.name}
    onClose={() => setPreviewState({...previewState, open: false})}
    disableDownload={true}
  />
)}
<NotificationToast/>
    </div>
  );
};

export default ClientViewSubmissions;



