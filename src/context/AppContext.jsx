import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initialReports, initialUsers, BADGES, CATEGORIES, STATUSES } from '../store';

const AppContext = createContext();

const initialState = {
  reports: [],
  users: [],
  currentUser: null,
  isLoading: true
};

function appReducer(state, action) {
  switch (action.type) {
    case 'INIT_DATA':
      return {
        ...state,
        reports: action.payload.reports,
        users: action.payload.users,
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    
    case 'ADD_REPORT':
      return {
        ...state,
        reports: [action.payload, ...state.reports]
      };
    
    case 'UPDATE_REPORT':
      return {
        ...state,
        reports: state.reports.map(report =>
          report.id === action.payload.id ? action.payload : report
        )
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id 
          ? action.payload 
          : state.currentUser
      };
    
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load data from localStorage or use initial data
    const loadData = () => {
      const savedReports = localStorage.getItem('aquawatch_reports');
      const savedUsers = localStorage.getItem('aquawatch_users');
      const savedCurrentUser = localStorage.getItem('aquawatch_currentUser');

      const reports = savedReports ? JSON.parse(savedReports) : initialReports;
      const users = savedUsers ? JSON.parse(savedUsers) : initialUsers;
      const currentUser = savedCurrentUser ? JSON.parse(savedCurrentUser) : users[0];

      dispatch({
        type: 'INIT_DATA',
        payload: { reports, users, currentUser }
      });
    };

    loadData();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('aquawatch_reports', JSON.stringify(state.reports));
      localStorage.setItem('aquawatch_users', JSON.stringify(state.users));
      if (state.currentUser) {
        localStorage.setItem('aquawatch_currentUser', JSON.stringify(state.currentUser));
      }
    }
  }, [state.reports, state.users, state.currentUser, state.isLoading]);

  const addReport = (reportData) => {
    const newReport = {
      ...reportData,
      id: Date.now().toString(),
      status: 'OPEN',
      riskScore: calculateRiskScore(reportData),
      reporterId: state.currentUser?.id || 'anonymous',
      reporterName: state.currentUser?.name || 'Anonymous',
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_REPORT', payload: newReport });

    // Update user stats and badges
    if (state.currentUser) {
      const updatedUser = {
        ...state.currentUser,
        points: state.currentUser.points + 10,
        reportsCount: state.currentUser.reportsCount + 1,
        badges: [...(state.currentUser.badges || [])]
      };

      // Check for new badges
      const allBadges = Object.entries(BADGES);
      for (const [badgeId, badge] of allBadges) {
        if (updatedUser.reportsCount >= badge.threshold && !updatedUser.badges.includes(badgeId)) {
          updatedUser.badges.push(badgeId);
        }
      }

      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    }

    return newReport;
  };

  const updateReportStatus = (reportId, newStatus) => {
    const report = state.reports.find(r => r.id === reportId);
    if (report) {
      const updatedReport = { ...report, status: newStatus };
      dispatch({ type: 'UPDATE_REPORT', payload: updatedReport });
    }
  };

  const calculateRiskScore = (reportData) => {
    const categoryInfo = CATEGORIES[reportData.category] || CATEGORIES.OTHER;
    const baseScore = categoryInfo.riskWeight * 8;
    return Math.min(baseScore + Math.floor(Math.random() * 20), 100);
  };

  const getStats = () => {
    const totalReports = state.reports.length;
    const openReports = state.reports.filter(r => r.status === 'OPEN').length;
    const investigatingReports = state.reports.filter(r => r.status === 'INVESTIGATING').length;
    const resolvedReports = state.reports.filter(r => r.status === 'RESOLVED').length;
    const averageRisk = totalReports > 0 
      ? Math.round(state.reports.reduce((sum, r) => sum + r.riskScore, 0) / totalReports)
      : 0;

    return {
      totalReports,
      openReports,
      investigatingReports,
      resolvedReports,
      averageRisk
    };
  };

  const getLeaderboard = () => {
    return [...state.users]
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  };

  return (
    <AppContext.Provider value={{
      ...state,
      addReport,
      updateReportStatus,
      getStats,
      getLeaderboard,
      CATEGORIES,
      STATUSES,
      BADGES
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
