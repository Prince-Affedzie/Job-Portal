import { FileText, X, Loader2, CheckCircle2 } from 'lucide-react';

export const FilePreview = ({ 
  file, 
  onClear,
  uploadProgress = null,
  isUploading = false,
  isUploaded = false
}) => {
  const getFileIcon = () => {
    const extension = file.name.split('.').pop().toLowerCase();
    const size = 18;
    
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
      className="relative px-3 py-2 bg-white border border-gray-200 rounded-lg flex items-center gap-2 transition-all max-w-full"
      role="region" 
      aria-label="File preview"
    >
      {/* File Icon */}
      <div className={`flex-shrink-0 p-1.5 rounded-md ${
        isUploaded ? 'bg-green-100' : 
        isUploading ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        {isUploaded ? (
          <CheckCircle2 size={16} className="text-green-600" />
        ) : isUploading ? (
          <Loader2 size={16} className="text-blue-600 animate-spin" />
        ) : (
          getFileIcon()
        )}
      </div>

      {/* File Info - with responsive constraints */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 w-full">
          <p 
            className="text-sm font-medium text-gray-900 truncate max-w-[180px] xs:max-w-[220px] sm:max-w-[280px]"
            title={file.name}
          >
            {file.name}
          </p>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {(file.size / (1024 * 1024)).toFixed(file.size > 1024 * 1024 ? 1 : 0)}
            {file.size > 1024 * 1024 ? 'MB' : 'KB'}
          </span>
        </div>
        
        {/* Progress Bar */}
        {uploadProgress !== null && (
          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Close Button */}
      <button 
        onClick={onClear}
        className="flex-shrink-0 p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        type="button"
        aria-label={`Remove ${file.name}`}
        disabled={isUploading}
      >
        <X size={16} />
      </button>
    </div>
  );
};