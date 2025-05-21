import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Image, 
  ExternalLink,
  Video,
  File
} from 'lucide-react';
import {getPreviewUrl} from '../../APIS/API'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// File preview component that shows thumbnails for images and placeholders for other files
const SubmittedFileItem = ({ file, index, onPreviewClick }) => {
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
    console.log("I'm Executing")
     console.log(file.fileKey)
     console.log(fileType)
     const fetchPreviewUrl = async(file)=>{
       setIsLoading(true);
      try{
      const res = await getPreviewUrl(file.fileKey);
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
  }, [file,fileType,previewURL]);

  useEffect(()=>{
   console.log(thumbnail)
  },[thumbnail])
  

  
  return (
    <div
      onClick={() => onPreviewClick(file.fileKey,previewURL)}
      className="relative group border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-all"
    >
      {/* Thumbnail Preview Area */}
      <div className="h-40 relative">
        {fileType === 'image' && thumbnail ? (
          <div className="h-full w-full bg-gray-50">
            <img
              src={thumbnail}
              alt={`File ${index + 1}`}
              className="w-full h-full object-cover"
              onError={() => setThumbnail(null)}
            />
          </div>
        ) :fileType === 'video' && thumbnail ? (
          <div className="h-full w-full bg-gray-50">
            <video
              src={thumbnail}
              alt={`File ${index + 1}`}
              className="w-full h-full object-cover"
              onError={() => setThumbnail(null)}
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
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
          <ExternalLink className="text-white" size={24} />
        </div>
      </div>
      
      {/* File Info Footer */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700 truncate">
            {getFileName(file.fileKey) || `File ${index + 1}`}
          </span>
          <span className="text-blue-600 text-xs font-medium">Preview</span>
        </div>
      </div>
    </div>
  );
};

// Usage example component
export default function SubmittedFiles({ files, onPreviewClick }) {
  if (!files || files.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">No files attached to this submission.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {files.map((file, idx) => (
        <SubmittedFileItem
          key={idx}
          file={file}
          index={idx}
          onPreviewClick={onPreviewClick}
        />
      ))}
    </div>
  );
}
