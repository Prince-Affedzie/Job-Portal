import React from 'react';
import '../../Styles/ProcessingOverlay.css';

const ProcessingOverlay = ({ show, message = 'Processing your request...' }) => {
  if (!show) return null;

  return (
    <div className="processing-overlay">
      <div className="processing-content">
        <div className="spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
