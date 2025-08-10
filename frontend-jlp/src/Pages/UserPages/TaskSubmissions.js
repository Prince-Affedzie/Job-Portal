import React, { useEffect, useState } from 'react';
import { 
  Loader2, 
  Trash2, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Image, 
  ExternalLink,
  MessageCircle,
  Calendar,
  Filter,
  X,
  Download
} from 'lucide-react';
import { getMyWorkSubmissions, deleteWorkSubmission, getPreviewUrl } from '../../APIS/API';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../../Components/Common/Navbar';
import SubmittedFiles from '../../Components/MiniTaskManagementComponents/SubmittedFiles';
import FilePreviewModal from '../../Components/MiniTaskManagementComponents/SubmissionsPreviewModal'


const FreelancerSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
    const [previewState, setPreviewState] = useState({
    open: false,
    url: null,
    type: null,
    name: null
  });
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const { taskId } = useParams();
  const navigate = useNavigate();
  const detailsRef = React.useRef(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await getMyWorkSubmissions(taskId);
      if (res.status === 200) {
        const sortedSubmissions = res.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSubmissions(sortedSubmissions);
        
        // Select the most recent submission by default
        if (sortedSubmissions.length > 0 && !selectedSubmission) {
          setSelectedSubmission(sortedSubmissions[0]);
        }
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      toast.error("Failed to load submissions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [taskId]);

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
 
  const getStatusDetails = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          icon: <Clock size={16} className="mr-1" />,
          text: 'Awaiting Review',
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
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <Clock size={16} className="mr-1" />,
          text: status,
          badge: 'bg-gray-100 text-gray-800'
        };
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

 

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    setDeleteLoading(id);
    try {
      const res = await deleteWorkSubmission(id);
      if (res.status === 200) {
        toast.success('Submission Removed Successfully');
        
        // Update submissions list
        const updatedSubmissions = submissions.filter((s) => s._id !== id);
        setSubmissions(updatedSubmissions);
        
        // If we deleted the selected submission, select the next one
        if (selectedSubmission && selectedSubmission._id === id) {
          if (updatedSubmissions.length > 0) {
            setSelectedSubmission(updatedSubmissions[0]);
          } else {
            setSelectedSubmission(null);
          }
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        "An unexpected error occurred. Please try again.";
      console.error('Failed to delete submission:', error);
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getFilteredSubmissions = () => {
    if (filter === 'all') return submissions;
    return submissions.filter(sub => sub.status === filter);
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

  const getSubmissionNumber = (submission) => {
    // Find the index of this submission in the original array (chronological order)
    const allSubmissions = [...submissions].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
    const index = allSubmissions.findIndex(s => s._id === submission._id);
    return index + 1;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center mb-1">
             
              <h1 className="text-xl font-bold text-gray-800">Submissions</h1>
            </div>
            <p className="text-sm text-gray-500">Manage your work submissions for this project</p>
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
                  <option value="pending">Awaiting Review</option>
                  <option value="approved">Approved</option>
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
        ) : getFilteredSubmissions().length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="text-gray-400" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Submissions Found</h2>
            <p className="text-gray-500 mb-6">{filter === 'all' ? "You haven't submitted any work yet for this task." : `No submissions with status: ${filter}`}</p>
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
                  {getFilteredSubmissions().map((submission) => {
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
                              }
                          
                        }}
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
                              <MessageCircle size={14} className="mr-1" />
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
                            Submission #{getSubmissionNumber(selectedSubmission)}
                          </h2>
                          <span className="ml-3 px-3 py-1 text-xs rounded-full flex items-center font-medium border ${statusDetails.color}">
                            {getStatusDetails(selectedSubmission.status).icon} {getStatusDetails(selectedSubmission.status).text}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted on {formatDate(selectedSubmission.createdAt)}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <button
                          onClick={() => handleDelete(selectedSubmission._id)}
                          disabled={deleteLoading === selectedSubmission._id}
                          className="flex items-center text-sm text-red-600 hover:text-red-800 focus:outline-none px-3 py-1 border border-red-200 rounded hover:bg-red-50"
                        >
                          {deleteLoading === selectedSubmission._id ? (
                            <Loader2 size={14} className="animate-spin mr-2" />
                          ) : (
                            <Trash2 size={14} className="mr-2" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Task Information */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-2">Task Information</h3>
                    <p className="text-gray-700 text-sm font-medium">
                      {selectedSubmission.taskId?.title || 'Untitled Task'}
                    </p>
                  </div>

                  {/* Message & Feedback */}
                  <div className="p-6">
                    {selectedSubmission.message && (
                      <div className="mb-6">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                          <MessageCircle size={18} className="mr-2" /> Your Message
                        </h3>
                        <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                          <p className="text-sm text-gray-700">
                            {selectedSubmission.message}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {selectedSubmission.feedback && (
                      <div className="mb-6">
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center text-blue-700">
                          <MessageCircle size={18} className="mr-2" /> Client Feedback
                        </h3>
                        <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                          <p className="text-sm text-gray-700">
                            {selectedSubmission.feedback}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Files */}
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">Submitted Files</h3>
                       <SubmittedFiles
                          files={selectedSubmission.files || []} 
                           onPreviewClick={handlePreview}
                           selectedSubmission={selectedSubmission} 
                          />
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

      {/* Image/PDF Preview Modal */}
      {previewState.open && (
       <FilePreviewModal
         previewUrl={previewState.url}
         fileType={previewState.type}
         fileName={previewState.name}
         onClose={() => setPreviewState({...previewState, open: false})}
         disableDownload={false}
       />
     )}
    </div>
  );
};

export default FreelancerSubmissions;