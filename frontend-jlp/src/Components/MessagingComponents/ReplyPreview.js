import { Send, Paperclip, FileText, Image, CheckCheck, CornerUpLeft, Trash2, X, Video, File, ExternalLink } from 'lucide-react';

export const ReplyPreview = ({ replyTo, onClear }) => (
  <div className="relative overflow-hidden">
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-50 to-indigo-100 animate-pulse opacity-70"></div>
    
    {/* Glass morphism overlay */}
    <div className="relative backdrop-blur-sm bg-white/40 border border-white/50 shadow-lg rounded-t-xl">
      {/* Gradient accent border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 rounded-t-xl"></div>
      
      <div className="flex items-start justify-between px-4 py-3">
        {/* Left: Enhanced message preview */}
        <div className="flex-1 overflow-hidden">
          {/* Header with icon and gradient text */}
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 shadow-sm">
              <CornerUpLeft size={12} className="text-white" />
            </div>
            <p className="text-xs font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
              Replying to {replyTo.sender?.name || 'User'}
            </p>
          </div>
          
          {/* Message content with enhanced styling */}
          <div className="ml-7">
            <p className="text-sm text-gray-700 leading-relaxed max-w-xs">
              {replyTo.text
                ? replyTo.text.length > 50
                  ? `${replyTo.text.slice(0, 50)}...`
                  : replyTo.text
                : replyTo.fileName || '[Media]'}
            </p>
          </div>
        </div>

        {/* Right: Enhanced close button */}
        <button
          onClick={onClear}
          className="group ml-3 p-2 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 ease-out"
          aria-label="Cancel reply"
        >
          <X size={14} className="group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>
      
      {/* Subtle bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-60"></div>
    </div>
  </div>
);