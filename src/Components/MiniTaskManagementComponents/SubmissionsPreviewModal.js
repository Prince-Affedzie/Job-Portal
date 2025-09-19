import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Image as ImageIcon,
  FileText,
  Film,
  Lock,
  Maximize2,
  ExternalLink, 
  Minimize2,
  RotateCw
} from 'lucide-react';
import { toast } from 'react-toastify';

const FilePreviewModal = ({ 
  previewUrl, 
  fileType, 
  fileName,
  onClose,
  disableDownload = true
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoading(true);
    setRotation(0);
    setIsFullscreen(false);
    // Reset position when URL changes
    setPosition({ x: 0, y: 0 });
  }, [previewUrl]);

  const handleContextMenu = (e) => {
    if (disableDownload) {
      e.preventDefault();
      toast.info('Right-click is disabled to protect content', {
        position: 'bottom-center'
      });
    }
  };

  const handleDragStart = (e) => {
    if (fileType === 'image') {
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleDrag = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setPosition({ x: 0, y: 0 });
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const getFileIcon = () => {
    switch (fileType) {
      case 'image': return <ImageIcon size={20} />;
      case 'video': return <Film size={20} />;
      case 'pdf': return <FileText size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const renderPreviewContent = () => {
    if (!previewUrl) return null;

    switch (fileType) {
      case 'image':
        return (
          <div 
            className={`relative ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'max-h-[70vh]'} overflow-hidden`}
            onMouseDown={handleDragStart}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <img
              src={previewUrl}
              alt="Preview"
              onContextMenu={handleContextMenu}
              className={`mx-auto ${isLoading ? 'hidden' : 'block'} object-contain`}
              style={{
                transform: `rotate(${rotation}deg)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                position: 'relative',
                left: `${position.x}px`,
                top: `${position.y}px`,
                maxWidth: '100%',
                maxHeight: '100%',
                transition: isDragging ? 'none' : 'transform 0.2s ease'
              }}
              onLoad={() => setIsLoading(false)}
              draggable={false}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="relative">
            <video
              controls
              controlsList="nodownload"
              className="max-h-[70vh] mx-auto"
              onContextMenu={handleContextMenu}
            >
              <source src={previewUrl} type={`video/${previewUrl.split('.').pop()}`} />
              Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              Video preview
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="h-[70vh]">
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
              className="w-full h-full border-0"
              onContextMenu={handleContextMenu}
              title="PDF Preview"
            />
          </div>
        );
      default:
        return (
          <div className="text-center py-16">
            <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-700 mb-2">No Preview Available</h4>
            <p className="text-gray-500 mb-6">This file type cannot be previewed in the browser.</p>
            <div className="flex justify-center gap-3">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                onClick={(e) => {
                  if (disableDownload) {
                    e.preventDefault();
                    toast.info('Direct downloads are disabled for this content', {
                      position: 'bottom-center'
                    });
                  }
                }}
              >
                <ExternalLink size={16} className="mr-2" />
                Open in new tab
              </a>
            </div>
          </div>
        );
    }
  };

  if (!previewUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 overflow-auto mt-20">
      {/* Modal Container */}
      <div className={`relative bg-white rounded-lg overflow-hidden shadow-xl ${isFullscreen ? 'w-full h-full' : 'max-w-5xl w-full max-h-[90vh]'} my-8 mt-8`}>
        {/* Header - Sticky to ensure visibility */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          <div className="flex items-center min-w-0">
            {getFileIcon()}
            <span className="ml-2 font-medium text-gray-800 truncate max-w-[180px] sm:max-w-xs">
              {fileName || 'Preview'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {fileType === 'image' && (
              <>
                <button
                  onClick={rotateImage}
                  className="p-1 text-gray-600 hover:text-blue-600 rounded hover:bg-gray-100"
                  title="Rotate"
                >
                  <RotateCw size={20} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-1 text-gray-600 hover:text-blue-600 rounded hover:bg-gray-100"
                  title={isFullscreen ? 'Minimize' : 'Maximize'}
                >
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              </>
            )}
            {disableDownload && (
              <span className="hidden sm:flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                <Lock size={14} className="mr-1" />
                Protected
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-600 hover:text-red-600 rounded hover:bg-gray-100"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Preview Content - Scrollable area */}
        <div className="overflow-auto">
          <div className="flex items-center justify-center p-4">
            {renderPreviewContent()}
          </div>
        </div>

        {/* Footer - Sticky to ensure visibility */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 sticky bottom-0 z-10">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {disableDownload ? 'Downloading disabled for client approval' : 'You can download this file'}
            </div>
            {!disableDownload && (
              <a
                href={previewUrl}
                download
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Download size={16} className="mr-1" />
                Download
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;