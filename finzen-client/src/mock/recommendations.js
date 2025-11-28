export const mockAIRecommendations = {
  "monthly_target": 3200,
  "via_round_ups": 2100,
  "manual_investment": 1100,
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
  "rationale": "Based on your moderate risk profile and ₹4,500 daily spending"
};

export const mockRoundUpRules = {
  "id": "507f1f77bcf86cd799439012",
  "is_active": true,
  "round_up_to": 100,
  "frequency": "per_transaction",
  "monthly_cap": 5000,
  "auto_invest": true
};