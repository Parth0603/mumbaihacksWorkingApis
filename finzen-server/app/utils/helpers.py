def round_up_transaction(amount: float, round_to: int = 100) -> float:
    """Round up transaction to nearest value"""
    import math
    return math.ceil(amount / round_to) * round_to

def calculate_investment_from_roundup(original: float, rounded: float) -> float:
    """Calculate investment amount from round-up"""
    return rounded - original

def format_currency(amount: float, currency: str = "INR") -> str:
    """Format amount as currency"""
    if currency == "INR":
        return f"₹{amount:,.2f}"
    return f"${amount:,.2f}"