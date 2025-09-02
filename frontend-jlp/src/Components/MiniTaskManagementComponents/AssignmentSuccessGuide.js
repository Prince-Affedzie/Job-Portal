import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageCircle, Eye, Flag, CheckCircle } from 'lucide-react';

const AssignmentSuccessGuide = ({ 
  isOpen, 
  onClose, 
  type = "assignment", // "assignment" or "bid"
  freelancerName 
}) => {
  if (!isOpen) return null;
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Successfully {type === "assignment" ? "Assigned" : "Accepted Bid"}
          </h3>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <p className="text-gray-700">
            {type === "assignment" 
              ? `You've assigned this task to ${freelancerName || "the freelancer"}. They've been notified and will need to accept the assignment.`
              : `You've accepted ${freelancerName || "the freelancer"}'s bid. They've been notified and will begin working on your task.`
            }
          </p>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Next steps:</h4>
            <ul className="space-y-3 text-sm text-blue-700">
              <li className="flex items-start">
                <MessageCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                <span>Use the chat feature(Chat Page) to communicate directly with {freelancerName || "the freelancer"} about task details</span>
              </li>
              <li className="flex items-start">
                <Eye size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                <span>Check the <strong>View Submissions</strong> button to review work submitted by the freelancer</span>
              </li>
              <li className="flex items-start">
                <Flag size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                <span>Use the <strong>Report Issue</strong> button if you encounter any problems with the task or delivery</span>
              </li>
            </ul>
          </div>

         <p className="text-sm text-gray-600">
             You can always access these options from the{" "}
               <span className="font-semibold text-indigo-600">My Tasks</span>{" "}
               page. Click on the{" "}
             <span className="font-semibold text-indigo-600">Choose Action button</span>{" "}
             to view these options.
        </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook to use the guide component
export const useAssignmentGuide = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideProps, setGuideProps] = useState({});
  const navigate = useNavigate()

  const showGuide = (type, freelancerName) => {
    setGuideProps({ type, freelancerName });
    setIsGuideOpen(true);
  };

  const hideGuide = () => {
    setIsGuideOpen(false);
    navigate('/manage/mini_tasks')
  };

  return {
    showGuide,
    hideGuide,
    Guide: () => (
      <AssignmentSuccessGuide
        isOpen={isGuideOpen}
        onClose={hideGuide}
        {...guideProps}
      />
    )
  };
};

export default AssignmentSuccessGuide;