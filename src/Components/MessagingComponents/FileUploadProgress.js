import React from 'react';

const FileUploadProgress = ({ fileData, onCancel }) => {
  const { name, size, progress, status, startTime } = fileData;

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get status color and text
  const getStatusInfo = () => {
    switch (status) {
      case 'preparing':
        return { color: 'bg-yellow-500', text: 'Preparing...', textColor: 'text-yellow-700' };
      case 'uploading':
        return { color: 'bg-blue-500', text: 'Uploading...', textColor: 'text-blue-700' };
      case 'processing':
        return { color: 'bg-purple-500', text: 'Processing...', textColor: 'text-purple-700' };
      case 'completed':
        return { color: 'bg-green-500', text: 'Completed!', textColor: 'text-green-700' };
      case 'failed':
        return { color: 'bg-red-500', text: 'Failed', textColor: 'text-red-700' };
      default:
        return { color: 'bg-gray-500', text: 'Unknown', textColor: 'text-gray-700' };
    }
  };

  const statusInfo = getStatusInfo();

  // Get file type icon
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else if (['pdf'].includes(extension)) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  return (
    <div className="flex justify-end mb-2">
      <div className="max-w-xs sm:max-w-md bg-white rounded-lg border border-gray-200 shadow-sm p-3">
        <div className="flex items-start gap-3">
          {/* File Icon */}
          <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg text-gray-600">
            {getFileIcon(name)}
          </div>
          
          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate" title={name}>
                  {name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(size)}
                </p>
              </div>
              
              {/* Cancel Button */}
              {status !== 'completed' && (
                <button
                  onClick={onCancel}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  title="Cancel upload"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${statusInfo.textColor}`}>
                  {statusInfo.text}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${statusInfo.color}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {/* Status Messages */}
            {status === 'failed' && (
              <p className="text-xs text-red-600 mt-1">
                Upload failed. Please try again.
              </p>
            )}
            
            {status === 'completed' && (
              <p className="text-xs text-green-600 mt-1">
                File uploaded successfully!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { FileUploadProgress };