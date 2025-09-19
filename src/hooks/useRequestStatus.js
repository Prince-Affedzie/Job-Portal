// hooks/useRequestStatus.js
import { useState } from 'react';

export function useRequestStatus() {
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const startLoading = (message = 'Processing...') => {
    setStatus('loading');
    setStatusMessage(message);
  };

  const setSuccess = (message = 'Success!') => {
    setStatus('success');
    setStatusMessage(message);
  };

  const setError = (message = 'An error occurred') => {
    setStatus('error');
    setStatusMessage(message);
  };

  const reset = () => {
    setStatus('idle');
    setStatusMessage('');
  };

  return {
    status,
    statusMessage,
    startLoading,
    setSuccess,
    setError,
    reset
  };
}