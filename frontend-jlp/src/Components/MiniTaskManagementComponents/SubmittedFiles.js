import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Image, 
  ExternalLink,
  Video,
  File,
  Download
} from 'lucide-react';
import {getPreviewUrl} from '../../APIS/API'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// File preview component that shows thumbnails for images and placeholders for other files
const SubmittedFileItem = ({ file, index, onPreviewClick,selectedSubmission }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewURL ,setPreviewUrl] = useState(null)
  
 
   
  
 
  const getFileType = (url) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
      return 'image';
    } else if (/\.(mp4|webm|mov|avi|wmv)$/i.test(url)) {
      return 'video';
    } else if (/\.(pdf)$/i.test(url)) {
      return 'pdf';
    } else if (/\.(doc|docx)$/i.test(url)) {
      return 'document';
    } else {
      return 'other';
    }
  };

  const fileType = getFileType(file.fileKey);
  
  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <Image size={24} className="text-blue-500" />;
      case 'video':
        return <Video size={24} className="text-purple-500" />;
      case 'pdf':
        return <FileText size={24} className="text-red-500" />;
      case 'document':
        return <FileText size={24} className="text-blue-500" />;
      default:
        return <File size={24} className="text-gray-500" />;
    }
  };
  
  const getFileName = (path) => {
    if (!path) return '';
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

   useEffect(() => {
    // For images, load a thumbnail directly from S3
    
     const fetchPreviewUrl = async(file)=>{
       setIsLoading(true);
      try{
        console.log(selectedSubmission)
      const res = await getPreviewUrl(file.fileKey,selectedSubmission.status);
      if(res.status ===200){
          const previewURL = res.data.previewURL
          setPreviewUrl(previewURL)
      } else {
            toast.error('Failed to get preview URL.');
      }
     if (fileType === 'image'||fileType === 'video') {
      setThumbnail(previewURL);
     
    }} catch(error){
        toast.error('Error fetching preview URL.');
              console.error(error);
    }finally{
      setIsLoading(false);
    }
  
  }
    fetchPreviewUrl(file)
  }, [file,fileType,previewURL,selectedSubmission]);

  useEffect(()=>{
   console.log(thumbnail)
  },[thumbnail])
  

  
  return (
    <div className="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
      {/* Download Button - Top Right Corner */}
      {selectedSubmission.status === "approved" && previewURL && (
        <div className="absolute top-2 right-2 z-10">
          <a
            href={previewURL}
            download
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-green-600"
            title="Download File"
          >
            <Download size={16} />
          </a>
        </div>
      )}

      {/* Thumbnail Preview Area */}
      <div 
        className="h-40 relative"
        onClick={() => onPreviewClick(file.fileKey, previewURL)}
      >
        {isLoading ? (
          // Show spinner or shimmer while loading
          <div className="h-full w-full flex items-center justify-center bg-gray-100 animate-pulse">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {fileType === 'image' && thumbnail ? (
              <div className="h-full w-full bg-gray-50">
                <img
                  src={thumbnail}
                  alt={`File ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => setThumbnail(null)}
                />
              </div>
            ) : fileType === 'video' && thumbnail ? (
              <div className="h-full w-full bg-gray-50">
                <video
                  src={thumbnail}
                  className="w-full h-full object-cover"
                  onError={() => setThumbnail(null)}
                  muted
                />
              </div>
            ) : (
              <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="mb-2">{getFileIcon()}</div>
                <div className="text-sm font-medium text-center text-gray-600 mb-1 truncate w-full">
                  {getFileName(file.fileKey) || `File ${index + 1}`}
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {fileType.toUpperCase()}
                </div>
              </div>
            )}
          </>
        )}

        {/* Hover overlay for preview */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center space-x-2 text-white">
            <ExternalLink size={20} />
            <span className="text-sm font-medium">Preview</span>
          </div>
        </div>
      </div>

      {/* File Info Footer */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-700 truncate block">
              {getFileName(file.fileKey) || `File ${index + 1}`}
            </span>
            <span className="text-xs text-gray-500 mt-1 block">
              {fileType.toUpperCase()}
            </span>
          </div>
          <div className="ml-3 flex-shrink-0">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <ExternalLink size={12} className="mr-1"  />
              View
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Usage example component
export default function SubmittedFiles({ files, onPreviewClick, selectedSubmission }) {
  if (!files || files.length === 0) {
    return (
      <div className="text-center py-8">
        <File size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500 italic">No files attached to this submission.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file, idx) => (
        <SubmittedFileItem
          key={idx}
          file={file}
          index={idx}
          onPreviewClick={onPreviewClick}
          selectedSubmission={selectedSubmission}
        />
      ))}
    </div>
  );
}