import React from "react";

// Utility Components
export const ImageWithFallback = ({ src, alt }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/150?text=User";
  };

  const imageSrc = src?.startsWith("http") 
    ? src 
    : `${process.env.REACT_APP_BACKEND_URL}/uploads/${src}`;

  return <img src={imageSrc} alt={alt} onError={handleImageError} />;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch (e) {
    return 'Invalid date';
  }
};