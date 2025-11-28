from pydantic import BaseModel
from typing import List

class GamificationProfile(BaseModel):
    level: int
    points: int
    badges: List[str]
    streak: int

class GamificationProfileResponse(BaseModel):
    level: int
    points: int
    badges: List[str]
    streak: int

class LeaderboardEntry(BaseModel):
    user: str
    points: int

class LeaderboardResponse(BaseModel):
    leaderboard: List[LeaderboardEntry]

class DailyRewardResponse(BaseModel):
    reward: int
    claimed: bool