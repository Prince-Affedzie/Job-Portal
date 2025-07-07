import React, { useState, useRef, useEffect } from 'react';
import { FaEye, FaUpload, FaCheck, FaTimes, FaCheckCircle, FaEllipsisV, FaComments, FaChevronDown } from 'react-icons/fa';

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
  layout = 'vertical',
  className = ''
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAssigned = task.assignedTo === user?._id;
  const isTaskActive = task._id;
  const canSubmitWork = isAssigned && (task.status === "In-progress" || task.status === "Completed");
  const needsAcceptance = task.assignedTo === user?._id && !task.assignmentAccepted;
  const isAccepted = task.assignedTo === user?._id && task.assignmentAccepted;

  const buttons = {
    viewDetails: {
      label: 'Visit Task',
      icon: FaEye,
      onClick: () => onViewDetails?.(task._id),
      className: 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 text-sm py-1.5 px-3',
      show: true,
      priority: 'primary'
    },
    submitWork: {
      label: task.locationType === 'on-site' ? 'Submit Proof of Work' : 'Submit Work',
      icon: FaUpload,
      onClick: () => onSubmitWork?.(task._id),
      className: 'bg-green-600 text-white hover:bg-green-700 text-sm py-1.5 px-3',
      show: canSubmitWork,
      priority: 'secondary'
    },
    viewSubmissions: {
      label: 'View Submissions',
      icon: FaEye,
      onClick: () => onViewSubmissions?.(task._id),
      className: 'bg-blue-600 text-white hover:bg-blue-700 text-sm py-1.5 px-3',
      show: canSubmitWork,
      priority: 'secondary'
    },
    acceptTask: {
      label: isTaskActive && isProcessing ? 'Accepting...' : 'Accept Task',
      icon: FaCheck,
      onClick: () => onAcceptTask?.(task._id),
      className: 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 text-sm py-1.5 px-3',
      disabled: isProcessing,
      show: needsAcceptance,
      priority: 'primary'
    },
    rejectTask: {
      label: isTaskActive && isProcessing ? 'Rejecting...' : 'Reject Task',
      icon: FaTimes,
      onClick: () => onRejectTask?.(task._id),
      className: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 text-sm py-1.5 px-3',
      disabled: isProcessing,
      show: needsAcceptance,
      priority: 'secondary'
    }
  };

  const visibleButtons = Object.entries(buttons).filter(([_, config]) => config.show);
  const primaryButtons = visibleButtons.filter(([_, config]) => config.priority === 'primary');
  const secondaryButtons = visibleButtons.filter(([_, config]) => config.priority === 'secondary');

  const Button = ({ config, compact = false, fullWidth = false }) => {
    const Icon = config.icon;
    return (
      <button
        className={`inline-flex items-center ${fullWidth ? 'justify-start w-full' : 'justify-center'} gap-2 px-${compact ? '3' : '4'} py-2 rounded-md transition-all duration-200 font-medium ${config.className}`}
        onClick={config.onClick}
        disabled={config.disabled}
      >
        <Icon className={`w-${compact ? '3' : '4'} h-${compact ? '3' : '4'}`} />
        <span className={compact ? 'text-sm' : ''}>{config.label}</span>
      </button>
    );
  };

  const DropdownLayout = () => (
    <div className="flex items-center gap-2">
      {primaryButtons.length > 0 && <Button config={primaryButtons[0][1]} />}
      {(secondaryButtons.length > 0 || canSubmitWork) && (
        <div className="relative" ref={dropdownRef}>
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-md text-sm font-medium"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            More <FaChevronDown className="w-3 h-3" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-md border border-gray-200 z-50">
              <div className="py-2">
                {secondaryButtons.map(([key, config]) => (
                  <button
                    key={key}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm"
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
                {canSubmitWork && StartChatButton && (
                  <div className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3">
                    <FaComments className="w-4 h-4 text-purple-600" />
                    <StartChatButton userId2={task.employer._id} jobId={task._id} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const GridLayout = () => (
    <div className="grid grid-cols-2 gap-2 max-w-md">
      {visibleButtons.map(([key, config]) => (
        <Button key={key} config={config} compact />
      ))}
      {canSubmitWork && StartChatButton && (
        <div className="col-span-1">
          <StartChatButton userId2={task.employer._id} jobId={task._id} />
        </div>
      )}
    </div>
  );

  const PriorityLayout = () => (
    <div className="flex items-center gap-2">
      {primaryButtons.length > 0 && <Button config={primaryButtons[0][1]} />}
      {secondaryButtons.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <button
            className="inline-flex items-center justify-center w-9 h-9 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="More actions"
          >
            <FaEllipsisV className="w-4 h-4" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md border border-gray-200 z-50">
              <div className="py-2">
                {secondaryButtons.map(([key, config]) => (
                  <button
                    key={key}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm"
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

  const VerticalLayout = () => (
    <div className="flex flex-col gap-2 max-w-xs">
      {visibleButtons.map(([key, config]) => (
        <Button key={key} config={config} fullWidth />
      ))}
      {canSubmitWork && StartChatButton && (
        <div className="flex items-center">
          <StartChatButton userId2={task.employer._id} jobId={task._id} />
        </div>
      )}
    </div>
  );

  return (
    <div className={`px-6 pb-6 ${className}`}>
      <div className="flex flex-wrap gap-3">
        {layout === 'dropdown' && <DropdownLayout />}
        {layout === 'grid' && <GridLayout />}
        {layout === 'priority' && <PriorityLayout />}
        {layout === 'vertical' && <VerticalLayout />}
      </div>
    </div>
  );
};

export default TaskActions;
