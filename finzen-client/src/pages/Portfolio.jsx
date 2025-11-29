import React, { useEffect, useState } from 'react';
import apiClient from '../utils/api';
import './Portfolio.css';

export default function Portfolio() {
  const [summary, setSummary] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1m');
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    amount: '',
    investment_type: 'mutual_fund',
    fund_name: '',
  });

  useEffect(() => {
    fetchPortfolioData();
  }, [period]);

  const fetchPortfolioData = async () => {
    try {
      // Fetch portfolio summary
      const summaryRes = await apiClient.get('/portfolio/summary');
      setSummary(summaryRes.data);

      // Fetch performance
      const perfRes = await apiClient.get(`/portfolio/performance?period=${period}`);
      setPerformance(perfRes.data);

      // Fetch investments
      const invRes = await apiClient.get('/investments/');
      setInvestments(invRes.data.investments || []);

      // Fetch AI recommendations
      try {
        const recRes = await apiClient.get('/ai/recommendations');
        setRecommendations(recRes.data);
      } catch (error) {
        console.log('AI recommendations not available');
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvestment = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/investments/', {
        ...newInvestment,
        amount: parseFloat(newInvestment.amount),
      });
      alert('Investment created successfully!');
      setShowInvestmentForm(false);
      setNewInvestment({ amount: '', investment_type: 'mutual_fund', fund_name: '' });
      fetchPortfolioData();
    } catch (error) {
      alert('Error creating investment: ' + (error.response?.data?.detail || 'Please try again'));
    }
  };

  if (loading) {
    return (
      <div className="portfolio-container">
        <div className="loading">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* Header */}
      <div className="portfolio-header">
        <div>
          <h1>💼 My Portfolio</h1>
          <p className="subtitle">Track your investments and performance</p>
        </div>
        <button className="btn-new-investment" onClick={() => setShowInvestmentForm(!showInvestmentForm)}>
          + New Investment
        </button>
      </div>

      {/* Investment Form Modal */}
      {showInvestmentForm && (
        <div className="modal-overlay" onClick={() => setShowInvestmentForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Investment</h2>
            <form onSubmit={handleCreateInvestment}>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  value={newInvestment.amount}
                  onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })}
                  placeholder="1000"
                  required
                  min="100"
                />
              </div>
              <div className="form-group">
                <label>Investment Type</label>
                <select
                  value={newInvestment.investment_type}
                  onChange={(e) => setNewInvestment({ ...newInvestment, investment_type: e.target.value })}
                >
                  <option value="mutual_fund">Mutual Fund</option>
                  <option value="stock">Stock</option>
                  <option value="etf">ETF</option>
                  <option value="bond">Bond</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fund/Stock Name</label>
                <input
                  type="text"
                  value={newInvestment.fund_name}
                  onChange={(e) => setNewInvestment({ ...newInvestment, fund_name: e.target.value })}
                  placeholder="e.g., HDFC Balanced Fund"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowInvestmentForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card primary">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <p className="card-label">Total Invested</p>
            <h2 className="card-value">₹{summary?.total_invested?.toFixed(2) || '0.00'}</h2>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <p className="card-label">Current Value</p>
            <h2 className="card-value">₹{summary?.current_value?.toFixed(2) || '0.00'}</h2>
          </div>
        </div>
        <div className="summary-card success">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <p className="card-label">Total Returns</p>
            <h2 className="card-value">₹{summary?.total_returns?.toFixed(2) || '0.00'}</h2>
            <p className="card-change positive">+{summary?.total_return_percentage?.toFixed(2) || '0'}%</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <p className="card-label">Total Investments</p>
            <h2 className="card-value">{investments.length}</h2>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="performance-section">
        <div className="section-header">
          <h2>📊 Performance</h2>
          <div className="period-selector">
            <button className={period === '1w' ? 'active' : ''} onClick={() => setPeriod('1w')}>
              1W
            </button>
            <button className={period === '1m' ? 'active' : ''} onClick={() => setPeriod('1m')}>
              1M
            </button>
            <button className={period === '3m' ? 'active' : ''} onClick={() => setPeriod('3m')}>
              3M
            </button>
            <button className={period === '1y' ? 'active' : ''} onClick={() => setPeriod('1y')}>
              1Y
            </button>
          </div>
        </div>
        <div className="performance-card">
          <div className="performance-stat">
            <span className="stat-label">Period Return</span>
            <span className="stat-value positive">+{performance?.return_percentage?.toFixed(2) || '0'}%</span>
          </div>
          <div className="performance-stat">
            <span className="stat-label">Gain/Loss</span>
            <span className="stat-value">₹{performance?.gain_loss?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {recommendations && (
        <div className="recommendations-section">
          <h2>🤖 AI Recommendations</h2>
          <div className="recommendation-card">
            <div className="recommendation-header">
              <h3>Suggested Allocation</h3>
              <span className="confidence">Confidence: {(recommendations.confidence_score * 100).toFixed(0)}%</span>
            </div>
            <div className="allocation-grid">
              {Object.entries(recommendations.recommended_allocation || {}).map(([asset, percentage]) => (
                <div key={asset} className="allocation-item">
                  <span className="asset-name">{asset.charAt(0).toUpperCase() + asset.slice(1)}</span>
                  <div className="allocation-bar">
                    <div className="allocation-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="allocation-percent">{percentage}%</span>
                </div>
              ))}
            </div>
            <div className="recommendation-details">
              <p>
                <strong>Suggested Amount:</strong> ₹{recommendations.suggested_amount}
              </p>
              <p>
                <strong>Reasoning:</strong> {recommendations.reasoning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Investments List */}
      <div className="investments-section">
        <h2>📋 Your Investments</h2>
        {investments.length === 0 ? (
          <div className="empty-state">
            <p>No investments yet. Create your first investment to get started!</p>
          </div>
        ) : (
          <div className="investments-list">
            {investments.map((investment, index) => (
              <div key={index} className="investment-item">
                <div className="investment-info">
                  <h4>{investment.fund_name || investment.investment_type}</h4>
                  <p className="investment-type">{investment.investment_type}</p>
                </div>
                <div className="investment-amount">
                  <p className="amount">₹{investment.amount?.toFixed(2)}</p>
                  <p className="date">{new Date(investment.created_at).toLocaleDateString()}</p>
                </div>
                <div className="investment-status">
                  <span className={`status ${investment.status}`}>{investment.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
