from fastapi import APIRouter, HTTPException, status, Depends
from app.services.gamification import GamificationService
from app.utils.dependencies import get_current_user

router = APIRouter()


@router.get("/profile", status_code=status.HTTP_200_OK)
async def get_gamification_profile(user_id: str = Depends(get_current_user)):
    """Get user's gamification profile"""
    try:
        profile = await GamificationService.get_user_gamification(user_id)
        return profile
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching profile: {str(e)}",
        )


@router.post("/add-points", status_code=status.HTTP_200_OK)
async def add_points(points_type: str, amount: int = None, user_id: str = Depends(get_current_user)):
    """Add points to user"""
    try:
        result = await GamificationService.add_points(user_id, points_type, amount)
        # Check for new badges
        badges = await GamificationService.check_and_award_badges(user_id)
        result["badges_awarded"] = badges
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error adding points: {str(e)}",
        )


@router.post("/award-badge", status_code=status.HTTP_200_OK)
async def award_badge(badge_name: str, user_id: str = Depends(get_current_user)):
    """Manually award badge"""
    try:
        result = await GamificationService.award_badge(user_id, badge_name)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error awarding badge: {str(e)}",
        )


@router.get("/leaderboard", status_code=status.HTTP_200_OK)
async def get_leaderboard(limit: int = 10):
    """Get top users by points"""
    try:
        leaderboard = await GamificationService.get_leaderboard(limit)
        return {"leaderboard": leaderboard, "total": len(leaderboard)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching leaderboard: {str(e)}",
        )


@router.post("/streak", status_code=status.HTTP_200_OK)
async def update_streak(user_id: str = Depends(get_current_user)):
    """Update daily streak"""
    try:
        result = await GamificationService.update_streak(user_id)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating streak: {str(e)}",
        )


@router.post("/daily-reward", status_code=status.HTTP_200_OK)
async def claim_daily_reward(user_id: str = Depends(get_current_user)):
    """Claim daily login reward"""
    try:
        result = await GamificationService.add_points(user_id, "daily_login")
        streak = await GamificationService.update_streak(user_id)
        result["streak"] = streak["streak"]
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error claiming reward: {str(e)}",
        )
