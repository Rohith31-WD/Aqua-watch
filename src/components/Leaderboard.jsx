import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Medal, Award } from 'lucide-react';

export default function Leaderboard() {
  const { getLeaderboard, BADGES } = useApp();
  const users = getLeaderboard();

  const getMedalIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-500" size={32} />;
      case 1:
        return <Medal className="text-gray-400" size={28} />;
      case 2:
        return <Award className="text-orange-500" size={24} />;
      default:
        return <span className="text-lg font-bold text-gray-500">{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Trophy className="text-yellow-500" />
          Community Leaderboard
        </h2>

        {/* Top 3 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {users.slice(0, 3).map((user, index) => {
            const medals = ['🥇', '🥈', '🥉'];
            return (
              <div
                key={user.id}
                className={`rounded-xl p-6 text-center ${
                  index === 0
                    ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400'
                    : index === 1
                    ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300'
                    : 'bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400'
                }`}
              >
                <div className="text-4xl mb-2">{medals[index]}</div>
                <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                <p className="text-2xl font-bold text-primary-600 mt-2">{user.points} pts</p>
                <div className="flex justify-center mt-2 space-x-1">
                  {user.badges?.map((badgeId, i) => {
                    const badge = BADGES[badgeId];
                    return badge ? (
                      <span key={i} className="text-xl" title={badge.name}>
                        {badge.icon}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Full List */}
        <div className="space-y-3">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  {getMedalIcon(index)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.reportsCount} reports</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {user.badges?.map((badgeId, i) => {
                    const badge = BADGES[badgeId];
                    return badge ? (
                      <span key={i} className="text-xl" title={badge.description}>
                        {badge.icon}
                      </span>
                    ) : null;
                  })}
                </div>
                <span className="text-xl font-bold text-primary-600">{user.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
