import { FileText, X, Loader2, CheckCircle2 } from 'lucide-react';

export const FilePreview = ({ 
  file, 
  onClear,
  uploadProgress = null, // Optional progress (0-100)
  isUploading = false,
  isUploaded = false
}) => {
  const getFileIcon = () => {
    const extension = file.name.split('.').pop().toLowerCase();
    const size = 18;
    
    // Add more file type icons as needed
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return <FileText size={size} className="text-blue-600" />;
    }
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) {
      return <FileText size={size} className="text-purple-600" />;
    }
    if (['pdf'].includes(extension)) {
      return <FileText size={size} className="text-red-600" />;
    }
    if (['doc', 'docx'].includes(extension)) {
      return <FileText size={size} className="text-blue-700" />;
    }
    return <FileText size={size} className="text-gray-600" />;
  };

  return (
    <div 
      className="px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-xs flex items-center gap-3 transition-all"
      role="region" 
      aria-label="File preview"
    >
      <div className={`flex items-center justify-center p-2 rounded-lg ${
        isUploaded ? 'bg-green-100' : 
        isUploading ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        {isUploaded ? (
          <CheckCircle2 size={18} className="text-green-600" />
        ) : isUploading ? (
          <Loader2 size={18} className="text-blue-600 animate-spin" />
        ) : (
          getFileIcon()
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p 
            className="text-sm font-medium text-gray-900 truncate"
            title={file.name}
          >
            {file.name}
          </p>
          <span className="text-xs text-gray-500">
            {(file.size / (1024 * 1024)).toFixed(1)}MB
          </span>
        </div>
        
        {uploadProgress !== null && (
          <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all" 
              style={{ width: `${uploadProgress}%` }}
              aria-valuenow={uploadProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        )}
      </div>

      <button 
        onClick={onClear}
        className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        type="button"
        aria-label={`Remove ${file.name}`}
        disabled={isUploading}
      >
        <X size={18} />
      </button>
    </div>
  );
};