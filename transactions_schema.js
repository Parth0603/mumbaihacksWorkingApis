// Transactions Collection Schema
// Purpose: Track user spending transactions (for round-up analysis)

// Sample Document Structure
const transactionSchema = {
  "_id": "ObjectId",
  "user_id": "ObjectId('user_id_ref')",
  "amount": 157.50, // Original transaction amount
  "merchant": "Starbucks",
  "category": "Food & Beverage",
  "transaction_date": "ISODate('2025-11-27T14:30:00Z')",
  "description": "Coffee purchase",
  "payment_method": "UPI",
  "round_up_applied": true,
  "round_up_amount": 42.50, // ₹200 - ₹157.50
  "invested": false, // If round-up was invested
  "created_at": "ISODate('2025-11-27T14:30:00Z')"
};

// Create Indexes
db.transactions.createIndex({ "user_id": 1 });
db.transactions.createIndex({ "transaction_date": -1 });
db.transactions.createIndex({ "user_id": 1, "transaction_date": -1 });