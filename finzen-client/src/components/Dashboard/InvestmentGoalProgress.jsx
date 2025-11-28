import React from 'react';
import Card from '../common/Card';

const ProgressBar = ({ progress, total, current }) => (
  <div className="w-full bg-gray-200 rounded-full h-3">
    <div
      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const InvestmentGoalProgress = () => {
  const current = 15050;
  const goal = 50000;
  const progress = (current / goal) * 100;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investment Goal</h3>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹{current.toLocaleString()}</span>
          <span>₹{goal.toLocaleString()}</span>
        </div>
        <ProgressBar progress={progress} total={goal} current={current} />
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{progress.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">of your goal achieved</p>
        </div>
      </div>
    </Card>
  );
};

export default InvestmentGoalProgress;