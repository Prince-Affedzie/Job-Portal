import { Send, Paperclip, FileText, Image, CheckCheck, CornerUpLeft, Trash2, X, Video,
  File,ExternalLink } from 'lucide-react';

export const FilePreview = ({ file, onClear }) => (
  <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 flex items-center">
    <div className="flex-1 truncate flex items-center">
      <div className="bg-blue-100 rounded p-2 mr-2">
        <FileText size={16} className="text-blue-600" />
      </div>
      <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
    </div>
    <button 
      onClick={onClear} 
      className="ml-2 p-1 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
      type="button"
    >
      <X size={16} />
    </button>
  </div>
);
