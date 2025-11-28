from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional
from bson import ObjectId
from datetime import datetime
from app.config.database import get_database
from app.utils.dependencies import get_current_user
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/", status_code=status.HTTP_200_OK)
async def get_investments(
    user_id: str = Depends(get_current_user),
    status_filter: Optional[str] = None
):
    """Get user investments"""
    db = get_database()
    
    try:
        query = {"user_id": ObjectId(user_id)}
        if status_filter:
            query["status"] = status_filter
        
        investments = await db.investments.find(query).sort("investment_date", -1).limit(10).to_list(None)
        
        # Convert ObjectIds to strings
        for inv in investments:
            inv["_id"] = str(inv["_id"])
            inv["user_id"] = str(inv["user_id"])
        
        return {"total": len(investments), "investments": investments}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching investments: {str(e)}"
        )

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_investment(
    investment_data: dict,
    user_id: str = Depends(get_current_user)
):
    """Create new investment"""
    db = get_database()
    
    try:
        investment = {
            "user_id": ObjectId(user_id),
            "investment_type": investment_data.get("investment_type"),
            "instrument_name": investment_data.get("instrument_name"),
            "amount_invested": float(investment_data.get("amount_invested", 0)),
            "current_value": float(investment_data.get("amount_invested", 0)),
            "quantity": int(investment_data.get("quantity", 100)),
            "entry_price": float(investment_data.get("entry_price", 0)),
            "current_price": float(investment_data.get("entry_price", 0)),
            "investment_date": datetime.utcnow(),
            "source": investment_data.get("source", "manual"),
            "status": "active",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.investments.insert_one(investment)
        
        # Update user's total_invested
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"total_invested": investment["amount_invested"]}}
        )
        
        investment["_id"] = str(result.inserted_id)
        investment["user_id"] = str(investment["user_id"])
        
        return {"status": "created", "investment": investment}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating investment: {str(e)}"
        )

@router.post("/roundup-rules", status_code=status.HTTP_201_CREATED)
async def set_roundup_rules(
    rules_data: dict,
    user_id: str = Depends(get_current_user)
):
    """Set round-up rules"""
    db = get_database()
    
    try:
        rules = {
            "user_id": ObjectId(user_id),
            "is_active": True,
            "round_up_to": int(rules_data.get("round_up_to", 100)),
            "frequency": rules_data.get("frequency", "per_transaction"),
            "monthly_cap": float(rules_data.get("monthly_cap", 5000)),
            "auto_invest": bool(rules_data.get("auto_invest", True)),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.roundup_rules.update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": rules},
            upsert=True
        )
        
        rules["_id"] = str(result.upserted_id or ObjectId())
        rules["user_id"] = str(rules["user_id"])
        
        return {"status": "created", "rules": rules}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error setting rules: {str(e)}"
        )

@router.get("/roundup-rules", status_code=status.HTTP_200_OK)
async def get_roundup_rules(user_id: str = Depends(get_current_user)):
    """Get round-up rules"""
    db = get_database()
    
    try:
        rules = await db.roundup_rules.find_one({"user_id": ObjectId(user_id)})
        if rules:
            rules["_id"] = str(rules["_id"])
            rules["user_id"] = str(rules["user_id"])
            return rules
        return {}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching rules: {str(e)}"
        )