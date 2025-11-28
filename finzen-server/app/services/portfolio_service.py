from motor import motor_asyncio
from app.config.settings import settings
from app.config.database import get_database
from app.models.portfolio import PortfolioSummaryResponse, AllocationValue, PortfolioPerformanceResponse, PerformanceDataPoint
from datetime import datetime, timedelta
from bson import ObjectId
from fastapi import HTTPException

class PortfolioService:
    # FIX: Don't create new MongoDB client in __init__; use get_database() from config
    # This prevents connection pooling issues and respects the app's connection lifecycle
    
    async def get_portfolio_summary(self, user_id: str) -> PortfolioSummaryResponse:
        db = get_database()
        # Check for cached summary
        cached_summary = await db.portfolio_summary.find_one({"user_id": ObjectId(user_id)})
        
        if cached_summary:
            return PortfolioSummaryResponse(
                total_invested=cached_summary["total_invested"],
                total_current_value=cached_summary["total_current_value"],
                total_returns=cached_summary["total_returns"],
                returns_percentage=cached_summary["returns_percentage"],
                portfolio_allocation={
                    k: AllocationValue(**v) for k, v in cached_summary["portfolio_allocation"].items()
                },
                monthly_invested_this_month=cached_summary["monthly_invested_this_month"],
                investment_goal=cached_summary["investment_goal"],
                months_to_goal=cached_summary["months_to_goal"],
                progress_percentage=round((cached_summary["total_invested"] / cached_summary["investment_goal"]) * 100, 2)
            )
        
        # Calculate summary from investments
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get all active investments
        investments = await db.investments.find({"user_id": ObjectId(user_id), "status": "active"}).to_list(length=None)
        
        total_invested = sum(inv["amount_invested"] for inv in investments)
        total_current_value = sum(inv["current_value"] for inv in investments)
        total_returns = total_current_value - total_invested
        returns_percentage = (total_returns / total_invested * 100) if total_invested > 0 else 0
        
        # Calculate allocation by investment type
        allocation = {}
        for inv in investments:
            inv_type = inv["investment_type"]
            if inv_type not in allocation:
                allocation[inv_type] = 0
            allocation[inv_type] += inv["current_value"]
        
        # Convert to percentage allocation
        portfolio_allocation = {}
        for inv_type, value in allocation.items():
            percentage = int((value / total_current_value * 100)) if total_current_value > 0 else 0
            portfolio_allocation[inv_type] = AllocationValue(percentage=percentage, value=value)
        
        # Calculate monthly investment (mock data)
        monthly_invested = 3200
        investment_goal = user.get("investment_goal", 50000)
        remaining = investment_goal - total_invested
        months_to_goal = remaining / monthly_invested if monthly_invested > 0 else 0
        progress_percentage = (total_invested / investment_goal * 100) if investment_goal > 0 else 0
        
        return PortfolioSummaryResponse(
            total_invested=total_invested,
            total_current_value=total_current_value,
            total_returns=total_returns,
            returns_percentage=round(returns_percentage, 2),
            portfolio_allocation=portfolio_allocation,
            monthly_invested_this_month=monthly_invested,
            investment_goal=investment_goal,
            months_to_goal=round(months_to_goal, 1),
            progress_percentage=round(progress_percentage, 2)
        )
    
    async def get_portfolio_performance(self, user_id: str, period: str = "1m") -> PortfolioPerformanceResponse:
        # Mock performance data based on period
        period_days = {
            "1m": 30,
            "3m": 90,
            "6m": 180,
            "1y": 365,
            "all": 730
        }
        
        days = period_days.get(period, 30)
        
        # Generate mock performance data
        data_points = []
        base_value = 15050
        
        for i in range(0, days, max(1, days // 10)):  # 10 data points max
            date = (datetime.utcnow() - timedelta(days=days-i)).strftime("%Y-%m-%d")
            # Mock growth with some volatility
            growth_factor = 1 + (i / days) * 0.05 + (i % 7 - 3) * 0.002
            portfolio_value = base_value * growth_factor
            returns = portfolio_value - base_value
            
            data_points.append(PerformanceDataPoint(
                date=date,
                portfolio_value=round(portfolio_value, 2),
                returns=round(returns, 2)
            ))
        
        return PortfolioPerformanceResponse(
            period=period,
            data=data_points,
            chart_url="https://api.finzen.com/charts/portfolio/performance"
        )