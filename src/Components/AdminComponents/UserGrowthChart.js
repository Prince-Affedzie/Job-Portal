// Components/AdminComponents/UserGrowthChart.jsx
import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUserGrowthData } from '../../hooks/useUserGrowthData';

const UserGrowthChart = ({ height = 300 }) => {
  const { chartData, loading, error, trend, rawTrend } = useUserGrowthData();

  // Debug: Log the data we're receiving
  useEffect(() => {
    console.log('=== USER GROWTH CHART DEBUG ===');
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Chart Data:', chartData);
    console.log('Trend:', trend);
    console.log('Raw Trend:', rawTrend);
    console.log('Chart Data Length:', chartData?.length);
    console.log('Chart Data Type:', Array.isArray(chartData) ? 'Array' : typeof chartData);
    console.log('==============================');
  }, [chartData, loading, error, trend, rawTrend]);

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
          <p className="font-semibold">Error loading chart</p>
          <p className="text-sm mt-2">{error}</p>
          <div className="mt-2 text-xs bg-red-100 p-2 rounded">
            <p>Check console for detailed error information</p>
          </div>
        </div>
      </div>
    );
  }

  // More detailed empty state check
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="text-center text-slate-500 py-8">
          <p className="font-semibold">No chart data available</p>
          <p className="text-sm mt-2">Growth data will appear here when available</p>
          <div className="mt-4 text-xs bg-slate-100 p-3 rounded-lg max-w-md mx-auto">
            <p><strong>Debug Info:</strong></p>
            <p>Chart Data: {chartData ? 'Exists' : 'Null/Undefined'}</p>
            <p>Is Array: {Array.isArray(chartData) ? 'Yes' : 'No'}</p>
            <p>Length: {chartData?.length || 0}</p>
            <p>Raw Trend exists: {rawTrend ? 'Yes' : 'No'}</p>
            <p>Trend exists: {trend ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Validate data structure
  const validatedData = chartData.map(item => ({
    period: item.period || 'Unknown',
    users: typeof item.users === 'number' ? item.users : 0,
    // Add fallbacks for other required fields
    ...item
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900">{label}</p>
          <p className="text-sm text-blue-600">
            Users: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">User Growth Trend</h3>
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={validatedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="period" 
            stroke="#64748b" 
            fontSize={12}
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12}
            tick={{ fill: '#64748b' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#1d4ed8' }}
          />
        </LineChart>
      </ResponsiveContainer>
      
     
    </div>
  );
};

export default UserGrowthChart;