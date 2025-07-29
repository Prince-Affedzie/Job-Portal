import { Tooltip } from "antd";
import { InfoCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VerifyTooltip = ({ 
  isVerified, 
  message = "Your account is not verified yet. Verification is typically completed within 24-48 hours. Please contact support if you need immediate assistance.",
  dismissible = false,
  placement = "top",
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(!isVerified);
  const [isHovered, setIsHovered] = useState(false);

  // Handle dismissal if dismissible
  const handleDismiss = () => {
    setIsVisible(false);
    // Optional: Store dismissal in localStorage
    localStorage.setItem('verificationTooltipDismissed', 'true');
  };

  // Check localStorage on mount for dismissible state
  useEffect(() => {
    if (dismissible && localStorage.getItem('verificationTooltipDismissed')) {
      setIsVisible(false);
    }
  }, [dismissible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={`w-full ${className}`}
      >
        <Tooltip 
          title="Learn more about verification" 
          placement={placement}
          overlayClassName="max-w-[300px]"
          onVisibleChange={(visible) => setIsHovered(visible)}
        >
          <div 
            className={`
              flex items-center justify-between
              text-amber-700 text-sm mb-10
              bg-amber-50 border border-amber-200
              px-4 py-3 rounded-lg gap-3
              shadow-xs hover:shadow-sm
              transition-all duration-200
              ${isHovered ? 'border-amber-300' : ''}
            `}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <InfoCircleOutlined className="text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="leading-snug">{message}</span>
            </div>
            
            {dismissible && (
              <button 
                onClick={handleDismiss}
                className="text-amber-500 hover:text-amber-700 transition-colors"
                aria-label="Dismiss verification message"
              >
                <CloseOutlined className="text-sm" />
              </button>
            )}
          </div>
        </Tooltip>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerifyTooltip;