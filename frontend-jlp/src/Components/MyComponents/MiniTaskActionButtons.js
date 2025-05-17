import { useState } from 'react';
import { ChevronDown, MoreVertical } from 'lucide-react';
import { FaCheck } from 'react-icons/fa';
import StartChatButton from '../MessagingComponents/StartChatButton';

const MiniTaskActions = ({
  task,
  user,
  navigate,
  openSubmitModal,
  handleTaskAcceptance,
  isProcessing,
  isTaskActive,
}) => {
  const [showActions, setShowActions] = useState(false);
  const isAssigned = task.assignedTo === user?._id;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowActions(!showActions)}
        className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none"
      >
        Actions
        <ChevronDown className="ml-1 w-4 h-4" />
      </button>

      {showActions && (
  <div className="absolute z-50 mt-2 w-64 origin-top-right bg-white border border-gray-200 rounded shadow-lg">
    <div className="p-2 space-y-2">
      <button
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
        onClick={() => {
          navigate(`/view/mini_task/info/${task._id}`);
          setShowActions(false);
        }}
      >
        View Details
      </button>

      {isAssigned && (task.status === "In-progress" || task.status === "Completed") && (
        <>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => {
              openSubmitModal(task._id);
              setShowActions(false);
            }}
          >
            Submit Work
          </button>

          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => {
              navigate(`/freelancer/${task._id}/view_task_submissions`);
              setShowActions(false);
            }}
          >
            View Submissions
          </button>

          <div className="w-full px-4">
            <StartChatButton
              userId2={task.employer._id}
              jobId={task._id}
            />
          </div>
        </>
      )}

      {isAssigned && !task.assignmentAccepted && (
        <button
          className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded ${isTaskActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => {
            if (!isProcessing) handleTaskAcceptance(task._id);
            setShowActions(false);
          }}
          disabled={isProcessing}
        >
          {isTaskActive && isProcessing ? 'Accepting...' : 'Accept Task'}
        </button>
      )}

      {isAssigned && task.assignmentAccepted && (
        <p className="flex items-center text-sm text-green-600 px-4">
          <FaCheck className="mr-1" /> Task accepted
        </p>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default MiniTaskActions;
