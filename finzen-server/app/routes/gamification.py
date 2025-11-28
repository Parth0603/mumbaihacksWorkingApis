from fastapi import APIRouter, Depends, Query
from app.models.gamification import GamificationProfileResponse, LeaderboardResponse, DailyRewardResponse
from app.services.gamification_service import GamificationService
# FIX: Use get_current_user from dependencies (Header-based) instead of auth (HTTPBearer)
from app.utils.dependencies import get_current_user
from typing import Optional

router = APIRouter(prefix="/gamification", tags=["Gamification"])
gamification_service = GamificationService()

@router.get("/profile", response_model=GamificationProfileResponse)
async def get_profile(current_user: str = Depends(get_current_user)):
    return await gamification_service.get_profile(current_user)

@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    current_user: str = Depends(get_current_user),
    period: str = Query("all", regex="^(weekly|monthly|all)$"),
    limit: int = Query(10, ge=1, le=100)
):
    return await gamification_service.get_leaderboard(period, limit)

@router.post("/daily-reward", response_model=DailyRewardResponse)
async def claim_daily_reward(current_user: str = Depends(get_current_user)):
    return await gamification_service.claim_daily_reward(current_user)