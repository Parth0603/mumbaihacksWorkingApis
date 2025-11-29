from bson import ObjectId
from datetime import datetime
from app.config.database import get_database
from typing import List, Dict, Optional


class TransactionService:
    """Service for transaction/investment history"""

    @staticmethod
    async def get_user_transactions(
        user_id: str, transaction_type: Optional[str] = None, limit: int = 50, skip: int = 0
    ) -> List[Dict]:
        """Get user's transaction history"""
        db = get_database()
        query = {"user_id": ObjectId(user_id)}
        if transaction_type:
            query["type"] = transaction_type
        transactions = (
            await db.transactions.find(query)
            .sort("transaction_date", -1)
            .skip(skip)
            .limit(limit)
            .to_list(None)
        )
        for tx in transactions:
            tx["_id"] = str(tx["_id"])
            tx["user_id"] = str(tx["user_id"])
        return transactions

    @staticmethod
    async def record_transaction(
        user_id: str,
        transaction_type: str,  # investment, round_up, transfer
        amount: float,
        description: str,
        metadata: Optional[Dict] = None,
    ) -> Dict:
        """Record a transaction"""
        db = get_database()
        tx_doc = {
            "user_id": ObjectId(user_id),
            "type": transaction_type,
            "amount": amount,
            "description": description,
            "metadata": metadata or {},
            "transaction_date": datetime.utcnow(),
            "status": "completed",
            "created_at": datetime.utcnow(),
        }
        result = await db.transactions.insert_one(tx_doc)
        return {"_id": str(result.inserted_id), "status": "recorded", "amount": amount}

    @staticmethod
    async def get_transaction_summary(user_id: str) -> Dict:
        """Get transaction summary for period"""
        db = get_database()
        transactions = await db.transactions.find({"user_id": ObjectId(user_id)}).to_list(None)
        if not transactions:
            return {
                "total_transactions": 0,
                "total_invested": 0,
                "total_round_ups": 0,
                "average_transaction": 0,
            }
        total_invested = sum(tx["amount"] for tx in transactions if tx["type"] == "investment")
        total_round_ups = sum(tx["amount"] for tx in transactions if tx["type"] == "round_up")
        average = (total_invested + total_round_ups) / len(transactions) if transactions else 0
        return {
            "total_transactions": len(transactions),
            "total_invested": round(total_invested, 2),
            "total_round_ups": round(total_round_ups, 2),
            "average_transaction": round(average, 2),
            "last_transaction": transactions[0].get("transaction_date") if transactions else None,
        }
