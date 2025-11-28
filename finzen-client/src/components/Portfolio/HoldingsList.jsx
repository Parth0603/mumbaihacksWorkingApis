import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const HoldingCard = ({ holding }) => (
  <Card className="p-4">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{holding.instrumentName}</h4>
        <p className="text-sm text-gray-600">{holding.investmentType}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">₹{holding.currentValue.toLocaleString()}</p>
        <p className={`text-sm ${holding.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {holding.returns >= 0 ? '+' : ''}₹{holding.returns} ({holding.returnsPercentage}%)
        </p>
      </div>
    </div>
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Invested: ₹{holding.amountInvested.toLocaleString()}</span>
        <span>Qty: {holding.quantity}</span>
      </div>
    </div>
  </Card>
);

const HoldingsList = ({ holdings = [] }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Holdings</h3>
        <Button variant="primary" size="sm">
          Add Investment
        </Button>
      </div>
      
      <div className="space-y-3">
        {holdings.map((holding, index) => (
          <HoldingCard key={index} holding={holding} />
        ))}
      </div>
      
      {holdings.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No investments yet</p>
          <Button variant="primary">Start Investing</Button>
        </Card>
      )}
    </div>
  );
};

export default HoldingsList;