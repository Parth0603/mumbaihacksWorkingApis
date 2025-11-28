from fastapi import APIRouter, HTTPException, status, Depends
from app.utils.dependencies import get_current_user
from app.services.portfolio import PortfolioService

router = APIRouter()

@router.get("/summary", status_code=status.HTTP_200_OK)
async def get_portfolio_summary(user_id: str = Depends(get_current_user)):
    """Get portfolio summary"""
    try:
        summary = await PortfolioService.get_portfolio_summary(user_id)
        return summary
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching portfolio: {str(e)}"
        )

@router.get("/performance", status_code=status.HTTP_200_OK)
async def get_portfolio_performance(
    user_id: str = Depends(get_current_user),
    period: str = "1m"
):
    """Get portfolio performance"""
    return {
        "period": period,
        "data": [
            {"date": "2025-11-29", "portfolio_value": 15540, "returns": 490},
            {"date": "2025-11-28", "portfolio_value": 15400, "returns": 350},
            {"date": "2025-11-27", "portfolio_value": 15300, "returns": 250}
        ]
    }