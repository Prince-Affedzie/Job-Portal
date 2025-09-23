// Context/AdminContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  dashboardStatistics, 
  dashboardActivity, 
  dashboardCategory, 
  recentMicroJobs 
} from '../APIS/adminApi';

const AdminMicroTaskContext = createContext();

// Action types
const SET_LOADING = 'SET_LOADING';
const SET_DASHBOARD_DATA = 'SET_DASHBOARD_DATA';
const SET_ERROR = 'SET_ERROR';

// Initial state
const initialState = {
  loading: true,
  dashboardData: {
    stats: null,
    activity: [],
    categories: [],
    recentMicroJobs: []
  },
  error: null,
};

// Reducer
function adminReducer(state, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_DASHBOARD_DATA:
      return { 
        ...state, 
        dashboardData: action.payload,
        loading: false,
        error: null
      };
    case SET_ERROR:
      return { 
        ...state, 
        error: action.payload,
        loading: false 
      };
    default:
      return state;
  }
}

export function AdminMicroTaskProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      // Fetch all data in parallel
      const [statsRes, activityRes, categoriesRes, recentRes] = await Promise.all([
        dashboardStatistics(),
        dashboardActivity(),
        dashboardCategory(),
        recentMicroJobs()
      ]);
      
      const dashboardData = {
        stats: statsRes.data,
        activity: activityRes.data,
        categories: categoriesRes.data,
        recentMicroJobs: recentRes.data
      };
      
      dispatch({ type: SET_DASHBOARD_DATA, payload: dashboardData });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      dispatch({ 
        type: SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch dashboard data' 
      });
    }
  };
  // Refresh dashboard data
  const refreshDashboard = () => {
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
    // Fetch other data if needed

  }, []);

  const value = {
    ...state,
    fetchDashboardData,
    refreshDashboard,
  };

  return (
    < AdminMicroTaskContext.Provider value={value}>
      {children}
    </ AdminMicroTaskContext.Provider>
  );
}

export function useAdminMicroTaskContext() {
  const context = useContext( AdminMicroTaskContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}