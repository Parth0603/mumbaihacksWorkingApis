import React from 'react';
import Card from '../common/Card';

const LevelDisplay = ({ currentLevel, totalPoints, nextLevelPoints = 2000 }) => {
  const currentLevelPoints = (currentLevel - 1) * 1000;
  const pointsForNext = nextLevelPoints - totalPoints;
  const progress = ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🏅</div>
        <h3 className="text-2xl font-bold text-blue-600">Level {currentLevel}</h3>
        <p className="text-gray-600">{totalPoints.toLocaleString()} points</p>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress to Level {currentLevel + 1}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-600 text-center">
          {pointsForNext > 0 
            ? `${pointsForNext.toLocaleString()} points to next level`
            : 'Max level reached!'
          }
        </p>
      </div>
    </Card>
  );
};

export default LevelDisplay;