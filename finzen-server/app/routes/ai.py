from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from datetime import datetime
from app.config.database import get_database
from app.utils.dependencies import get_current_user
from app.services.ai_recommendation import AIRecommendationService

router = APIRouter()

@router.get("/recommendations", status_code=status.HTTP_200_OK)
async def get_recommendations(user_id: str = Depends(get_current_user)):
    """Get AI investment recommendations"""
    db = get_database()
    
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Generate recommendation
        recommendation = await AIRecommendationService.generate_recommendation(user_id, user)
        
        # Cache it
        await AIRecommendationService.cache_recommendation(user_id, recommendation)
        
        return recommendation
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating recommendations: {str(e)}"
        )