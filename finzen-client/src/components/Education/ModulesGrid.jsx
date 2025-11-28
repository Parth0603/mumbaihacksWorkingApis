import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const ModuleCard = ({ module, onStart }) => (
  <Card className="p-6 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-2">{module.title}</h4>
        <p className="text-sm text-gray-600 mb-3">{module.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="capitalize">{module.difficulty}</span>
          <span>{Math.floor(module.durationSeconds / 60)} min</span>
        </div>
      </div>
      <div className="text-2xl">{module.completed ? '✅' : '📚'}</div>
    </div>
    
    {module.completed ? (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{module.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${module.progress}%` }}
          ></div>
        </div>
        <Button variant="secondary" size="sm" className="w-full mt-3">
          Review
        </Button>
      </div>
    ) : (
      <Button 
        variant="primary" 
        size="sm" 
        className="w-full"
        onClick={() => onStart(module.moduleId)}
      >
        Start Learning
      </Button>
    )}
  </Card>
);

const ModulesGrid = ({ modules = [], onStartModule }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Education Modules</h2>
        <div className="text-sm text-gray-600">
          {modules.filter(m => m.completed).length} of {modules.length} completed
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard 
            key={module.moduleId} 
            module={module} 
            onStart={onStartModule}
          />
        ))}
      </div>
    </div>
  );
};

export default ModulesGrid;