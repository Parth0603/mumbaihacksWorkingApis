from datetime import datetime
from bson import ObjectId
from typing import Optional, List


class Badge:
    """Achievement badge"""

    def __init__(
        self,
        name: str,
        description: str,
        icon_url: str,
        requirement: str,  # "complete_3_modules", "invest_10k", etc
        _id: Optional[ObjectId] = None,
    ):
        self._id = _id or ObjectId()
        self.name = name
        self.description = description
        self.icon_url = icon_url
        self.requirement = requirement
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "name": self.name,
            "description": self.description,
            "icon_url": self.icon_url,
            "requirement": self.requirement,
        }


class UserGamification:
    """User's gamification progress"""

    def __init__(
        self,
        user_id: ObjectId,
        points: int = 0,
        level: int = 1,
        badges: List[str] = None,
        streak_days: int = 0,
        last_action_date: Optional[datetime] = None,
        total_investments: int = 0,
        total_modules_completed: int = 0,
        _id: Optional[ObjectId] = None,
    ):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.points = points
        self.level = level
        self.badges = badges or []
        self.streak_days = streak_days
        self.last_action_date = last_action_date or datetime.utcnow()
        self.total_investments = total_investments
        self.total_modules_completed = total_modules_completed
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "user_id": str(self.user_id),
            "points": self.points,
            "level": self.level,
            "badges": self.badges,
            "streak_days": self.streak_days,
            "last_action_date": self.last_action_date.isoformat(),
            "total_investments": self.total_investments,
            "total_modules_completed": self.total_modules_completed,
            "updated_at": self.updated_at.isoformat(),
        }
