// Users Collection Schema
// Purpose: Store user authentication and profile data

// Sample Document Structure
const userSchema = {
  "_id": "ObjectId",
  "email": "user@example.com",
  "phone": "9876543210", 
  "password_hash": "hashed_password",
  "name": "Rahul Kumar",
  "age": 28,
  "risk_profile": "moderate", // conservative, moderate, aggressive
  "kyc_verified": true,
  "investment_goal": 50000, // Target investment amount
  "total_invested": 15050, // Current total
  "created_at": "ISODate('2025-11-28T03:00:00Z')",
  "updated_at": "ISODate('2025-11-28T03:00:00Z')"
};

// Create Indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }, { unique: true });
db.users.createIndex({ "created_at": 1 });