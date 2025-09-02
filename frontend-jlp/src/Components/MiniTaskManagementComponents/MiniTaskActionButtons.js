import React, { useState, useRef, useEffect } from 'react';
import { 
  FaEye, 
  FaUpload, 
  FaCheck, 
  FaTimes, 
  FaEllipsisH,
  FaFileAlt,
  FaCommentAlt
} from 'react-icons/fa';
import { Upload, MessageCircle, FileText, MoreHorizontal } from 'lucide-react';

const TaskActions = ({
  task,
  user,
  isProcessing = false,
  onViewDetails,
  onSubmitWork,
  onViewSubmissions,
  onStartChat,
  onAcceptTask,
  onRejectTask,
  StartChatButton,
  className = ''
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Status checks
  const isAssigned = task.assignedTo === user?._id;
  const canSubmitWork = isAssigned && (task.status === "In-progress" || task.status === "Completed");
  const needsAcceptance = task.assignedTo === user?._id && !task.assignmentAccepted;

  // Action configurations
  const actions = [
    // Primary actions (always visible when applicable)
    {
      id: 'viewDetails',
      label: 'Details',
      icon: FaEye,
      onClick: () => onViewDetails?.(task._id),
      variant: 'secondary',
      show: true,
      priority: 1,
      mobileLabel: 'View'
    },
    {
      id: 'submitWork',
      label: task.locationType === 'on-site' ? 'Submit Proof' : 'Submit Work',
      icon: Upload,
      onClick: () => onSubmitWork?.(task._id),
      variant: 'primary',
      show: canSubmitWork,
      priority: 1,
      mobileLabel: 'Submit'
    },
    {
      id: 'acceptTask',
      label: isProcessing ? 'Accepting...' : 'Accept',
      icon: FaCheck,
      onClick: () => onAcceptTask?.(task, task._id),
      variant: 'success',
      show: needsAcceptance,
      priority: 1,
      mobileLabel: 'Accept'
    },
    {
      id: 'rejectTask',
      label: isProcessing ? 'Rejecting...' : 'Decline',
      icon: FaTimes,
      onClick: () => onRejectTask?.(task._id),
      variant: 'danger',
      show: needsAcceptance,
      priority: 1,
      mobileLabel: 'Decline'
    },
    
    // Secondary actions (go in dropdown on mobile)
    {
      id: 'viewSubmissions',
      label: 'Submissions',
      icon: FileText,
      onClick: () => onViewSubmissions?.(task._id),
      variant: 'ghost',
      show: canSubmitWork,
      priority: 2,
      mobileLabel: 'Submissions'
    },
    {
      id: 'startChat',
      label: 'Message',
      icon: MessageCircle,
      onClick: () => onStartChat?.(task._id),
      variant: 'ghost',
      show: canSubmitWork && !StartChatButton,
      priority: 2,
      mobileLabel: 'Message'
    }
  ];

  // Filter and sort actions by priority and visibility
  const visibleActions = actions
    .filter(action => action.show)
    .sort((a, b) => a.priority - b.priority);

  const primaryActions = visibleActions.filter(action => action.priority === 1);
  const secondaryActions = visibleActions.filter(action => action.priority === 2);

  // Button component with responsive design
  const ActionButton = ({ 
    action, 
    compact = false,
    iconOnly = false
  }) => {
    const Icon = action.icon;
    
    const baseClasses = `
      inline-flex items-center justify-center gap-2 rounded-lg 
      transition-all duration-200 font-medium whitespace-nowrap
      focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
      disabled:opacity-60 disabled:cursor-not-allowed
      ${compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5'}
      ${iconOnly ? 'w-10 h-10 p-0' : ''}
    `;
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
      success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100'
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[action.variant]}`}
        onClick={action.onClick}
        disabled={isProcessing && ['acceptTask', 'rejectTask'].includes(action.id)}
        aria-label={action.label}
      >
        <Icon className={`w-4 h-4 ${iconOnly ? '' : 'sm:flex hidden'}`} />
        {!iconOnly && (
          <span className="text-sm">
            <span className="sm:inline hidden">{action.label}</span>
            <span className="sm:hidden">{action.mobileLabel}</span>
          </span>
        )}
      </button>
    );
  };

  // Mobile dropdown for secondary actions
  const MobileDropdown = () => {
    if (secondaryActions.length === 0 && !(canSubmitWork && StartChatButton)) return null;

    return (
      <div className="relative sm:hidden" ref={dropdownRef}>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-label="More actions"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-600" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="py-1">
              {secondaryActions.map(action => (
                <button
                  key={action.id}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                  onClick={() => {
                    action.onClick();
                    setDropdownOpen(false);
                  }}
                >
                  <action.icon className="w-4 h-4 text-gray-500" />
                  <span>{action.label}</span>
                </button>
              ))}
              
              {canSubmitWork && StartChatButton && (
                <div className="px-4 py-3 hover:bg-gray-50">
                  <StartChatButton 
                    userId2={task.employer._id} 
                    jobId={task._id}
                    className="flex items-center gap-3 text-sm text-gray-700 w-full text-left"
                  >
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <span>Message</span>
                  </StartChatButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-3 sm:space-y-0 ${className}`}>
      {/* Primary actions row */}
      <div className="flex items-center gap-2 flex-wrap">
        {primaryActions.map(action => (
          <ActionButton 
            key={action.id} 
            action={action}
            compact={primaryActions.length > 2}
          />
        ))}
        
        {/* Secondary actions on desktop */}
        {secondaryActions.length > 0 && (
          <div className="hidden sm:flex items-center gap-2">
            {secondaryActions.map(action => (
              <ActionButton 
                key={action.id} 
                action={action}
                compact={true}
              />
            ))}
          </div>
        )}
        
        {/* Start chat button (desktop) */}
        {canSubmitWork && StartChatButton && (
          <div className="hidden sm:block">
            <StartChatButton 
              userId2={task.employer._id} 
              jobId={task._id}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </StartChatButton>
          </div>
        )}
        
        {/* Mobile dropdown for secondary actions */}
        <MobileDropdown />
      </div>

      {/* Visual feedback for processing state */}
      {isProcessing && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};

export default TaskActions;