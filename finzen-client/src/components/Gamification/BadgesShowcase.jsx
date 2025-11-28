import React from 'react';
import Card from '../common/Card';

const BadgeItem = ({ badge, earned = false }) => (
  <div className={`p-4 rounded-lg border-2 text-center ${
    earned 
      ? 'border-yellow-300 bg-yellow-50' 
      : 'border-gray-200 bg-gray-50 opacity-60'
  }`}>
    <div className="text-3xl mb-2">{earned ? '🏆' : '🔒'}</div>
    <h4 className="font-semibold text-sm">{badge.name}</h4>
    {earned && badge.earnedDate && (
      <p className="text-xs text-gray-600 mt-1">
        {new Date(badge.earnedDate).toLocaleDateString()}
      </p>
    )}
  </div>
);

const BadgesShowcase = ({ earnedBadges = [], availableBadges = [] }) => {
  const allBadges = [
    ...earnedBadges.map(badge => ({ ...badge, earned: true })),
    ...availableBadges.map(badge => ({ ...badge, earned: false }))
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Badges</h3>
        <span className="text-sm text-gray-600">
          {earnedBadges.length} earned
        </span>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {allBadges.map((badge, index) => (
          <BadgeItem 
            key={badge.badgeId || index} 
            badge={badge} 
            earned={badge.earned}
          />
        ))}
      </div>
      
      {earnedBadges.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No badges earned yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Complete activities to earn your first badge!
          </p>
        </div>
      )}
    </Card>
  );
};

export default BadgesShowcase;