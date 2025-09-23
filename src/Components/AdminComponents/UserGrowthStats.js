// Components/AdminComponents/UserGrowthStats.jsx
import React from 'react';
import { Users, TrendingUp, UserCheck, Activity } from 'lucide-react';
import { useUserGrowthData } from '../../hooks/useUserGrowthData';
import StatCard from './StatCard';

const UserGrowthStats = () => {
  const { totalUsers, newUsers, loading } = useUserGrowthData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const growthRate = totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(2) : '0.00';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value={totalUsers.toLocaleString()}
        icon={Users}
        trend={newUsers > 0 ? "up" : "down"}
        trendValue={`${growthRate}%`}
        color="blue"
      />
      
      <StatCard
        title="New Users"
        value={newUsers.toLocaleString()}
        icon={TrendingUp}
        trend={newUsers > 0 ? "up" : "down"}
        trendValue="This period"
        color="emerald"
      />
      
      <StatCard
        title="Active Users"
        value={totalUsers.toLocaleString()} // Simplified for now
        icon={UserCheck}
        trend="up"
        trendValue="All users"
        color="purple"
      />
      
      <StatCard
        title="Growth Rate"
        value={`${growthRate}%`}
        icon={Activity}
        trend={parseFloat(growthRate) > 0 ? "up" : "down"}
        trendValue="Current"
        color="amber"
      />
    </div>
  );
};

export default UserGrowthStats;