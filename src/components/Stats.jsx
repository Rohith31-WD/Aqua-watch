import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

export default function Stats() {
  const { reports, getStats, CATEGORIES, STATUSES } = useApp();
  const stats = getStats();

  // Calculate category distribution
  const categoryCounts = {};
  reports.forEach(report => {
    categoryCounts[report.category] = (categoryCounts[report.category] || 0) + 1;
  });

  // Calculate status distribution
  const statusCounts = {
    OPEN: 0,
    INVESTIGATING: 0,
    RESOLVED: 0
  };
  reports.forEach(report => {
    if (statusCounts[report.status] !== undefined) {
      statusCounts[report.status]++;
    }
  });

  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="text-primary-500" size={24} />
            <span className="text-sm text-gray-600">Total Reports</span>
          </div>
          <p className="text-4xl font-bold text-gray-800">{stats.totalReports}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="text-green-500" size={24} />
            <span className="text-sm text-gray-600">Avg Risk</span>
          </div>
          <p className="text-4xl font-bold text-green-600">{stats.averageRisk}%</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <PieChart className="text-blue-500" size={24} />
            <span className="text-sm text-gray-600">Categories</span>
          </div>
          <p className="text-4xl font-bold text-blue-600">{Object.keys(categoryCounts).length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="text-purple-500" size={24} />
            <span className="text-sm text-gray-600">Resolution Rate</span>
          </div>
          <p className="text-4xl font-bold text-purple-600">
            {stats.totalReports > 0 
              ? Math.round((stats.resolvedReports / stats.totalReports) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Reports by Category</h2>
        <div className="space-y-4">
          {Object.entries(categoryCounts).map(([category, count]) => {
            const catInfo = CATEGORIES[category] || CATEGORIES.OTHER;
            const percentage = (count / maxCategoryCount) * 100;
            
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{catInfo.icon}</span>
                    <span className="font-medium text-gray-700">{catInfo.name}</span>
                  </div>
                  <span className="font-bold text-gray-800">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: catInfo.color
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Status Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-4xl font-bold text-red-600">{statusCounts.OPEN}</p>
            <p className="text-sm font-medium text-red-700 mt-2">Open</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
            <p className="text-4xl font-bold text-orange-600">{statusCounts.INVESTIGATING}</p>
            <p className="text-sm font-medium text-orange-700 mt-2">Investigating</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-4xl font-bold text-green-600">{statusCounts.RESOLVED}</p>
            <p className="text-sm font-medium text-green-700 mt-2">Resolved</p>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Risk Score Distribution</h2>
        <div className="space-y-3">
          {[
            { label: 'High Risk (70-100)', min: 70, max: 100, color: 'bg-red-500' },
            { label: 'Medium Risk (40-69)', min: 40, max: 69, color: 'bg-orange-500' },
            { label: 'Low Risk (0-39)', min: 0, max: 39, color: 'bg-green-500' }
          ].map(range => {
            const count = reports.filter(r => r.riskScore >= range.min && r.riskScore <= range.max).length;
            const percentage = stats.totalReports > 0 ? (count / stats.totalReports) * 100 : 0;
            
            return (
              <div key={range.label} className="flex items-center gap-4">
                <div className="w-32 text-sm text-gray-600">{range.label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${range.color}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-16 text-right font-bold text-gray-800">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
