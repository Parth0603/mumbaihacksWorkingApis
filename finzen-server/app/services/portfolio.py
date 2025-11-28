from app.config.database import get_database
from bson import ObjectId

class PortfolioService:
    @staticmethod
    async def get_portfolio_summary(user_id: str):
        """Get portfolio summary"""
        db = get_database()
        
        # Get user investments
        investments = await db.investments.find({"user_id": ObjectId(user_id)}).to_list(None)
        
        total_invested = sum(inv.get("amount", 0) for inv in investments)
        total_current_value = total_invested * 1.05  # Mock 5% growth
        
        # Mock portfolio allocation
        allocation = [
            {"category": "Equity", "percentage": 60, "value": total_current_value * 0.6},
            {"category": "Debt", "percentage": 30, "value": total_current_value * 0.3},
            {"category": "Gold", "percentage": 10, "value": total_current_value * 0.1}
        ]
        
        return {
            "total_invested": total_invested,
            "total_current_value": total_current_value,
            "total_returns": total_current_value - total_invested,
            "returns_percentage": ((total_current_value - total_invested) / total_invested * 100) if total_invested > 0 else 0,
            "portfolio_allocation": allocation
        }
    
    @staticmethod
    async def get_performance_history(user_id: str):
        """Get portfolio performance history"""
        # Mock performance data
        return {
            "performance_data": [
                {"date": "2024-01-01", "value": 10000},
                {"date": "2024-02-01", "value": 10200},
                {"date": "2024-03-01", "value": 10500}
            ],
            "total_return": 5.0,
            "volatility": 12.5
        }