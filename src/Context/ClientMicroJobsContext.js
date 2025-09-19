import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMiniTasksposted } from '../APIS/API'; // Adjust the import path as needed

// Create the context
const ClientMicroJobsContext = createContext();

// Custom hook to use the context
export const useClientMicroJobs = () => {
  const context = useContext(ClientMicroJobsContext);
  if (!context) {
    throw new Error('useClientMicroJobs must be used within a ClientMicroJobsProvider');
  }
  return context;
};

// Provider component
export const ClientMicroJobsProvider = ({ children }) => {
  const [microJobs, setMicroJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchCount, setRefetchCount] = useState(0);

  const fetchMicroJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMiniTasksposted();
      setMicroJobs(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch micro jobs');
      console.error('Error fetching micro jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    setRefetchCount(prev => prev + 1);
  };

  useEffect(() => {
    fetchMicroJobs();
  }, [refetchCount]);

  const value = {
    microJobs,
    loading,
    error,
    refetch,
    // Helper functions
    ////Open", "In-progress","Review","Rejected","Completed", "Closed","Assigned"
    getActiveJobs: () => microJobs.filter(job => job.status === 'Open'),
    getPendingJobs: () => microJobs.filter(job => job.status === 'Review' || job.status === 'review'),
    getCompletedJobs: () => microJobs.filter(job => job.status === 'Completed'),
    getInProgressJobs: () => microJobs.filter(job => job.status === 'In-progress'),
    getAssignedJobs: () => microJobs.filter(job => job.status === 'Assigned'),
    getDraftJobs: () => microJobs.filter(job => job.status === 'Closed'),
    
  };

  return (
    <ClientMicroJobsContext.Provider value={value}>
      {children}
    </ClientMicroJobsContext.Provider>
  );
};