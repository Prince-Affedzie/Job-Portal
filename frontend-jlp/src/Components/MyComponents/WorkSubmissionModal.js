import { DialogTitle, Dialog,Transition,TransitionChild,DialogPanel } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getSignedUrl,
  submitWorkForReview,
  sendFileToS3,
} from '../../APIS/API';

const WorkSubmissionModal = ({ isOpen, onClose, taskId, task }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  // File size limit (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const MAX_FILES = 10;

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setMessage('');
      setFiles([]);
      setUploadProgress({});
      setErrors({});
    }
  }, [isOpen]);

  const validateFiles = (fileList) => {
    const validationErrors = {};
    const validFiles = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        validationErrors[file.name] = `File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`;
        continue;
      }

      // Check for duplicates
      if (files.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
        validationErrors[file.name] = 'File already selected';
        continue;
      }

      validFiles.push(file);
    }

    // Check total file count
    if (files.length + validFiles.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return { validFiles: validFiles.slice(0, MAX_FILES - files.length), errors: validationErrors };
    }

    return { validFiles, errors: validationErrors };
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const { validFiles, errors: validationErrors } = validateFiles(newFiles);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...validationErrors }));
      // Clear errors after 5 seconds
      setTimeout(() => {
        setErrors(prev => {
          const newErrors = { ...prev };
          Object.keys(validationErrors).forEach(key => delete newErrors[key]);
          return newErrors;
        });
      }, 5000);
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const { validFiles, errors: validationErrors } = validateFiles(droppedFiles);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...validationErrors }));
        setTimeout(() => {
          setErrors(prev => {
            const newErrors = { ...prev };
            Object.keys(validationErrors).forEach(key => delete newErrors[key]);
            return newErrors;
          });
        }, 5000);
      }

      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[indexToRemove];
      return newProgress;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!message.trim()) {
      newErrors.message = 'Submission message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    if (files.length === 0) {
      newErrors.files = 'Please select at least one file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const fileKeys = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(prev => ({ ...prev, [i]: 0 }));

        try {
          const { data } = await getSignedUrl({
            taskId,
            filename: file.name,
            contentType: file.type,
          });

          setUploadProgress(prev => ({ ...prev, [i]: 50 }));

          await sendFileToS3(data.uploadURL, file);

          setUploadProgress(prev => ({ ...prev, [i]: 100 }));

          fileKeys.push({
            fileKey: data.fileKey,
          });
        } catch (fileError) {
          setUploadProgress(prev => ({ ...prev, [i]: -1 })); // -1 indicates error
          throw new Error(`Failed to upload ${file.name}: ${fileError.message}`);
        }
      }

      await submitWorkForReview(taskId, {
        message: message.trim(),
        fileKeys,
      });

      toast.success('Work submitted successfully!');
      onClose();
    } catch (error) {
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        'An unexpected error occurred while submitting your work.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getAcceptedFileTypes = () => {
    return task?.locationType === 'on-site' ? 'image/*,video/*' : '*';
  };

  const getFileTypeHint = () => {
    if (task?.locationType === 'on-site') {
      return 'Only images and videos are accepted for on-site tasks';
    }
    return 'All file types accepted';
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start sm:items-center justify-center p-2 sm:p-4 pt-4 sm:pt-8">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="max-h-[80vh] mt-10 overflow-y-auto overflow-hidden rounded-2xl bg-white  transition-all">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <DialogTitle className="text-xl font-semibold text-white flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Submit Work for Review
                  </DialogTitle>
                  <p className="text-blue-100 text-sm mt-1">
                    Upload your completed work and provide submission details
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Message Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submission Message *
                    </label>
                    <textarea
                      className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Describe your completed work, any challenges faced, or additional notes..."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) {
                          setErrors(prev => ({ ...prev, message: undefined }));
                        }
                      }}
                      rows={4}
                      maxLength={1000}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      {message.length}/1000 characters
                    </p>
                  </div>

                  {/* File Upload Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Files * ({files.length}/{MAX_FILES})
                    </label>
                    
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive
                          ? 'border-blue-500 bg-blue-50'
                          : errors.files
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        multiple
                        accept={getAcceptedFileTypes()}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onClick={(e) => (e.target.value = null)}
                      />
                      
                      <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {getFileTypeHint()} • Max {formatFileSize(MAX_FILE_SIZE)} per file
                          </p>
                        </div>
                      </div>
                    </div>

                    {errors.files && (
                      <p className="text-red-500 text-sm mt-1">{errors.files}</p>
                    )}
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                             
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                                {submitting && uploadProgress[index] !== undefined && (
                                  <div className="mt-1">
                                    {uploadProgress[index] === -1 ? (
                                      <p className="text-xs text-red-500">Upload failed</p>
                                    ) : (
                                      <div className="flex items-center space-x-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                          <div
                                            className="bg-blue-600 h-1.5 rounded-full transition-all"
                                            style={{ width: `${uploadProgress[index]}%` }}
                                          />
                                        </div>
                                        <span className="text-xs text-gray-500">
                                          {uploadProgress[index]}%
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              disabled={submitting}
                              className="ml-3 text-gray-400 hover:text-red-500 focus:outline-none focus:text-red-500 disabled:opacity-50"
                              title="Remove file"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error Messages */}
                  {Object.keys(errors).filter(key => !['message', 'files'].includes(key)).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-red-800 mb-1">File Upload Errors:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {Object.entries(errors)
                          .filter(([key]) => !['message', 'files'].includes(key))
                          .map(([fileName, error]) => (
                            <li key={fileName} className="flex items-start">
                              <span className="font-medium mr-2">{fileName}:</span>
                              <span>{error}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={submitting}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || files.length === 0}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Submit Work
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WorkSubmissionModal;