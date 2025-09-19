import React, { useState, useCallback } from 'react';
import { 
  FaLink, 
  FaFilePdf, 
  FaFileImage, 
  FaFileAlt, 
  FaTimes, 
  FaFileWord, 
  FaFileVideo, 
  FaPlay, 
  FaExternalLinkAlt, 
  FaDownload, 
  FaEye,
  FaGithub,
  FaBehance,
  FaDribbble,
  FaGlobe,
  FaEllipsisH,
  FaHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaClock
} from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

// Enhanced file type detection with more formats
const getFileType = (fileName) => {
  const extension = fileName?.split('.').pop()?.toLowerCase() || '';
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'];
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'mkv', 'flv'];
  const documentExtensions = ['doc', 'docx', 'txt', 'rtf'];
  const spreadsheetExtensions = ['xls', 'xlsx', 'csv'];
  const presentationExtensions = ['ppt', 'pptx'];
  const codeExtensions = ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'java', 'cpp', 'c', 'php'];
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];

  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  if (extension === 'pdf') return 'pdf';
  if (documentExtensions.includes(extension)) return 'document';
  if (spreadsheetExtensions.includes(extension)) return 'spreadsheet';
  if (presentationExtensions.includes(extension)) return 'presentation';
  if (codeExtensions.includes(extension)) return 'code';
  if (archiveExtensions.includes(extension)) return 'archive';
  if (audioExtensions.includes(extension)) return 'audio';
  
  return 'other';
};

// Get platform icon for links
const getPlatformIcon = (url) => {
  const hostname = new URL(url).hostname.toLowerCase();
  
  if (hostname.includes('github')) return <FaGithub className="text-gray-800" />;
  if (hostname.includes('behance')) return <FaBehance className="text-blue-600" />;
  if (hostname.includes('dribbble')) return <FaDribbble className="text-pink-600" />;
  if (hostname.includes('linkedin')) return <FaGlobe className="text-blue-500" />;
  
  return <FaGlobe className="text-gray-600" />;
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// File Preview Component
const FilePreview = ({ file, onView, onDownload }) => {
  const fileType = getFileType(file.name);
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onView(file);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDownload(file);
  };

  const renderFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <FaFileImage className="text-blue-500" />;
      case 'video':
        return <FaFileVideo className="text-red-500" />;
      case 'pdf':
        return <FaFilePdf className="text-red-600" />;
      case 'document':
        return <FaFileWord className="text-blue-600" />;
      case 'spreadsheet':
        return <FaFileAlt className="text-green-600" />;
      case 'presentation':
        return <FaFileAlt className="text-orange-600" />;
      case 'code':
        return <FaFileAlt className="text-purple-600" />;
      case 'archive':
        return <FaFileAlt className="text-gray-600" />;
      case 'audio':
        return <FaFileAlt className="text-indigo-600" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 hover:border-blue-300">
      <div className="w-full h-20 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative">
        {fileType === 'image' && !imageError ? (
          <img 
            src={file.publicUrl} 
            alt={file.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
        ) : fileType === 'video' ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="relative z-10 flex items-center justify-center">
              <div className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                <FaPlay className="text-gray-900 text-sm ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-2">
            <div className="text-2xl mb-1">
              {renderFileIcon()}
            </div>
            <span className="text-xs text-gray-600 font-medium text-center leading-tight">
              {file.name.split('.').pop()?.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      {/* File info */}
      <div className="p-3 bg-white">
        <p className="text-sm font-medium text-gray-900 truncate mb-1" title={file.name}>
          {file.name}
        </p>
        {file.size && (
          <p className="text-xs text-gray-500">
            {formatFileSize(file.size)}
          </p>
        )}
      </div>
      
      {/* Hover actions */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-lg">
          <button
            onClick={handleView}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
            title="Preview"
          >
            <FaEye className="text-gray-700 text-sm" />
          </button>
          <button
            onClick={handleDownload}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
            title="Download"
          >
            <FaDownload className="text-gray-700 text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Lightbox Modal Component
const LightboxModal = ({ file, isOpen, onClose, onNext, onPrevious, hasNext, hasPrevious }) => {
  if (!isOpen) return null;

  const fileType = getFileType(file.name);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors duration-200 z-10"
        >
          <FaTimes />
        </button>

        {hasPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors duration-200"
          >
            ‹
          </button>
        )}

        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors duration-200"
          >
            ›
          </button>
        )}

        <div className="bg-white rounded-lg overflow-hidden">
          {fileType === 'image' ? (
            <img
              src={file.publicUrl}
              alt={file.name}
              className="w-full h-auto max-h-96 object-contain"
            />
          ) : fileType === 'video' ? (
            <video
              src={file.publicUrl}
              controls
              className="w-full h-auto max-h-96"
            />
          ) : (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">
                {getFileType(file.name) === 'pdf' ? (
                  <FaFilePdf className="text-red-600 mx-auto" />
                ) : (
                  <FaFileAlt className="text-gray-600 mx-auto" />
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">{file.name}</h3>
              <p className="text-gray-600 mb-4">
                This file type cannot be previewed. Would you like to download it?
              </p>
              <a
                href={file.publicUrl}
                download
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FaDownload className="mr-2" />
                Download File
              </a>
            </div>
          )}
        </div>

        <div className="mt-4 text-white text-center">
          <h3 className="text-lg font-semibold">{file.name}</h3>
          {file.size && (
            <p className="text-gray-300">{formatFileSize(file.size)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Portfolio Preview Component
const PortfolioPreview = ({ 
  portfolio, 
  onRemove, 
  isEditable = false,
  onLike,
  onComment,
  onShare,
  onBookmark,
  likes = 0,
  comments = 0,
  shares = 0,
  isLiked = false,
  isBookmarked = false,
  createdAt,
  showSocialActions = false
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const hasContent = portfolio.title || portfolio.description || portfolio.files?.length > 0 || portfolio.link;
  
  if (!hasContent) return null;

  const currentFile = portfolio.files?.[currentFileIndex];
  const hasNext = portfolio.files && currentFileIndex < portfolio.files.length - 1;
  const hasPrevious = portfolio.files && currentFileIndex > 0;

  const handleViewFile = (file, index) => {
    setCurrentFileIndex(index);
    setLightboxOpen(true);
  };

  const handleNextFile = () => {
    if (hasNext) {
      setCurrentFileIndex(currentFileIndex + 1);
    }
  };

  const handlePreviousFile = () => {
    if (hasPrevious) {
      setCurrentFileIndex(currentFileIndex - 1);
    }
  };

  const handleDownloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.publicUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const shouldTruncate = portfolio.description && portfolio.description.length > 150;

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              {portfolio.title && (
                <div className="flex items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1 mr-4 line-clamp-2">
                    {portfolio.title}
                  </h3>
                  {portfolio.link && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                        {getPlatformIcon(portfolio.link)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {portfolio.description && (
                <div className="mb-4">
                  <p className={`text-gray-600 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
                    {portfolio.description}
                  </p>
                  {shouldTruncate && (
                    <button
                      onClick={toggleExpand}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 transition-colors duration-200"
                    >
                      {expanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {createdAt && (
                  <div className="flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {portfolio.category && (
                  <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    {portfolio.category}
                  </span>
                )}
              </div>
            </div>

            {isEditable && (
              <button 
                onClick={onRemove}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Remove portfolio item"
              >
                <FaTimes className="text-sm" />
              </button>
            )}
          </div>
        </div>

        {/* Link Preview */}
        {portfolio.link && (
          <div className="px-6 pb-4">
            <a 
              href={portfolio.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 rounded-lg transition-all duration-200 group/link"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  {getPlatformIcon(portfolio.link)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {new URL(portfolio.link).hostname}
                    </span>
                    <FiExternalLink className="text-gray-400 text-xs" />
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    {portfolio.link}
                  </p>
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Files Preview */}
        {portfolio.files?.length > 0 && (
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">
                Project Files
              </h4>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                {portfolio.files.length} {portfolio.files.length === 1 ? 'file' : 'files'}
              </span>
            </div>
            
            {/* Files Grid */}
            <div className={`grid gap-3 ${
              portfolio.files.length === 1 
                ? 'grid-cols-1 max-w-sm' 
                : portfolio.files.length === 2 
                ? 'grid-cols-2 max-w-md' 
                : portfolio.files.length <= 4
                ? 'grid-cols-2 sm:grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            }`}>
              {portfolio.files.slice(0, 8).map((file, index) => (
                <div key={index} className="relative">
                  <FilePreview 
                    file={file}
                    onView={() => handleViewFile(file, index)}
                    onDownload={() => handleDownloadFile(file)}
                  />
                </div>
              ))}
              
              {/* Show more indicator */}
              {portfolio.files.length > 8 && (
                <div className="h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center group-hover:border-gray-400 transition-colors duration-200">
                  <span className="text-lg font-bold text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                    +{portfolio.files.length - 8}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">more files</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Actions */}
        {showSocialActions && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={onLike}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                    isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <FaHeart className={isLiked ? 'fill-current' : ''} />
                  <span>{likes}</span>
                </button>
                
                <button
                  onClick={onComment}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <FaComment />
                  <span>{comments}</span>
                </button>
                
                <button
                  onClick={onShare}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  <FaShare />
                  <span>{shares}</span>
                </button>
              </div>
              
              <button
                onClick={onBookmark}
                className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
                  isBookmarked ? 'text-blue-600' : ''
                }`}
              >
                <FaBookmark className={isBookmarked ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        file={currentFile}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNextFile}
        onPrevious={handlePreviousFile}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />
    </>
  );
};

export default PortfolioPreview;