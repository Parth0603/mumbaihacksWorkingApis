// AI Recommendations Collection Schema
// Purpose: Store cached AI recommendations (updated daily)

// Sample Document Structure
const aiRecommendationsSchema = {
  "_id": "ObjectId",
  "user_id": "ObjectId('user_id_ref')",
  "recommendation_date": "ISODate('2025-11-28T03:00:00Z')",
  "analysis": {
    "avg_daily_spend": 4500,
    "total_monthly_spend": 135000,
    "spending_volatility": 1200,
    "disposable_income": 27000
  },
  "recommended_investment": {
    "monthly_target": 3200,
    "via_round_ups": 2100,
    "manual_investment": 1100
  },
  "portfolio_allocation": {
    "balanced_funds": { "percentage": 40, "amount": 1280 },
    "government_bonds": { "percentage": 30, "amount": 960 },
    "etfs": { "percentage": 30, "amount": 960 }
  },
  "suggested_instruments": [
    "Axis Bluechip Fund",
    "Nifty 50 ETF",
    "Government Securities"
  ],
  "rationale": "Based on moderate risk profile and stable spending patterns",
  "expires_at": "ISODate('2025-11-29T03:00:00Z')"
};

// Create Indexes
db.ai_recommendations.createIndex({ "user_id": 1 }, { unique: true });
db.ai_recommendations.createIndex({ "recommendation_date": -1 });