// Round Up Rules Collection Schema
// Purpose: Store user's round-up preferences

// Sample Document Structure
const roundUpRulesSchema = {
  "_id": "ObjectId",
  "user_id": "ObjectId('user_id_ref')",
  "is_active": true,
  "round_up_to": 100, // Round to nearest 100 or 500
  "frequency": "per_transaction", // per_transaction, weekly_batch
  "monthly_cap": 5000, // Don't round-up if monthly > this
  "auto_invest": true, // Automatically invest round-ups
  "created_at": "ISODate('2025-11-28T03:00:00Z')",
  "updated_at": "ISODate('2025-11-28T03:00:00Z')"
};

// Create Indexes
db.round_up_rules.createIndex({ "user_id": 1 }, { unique: true });