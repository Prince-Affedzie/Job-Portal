import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, X, RefreshCw, Clock, CheckCircle, XCircle, Download, FileText, Image, ExternalLink } from 'lucide-react';
import { getMyWorkSubmissions, deleteWorkSubmission } from '../APIS/API';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../Components/MyComponents/Navbar';

const FreelancerSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [filter, setFilter] = useState('all');
  const { taskId } = useParams();

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await getMyWorkSubmissions(taskId);
      if (res.status === 200) {
        setSubmissions(res.data);
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

  const getStatusDetails = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
          icon: <Clock size={16} className="mr-1" />,
          text: 'Awaiting Review'
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
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          icon: <Clock size={16} className="mr-1" />,
          text: status
        };
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

  const getFileType = (url) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
      return 'image';
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
        setSubmissions((prev) => prev.filter((s) => s._id !== id));
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

  const handlePreview = (url, type) => {
    setPreviewUrl(url);
    setPreviewType(type);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Work Submissions</h1>
            <p className="text-gray-500">View and manage all submissions for this task</p>
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
              <option value="pending">Awaiting Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
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
            <Link 
              to="/h1/dashboard" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {getFilteredSubmissions().map((submission) => {
              const statusDetails = getStatusDetails(submission.status);
              
              return (
                <div
                  key={submission._id}
                  className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow transition bg-white relative"
                >
                  {/* Status badge - moved to top right */}
                  <div className="absolute top-3 right-3">
                    <span className={`flex items-center px-3 py-1 text-xs rounded-full font-medium border ${statusDetails.color}`}>
                      {statusDetails.icon} {statusDetails.text}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-1 pr-24">
                    {submission.taskId?.title || 'Untitled Task'}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    Submitted on: {formatDate(submission.createdAt)}
                  </p>

                  {submission.message && (
                    <div className="mb-5 p-3 bg-gray-50 rounded-md border border-gray-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Your message:</span>{' '}
                        {submission.message}
                      </p>
                    </div>
                  )}

                  {submission.feedback && (
                    <div className="mb-5 p-3 bg-blue-50 rounded-md border border-blue-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-blue-700">Client feedback:</span>{' '}
                        {submission.feedback}
                      </p>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="font-medium text-gray-800 mb-2">Files:</p>
                    {submission.files?.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {submission.files.map((url, idx) => {
                          const fileType = getFileType(url);
                          
                          return (
                            <div key={idx} className="relative group">
                              {fileType === 'image' ? (
                                <div 
                                  className="h-28 rounded-md border border-gray-200 overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
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
                                  className="flex items-center p-3 h-28 border border-gray-200 rounded-md hover:bg-gray-50 transition text-gray-700 hover:text-blue-600"
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

                  {/* Action button */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => handleDelete(submission._id)}
                      disabled={deleteLoading === submission._id}
                      className="flex items-center text-sm text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      {deleteLoading === submission._id ? (
                        <Loader2 size={14} className="animate-spin mr-1" />
                      ) : (
                        <Trash2 size={14} className="mr-1" />
                      )}
                      Delete Submission
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image/PDF Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 mt-20">
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

export default FreelancerSubmissions;