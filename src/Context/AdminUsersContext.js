// Context/UserGrowthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserGrowthStats, getUserGrowthTrend } from '../APIS/adminApi';

const UserGrowthContext = createContext();

export const UserGrowthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserGrowthData = async (period = 'monthly') => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching user growth data for period:', period);
      
      const [statsResponse, trendResponse] = await Promise.all([
        getUserGrowthStats({ period }),
        getUserGrowthTrend({ period, limit: 6 })
      ]);

      console.log('📊 Stats API Response:', statsResponse);
      console.log('📈 Trend API Response:', trendResponse);

      // FIX: Check response.data.success instead of response.success
      if (statsResponse.data && statsResponse.data.success) {
        setStats(statsResponse.data.data); // Set the actual data
        console.log('✅ Stats data set successfully:', statsResponse.data.data);
      } else {
        console.warn('❌ Stats API returned success: false');
        setStats(null);
      }
      
      if (trendResponse.data && trendResponse.data.success) {
        setTrend(trendResponse.data.data); // Set the actual data
        console.log('✅ Trend data set successfully, length:', trendResponse.data.data?.length);
      } else {
        console.warn('❌ Trend API returned success: false');
        setTrend(null);
      }

    } catch (err) {
      console.error('💥 Error fetching user growth data:', err);
      setError(err.message || 'Failed to fetch user growth data');
    } finally {
      setLoading(false);
      console.log('🏁 Loading completed');
    }
  };

  useEffect(() => {
    console.log('🎯 UserGrowthProvider mounted, fetching initial data...');
    fetchUserGrowthData();
  }, []);

  const value = {
    // Data
    stats,
    trend,
    
    // State
    loading,
    error,
    
    // Actions
    fetchUserGrowthData,
    refreshData: () => fetchUserGrowthData()
  };

  return (
    <UserGrowthContext.Provider value={value}>
      {children}
    </UserGrowthContext.Provider>
  );
};

export const useUserGrowth = () => {
  const context = useContext(UserGrowthContext);
  if (!context) {
    throw new Error('useUserGrowth must be used within a UserGrowthProvider');
  }
  return context;
};