import { Send, Paperclip, FileText, Image, CheckCheck, CornerUpLeft, Trash2, X, Video,
  File,ExternalLink } from 'lucide-react';

export const ReplyPreview = ({ replyTo, onClear }) => (
  <div className="flex items-start justify-between bg-blue-50 border-l-4 border-blue-500 rounded-t-md px-4 py-2">
    {/* Left: Message preview */}
    <div className="flex-1 overflow-hidden">
      <p className="text-xs text-blue-700 font-semibold mb-0.5">
        Replying to {replyTo.sender?.name || 'User'}
      </p>
      <p className="text-xs text-gray-700 truncate max-w-xs">
        {replyTo.text
          ? replyTo.text.length > 50
            ? `${replyTo.text.slice(0, 50)}...`
            : replyTo.text
          : replyTo.fileName || '[Media]'}
      </p>
    </div>

    {/* Right: Close button */}
    <button
      onClick={onClear}
      className="ml-3 p-1 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
      aria-label="Cancel reply"
    >
      <X size={16} />
    </button>
  </div>
);
