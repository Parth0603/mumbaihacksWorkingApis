// Investments Collection Schema
// Purpose: Track individual investment records

// Sample Document Structure
const investmentSchema = {
  "_id": "ObjectId",
  "user_id": "ObjectId('user_id_ref')",
  "investment_type": "mutual_fund", // mutual_fund, etf, bonds
  "instrument_name": "Axis Bluechip Fund",
  "amount_invested": 2100,
  "current_value": 2205, // Mock: +5%
  "quantity": 100, // Units held
  "entry_price": 21.00, // Price per unit
  "current_price": 22.05,
  "investment_date": "ISODate('2025-11-20T10:00:00Z')",
  "source": "round_up", // round_up, manual, goal_contribution
  "status": "active", // active, sold, pending
  "created_at": "ISODate('2025-11-20T10:00:00Z')",
  "updated_at": "ISODate('2025-11-28T03:00:00Z')"
};

// Create Indexes
db.investments.createIndex({ "user_id": 1 });
db.investments.createIndex({ "investment_date": -1 });
db.investments.createIndex({ "status": 1 });