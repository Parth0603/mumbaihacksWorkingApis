import motor.motor_asyncio
from app.config.settings import settings
from typing import Optional
from fastapi import HTTPException

# Global database client
client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
db: Optional[motor.motor_asyncio.AsyncIOMotorDatabase] = None

async def connect_to_mongo():
    """Connect to MongoDB on app startup"""
    global client, db
    try:
        # FIX: Don't require successful ping; DB connection issues should not prevent startup.
        # Routes will return 503 if DB is unavailable.
        client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
        db = client[settings.DATABASE_NAME]
        
        # Test connection (non-blocking attempt)
        try:
            await client.admin.command('ping')
            print("[OK] Connected to MongoDB successfully!")
            print(f"     Database: {settings.DATABASE_NAME}")
            print(f"     URI: {settings.MONGODB_URI[:50]}...")
            return True
        except Exception as ping_error:
            print(f"[WARN] MongoDB connection check failed: {ping_error}")
            print("       App will continue, but routes requiring DB will return 503.")
            return False
            
    except Exception as e:
        print(f"[ERROR] Failed to initialize MongoDB client: {e}")
        print("        App will continue; routes requiring DB will return 503.")
        return False

async def close_mongo_connection():
    """Close MongoDB connection on app shutdown"""
    global client, db
    if client is not None:
        client.close()
        print("[OK] Closed MongoDB connection")

def get_database():
    """Get database instance (dependency injection)"""
    if db is None:
        raise HTTPException(
            status_code=503, 
            detail="Database not initialized. Please ensure MongoDB is running on localhost:27017 or update MONGODB_URI in .env file."
        )
    return db