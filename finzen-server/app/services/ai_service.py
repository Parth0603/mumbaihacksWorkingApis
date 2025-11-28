from motor import motor_asyncio
from app.config.settings import settings
from app.models.investment import AIRecommendationResponse, AllocationItem
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException

class AIService:
    def __init__(self):
        self.client = motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
        self.db = self.client[settings.DATABASE_NAME]
    
    async def get_recommendations(self, user_id: str) -> AIRecommendationResponse:
        # Get cached recommendation
        recommendation = await self.db.ai_recommendations.find_one({"user_id": ObjectId(user_id)})
        
        if not recommendation:
            # Generate new recommendation (mock data for now)
            user = await self.db.users.find_one({"_id": ObjectId(user_id)})
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Mock AI recommendation based on user profile
            mock_recommendation = {
                "monthly_target": 3200,
                "via_round_ups": 2100,
                "manual_investment": 1100,
                "portfolio_allocation": {
                    "balanced_funds": {"percentage": 40, "amount": 1280},
                    "government_bonds": {"percentage": 30, "amount": 960},
                    "etfs": {"percentage": 30, "amount": 960}
                },
                "suggested_instruments": [
                    "Axis Bluechip Fund",
                    "Nifty 50 ETF",
                    "Government Securities"
                ],
                "rationale": f"Based on your {user['risk_profile']} risk profile and ₹4,500 daily spending"
            }
            return AIRecommendationResponse(**mock_recommendation)
        
        # Return cached recommendation
        return AIRecommendationResponse(
            monthly_target=recommendation["recommended_investment"]["monthly_target"],
            via_round_ups=recommendation["recommended_investment"]["via_round_ups"],
            manual_investment=recommendation["recommended_investment"]["manual_investment"],
            portfolio_allocation={
                k: AllocationItem(**v) for k, v in recommendation["portfolio_allocation"].items()
            },
            suggested_instruments=recommendation["suggested_instruments"],
            rationale=recommendation["rationale"]
        )