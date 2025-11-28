from pydantic import BaseModel
from typing import Dict

class AllocationValue(BaseModel):
    percentage: int
    value: float

class PortfolioSummaryResponse(BaseModel):
    total_invested: float
    total_current_value: float
    total_returns: float
    returns_percentage: float
    portfolio_allocation: Dict[str, AllocationValue]
    monthly_invested_this_month: float
    investment_goal: float
    months_to_goal: float
    progress_percentage: float

class PerformanceDataPoint(BaseModel):
    date: str
    portfolio_value: float
    returns: float

class PortfolioPerformanceResponse(BaseModel):
    period: str
    data: list[PerformanceDataPoint]
    chart_url: str