// User Education Progress Collection Schema
// Purpose: Track which modules user has completed

// Sample Document Structure
const userEducationProgressSchema = {
  "_id": "ObjectId",
  "user_id": "ObjectId('user_id_ref')",
  "module_id": "stock_market_101",
  "completed": true,
  "quiz_score": 100, // Percentage
  "completed_date": "ISODate('2025-11-27T15:00:00Z')",
  "created_at": "ISODate('2025-11-27T15:00:00Z')"
};

// Create Indexes
db.user_education_progress.createIndex({ "user_id": 1 });
db.user_education_progress.createIndex({ "user_id": 1, "module_id": 1 }, { unique: true });