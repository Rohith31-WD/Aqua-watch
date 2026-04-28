import React from 'react';
import { Map, FileText, LayoutDashboard, Trophy, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const tabs = [
  { id: 'map', label: 'Map View', icon: Map },
  { id: 'report', label: 'Report Issue', icon: FileText },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'stats', label: 'Statistics', icon: BarChart3 },
];

export default function Header({ activeTab, setActiveTab }) {
  const { currentUser, BADGES } = useApp();

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🌊</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AquaWatch</h1>
              <p className="text-xs text-primary-200">Water & Sanitation Monitoring</p>
            </div>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-4 bg-primary-800/30 px-4 py-2 rounded-lg">
              <div className="text-right">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-primary-200">{currentUser.points} points</p>
              </div>
              <div className="flex space-x-1">
                {currentUser.badges?.map((badgeId, index) => {
                  const badge = BADGES[badgeId];
                  return badge ? (
                    <span key={index} className="text-xl" title={badge.name}>
                      {badge.icon}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        <nav className="flex space-x-1 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-primary-700 shadow-md'
                    : 'text-primary-100 hover:bg-primary-800/30'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
