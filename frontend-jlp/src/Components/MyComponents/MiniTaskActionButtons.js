import React, { useState, useRef, useEffect } from 'react';
import { FaEye, FaUpload, FaCheck, FaTimes, FaCheckCircle, FaEllipsisV, FaComments,FaChevronDown} from 'react-icons/fa';

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
  StartChatButton, // Pass the StartChatButton component as prop
  layout = 'dropdown', // 'dropdown', 'grid', 'priority', 'vertical'
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

  // Derived states
  const isAssigned = task.assignedTo === user?._id;
  const isTaskActive = task._id; // You might want to adjust this logic
  const canSubmitWork = isAssigned && (task.status === "In-progress" || task.status === "Completed");
  const needsAcceptance = task.assignedTo === user?._id && !task.assignmentAccepted;
  const isAccepted = task.assignedTo === user?._id && task.assignmentAccepted;

  // Button configurations
  const buttons = {
    viewDetails: {
      label: 'View Details',
      icon: FaEye,
      onClick: () => onViewDetails?.(task._id),
      className: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      show: true,
      priority: 'primary'
    },
    submitWork: {
      label: task.locationType === 'on-site' ? 'Submit Proof of Work' : 'Submit Work',
      icon: FaUpload,
      onClick: () => onSubmitWork?.(task._id),
      className: 'bg-green-600 text-white hover:bg-green-700',
      show: canSubmitWork,
      priority: 'secondary'
    },
    viewSubmissions: {
      label: 'View Submissions',
      icon: FaEye,
      onClick: () => onViewSubmissions?.(task._id),
      className: 'bg-blue-600 text-white hover:bg-blue-700',
      show: canSubmitWork,
      priority: 'secondary'
    },
    acceptTask: {
      label: isTaskActive && isProcessing ? 'Accepting...' : 'Accept Task',
      icon: FaCheck,
      onClick: () => onAcceptTask?.(task._id),
      className: `bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 ${isTaskActive ? 'animate-pulse' : ''}`,
      disabled: isProcessing,
      show: needsAcceptance,
      priority: 'primary'
    },
    rejectTask: {
      label: isTaskActive && isProcessing ? 'Rejecting...' : 'Reject Task',
      icon: FaTimes,
      onClick: () => onRejectTask?.(task._id),
      className: `bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 ${isTaskActive ? 'animate-pulse' : ''}`,
      disabled: isProcessing,
      show: needsAcceptance,
      priority: 'secondary'
    }
  };

  // Filter visible buttons
  const visibleButtons = Object.entries(buttons).filter(([_, config]) => config.show);
  const primaryButtons = visibleButtons.filter(([_, config]) => config.priority === 'primary');
  const secondaryButtons = visibleButtons.filter(([_, config]) => config.priority === 'secondary');

  // Button component
  const Button = ({ config, compact = false, fullWidth = false }) => {
    const Icon = config.icon;
    return (
      <button
        className={`inline-flex items-center ${fullWidth ? 'justify-start w-full' : 'justify-center'} gap-2 px-${compact ? '3' : '4'} py-2 rounded-lg transition-colors duration-200 font-medium ${config.className} ${fullWidth ? 'hover:bg-gray-50' : ''}`}
        onClick={config.onClick}
        disabled={config.disabled}
      >
        <Icon className={`w-${compact ? '3' : '4'} h-${compact ? '3' : '4'}`} />
        <span className={compact ? 'text-sm' : ''}>{config.label}</span>
      </button>
    );
  };

  // Dropdown layout
  const DropdownLayout = () => (
    <div className="flex items-center gap-2">
      {/* Primary action always visible */}
      {primaryButtons.length > 0 && (
        <Button config={primaryButtons[0][1]} />
      )}
      
      {/* Secondary actions in dropdown */}
      {(secondaryButtons.length > 0 || canSubmitWork) && (
        <div className="relative" ref={dropdownRef}>
         <button 
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                onClick={() => setDropdownOpen(!dropdownOpen)}
>
              <span>More Actions</span>
              <FaChevronDown className="w-3 h-3" />
             </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                {secondaryButtons.map(([key, config]) => (
                  <button
                    key={key}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    onClick={() => {
                      config.onClick();
                      setDropdownOpen(false);
                    }}
                    disabled={config.disabled}
                  >
                    <config.icon className="w-3 h-3 text-gray-500" />
                    <span>{config.label}</span>
                  </button>
                ))}
                
                {/* Start Chat Button */}
                {canSubmitWork && StartChatButton && (
                  <div className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3">
                    <FaComments className="w-4 h-4 text-purple-600" />
                    <StartChatButton
                      userId2={task.employer._id}
                      jobId={task._id}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Grid layout
  const GridLayout = () => (
    <div className="grid grid-cols-2 gap-2 max-w-md">
      {visibleButtons.map(([key, config]) => (
        <Button key={key} config={config} compact />
      ))}
      {canSubmitWork && StartChatButton && (
        <div className="col-span-1">
          <StartChatButton
            userId2={task.employer._id}
            jobId={task._id}
          />
        </div>
      )}
    </div>
  );

  // Priority layout
  const PriorityLayout = () => (
    <div className="flex items-center gap-2">
      {/* Primary action */}
      {primaryButtons.length > 0 && (
        <Button config={primaryButtons[0][1]} />
      )}
      
      {/* Secondary actions dropdown */}
      {secondaryButtons.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <button
            className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="More actions available"
          >
            <FaEllipsisV className="w-4 h-4" />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                {secondaryButtons.map(([key, config]) => (
                  <button
                    key={key}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    onClick={() => {
                      config.onClick();
                      setDropdownOpen(false);
                    }}
                    disabled={config.disabled}
                  >
                    <config.icon className="w-4 h-4 text-gray-500" />
                    <span>{config.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Vertical layout
  const VerticalLayout = () => (
    <div className="flex flex-col gap-2 max-w-xs">
      {visibleButtons.map(([key, config]) => (
        <Button key={key} config={config} fullWidth />
      ))}
      {canSubmitWork && StartChatButton && (
        <div className="flex items-center">
          <StartChatButton
            userId2={task.employer._id}
            jobId={task._id}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className={`px-6 pb-6 ${className}`}>
      <div className="flex flex-wrap gap-3">
        {/* Task acceptance status */}
        {isAccepted && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
            <FaCheckCircle className="w-4 h-4" />
            <span className="font-medium">Task Accepted</span>
          </div>
        )}
        
        {/* Action buttons based on layout */}
        {layout === 'dropdown' && <DropdownLayout />}
        {layout === 'grid' && <GridLayout />}
        {layout === 'priority' && <PriorityLayout />}
        {layout === 'vertical' && <VerticalLayout />}
      </div>
    </div>
  );
};

export default TaskActions;