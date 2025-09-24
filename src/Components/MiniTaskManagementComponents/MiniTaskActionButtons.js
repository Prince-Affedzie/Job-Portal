import React, { useState, useRef, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import {
  Upload,
  MessageCircle,
  FileText,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import MarkDoneSwitch from './MarkDoneButton'; // ensure path is correct

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
  const dropdownMenuRef = useRef(null);

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

  // Detect mobile (for sheet style)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Calculate optimal dropdown position (desktop)
  const calculateDropdownPosition = () => {
    if (!dropdownMenuRef.current || !dropdownRef.current) return {};
    try {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const menuRect = dropdownMenuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = dropdownRect.bottom + window.scrollY;
      let left = dropdownRect.left + window.scrollX;
      let transformOrigin = 'top left';

      // If dropdown goes beyond right edge -> push left
      if (left + menuRect.width > viewportWidth) {
        left = Math.max(10, viewportWidth - menuRect.width - 10); // 10px padding
        transformOrigin = 'top right';
      }

      // If dropdown goes beyond left edge -> push right
      if (left < 0) {
        left = 10;
        transformOrigin = 'top left';
      }

      // If dropdown goes beyond bottom -> open upwards
      if (top + menuRect.height > viewportHeight + window.scrollY) {
        top = dropdownRect.top + window.scrollY - menuRect.height;
        transformOrigin = transformOrigin.replace('top', 'bottom');
      }

      // return style object usable in JSX
      return {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        transformOrigin,
        zIndex: 1000
      };
    } catch (err) {
      // if measuring fails, fallback to default
      return {};
    }
  };

  // Status checks (be defensive with types)
  const isAssigned =
    !!task.assignedTo && String(task.assignedTo) === String(user?._id);
  const canSubmitWork =
    isAssigned && (task.status === 'In-progress' || task.status === 'Completed');
  const needsAcceptance =
    !!task.assignedTo && String(task.assignedTo) === String(user?._id) && !task.assignmentAccepted;

  // Determine who can mark done and initial marked state
  const isEmployer = String(task.employer?._id || task.employer) === String(user?._id);
  const isTasker = !!task.assignedTo && String(task.assignedTo) === String(user?._id);
  
  const alreadyMarked = task.markDone;
  const canMark =  (task.status === 'Assigned' || task.status === 'In-progress');

  // Primary action (keeps original logic)
  const primaryAction = needsAcceptance
    ? {
        type: 'acceptance',
        actions: [
          {
            label: 'Accept',
            icon: FaCheck,
            onClick: () => onAcceptTask?.(task, task._id),
            className: 'bg-green-600 hover:bg-green-700 text-white',
            disabled: isProcessing
          },
          {
            label: 'Decline',
            icon: FaTimes,
            onClick: () => onRejectTask?.(task._id),
            className: 'bg-red-600 hover:bg-red-700 text-white',
            disabled: isProcessing
          }
        ]
      }
    : isAssigned && (task.status === 'In-progress' || task.status === 'Completed')
    ? {
        type: 'submit',
        actions: [
          {
            label: task.locationType === 'on-site' ? 'Submit Proof' : 'Submit Work',
            icon: Upload,
            onClick: () => onSubmitWork?.(task._id),
            className: 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        ]
      }
    : {
        type: 'view',
        actions: [
          {
            label: 'View Details',
            icon: Eye,
            onClick: () => onViewDetails?.(task._id),
            className: 'bg-gray-600 hover:bg-gray-700 text-white'
          }
        ]
      };

  // Secondary actions (preserve original behavior)
  const secondaryActions = [];
  if (primaryAction.type !== 'view') {
    secondaryActions.push({
      label: 'View Details',
      icon: Eye,
      onClick: () => onViewDetails?.(task._id)
    });
  }

  if (canSubmitWork) {
    if (primaryAction.type !== 'submit') {
      secondaryActions.push({
        label: task.locationType === 'on-site' ? 'Submit Proof' : 'Submit Work',
        icon: Upload,
        onClick: () => onSubmitWork?.(task._id)
      });
    }

    secondaryActions.push({
      label: 'View Submissions',
      icon: FileText,
      onClick: () => onViewSubmissions?.(task._id)
    });

    if (!StartChatButton) {
      secondaryActions.push({
        label: 'Message Employer',
        icon: MessageCircle,
        onClick: () => onStartChat?.(task._id)
      });
    }
  }

  const hasSecondaryActions =
    secondaryActions.length > 0 || (canSubmitWork && StartChatButton);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Primary Action(s) */}
      {primaryAction.actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          className={`
            inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
            text-sm font-medium transition-colors duration-200 
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
            disabled:opacity-60 disabled:cursor-not-allowed
            ${action.className}
          `}
        >
          <action.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{action.label}</span>
        </button>
      ))}

      {/* Chat Button (desktop only if provided) */}
      {canSubmitWork && StartChatButton && (
        <div className="hidden sm:block">
          {/*<StartChatButton
            userId2={task.employer._id}
            jobId={task._id}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
          </StartChatButton>*/}
        </div>
      )}

      {/* More actions dropdown */}
      {hasSecondaryActions && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((s) => !s)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            aria-label="More actions"
          >
            {dropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {dropdownOpen && (
            <>
              {/* Mobile backdrop */}
              {isMobile && <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setDropdownOpen(false)} />}

              <div
                ref={dropdownMenuRef}
                className={`${isMobile ? 'fixed bottom-0 left-0 right-0 rounded-t-2xl max-h-[70vh] overflow-y-auto bg-white z-50' : 'absolute w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'}`}
                style={!isMobile ? calculateDropdownPosition() : {}}
              >
                {/* Mobile header */}
                {isMobile && (
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
                    <h3 className="font-semibold text-gray-900">Actions</h3>
                    <button onClick={() => setDropdownOpen(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-500" aria-label="Close menu">
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div className={isMobile ? 'p-4 space-y-3' : 'p-2 space-y-1'}>
                  {secondaryActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.onClick();
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors break-words whitespace-normal ${isMobile ? 'rounded-lg' : 'rounded-md'}`}
                    >
                      <action.icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="flex-1">{action.label}</span>
                    </button>
                  ))}

                  {/* Mark as Done switch (only rendered for authorized users and correct statuses) */}
                  {canMark && (
                    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-md">
                  
                      <MarkDoneSwitch taskId={task._id} userRole='tasker' initialMarked={alreadyMarked} />
                    </div>
                  )}

                  {/* Chat option (mobile only) */}
                  {canSubmitWork && StartChatButton && (
                    <div className={`${isMobile ? 'px-4 py-3 hover:bg-gray-50 rounded-lg' : 'sm:hidden px-4 py-3 hover:bg-gray-50 rounded-md'}`}>
                      <StartChatButton
                        userId2={task.employer._id}
                        jobId={task._id}
                        className="flex items-center gap-3 text-sm text-gray-700 w-full text-left"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <MessageCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="flex-1">Message Employer</span>
                      </StartChatButton>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="flex items-center gap-2 ml-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-blue-600 hidden sm:inline">Processing...</span>
        </div>
      )}
    </div>
  );
};

export default TaskActions;
