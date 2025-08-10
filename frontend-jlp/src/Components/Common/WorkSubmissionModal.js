import { DialogTitle, Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import { Fragment, useState, useEffect, useRef } from 'react';
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';
import {
  getSignedUrl,
  submitWorkForReview,
  sendFileToS3,
} from '../../APIS/API';
import { X, Upload, FileText, Image, Video, Loader2, Check, AlertCircle, Trash2 } from 'lucide-react';

const WorkSubmissionModal = ({ isOpen, onClose, taskId, task }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate()

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

  const getFileIconComponent = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconClass = "w-5 h-5 text-gray-500 flex-shrink-0";
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return <Image className={iconClass} />;
    } else if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) {
      return <Video className={iconClass} />;
    } else {
      return <FileText className={iconClass} />;
    }
  };

  const validateFiles = (fileList) => {
    const validationErrors = {};
    const validFiles = [];
    let totalSize = files.reduce((sum, file) => sum + file.size, 0);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        validationErrors[file.name] = `File exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`;
        continue;
      }

      // Check total size won't exceed 50MB
      if (totalSize + file.size > 50 * 1024 * 1024) {
        validationErrors[file.name] = 'Total upload size would exceed 50MB';
        continue;
      }

      // Check for duplicates
      if (files.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
        validationErrors[file.name] = 'File already selected';
        continue;
      }

      validFiles.push(file);
      totalSize += file.size;
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
    if (newFiles.length === 0) return;

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

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      toast.success(`Added ${validFiles.length} file(s)`);
    }
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

      if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
        toast.success(`Added ${validFiles.length} file(s)`);
      }
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
      newErrors.message = 'Please describe your submission';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Description should be at least 10 characters';
    }
    
    if (files.length === 0) {
      newErrors.files = 'Please add at least one file';
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
      const failedUploads = [];

      // Upload files sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(prev => ({ ...prev, [i]: 0 }));

        try {
          // Get signed URL
          const { data } = await getSignedUrl({
            taskId,
            filename: file.name,
            contentType: file.type,
          });
          
          setUploadProgress(prev => ({ ...prev, [i]: 30 }));

          // Upload to S3 with progress tracking
          await sendFileToS3(data.uploadURL, file, (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(prev => ({ 
              ...prev, 
              [i]: 30 + Math.floor(percentCompleted * 0.7) 
            }));
          });

          setUploadProgress(prev => ({ ...prev, [i]: 100 }));
          fileKeys.push({ fileKey: data.fileKey });
        } catch (fileError) {
          console.error(`Failed to upload ${file.name}:`, fileError);
          setUploadProgress(prev => ({ ...prev, [i]: -1 }));
          failedUploads.push(file.name);
        }
      }

      // Check if we have any successfully uploaded files
      if (fileKeys.length === 0) {
        throw new Error('All file uploads failed');
      }

      // Submit work with successful uploads
      await submitWorkForReview(taskId, {
        message: message.trim(),
        fileKeys,
      });

      if (failedUploads.length > 0) {
        toast.success(
          `Submitted with ${fileKeys.length} files (${failedUploads.length} failed)`,
          { icon: '⚠️' }
        );
      } else {
        toast.success('Submitted successfully!', { icon: '✅' });
        navigate(`/freelancer/${taskId}/view_task_submissions`)

      }
      
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Submission failed. Please try again.';
      toast.error(errorMessage, { icon: '❌' });
    } finally {
      setSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl font-semibold text-white flex items-center">
                      <Upload className="w-5 h-5 mr-2" />
                      Submit Your Work
                    </DialogTitle>
                    <button
                      onClick={onClose}
                      className="text-white/80 hover:text-white focus:outline-none"
                      disabled={submitting}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">
                    Upload your completed files and provide details
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Message Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Describe what you're submitting..."
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
                    <div className="flex justify-between mt-1">
                      {errors.message ? (
                        <p className="text-red-500 text-sm">{errors.message}</p>
                      ) : (
                        <p className="text-gray-500 text-xs">
                          Minimum 10 characters
                        </p>
                      )}
                      <p className="text-gray-500 text-xs">
                        {message.length}/1000
                      </p>
                    </div>
                  </div>

                  {/* File Upload Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Files <span className="text-red-500">*</span> ({files.length}/{MAX_FILES})
                    </label>
                    
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        dragActive
                          ? 'border-blue-500 bg-blue-50'
                          : errors.files
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                    >
                      <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      
                      <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Max {formatFileSize(MAX_FILE_SIZE)} per file • 50MB total
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
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Selected Files
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              uploadProgress[index] === -1
                                ? 'bg-red-50 border-red-200'
                                : uploadProgress[index] === 100
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              {getFileIconComponent(file.name)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {file.name}
                                </p>
                                <div className="flex justify-between items-center">
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                  </p>
                                  {uploadProgress[index] !== undefined && (
                                    <span className="text-xs font-medium">
                                      {uploadProgress[index] === -1 ? (
                                        <span className="text-red-500 flex items-center">
                                          <AlertCircle className="w-3 h-3 mr-1" />
                                          Failed
                                        </span>
                                      ) : uploadProgress[index] === 100 ? (
                                        <span className="text-green-600 flex items-center">
                                          <Check className="w-3 h-3 mr-1" />
                                          Uploaded
                                        </span>
                                      ) : (
                                        <span className="text-blue-600">
                                          {uploadProgress[index]}%
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </div>
                                {uploadProgress[index] > 0 && uploadProgress[index] < 100 && (
                                  <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                                      style={{ width: `${uploadProgress[index]}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              disabled={submitting}
                              className="ml-3 text-gray-400 hover:text-red-500 focus:outline-none disabled:opacity-50"
                              title="Remove file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error Messages */}
                  {Object.keys(errors).filter(key => !['message', 'files'].includes(key)).length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Some files couldn't be added
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <ul className="list-disc pl-5 space-y-1">
                              {Object.entries(errors)
                                .filter(([key]) => !['message', 'files'].includes(key))
                                .map(([fileName, error]) => (
                                  <li key={fileName}>
                                    <span className="font-medium">{fileName}:</span> {error}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={submitting}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || files.length === 0}
                      className={`px-5 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center ${
                        submitting
                          ? 'bg-blue-400 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="-ml-1 mr-2 h-4 w-4" />
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