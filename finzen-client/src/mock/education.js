export const mockEducationModules = [
  {
    "module_id": "stock_market_101",
    "title": "Stock Market 101",
    "description": "Learn the basics of stock market investing",
    "difficulty": "beginner",
    "duration_seconds": 120,
    "completed": true,
    "progress": 100,
    "quiz_score": 100
  },
  {
    "module_id": "mutual_funds",
    "title": "Mutual Funds Explained",
    "description": "Understanding mutual funds and their benefits",
    "difficulty": "beginner",
    "duration_seconds": 150,
    "completed": false,
    "progress": 0
  },
  {
    "module_id": "etf_basics",
    "title": "ETF Fundamentals",
    "description": "Exchange Traded Funds and how they work",
    "difficulty": "beginner",
    "duration_seconds": 180,
    "completed": false,
    "progress": 0
  },
  {
    "module_id": "risk_management",
    "title": "Risk Management",
    "description": "Learn to manage investment risks effectively",
    "difficulty": "intermediate",
    "duration_seconds": 240,
    "completed": false,
    "progress": 0
  },
  {
    "module_id": "portfolio_diversification",
    "title": "Portfolio Diversification",
    "description": "Building a balanced investment portfolio",
    "difficulty": "intermediate",
    "duration_seconds": 200,
    "completed": false,
    "progress": 0
  },
  {
    "module_id": "advanced_strategies",
    "title": "Advanced Investment Strategies",
    "description": "Complex investment techniques and strategies",
    "difficulty": "advanced",
    "duration_seconds": 300,
    "completed": false,
    "progress": 0
  }
];

export const mockModuleDetail = {
  "module_id": "stock_market_101",
  "title": "Stock Market 101",
  "content": {
    "intro_text": "Welcome to stock market investing...",
    "key_points": ["What are stocks", "How to buy", "Risk factors"],
    "video_url": "https://example.com/video.mp4",
    "animation": true
  },
  "quiz": [
    {
      "question_id": "q1",
      "question": "What is a stock?",
      "options": ["Part of company", "Currency", "Bond", "Commodity"],
      "explanation": "A stock represents ownership in a company"
    }
  ],
  "badges_reward": ["First Learner"],
  "points_reward": 10
};