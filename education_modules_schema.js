// Education Modules Collection Schema
// Purpose: Store educational content (quiz questions, videos)

// Sample Document Structure
const educationModuleSchema = {
  "_id": "ObjectId",
  "module_id": "stock_market_101",
  "title": "Stock Market 101",
  "description": "Learn basics of stock market investing",
  "difficulty": "beginner", // beginner, intermediate, advanced
  "duration_seconds": 120,
  "order": 1, // Display order
  "content": {
    "intro_text": "Welcome to stock market investing...",
    "key_points": ["What are stocks", "How to buy", "Risk factors"],
    "video_url": "https://example.com/video.mp4",
    "animation": true
  },
  "quiz": [{
    "question_id": "q1",
    "question": "What is a stock?",
    "options": ["Part of company", "Currency", "Bond", "Commodity"],
    "correct_answer": 0,
    "explanation": "A stock represents ownership in a company"
  }],
  "badges_reward": ["First Learner"],
  "points_reward": 10,
  "created_at": "ISODate('2025-11-28T03:00:00Z')"
};

// Create Indexes
db.education_modules.createIndex({ "module_id": 1 }, { unique: true });
db.education_modules.createIndex({ "order": 1 });