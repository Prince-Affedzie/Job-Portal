import React from 'react';

const LoadingSkeleton = ({ className, count = 1, circle = false }) => {
  const elements = Array.from({ length: count }, (_, i) => i);
  
  return (
    <>
      {elements.map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 animate-pulse ${circle ? 'rounded-full' : 'rounded'} ${className}`}
          aria-label="Loading..."
        />
      ))}
    </>
  );
};

export const TextSkeleton = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
        />
      ))}
    </div>
  );
};

export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <LoadingSkeleton className="h-6 w-3/4 mb-4" />
      <TextSkeleton lines={3} />
    </div>
  );
};

export default LoadingSkeleton;