import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined, ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { userContext } from "../../Context/FetchUser";
import { motion } from "framer-motion";
import { Button } from "antd";

const PostEligibilityGate = ({
  children,
  fallbackMessage = "Only verified Task Posters can post micro-tasks. Verification typically takes 24-48 hours after document submission.",
  customAction,
  className = ""
}) => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const isEligible = user?.isVerified && user?.miniTaskEligible;

  // Redirect or loading states
  if (!user) {
    // Consider redirecting to login instead of returning null
    // useEffect(() => { navigate('/login'); }, [navigate]);
    return null;
  }

  if (isEligible) {
    return <>{children}</>;
  }

  // Determine specific reason for ineligibility
  const getIneligibilityReason = () => {
    if (!user.isVerified) {
      return "Account verification pending";
    }
    if (!user.miniTaskEligible) {
      return "Micro-task posting privileges not granted";
    }
    return "Account not eligible";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`max-w-2xl mx-auto p-8 ${className}`}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-50 rounded-full mb-4">
              <InfoCircleOutlined className="text-amber-500 text-2xl" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Posting Restricted
            </h3>
            
            <p className="text-gray-600 mb-6">
              {fallbackMessage}
            </p>
            
            <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mb-6 w-full text-left">
              <p className="text-sm font-medium text-amber-800">
                {getIneligibilityReason()}
              </p>
              {!user.isVerified && (
                <p className="text-xs text-amber-600 mt-1">
                  Status: {user.verificationStatus || 'Pending review'}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/client/microtask_dashboard")}
                className="flex-1"
                size="large"
              >
                Return to Dashboard
              </Button>
              
              <Button
                type="primary"
                icon={<MailOutlined />}
                onClick={() => window.location.href = 'mailto:support@workaflow.com'}
                className="flex-1"
                size="large"
              >
                Contact Support
              </Button>
            </div>

            {customAction && (
              <div className="mt-4 w-full">
                {customAction}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostEligibilityGate;