import React from 'react';
import Card from '../common/Card';

const StatCard = ({ title, value, icon, color }) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </Card>
);

const QuickStats = () => {
  return (
    <div className="space-y-4">
      <StatCard
        title="Total Invested"
        value="₹15,050"
        icon="💰"
        color="text-green-600"
      />
      <StatCard
        title="Total Returns"
        value="₹490"
        icon="📈"
        color="text-blue-600"
      />
      <StatCard
        title="Goal Progress"
        value="30.1%"
        icon="🎯"
        color="text-purple-600"
      />
    </div>
  );
};

export default QuickStats;