from pydantic import BaseModel
from typing import List, Dict

class AllocationItem(BaseModel):
    percentage: int
    amount: int

class AIRecommendationResponse(BaseModel):
    monthly_target: int
    via_round_ups: int
    manual_investment: int
    portfolio_allocation: Dict[str, AllocationItem]
    suggested_instruments: List[str]
    rationale: str

class RoundUpRulesRequest(BaseModel):
    round_up_to: int
    frequency: str
    monthly_cap: int
    auto_invest: bool

class RoundUpRulesResponse(BaseModel):
    id: str
    is_active: bool
    round_up_to: int
    frequency: str
    monthly_cap: int
    auto_invest: bool

class CreateInvestmentRequest(BaseModel):
    investment_type: str
    instrument_name: str
    amount_invested: float
    quantity: int
    entry_price: float
    source: str

class InvestmentResponse(BaseModel):
    id: str
    investment_type: str
    instrument_name: str
    amount_invested: float
    current_value: float
    status: str
    investment_date: str

class InvestmentListItem(BaseModel):
    id: str
    instrument_name: str
    amount_invested: float
    current_value: float
    returns: float
    returns_percentage: float
    status: str

class InvestmentListResponse(BaseModel):
    total: int
    investments: List[InvestmentListItem]