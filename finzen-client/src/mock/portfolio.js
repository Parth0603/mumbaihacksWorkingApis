export const mockPortfolioSummary = {
  "total_invested": 15050,
  "total_current_value": 15540,
  "total_returns": 490,
  "returns_percentage": 3.26,
  "portfolio_allocation": {
    "mutual_funds": { "percentage": 58, "value": 9013 },
    "etfs": { "percentage": 35, "value": 5439 },
    "bonds": { "percentage": 7, "value": 1088 }
  },
  "monthly_invested_this_month": 3200,
  "investment_goal": 50000,
  "months_to_goal": 14.7,
  "progress_percentage": 30.1
};

export const mockPortfolioPerformance = {
  "period": "1m",
  "data": [
    { "date": "2025-11-01", "portfolio_value": 14800, "returns": 250 },
    { "date": "2025-11-08", "portfolio_value": 15100, "returns": 350 },
    { "date": "2025-11-15", "portfolio_value": 15300, "returns": 400 },
    { "date": "2025-11-22", "portfolio_value": 15450, "returns": 450 },
    { "date": "2025-11-28", "portfolio_value": 15540, "returns": 490 }
  ],
  "chart_url": "https://api.finzen.com/charts/portfolio/performance"
};