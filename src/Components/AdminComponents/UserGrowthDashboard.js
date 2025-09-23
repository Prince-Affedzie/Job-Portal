// Components/AdminComponents/UserGrowthDashboard.jsx
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useUserGrowthData } from '../../hooks/useUserGrowthData';
import UserGrowthStats from './UserGrowthStats';
import UserGrowthChart from './UserGrowthChart';
import RoleDistributionChart from './RoleDistributionChart';

const UserGrowthDashboard = () => {
  const { refreshData, loading, error, fetchUserGrowthData } = useUserGrowthData();
  const [period, setPeriod] = useState('monthly');
  const [chartType, setChartType] = useState('line');

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchUserGrowthData(newPeriod);
  };

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Growth Analytics</h2>
          <p className="text-slate-600 mt-1">Monitor platform user growth and trends</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                chartType === 'line' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                chartType === 'bar' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bar Chart
            </button>
          </div>

          {/* Period Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => handlePeriodChange('weekly')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                period === 'weekly' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => handlePeriodChange('monthly')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                period === 'monthly' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-800">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <UserGrowthStats />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart height={350} />
        <RoleDistributionChart height={350} />
      </div>

      {/* Additional Metrics - Simplified for now */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-600 mb-2">Active Sessions</h4>
          <p className="text-2xl font-bold text-slate-900">--</p>
          <p className="text-sm text-slate-500">Data coming soon</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-600 mb-2">Engagement Rate</h4>
          <p className="text-2xl font-bold text-slate-900">--</p>
          <p className="text-sm text-slate-500">Data coming soon</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h4 className="text-sm font-semibold text-slate-600 mb-2">Feature Usage</h4>
          <p className="text-2xl font-bold text-slate-900">--</p>
          <p className="text-sm text-slate-500">Data coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default UserGrowthDashboard;