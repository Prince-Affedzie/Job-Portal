// ReportForm.jsx
import React, { useState, useEffect } from 'react';
import { FaFlag, FaTimes, FaUpload, FaPaperclip } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { raiseDispute, addReportingEvidence, sendFileToS3 } from '../../APIS/API';

const ReportForm = ({ 
  isOpen, 
  onClose, 
  task,
  currentUser,
  onReportSubmitted
}) => {
  const [formData, setFormData] = useState({
    against: '',
    taskId: '',
    tasktitle: '',
    reportedBy: '',
    reason: '',
    details: '',
    evidence: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when task or visibility changes
  useEffect(() => {
    if (isOpen && task) {
      task.assignedTo === currentUser._id ? setFormData({
        against: task.employer?._id || '',
        taskId: task._id || '',
        tasktitle: task.title || '',
        reportedBy: currentUser?.name || '',
        reason: '',
        details: '',
        evidence: null
      }) : setFormData({
        against: task.assignedTo || '',
        taskId: task._id || '',
        tasktitle: task.title || '',
        reportedBy: currentUser?.name || '',
        reason: '',
        details: '',
        evidence: null
      });
    }
  }, [isOpen, task, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 
                         'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, PDF, and DOC files are allowed');
      return;
    }

    setFormData(prev => ({ ...prev, evidence: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.reason || !formData.details) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      let evidenceData = null;

      if (formData.evidence) {
        const fileInfo = {
          filename: formData.evidence.name,
          contentType: formData.evidence.type
        };

        const evidenceResponse = await addReportingEvidence(fileInfo);
        const { publicUrl, uploadUrl } = evidenceResponse.data;

        await sendFileToS3(uploadUrl, formData.evidence, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        });

        evidenceData = publicUrl;
      }

      const reportPayload = {
        against: formData.against,
        taskId: formData.taskId,
        tasktitle: formData.tasktitle,
        reportedBy: formData.reportedBy,
        reason: formData.reason,
        details: formData.details,
        evidence: evidenceData
      };

      const response = await raiseDispute(reportPayload);
      
      if (response.status === 200) {
        toast.success(`Issue reported successfully. Our team will reach out soon.`);
        onReportSubmitted();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center mt-4 justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              <FaFlag className="inline mr-2 text-red-500" />
              Report Issue
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isLoading}
            >
              <FaTimes />
            </button>
          </div>
          {formData.tasktitle && (
            <p className="text-sm text-gray-600 mt-1 truncate">
              Reporting issue with: <strong>{formData.tasktitle}</strong>
            </p>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Reason Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Brief reason for reporting"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
                disabled={isLoading}
              />
            </div>

            {/* Details Field - Smaller textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details <span className="text-red-500">*</span>
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={3}
                placeholder="Please provide detailed explanation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
                disabled={isLoading}
              />
            </div>

            {/* File Upload - Compact version */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Evidence (Optional)
              </label>
              <div className="space-y-2">
                <label className={`flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <FaUpload className="text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload file</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    disabled={isLoading}
                  />
                </label>
                
                {formData.evidence && (
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center truncate">
                      <FaPaperclip className="flex-shrink-0 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700 truncate">{formData.evidence.name}</span>
                    </div>
                  </div>
                )}

                {uploadProgress > 0 && (
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                      Uploading: {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, PDF, or DOC (Max 5MB)
              </p>
            </div>
          </form>
        </div>

        {/* Footer with actions - Sticky bottom */}
        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {uploadProgress > 0 ? 'Uploading...' : 'Submitting...'}
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;