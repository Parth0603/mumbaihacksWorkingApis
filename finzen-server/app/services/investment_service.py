from motor import motor_asyncio
from app.config.settings import settings
from app.models.investment import RoundUpRulesRequest, RoundUpRulesResponse, CreateInvestmentRequest, InvestmentResponse, InvestmentListResponse, InvestmentListItem
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException

class InvestmentService:
    def __init__(self):
        self.client = motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
        self.db = self.client[settings.DATABASE_NAME]
    
    async def set_roundup_rules(self, user_id: str, rules_data: RoundUpRulesRequest) -> RoundUpRulesResponse:
        # Check if rules already exist for user
        existing_rules = await self.db.roundup_rules.find_one({"user_id": ObjectId(user_id)})
        
        rules_doc = {
            "user_id": ObjectId(user_id),
            "is_active": True,
            "round_up_to": rules_data.round_up_to,
            "frequency": rules_data.frequency,
            "monthly_cap": rules_data.monthly_cap,
            "auto_invest": rules_data.auto_invest,
            "updated_at": datetime.utcnow()
        }
        
        if existing_rules:
            # Update existing rules
            await self.db.roundup_rules.update_one(
                {"user_id": ObjectId(user_id)},
                {"$set": rules_doc}
            )
            rule_id = str(existing_rules["_id"])
        else:
            # Create new rules
            rules_doc["created_at"] = datetime.utcnow()
            result = await self.db.roundup_rules.insert_one(rules_doc)
            rule_id = str(result.inserted_id)
        
        return RoundUpRulesResponse(
            id=rule_id,
            is_active=True,
            round_up_to=rules_data.round_up_to,
            frequency=rules_data.frequency,
            monthly_cap=rules_data.monthly_cap,
            auto_invest=rules_data.auto_invest
        )
    
    async def create_investment(self, user_id: str, investment_data: CreateInvestmentRequest) -> InvestmentResponse:
        investment_doc = {
            "user_id": ObjectId(user_id),
            "investment_type": investment_data.investment_type,
            "instrument_name": investment_data.instrument_name,
            "amount_invested": investment_data.amount_invested,
            "current_value": investment_data.amount_invested,  # Initially same as invested
            "quantity": investment_data.quantity,
            "entry_price": investment_data.entry_price,
            "current_price": investment_data.entry_price,  # Initially same as entry
            "investment_date": datetime.utcnow(),
            "source": investment_data.source,
            "status": "active",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await self.db.investments.insert_one(investment_doc)
        
        return InvestmentResponse(
            id=str(result.inserted_id),
            investment_type=investment_data.investment_type,
            instrument_name=investment_data.instrument_name,
            amount_invested=investment_data.amount_invested,
            current_value=investment_data.amount_invested,
            status="active",
            investment_date=investment_doc["investment_date"].isoformat() + "Z"
        )
    
    async def get_investments(self, user_id: str, status: str = None, sort: str = "investment_date", limit: int = None) -> InvestmentListResponse:
        # Build query
        query = {"user_id": ObjectId(user_id)}
        if status:
            query["status"] = status
        
        # Build sort
        sort_field = sort if sort in ["investment_date", "amount_invested", "current_value"] else "investment_date"
        sort_order = -1  # Descending
        
        # Get total count
        total = await self.db.investments.count_documents(query)
        
        # Get investments
        cursor = self.db.investments.find(query).sort(sort_field, sort_order)
        if limit:
            cursor = cursor.limit(limit)
        
        investments = await cursor.to_list(length=None)
        
        # Format response
        investment_items = []
        for inv in investments:
            returns = inv["current_value"] - inv["amount_invested"]
            returns_percentage = (returns / inv["amount_invested"]) * 100 if inv["amount_invested"] > 0 else 0
            
            investment_items.append(InvestmentListItem(
                id=str(inv["_id"]),
                instrument_name=inv["instrument_name"],
                amount_invested=inv["amount_invested"],
                current_value=inv["current_value"],
                returns=returns,
                returns_percentage=round(returns_percentage, 2),
                status=inv["status"]
            ))
        
        return InvestmentListResponse(
            total=total,
            investments=investment_items
        )