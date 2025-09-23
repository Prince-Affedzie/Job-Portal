// hooks/useUserGrowthData.js
import { useUserGrowth } from '../Context/AdminUsersContext';
import { useAdminContext } from '../Context/AdminContext';

export const useUserGrowthData = () => {
  const { stats, trend, loading, error, fetchUserGrowthData, refreshData } = useUserGrowth();
  const { users } = useAdminContext();

  // Simple data extraction
  const chartData = Array.isArray(trend) ? trend : [];
  
  // Role distribution - try API first, then fallback to local users
  const roleDistribution = stats?.usersByRole 
    ? Object.entries(stats.usersByRole)
        .map(([role, count]) => ({ role, count: Number(count) || 0 }))
        .filter(item => item.count > 0)
    : users 
    ? calculateRoleDistribution(users)
    : [];

  // Helper function for fallback role calculation
  function calculateRoleDistribution(usersArray) {
    const roleCounts = usersArray.reduce((acc, user) => {
      const role = user.role || 'unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(roleCounts)
      .map(([role, count]) => ({ role, count }))
      .filter(item => item.count > 0);
  }

  return {
    // Data
    chartData,
    roleDistribution,
    totalUsers: stats?.totalUsers || users?.length || 0,
    newUsers: stats?.newUsers || 0,
    
    // State
    loading,
    error,
    
    // Actions
    refreshData,
    fetchUserGrowthData
  };
};