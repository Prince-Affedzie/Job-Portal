// Components/AdminComponents/UserGrowthChart.jsx
import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { TrendingUp, BarChart3, Circle, Users, TrendingDown } from 'lucide-react';
import { useUserGrowthData } from '../../hooks/useUserGrowthData';

const UserGrowthChart = ({ height = 300 }) => {
  const { chartData, loading, error, trend, rawTrend } = useUserGrowthData();
  const [chartType, setChartType] = useState('line'); // 'line' or 'bar'


  const toggleChartType = () => {
    setChartType(prev => prev === 'line' ? 'bar' : 'line');
  };

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
    startDate: item.startDate,
    endDate: item.endDate,
    ...item
  }));

  // FIXED: Correct bar chart data calculation
  // The bar chart should show the actual user count for each period, not growth differences
  const barChartData = validatedData.map((item, index) => {
    return {
      ...item,
      // For bar chart, we show the actual user count for that period
      userCount: item.users,
      // Optional: Also calculate period-over-period growth if you want both
      growth: index === 0 ? 0 : item.users - validatedData[index - 1].users,
      isPositive: index === 0 ? true : item.users >= validatedData[index - 1].users
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900">{label}</p>
          <p className="text-sm text-blue-600">
            {chartType === 'line' ? 'Total Users: ' : 'Users in Period: '}
            <span className="font-semibold">{value.toLocaleString()}</span>
          </p>
          
          {chartType === 'bar' && data.growth !== undefined && (
            <p className={`text-sm ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Growth: {data.growth >= 0 ? '+' : ''}{data.growth}
            </p>
          )}
          
          {data.startDate && (
            <p className="text-xs text-slate-500 mt-1">
              {new Date(data.startDate).toLocaleDateString()} - {new Date(data.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderLineChart = () => (
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
      <Legend />
      <Line 
        type="monotone" 
        dataKey="users" 
        name="Cumulative Users"
        stroke="#3b82f6" 
        strokeWidth={3}
        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, fill: '#1d4ed8' }}
      />
    </LineChart>
  );

  const renderBarChart = () => (
    <BarChart data={barChartData}>
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
      <Legend />
      <Bar 
        dataKey="userCount" 
        name="Users per Period"
        fill="#8b5cf6"
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  );

  // Calculate statistics for the summary
  const totalUsers = validatedData[validatedData.length - 1]?.users || 0;
  const totalGrowth = validatedData.length > 1 ? 
    validatedData[validatedData.length - 1].users - validatedData[0].users : 0;
  const averageGrowth = validatedData.length > 1 ? 
    Math.round(totalGrowth / (validatedData.length - 1)) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          {chartType === 'line' ? 'User Growth Trend' : 'User Distribution by Period'}
        </h3>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {chartType === 'line' ? (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>Cumulative View</span>
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4" />
                <span>Period View</span>
              </>
            )}
          </div>
          
          <button
            onClick={toggleChartType}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title={`Switch to ${chartType === 'line' ? 'bar' : 'line'} chart`}
          >
            <Circle className="w-4 h-4" />
            Switch
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        {chartType === 'line' ? renderLineChart() : renderBarChart()}
      </ResponsiveContainer>
      
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 ${chartType === 'line' ? 'bg-blue-500' : 'bg-purple-500'} rounded`}></div>
          <span>
            {chartType === 'line' ? 'Cumulative Users' : 'Users per Period'}
          </span>
        </div>
        {chartType === 'bar' && (
          <>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>Positive Growth</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-red-500" />
              <span>Negative Growth</span>
            </div>
          </>
        )}
      </div>

      {/* Chart summary */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">
              {totalUsers.toLocaleString()}
            </div>
          </div>
          <div className="text-blue-600 font-medium">Total Users</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              {totalGrowth >= 0 ? '+' : ''}{totalGrowth.toLocaleString()}
            </div>
          </div>
          <div className="text-green-600 font-medium">Total Growth</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {averageGrowth >= 0 ? '+' : ''}{averageGrowth.toLocaleString()}
          </div>
          <div className="text-purple-600 font-medium">Avg Growth/Period</div>
        </div>
      </div>

      {/* Explanation text */}
      <div className="mt-3 text-xs text-slate-500 text-center">
        {chartType === 'line' 
          ? 'Line chart shows cumulative user growth over time' 
          : 'Bar chart shows user count for each time period'
        }
      </div>
    </div>
  );
};

export default UserGrowthChart;