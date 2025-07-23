import React, { useState, useRef, useEffect } from 'react';
import { 
  FaEye, 
  FaUpload, 
  FaCheck, 
  FaTimes, 
  FaEllipsisV, 
  FaChevronDown,
  FaPaperPlane,
  FaFileAlt,
  FaCommentAlt
} from 'react-icons/fa';

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
  layout = 'responsive', // 'responsive' is now the default
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
  const isTaskActive = task._id;
  const canSubmitWork = isAssigned && (task.status === "In-progress" || task.status === "Completed");
  const needsAcceptance = task.assignedTo === user?._id && !task.assignmentAccepted;
  const isAccepted = task.assignedTo === user?._id && task.assignmentAccepted;

  // Action button configurations
  const actionButtons = [
    {
      id: 'viewDetails',
      label: 'View Details',
      icon: FaEye,
      onClick: () => onViewDetails?.(task._id),
      variant: 'secondary',
      show: true,
      priority: 'primary',
      mobileVisible: true
    },
    {
      id: 'submitWork',
      label: task.locationType === 'on-site' ? 'Submit Work Proof' : 'Submit Work',
      icon: FaUpload,
      onClick: () => onSubmitWork?.(task._id),
      variant: 'primary',
      show: canSubmitWork,
      priority: 'primary',
      mobileVisible: true
    },
    {
      id: 'viewSubmissions',
      label: 'View Submissions',
      icon: FaFileAlt,
      onClick: () => onViewSubmissions?.(task._id),
      variant: 'secondary',
      show: canSubmitWork,
      priority: 'secondary',
      mobileVisible: false
    },
    {
      id: 'acceptTask',
      label: isProcessing ? 'Accepting...' : 'Accept',
      icon: FaCheck,
      onClick: () => onAcceptTask?.(task._id),
      variant: 'success',
      show: needsAcceptance,
      priority: 'primary',
      mobileVisible: true
    },
    {
      id: 'rejectTask',
      label: isProcessing ? 'Rejecting...' : 'Reject',
      icon: FaTimes,
      onClick: () => onRejectTask?.(task._id),
      variant: 'danger',
      show: needsAcceptance,
      priority: 'secondary',
      mobileVisible: false
    },
    {
      id: 'startChat',
      label: 'Message',
      icon: FaCommentAlt,
      onClick: () => onStartChat?.(task._id),
      variant: 'secondary',
      show: canSubmitWork && !StartChatButton,
      priority: 'secondary',
      mobileVisible: false
    }
  ];

  // Filter visible buttons
  const visibleButtons = actionButtons.filter(button => button.show);
  const primaryButtons = visibleButtons.filter(button => button.priority === 'primary');
  const secondaryButtons = visibleButtons.filter(button => button.priority === 'secondary');
  const mobileVisibleButtons = visibleButtons.filter(button => button.mobileVisible);

  // Button component with consistent styling
  const ActionButton = ({ button, compact = false, fullWidth = false }) => {
    const Icon = button.icon;
    const baseClasses = `flex items-center justify-center gap-2 rounded-lg transition-all duration-200 font-medium whitespace-nowrap ${
      fullWidth ? 'w-full' : ''
    } ${compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'}`;
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      success: 'bg-green-600 text-white hover:bg-green-700',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[button.variant]}`}
        onClick={button.onClick}
        disabled={isProcessing && ['acceptTask', 'rejectTask'].includes(button.id)}
      >
        <Icon className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
        <span>{button.label}</span>
      </button>
    );
  };

  // Responsive Layout (default)
  const ResponsiveLayout = () => (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <div className="flex gap-2">
        {mobileVisibleButtons.map(button => (
          <ActionButton key={button.id} button={button} compact />
        ))}
      </div>
      
      {(secondaryButtons.length > 0 || (canSubmitWork && StartChatButton)) && (
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center justify-center gap-1 px-3 py-1.5 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium w-full sm:w-auto"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>More</span>
            <FaChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
              <div className="py-1">
                {secondaryButtons.map(button => (
                  <button
                    key={button.id}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                    onClick={() => {
                      button.onClick();
                      setDropdownOpen(false);
                    }}
                  >
                    <button.icon className="w-4 h-4 text-gray-500" />
                    <span>{button.label}</span>
                  </button>
                ))}
                
                {canSubmitWork && StartChatButton && (
                  <div className="px-4 py-2.5 hover:bg-gray-50">
                    <StartChatButton 
                      userId2={task.employer._id} 
                      jobId={task._id} 
                      className="flex items-center gap-3 text-sm text-gray-700 w-full"
                    >
                      <FaCommentAlt className="w-4 h-4 text-gray-500" />
                      <span>Message</span>
                    </StartChatButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Desktop Priority Layout
  const DesktopPriorityLayout = () => (
    <div className="flex items-center gap-2">
      {primaryButtons.map(button => (
        <ActionButton key={button.id} button={button} />
      ))}
      
      {(secondaryButtons.length > 0 || (canSubmitWork && StartChatButton)) && (
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center justify-center w-9 h-9 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="More actions"
          >
            <FaEllipsisV className="w-4 h-4" />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
              <div className="py-1">
                {secondaryButtons.map(button => (
                  <button
                    key={button.id}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                    onClick={() => {
                      button.onClick();
                      setDropdownOpen(false);
                    }}
                  >
                    <button.icon className="w-4 h-4 text-gray-500" />
                    <span>{button.label}</span>
                  </button>
                ))}
                
                {canSubmitWork && StartChatButton && (
                  <div className="px-4 py-2.5 hover:bg-gray-50">
                    <StartChatButton 
                      userId2={task.employer._id} 
                      jobId={task._id} 
                      className="flex items-center gap-3 text-sm text-gray-700 w-full"
                    >
                      <FaCommentAlt className="w-4 h-4 text-gray-500" />
                      <span>Message</span>
                    </StartChatButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Mobile Expanded Layout
  const MobileExpandedLayout = () => (
    <div className="grid grid-cols-2 gap-2 w-full">
      {visibleButtons.map(button => (
        <ActionButton key={button.id} button={button} fullWidth />
      ))}
      {canSubmitWork && StartChatButton && (
        <StartChatButton 
          userId2={task.employer._id} 
          jobId={task._id} 
          className="col-span-2"
        />
      )}
    </div>
  );

  // Choose layout based on prop and screen size
  const getLayout = () => {
    if (layout === 'desktop-priority') return <DesktopPriorityLayout />;
    if (layout === 'mobile-expanded') return <MobileExpandedLayout />;
    return <ResponsiveLayout />;
  };

  return (
    <div className={`${className}`}>
      {getLayout()}
    </div>
  );
};

export default TaskActions;