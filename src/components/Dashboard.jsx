import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { reports, currentUser, getStats, CATEGORIES, STATUSES } = useApp();
  const stats = getStats();

  // Get user's reports
  const myReports = reports.filter(r => r.reporterId === currentUser?.id || r.reporterName === currentUser?.name);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalReports}</p>
            </div>
            <AlertCircle className="text-primary-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Issues</p>
              <p className="text-3xl font-bold text-red-600">{stats.openReports}</p>
            </div>
            <Clock className="text-red-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{stats.resolvedReports}</p>
            </div>
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Risk</p>
              <p className="text-3xl font-bold text-orange-600">{stats.averageRisk}</p>
            </div>
            <TrendingUp className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* My Reports */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Reports ({myReports.length})</h2>
        
        {myReports.length === 0 ? (
          <p className="text-gray-500 text-center py-8">You haven't submitted any reports yet.</p>
        ) : (
          <div className="space-y-4">
            {myReports.map(report => {
              const category = CATEGORIES[report.category] || CATEGORIES.OTHER;
              const status = STATUSES[report.status] || STATUSES.OPEN;
              
              return (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{report.address}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                      {status.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Reports</h2>
        <div className="space-y-4">
          {reports.slice(0, 5).map(report => {
            const category = CATEGORIES[report.category] || CATEGORIES.OTHER;
            const status = STATUSES[report.status] || STATUSES.OPEN;
            
            return (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">{category.name}</p>
                      <p className="text-xs text-gray-500">by {report.reporterName}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                    {status.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
