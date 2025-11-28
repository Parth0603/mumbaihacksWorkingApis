// User Gamification Collection Schema
// Purpose: Track user badges, levels, points, streaks

// Sample Document Structure
const userGamificationSchema = {
  "_id": "ObjectId",
  "user_id": "ObjectId('user_id_ref')",
  "total_points": 1250,
  "current_level": 3, // 1-5
  "badges": [
    {
      "badge_id": "first_investor",
      "name": "First Investor",
      "earned_date": "ISODate('2025-11-20T10:00:00Z')",
      "icon": "🏆"
    },
    {
      "badge_id": "savings_streak",
      "name": "Savings Streak",
      "earned_date": "ISODate('2025-11-27T10:00:00Z')",
      "icon": "🔥"
    }
  ],
  "streaks": {
    "daily_app_opens": 7,
    "weekly_investments": 3,
    "education_streak": 5
  },
  "leaderboard_rank": 42,
  "referral_count": 3,
  "referral_bonus": 1500,
  "updated_at": "ISODate('2025-11-28T03:00:00Z')"
};

// Create Indexes
db.user_gamification.createIndex({ "user_id": 1 }, { unique: true });
db.user_gamification.createIndex({ "total_points": -1 });
db.user_gamification.createIndex({ "leaderboard_rank": 1 });