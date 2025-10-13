// Components/AdminComponents/RoleDistributionChart.jsx
import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users } from 'lucide-react';
import { useUserGrowthData } from '../../hooks/useUserGrowthData';

const RoleDistributionChart = ({ height = 300 }) => {
  const { roleDistribution, loading, error, stats, users } = useUserGrowthData();

  // Debug: Log the data we're receiving
  useEffect(() => {
    console.log('=== ROLE DISTRIBUTION DEBUG ===');
    console.log('Role Distribution:', roleDistribution);
    console.log('Stats:', stats);
    console.log('Users from context:', users?.length);
    console.log('UsersByRole from stats:', stats?.usersByRole);
    console.log('==============================');
  }, [roleDistribution, stats, users]);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="text-center text-red-600 py-8">
          <p className="font-semibold">Error loading data</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Check if we have any role data to display
  const hasRoleData = roleDistribution && roleDistribution.length > 0 && 
                     roleDistribution.some(item => item.count > 0);

  if (!hasRoleData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="text-center text-slate-500 py-8">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="font-semibold">No role distribution data available</p>
          <p className="text-sm mt-2">
            {stats?.usersByRole 
              ? 'Role data exists but might be empty' 
              : 'Role data not available from API'
            }
          </p>
          
          {/* Debug information */}
          <div className="mt-4 text-xs bg-slate-100 p-3 rounded-lg max-w-md mx-auto">
            <p><strong>Debug Information:</strong></p>
            <p>Total Users: {stats?.totalUsers || 0}</p>
            <p>usersByRole exists: {stats?.usersByRole ? 'Yes' : 'No'}</p>
            <p>usersByRole content: {JSON.stringify(stats?.usersByRole || {})}</p>
            <p>Local users count: {users?.length || 0}</p>
            <p>Calculated role distribution: {roleDistribution?.length || 0} roles</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = roleDistribution.reduce((sum, item) => sum + item.count, 0);
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900 capitalize">{payload[0].name}</p>
          <p className="text-sm text-slate-600">
            Users: <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-sm text-slate-600">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">User Role Distribution</h3>
      
      <ResponsiveContainer width="100%" height={height}>
  <PieChart>
    <Pie
      data={roleDistribution}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
      outerRadius={100}
      fill="#8884d8"
      dataKey="count"
    >
      {roleDistribution.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
      ))}
    </Pie>
    <Tooltip content={<CustomTooltip />} />
    <Legend 
      formatter={(value) => (
        <span className="capitalize text-xs">
          {String(value || '').replace('_', ' ')}
        </span>
      )}
    />
  </PieChart>
</ResponsiveContainer>

{/* Role summary below the chart */}
<div className="mt-4 grid grid-cols-2 gap-2">
  {roleDistribution.map((role, index) => (
    <div key={role.role} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: colors[index % colors.length] }}
        />
        <span className="text-sm font-medium capitalize text-slate-700">
          {String(role.role || '').replace('_', ' ')}
        </span>
      </div>
      <span className="text-sm font-semibold text-slate-900">
        {role.count.toLocaleString()}
      </span>
    </div>
  ))}
</div>
    </div>
  );
};

export default RoleDistributionChart;