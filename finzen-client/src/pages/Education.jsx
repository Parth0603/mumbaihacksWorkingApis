import React, { useEffect, useState } from 'react';
import apiClient from '../utils/api';
import './Education.css';

export default function Education() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list', 'detail', 'quiz', 'result'

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await apiClient.get('/education/modules');
      setModules(response.data.modules);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = async (moduleId) => {
    try {
      const response = await apiClient.get(`/education/modules/${moduleId}`);
      setSelectedModule(response.data);
      setView('detail');
    } catch (error) {
      console.error('Error fetching module:', error);
    }
  };

  const handleStartModule = async () => {
    try {
      await apiClient.post(`/education/modules/${selectedModule._id}/start`);
      // Load quiz
      const quizResponse = await apiClient.get(`/education/modules/${selectedModule._id}/quiz`);
      setQuiz(quizResponse.data);
      setAnswers({});
      setView('quiz');
    } catch (error) {
      console.error('Error starting module:', error);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer,
    });
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await apiClient.post(`/education/modules/${selectedModule._id}/quiz`, answers);
      setQuizResult(response.data);
      setView('result');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    }
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedModule(null);
    setQuiz(null);
    setQuizResult(null);
    fetchModules(); // Refresh to show updated progress
  };

  if (loading) {
    return (
      <div className="education-container">
        <div className="loading">Loading modules...</div>
      </div>
    );
  }

  return (
    <div className="education-container">
      {view === 'list' && (
        <>
          <div className="education-header">
            <h1>📚 Learn to Invest</h1>
            <p className="subtitle">Master investing basics with interactive modules and quizzes</p>
          </div>

          <div className="modules-grid">
            {modules.map((module) => (
              <div key={module._id} className="module-card" onClick={() => handleModuleClick(module._id)}>
                <div className="module-header">
                  <h3>{module.title}</h3>
                  <span className={`difficulty ${module.difficulty}`}>{module.difficulty}</span>
                </div>
                <p className="module-description">{module.description}</p>
                <div className="module-meta">
                  <span>⏱️ {module.duration_minutes} min</span>
                  <span>📖 {module.learning_outcomes?.length || 0} lessons</span>
                </div>
                {module.completed && (
                  <div className="completed-badge">✅ Completed</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'detail' && selectedModule && (
        <div className="module-detail">
          <button className="btn-back" onClick={handleBackToList}>
            ← Back to Modules
          </button>
          
          <div className="detail-header">
            <h1>{selectedModule.title}</h1>
            <span className={`difficulty ${selectedModule.difficulty}`}>
              {selectedModule.difficulty}
            </span>
          </div>

          <div className="detail-content">
            <div className="content-section">
              <h3>What you'll learn:</h3>
              <ul className="learning-outcomes">
                {selectedModule.learning_outcomes?.map((outcome, index) => (
                  <li key={index}>✓ {outcome}</li>
                ))}
              </ul>
            </div>

            <div className="content-section">
              <h3>Module Content:</h3>
              <div className="module-content" dangerouslySetInnerHTML={{ __html: selectedModule.content }} />
            </div>
          </div>

          <button className="btn-start-quiz" onClick={handleStartModule}>
            Start Quiz 🎯
          </button>
        </div>
      )}

      {view === 'quiz' && quiz && (
        <div className="quiz-container">
          <button className="btn-back" onClick={handleBackToList}>
            ← Back to Modules
          </button>

          <div className="quiz-header">
            <h1>📝 Quiz Time!</h1>
            <p>Answer all questions to complete the module</p>
          </div>

          <div className="questions-list">
            {quiz.questions.map((question, index) => (
              <div key={index} className="question-card">
                <h3>Question {index + 1}</h3>
                <p className="question-text">{question.question}</p>
                <div className="options-list">
                  {question.options.map((option, optIndex) => (
                    <label key={optIndex} className="option-label">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() => handleAnswerChange(index, option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-submit-quiz"
            onClick={handleSubmitQuiz}
            disabled={Object.keys(answers).length !== quiz.questions.length}
          >
            Submit Quiz
          </button>
        </div>
      )}

      {view === 'result' && quizResult && (
        <div className="result-container">
          <div className={`result-card ${quizResult.passed ? 'passed' : 'failed'}`}>
            <div className="result-icon">
              {quizResult.passed ? '🎉' : '😔'}
            </div>
            <h1>{quizResult.passed ? 'Congratulations!' : 'Keep Learning!'}</h1>
            <p className="result-message">{quizResult.message}</p>
            
            <div className="result-stats">
              <div className="stat">
                <span className="stat-label">Score</span>
                <span className="stat-value">{quizResult.score}%</span>
              </div>
              <div className="stat">
                <span className="stat-label">Correct</span>
                <span className="stat-value">{quizResult.correct}/{quizResult.total}</span>
              </div>
            </div>

            {quizResult.passed && (
              <div className="points-earned">
                +50 Points Earned! 🏆
              </div>
            )}

            <button className="btn-back-list" onClick={handleBackToList}>
              Back to Modules
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
