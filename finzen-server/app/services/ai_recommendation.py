from app.config.database import get_database
from bson import ObjectId
from datetime import datetime

class AIRecommendationService:
    @staticmethod
    async def generate_recommendation(user_id: str, user_data: dict):
        """Generate AI investment recommendation"""
        risk_profile = user_data.get("risk_profile", "moderate")
        age = user_data.get("age", 30)
        
        # Mock AI recommendation based on risk profile
        if risk_profile == "conservative":
            recommendation = {
                "recommended_allocation": {
                    "equity": 30,
                    "debt": 60,
                    "gold": 10
                },
                "suggested_amount": 5000,
                "reasoning": "Conservative approach suitable for capital preservation"
            }
        elif risk_profile == "aggressive":
            recommendation = {
                "recommended_allocation": {
                    "equity": 80,
                    "debt": 15,
                    "gold": 5
                },
                "suggested_amount": 10000,
                "reasoning": "Aggressive growth strategy for higher returns"
            }
        else:  # moderate
            recommendation = {
                "recommended_allocation": {
                    "equity": 60,
                    "debt": 30,
                    "gold": 10
                },
                "suggested_amount": 7500,
                "reasoning": "Balanced approach for steady growth"
            }
        
        recommendation.update({
            "user_id": user_id,
            "generated_at": datetime.utcnow().isoformat(),
            "confidence_score": 0.85
        })
        
        return recommendation
    
    @staticmethod
    async def cache_recommendation(user_id: str, recommendation: dict):
        """Cache recommendation in database"""
        db = get_database()
        
        # Create a copy to avoid modifying the original
        cache_data = recommendation.copy()
        cache_data["user_id"] = ObjectId(user_id)
        
        # Convert generated_at to datetime if it's a string
        if isinstance(cache_data.get("generated_at"), str):
            cache_data["generated_at"] = datetime.fromisoformat(cache_data["generated_at"])
        
        await db.ai_recommendations.replace_one(
            {"user_id": ObjectId(user_id)},
            cache_data,
            upsert=True
        )
    
    @staticmethod
    async def analyze_spending(user_id: str):
        """Analyze spending patterns"""
        # Mock spending analysis
        return {
            "categories": [
                {"category": "Food", "amount": 5000, "percentage": 40},
                {"category": "Transport", "amount": 2500, "percentage": 20},
                {"category": "Entertainment", "amount": 2000, "percentage": 16},
                {"category": "Shopping", "amount": 3000, "percentage": 24}
            ],
            "total_spending": 12500,
            "insights": [
                "You spend 40% on food - consider meal planning",
                "Transport costs are reasonable at 20%"
            ]
        }