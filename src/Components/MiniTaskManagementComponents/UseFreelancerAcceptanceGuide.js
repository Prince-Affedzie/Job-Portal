import React, {useState}from 'react';
import { X, Clock, Upload, Flag, MessageCircle, DollarSign, CheckCircle } from 'lucide-react';

const FreelancerAcceptanceGuide = ({ 
  isOpen, 
  onClose, 
  taskTitle,
  clientName,
  deadline
}) => {
  if (!isOpen) return null;

  // Format deadline date if provided
  const formatDeadline = deadline ? new Date(deadline).toLocaleDateString() : 'the specified date';

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
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <CheckCircle className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Task Accepted Successfully
          </h3>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <p className="text-gray-700">
            You've accepted the task <strong>"{taskTitle}"</strong> from {clientName}. 
            Please make sure to deliver quality work on time.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Important Guidelines:</h4>
            <ul className="space-y-3 text-sm text-blue-700">
              <li className="flex items-start">
                <Clock size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                <span>Deliver the task by <strong>{formatDeadline}</strong> to maintain your reputation</span>
              </li>
              <li className="flex items-start">
                <Upload size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                <span>Submit your work using the <strong>Submit Work</strong> or <strong>Submit Proof</strong> button</span>
              </li>
              <li className="flex items-start">
                <Flag size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                <span>Report any issues using the <strong>Report Issue</strong> button (⋮ menu)</span>
              </li>
              <li className="flex items-start">
                <MessageCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                <span>Communicate with the client through the chat for clarifications</span>
              </li>
              <li className="flex items-start">
                <DollarSign size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                <span>You'll receive payment after the client marks the task as completed and our team verifies it</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Access all these options from the task details page using the three-dot menu (⋮) button.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Start Working
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook to use the freelancer guide component
export const useFreelancerGuide = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideProps, setGuideProps] = useState({});

  const showGuide = (taskTitle, clientName, deadline) => {
    setGuideProps({ taskTitle, clientName, deadline });
    setIsGuideOpen(true);
  };

  const hideGuide = () => {
    setIsGuideOpen(false);
  };

  return {
    showFreelancerGuide: showGuide,
    hideFreelancerGuide: hideGuide,
    FreelancerGuide: () => (
      <FreelancerAcceptanceGuide
        isOpen={isGuideOpen}
        onClose={hideGuide}
        {...guideProps}
      />
    )
  };
};

export default FreelancerAcceptanceGuide;