from app.config.database import get_database
from bson import ObjectId
from datetime import datetime

class InvestmentService:
    @staticmethod
    async def get_user_investments(user_id: str, status_filter: str = None):
        """Get user investments"""
        db = get_database()
        query = {"user_id": ObjectId(user_id)}
        if status_filter:
            query["status"] = status_filter
        
        investments = await db.investments.find(query).to_list(None)
        for inv in investments:
            inv["id"] = str(inv.pop("_id"))
            inv["user_id"] = str(inv["user_id"])
        return investments
    
    @staticmethod
    async def create_investment(user_id: str, investment_data: dict):
        """Create new investment"""
        db = get_database()
        investment_data.update({
            "user_id": ObjectId(user_id),
            "created_at": datetime.utcnow(),
            "status": "active"
        })
        
        result = await db.investments.insert_one(investment_data)
        investment_data["id"] = str(result.inserted_id)
        investment_data["user_id"] = user_id
        return investment_data
    
    @staticmethod
    async def set_roundup_rules(user_id: str, rules_data: dict):
        """Set round-up rules"""
        db = get_database()
        rules_data.update({
            "user_id": ObjectId(user_id),
            "created_at": datetime.utcnow()
        })
        
        await db.roundup_rules.replace_one(
            {"user_id": ObjectId(user_id)},
            rules_data,
            upsert=True
        )
        return rules_data
    
    @staticmethod
    async def get_roundup_rules(user_id: str):
        """Get round-up rules"""
        db = get_database()
        rules = await db.roundup_rules.find_one({"user_id": ObjectId(user_id)})
        if rules:
            rules["id"] = str(rules.pop("_id"))
            rules["user_id"] = str(rules["user_id"])
        return rules