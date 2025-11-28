import asyncio
from motor import motor_asyncio
from app.config.settings import settings

async def init_indexes():
    """Initialize all MongoDB indexes"""
    client = motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.DATABASE_NAME]
    
    # Users collection
    await db.users.create_index([("email", 1)], unique=True)
    await db.users.create_index([("phone", 1)], unique=True)
    await db.users.create_index([("created_at", 1)])
    
    # Transactions
    await db.transactions.create_index([("user_id", 1)])
    await db.transactions.create_index([("transaction_date", -1)])
    await db.transactions.create_index([("user_id", 1), ("transaction_date", -1)])
    
    # RoundUpRules
    await db.roundup_rules.create_index([("user_id", 1)], unique=True)
    
    # Investments
    await db.investments.create_index([("user_id", 1)])
    await db.investments.create_index([("investment_date", -1)])
    await db.investments.create_index([("status", 1)])
    
    # Education
    await db.education_modules.create_index([("module_id", 1)], unique=True)
    await db.education_modules.create_index([("order", 1)])
    
    # User Education Progress
    await db.user_education_progress.create_index([("user_id", 1)])
    await db.user_education_progress.create_index([("user_id", 1), ("module_id", 1)], unique=True)
    
    # Gamification
    await db.user_gamification.create_index([("user_id", 1)], unique=True)
    await db.user_gamification.create_index([("total_points", -1)])
    await db.user_gamification.create_index([("leaderboard_rank", 1)])
    
    # Portfolio Summary
    await db.portfolio_summary.create_index([("user_id", 1)], unique=True)
    
    # AI Recommendations
    await db.ai_recommendations.create_index([("user_id", 1)], unique=True)
    await db.ai_recommendations.create_index([("recommendation_date", -1)])
    
    # OTPs
    await db.otps.create_index([("phone", 1)])
    await db.otps.create_index([("expires_at", 1)], expireAfterSeconds=0)
    
    # Daily Rewards
    await db.daily_rewards.create_index([("user_id", 1)])
    await db.daily_rewards.create_index([("claim_date", 1)])
    
    print("✅ All MongoDB indexes created successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(init_indexes())