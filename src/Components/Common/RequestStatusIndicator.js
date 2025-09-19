import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

// This component can be used to show loading status during API requests
export default function RequestStatusIndicator({ 
  status = 'idle', // idle, loading, success, error
  message = '',
  hideAfter = 3000, // time in ms to hide success/error messages
  onHide = () => {}, // callback when component hides itself
  variant = 'overlay' // overlay, inline, toast
}) {
  const [visible, setVisible] = useState(status !== 'idle');
  
  // Handle automatic hiding after success/error
  useEffect(() => {
    setVisible(status !== 'idle');
    
    let timer;
    if (status === 'success' || status === 'error') {
      timer = setTimeout(() => {
        setVisible(false);
        onHide();
      }, hideAfter);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status, hideAfter, onHide]);
  
  if (!visible) return null;
  
  // Different styling based on variant
  const variantStyles = {
    overlay: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50",
    inline: "flex items-center justify-center py-2 px-4",
    toast: "fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg z-50 p-4 border-l-4 animate-slide-in"
  };
  
  // Status specific styling for toast variant
  const toastStatusStyles = {
    loading: "border-blue-500",
    success: "border-green-500",
    error: "border-red-500"
  };
  
  // Component for the toast variant
  if (variant === 'toast') {
    return (
      <div className={`${variantStyles.toast} ${toastStatusStyles[status]}`}>
        <div className="flex items-center">
          {status === 'loading' && <Loader2 className="w-5 h-5 mr-2 text-blue-500 animate-spin" />}
          {status === 'success' && <CheckCircle className="w-5 h-5 mr-2 text-green-500" />}
          {status === 'error' && <XCircle className="w-5 h-5 mr-2 text-red-500" />}
          <div>
            <p className="font-medium">
              {status === 'loading' && 'Processing...'}
              {status === 'success' && 'Success!'}
              {status === 'error' && 'Error!'}
            </p>
            {message && <p className="text-sm text-gray-600">{message}</p>}
          </div>
        </div>
      </div>
    );
  }
  
  // Component for overlay and inline variants
  return (
    <div className={variantStyles[variant]}>
      <div className={variant === 'overlay' ? "bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center" : "flex items-center"}>
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            </div>
            <p className="mt-4 text-gray-700 font-medium">{message || 'Processing your request...'}</p>
            <p className="mt-2 text-sm text-gray-500">Please wait while we complete your request</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="mt-3 text-gray-700 font-medium">{message || 'Success!'}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="mt-3 text-gray-700 font-medium">{message || 'An error occurred'}</p>
            <p className="mt-2 text-sm text-gray-500">Please try again</p>
          </div>
        )}
      </div>
    </div>
  );
}