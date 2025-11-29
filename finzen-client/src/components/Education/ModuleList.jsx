import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/api';

export default function ModuleList() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await apiClient.get('/education/modules');
      setModules(response.data.modules);
      setError(null);
    } catch (err) {
      setError('Failed to load modules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading modules...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>📚 Learn to Invest</h1>
      <p>Master the basics of investing with our interactive modules</p>
      {modules.map((module) => (
        <div key={module._id}>
          <h3>{module.title}</h3>
          <span>{module.difficulty}</span>
          <p>{module.description}</p>
          <div>
            <span>⏱️{module.duration_minutes} min</span>
            <span>{module.learning_outcomes.length} lessons</span>
          </div>
          <button className="btn-primary" onClick={() => startModule(module._id)}>
            Start Learning
          </button>
        </div>
      ))}
    </div>
  );
}

async function startModule(moduleId) {
  try {
    await apiClient.post(`/education/modules/${moduleId}/start`);
    // Navigate to module detail page
  } catch (err) {
    console.error('Failed to start module:', err);
  }
}
