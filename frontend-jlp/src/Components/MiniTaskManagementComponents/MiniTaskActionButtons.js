import React, { useState, useRef, useEffect } from 'react';
import { 
  FaEye, 
  FaUpload, 
  FaCheck, 
  FaTimes, 
  FaEllipsisH, 
  FaChevronDown,
  FaPaperPlane,
  FaFileAlt,
  FaCommentAlt,
  FaClock,
  FaUser
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
  initialLayout = 'contextual',
  className = ''
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [contextualMenu, setContextualMenu] = useState(false);
  const [currentLayout, setCurrentLayout] = useState(initialLayout);
  const dropdownRef = useRef(null);
  const contextualRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (contextualRef.current && !contextualRef.current.contains(event.target)) {
        setContextualMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Status checks
  const isAssigned = task.assignedTo === user?._id;
  const canSubmitWork = isAssigned && (task.status === "In-progress" || task.status === "Completed");
  const needsAcceptance = task.assignedTo === user?._id && !task.assignmentAccepted;
  
  // Mock task data for demo
  const mockTask = {
    _id: '1',
    status: 'In-progress',
    assignedTo: 'user123',
    assignmentAccepted: true,
    locationType: 'remote',
    employer: { _id: 'emp1' }
  };
  
  const mockUser = { _id: 'user123' };
  
  // Use mock data for demo
  const currentTask = task || mockTask;
  const currentUser = user || mockUser;

  // Action button configurations with contextual grouping
  const actionGroups = {
    primary: [
      {
        id: 'viewDetails',
        label: 'Details',
        icon: FaEye,
        onClick: () => onViewDetails?.(currentTask._id),
        variant: 'secondary',
        show: true,
        description: 'View task details'
      }
    ],
    workflow: [
      {
        id: 'submitWork',
        label: currentTask.locationType === 'on-site' ? 'Submit Proof' : 'Submit Work',
        icon: FaUpload,
        onClick: () => onSubmitWork?.(currentTask._id),
        variant: 'primary',
        show: canSubmitWork,
        description: 'Submit your completed work'
      },
      {
        id: 'acceptTask',
        label: isProcessing ? 'Accepting...' : 'Accept',
        icon: FaCheck,
        onClick: () => onAcceptTask?.(currentTask._id),
        variant: 'success',
        show: needsAcceptance,
        description: 'Accept this task assignment'
      },
      {
        id: 'rejectTask',
        label: isProcessing ? 'Rejecting...' : 'Decline',
        icon: FaTimes,
        onClick: () => onRejectTask?.(currentTask._id),
        variant: 'danger-outline',
        show: needsAcceptance,
        description: 'Decline this task assignment'
      }
    ],
    secondary: [
      {
        id: 'viewSubmissions',
        label: 'Submissions',
        icon: FaFileAlt,
        onClick: () => onViewSubmissions?.(currentTask._id),
        variant: 'ghost',
        show: canSubmitWork,
        description: 'View previous submissions'
      },
      {
        id: 'startChat',
        label: 'Message',
        icon: FaCommentAlt,
        onClick: () => onStartChat?.(currentTask._id),
        variant: 'ghost',
        show: canSubmitWork && !StartChatButton,
        description: 'Chat with employer'
      }
    ]
  };

  // Button component with enhanced styling
  const ActionButton = ({ 
    button, 
    compact = false, 
    fullWidth = false, 
    showTooltip = false,
    iconOnly = false 
  }) => {
    const Icon = button.icon;
    const [showTooltipState, setShowTooltipState] = useState(false);
    
    const baseClasses = `
      relative inline-flex items-center justify-center gap-2 rounded-lg 
      transition-all duration-200 font-medium whitespace-nowrap
      focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
      disabled:opacity-60 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
      ${compact ? 'px-3 py-1.5 text-sm' : iconOnly ? 'w-9 h-9' : 'px-4 py-2'}
    `;
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md',
      'danger-outline': 'bg-white text-red-600 border border-red-300 hover:bg-red-50',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
      minimal: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 p-2'
    };

    return (
      <div className="relative">
        <button
          className={`${baseClasses} ${variantClasses[button.variant]}`}
          onClick={button.onClick}
          disabled={isProcessing && ['acceptTask', 'rejectTask'].includes(button.id)}
          onMouseEnter={() => showTooltip && setShowTooltipState(true)}
          onMouseLeave={() => showTooltip && setShowTooltipState(false)}
          aria-label={button.description}
        >
          <Icon className={`${compact || iconOnly ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
          {!iconOnly && <span>{button.label}</span>}
        </button>
        
        {showTooltip && showTooltipState && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
            {button.description}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  };

  // Contextual Layout - Groups actions by context and importance
  const ContextualLayout = () => {
    const primaryActions = actionGroups.primary.filter(button => button.show);
    const workflowActions = actionGroups.workflow.filter(button => button.show);
    const secondaryActions = actionGroups.secondary.filter(button => button.show);
    const hasSecondaryActions = secondaryActions.length > 0 || (canSubmitWork && StartChatButton);

    return (
      <div className="flex items-center justify-between w-full">
        {/* Primary and workflow actions */}
        <div className="flex items-center gap-2">
          {primaryActions.map(button => (
            <ActionButton key={button.id} button={button} compact />
          ))}
          
          {workflowActions.map(button => (
            <ActionButton key={button.id} button={button} />
          ))}
        </div>

        {/* Secondary actions in contextual menu */}
        {hasSecondaryActions && (
          <div className="relative" ref={contextualRef}>
            <ActionButton 
              button={{
                id: 'more',
                icon: FaEllipsisH,
                variant: 'minimal',
                onClick: () => setContextualMenu(!contextualMenu),
                description: 'More actions'
              }}
              iconOnly
              showTooltip
            />
            
            {contextualMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="py-1">
                  {secondaryActions.map(button => (
                    <button
                      key={button.id}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
                      onClick={() => {
                        button.onClick();
                        setContextualMenu(false);
                      }}
                    >
                      <button.icon className="w-4 h-4 text-gray-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">{button.label}</span>
                        <span className="text-xs text-gray-500">{button.description}</span>
                      </div>
                    </button>
                  ))}
                  
                  {canSubmitWork && StartChatButton && (
                    <div className="px-4 py-2.5 hover:bg-gray-50">
                      <StartChatButton 
                        userId2={currentTask.employer._id} 
                        jobId={currentTask._id} 
                        className="flex items-center gap-3 text-sm text-gray-700 w-full"
                      >
                        <FaCommentAlt className="w-4 h-4 text-gray-500" />
                        <div className="flex flex-col">
                          <span className="font-medium">Message</span>
                          <span className="text-xs text-gray-500">Chat with employer</span>
                        </div>
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
  };

  // Icon-First Layout - Minimalist approach with icons
  const IconFirstLayout = () => {
    const allActions = [
      ...actionGroups.primary.filter(button => button.show),
      ...actionGroups.workflow.filter(button => button.show),
      ...actionGroups.secondary.filter(button => button.show)
    ];

    const visibleActions = allActions.slice(0, 3);
    const hiddenActions = allActions.slice(3);

    return (
      <div className="flex items-center gap-1">
        {visibleActions.map(button => (
          <ActionButton 
            key={button.id} 
            button={button} 
            iconOnly 
            showTooltip 
          />
        ))}
        
        {hiddenActions.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <ActionButton 
              button={{
                id: 'more',
                icon: FaEllipsisH,
                variant: 'minimal',
                onClick: () => setDropdownOpen(!dropdownOpen)
              }}
              iconOnly
              showTooltip
            />
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  {hiddenActions.map(button => (
                    <button
                      key={button.id}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                      onClick={() => {
                        button.onClick();
                        setDropdownOpen(false);
                      }}
                    >
                      <button.icon className="w-4 h-4 text-gray-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">{button.label}</span>
                        <span className="text-xs text-gray-500 mt-0.5">{button.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Progressive Layout - Shows actions based on task state
  const ProgressiveLayout = () => {
    const getStateActions = () => {
      if (needsAcceptance) {
        return actionGroups.workflow.filter(action => ['acceptTask', 'rejectTask'].includes(action.id) && action.show);
      }
      if (canSubmitWork) {
        return [
          ...actionGroups.workflow.filter(action => action.id === 'submitWork' && action.show),
          ...actionGroups.primary.filter(action => action.show)
        ];
      }
      return actionGroups.primary.filter(action => action.show);
    };

    const stateActions = getStateActions();
    const contextActions = actionGroups.secondary.filter(action => action.show);

    return (
      <div className="space-y-2">
        {/* Primary state-based actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {stateActions.map(button => (
            <ActionButton key={button.id} button={button} />
          ))}
        </div>
        
        {/* Secondary contextual actions */}
        {contextActions.length > 0 && (
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            {contextActions.map(button => (
              <ActionButton key={button.id} button={button} compact />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Choose layout based on currentLayout state
  const getLayout = () => {
    switch (currentLayout) {
      case 'icon-first':
        return <IconFirstLayout />;
      case 'progressive':
        return <ProgressiveLayout />;
      case 'contextual':
      default:
        return <ContextualLayout />;
    }
  };

  return (
    <div className={`${className}`}>
      {/*<div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Demo Task Actions</h3>
        <p className="text-sm text-gray-600 mb-3">Switch between different layouts:</p>
        <div className="flex gap-2 flex-wrap">
          {['contextual', 'icon-first', 'progressive'].map(layoutType => (
            <button
              key={layoutType}
              onClick={() => setCurrentLayout(layoutType)}
              className={`px-3 py-1 text-xs rounded ${
                currentLayout === layoutType 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              {layoutType.charAt(0).toUpperCase() + layoutType.slice(1)}
            </button>
          ))}
        </div>
      </div>*/}
      {getLayout()}
    </div>
  );
};

export default TaskActions;