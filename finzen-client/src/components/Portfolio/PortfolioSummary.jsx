import React from 'react';
import Card from '../common/Card';

const TotalValue = ({ totalInvested, currentValue, returns, returnsPercentage }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4">Portfolio Value</h3>
    <div className="space-y-3">
      <div>
        <p className="text-3xl font-bold text-gray-900">₹{currentValue.toLocaleString()}</p>
        <p className="text-sm text-gray-600">Current Value</p>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">₹{totalInvested.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Invested</p>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {returns >= 0 ? '+' : ''}₹{returns.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">{returnsPercentage}% Returns</p>
        </div>
      </div>
    </div>
  </Card>
);

const AllocationPie = ({ allocation }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
    <div className="space-y-3">
      {Object.entries(allocation).map(([type, data]) => (
        <div key={type} className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="capitalize">{type.replace('_', ' ')}</span>
          </div>
          <div className="text-right">
            <span className="font-semibold">{data.percentage}%</span>
            <p className="text-sm text-gray-600">₹{data.value.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const PortfolioSummary = ({ summary }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <TotalValue
        totalInvested={summary.totalInvested}
        currentValue={summary.totalCurrentValue}
        returns={summary.totalReturns}
        returnsPercentage={summary.returnsPercentage}
      />
      <AllocationPie allocation={summary.portfolioAllocation} />
    </div>
  );
};

export default PortfolioSummary;