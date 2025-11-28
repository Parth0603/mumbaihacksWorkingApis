// Portfolio Summary Collection Schema
// Purpose: Cached portfolio aggregates (for performance)

// Sample Document Structure
const portfolioSummarySchema = {
  "_id": "ObjectId",
  "user_id": "ObjectId('user_id_ref')",
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
  "recommended_monthly": 3200,
  "last_updated": "ISODate('2025-11-28T03:00:00Z')"
};

// Create Indexes
db.portfolio_summary.createIndex({ "user_id": 1 }, { unique: true });