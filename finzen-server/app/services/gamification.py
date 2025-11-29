from bson import ObjectId
from datetime import datetime, timedelta
from app.config.database import get_database
from typing import Dict, List


class GamificationService:
    """Service for gamification mechanics"""

    # Points system
    POINTS = {
        "investment_created": 10,
        "module_completed": 50,
        "quiz_passed": 30,
        "investment_milestone_1k": 25,
        "investment_milestone_5k": 100,
        "investment_milestone_10k": 250,
        "daily_login": 5,
        "weekly_investment": 20,
    }

    # Level thresholds (cumulative points)
    LEVEL_THRESHOLDS = {
        1: 0,
        2: 100,
        3: 250,
        4: 500,
        5: 1000,
        6: 1500,
        7: 2000,
        8: 2500,
        9: 3000,
        10: 4000,
    }

    @staticmethod
    async def get_user_gamification(user_id: str) -> Dict:
        """Get user's gamification stats"""
        db = get_database()
        gam = await db.user_gamification.find_one({"user_id": ObjectId(user_id)})
        if not gam:
            # Create default if doesn't exist
            gam_doc = {
                "user_id": ObjectId(user_id),
                "points": 0,
                "level": 1,
                "badges": [],
                "streak_days": 0,
                "last_action_date": datetime.utcnow(),
                "total_investments": 0,
                "total_modules_completed": 0,
                "updated_at": datetime.utcnow(),
            }
            result = await db.user_gamification.insert_one(gam_doc)
            gam = gam_doc
            gam["_id"] = result.inserted_id
        # Convert to dict
        gam["_id"] = str(gam["_id"])
        gam["user_id"] = str(gam["user_id"])
        # Calculate next level info
        current_level = gam["level"]
        current_points = gam["points"]
        next_level = current_level + 1
        current_threshold = GamificationService.LEVEL_THRESHOLDS.get(current_level, 0)
        next_threshold = GamificationService.LEVEL_THRESHOLDS.get(
            next_level, current_threshold + 500
        )
        points_to_next = max(0, next_threshold - current_points)
        gam["next_level"] = next_level if next_level <= 10 else current_level
        gam["points_to_next_level"] = points_to_next
        gam["level_progress_percent"] = int(
            (current_points - current_threshold) / (next_threshold - current_threshold) * 100
        )
        return gam

    @staticmethod
    async def add_points(user_id: str, points_type: str, amount: int = None) -> Dict:
        """Add points to user"""
        db = get_database()
        points = amount or GamificationService.POINTS.get(points_type, 0)
        # Update points
        result = await db.user_gamification.update_one(
            {"user_id": ObjectId(user_id)},
            {"$inc": {"points": points}, "$set": {"updated_at": datetime.utcnow()}},
            upsert=True,
        )
        # Check if level up
        gam = await db.user_gamification.find_one({"user_id": ObjectId(user_id)})
        current_points = gam["points"]
        current_level = gam["level"]
        for level, threshold in sorted(GamificationService.LEVEL_THRESHOLDS.items()):
            if current_points >= threshold and level > current_level:
                await db.user_gamification.update_one(
                    {"user_id": ObjectId(user_id)}, {"$set": {"level": level}}
                )
                current_level = level
        return {
            "points_added": points,
            "total_points": current_points,
            "current_level": current_level,
            "message": f"✅ +{points} points!",
        }

    @staticmethod
    async def award_badge(user_id: str, badge_name: str) -> Dict:
        """Award badge to user"""
        db = get_database()
        # Check if already has badge
        gam = await db.user_gamification.find_one({"user_id": ObjectId(user_id)})
        if badge_name in gam.get("badges", []):
            return {"message": "Already has this badge", "status": 200}
        # Add badge
        await db.user_gamification.update_one(
            {"user_id": ObjectId(user_id)},
            {"$addToSet": {"badges": badge_name}, "$set": {"updated_at": datetime.utcnow()}},
        )
        return {
            "badge_awarded": badge_name,
            "message": f"🎖️Badge '{badge_name}' unlocked!",
            "status": 200,
        }

    @staticmethod
    async def check_and_award_badges(user_id: str) -> List[Dict]:
        """Check if user qualifies for any badges"""
        db = get_database()
        awarded = []
        gam = await db.user_gamification.find_one({"user_id": ObjectId(user_id)})
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        # Define badge conditions
        badges_to_check = [
            {"name": "First Investment", "condition": user.get("total_invested", 0) > 0},
            {
                "name": "Investment Goal",
                "condition": user.get("total_invested", 0)
                >= user.get("investment_goal", float("inf")),
            },
            {"name": "Investor", "condition": gam.get("total_investments", 0) >= 5},
            {"name": "Scholar", "condition": gam.get("total_modules_completed", 0) >= 3},
            {"name": "Pro Investor", "condition": gam.get("total_investments", 0) >= 20},
        ]
        for badge_check in badges_to_check:
            if badge_check["condition"] and badge_check["name"] not in gam.get("badges", []):
                result = await GamificationService.award_badge(user_id, badge_check["name"])
                awarded.append(result)
        return awarded

    @staticmethod
    async def get_leaderboard(limit: int = 10) -> List[Dict]:
        """Get top users by points"""
        db = get_database()
        leaderboard = (
            await db.user_gamification.find({}).sort("points", -1).limit(limit).to_list(None)
        )
        result = []
        for idx, entry in enumerate(leaderboard, 1):
            user = await db.users.find_one({"_id": entry["user_id"]})
            result.append(
                {
                    "rank": idx,
                    "user_name": user.get("name", "Anonymous"),
                    "points": entry["points"],
                    "level": entry["level"],
                    "badges_count": len(entry.get("badges", [])),
                }
            )
        return result

    @staticmethod
    async def update_streak(user_id: str) -> Dict:
        """Update user's daily streak"""
        db = get_database()
        gam = await db.user_gamification.find_one({"user_id": ObjectId(user_id)})
        last_action = gam.get("last_action_date")
        today = datetime.utcnow().date()
        if isinstance(last_action, str):
            last_action = datetime.fromisoformat(last_action)
        last_action_date = last_action.date()
        # Check if action was today
        if last_action_date == today:
            return {"streak": gam.get("streak_days", 0), "message": "Already updated today"}
        # Check if yesterday (continue streak)
        yesterday = today - timedelta(days=1)
        if last_action_date == yesterday:
            new_streak = gam.get("streak_days", 0) + 1
            await db.user_gamification.update_one(
                {"user_id": ObjectId(user_id)},
                {"$set": {"streak_days": new_streak, "last_action_date": datetime.utcnow()}},
            )
            # Award streak bonus points
            if new_streak % 7 == 0:  # Every 7 days
                await GamificationService.add_points(user_id, "weekly_investment", 50)
            return {"streak": new_streak, "message": f"🔥 {new_streak}-day streak!"}
        # Streak broken, reset
        await db.user_gamification.update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": {"streak_days": 1, "last_action_date": datetime.utcnow()}},
        )
        return {"streak": 1, "message": "Streak restarted"}
