import motor.motor_asyncio
from app.config.settings import settings
from typing import Optional
from fastapi import HTTPException
import asyncio

# Global database client
client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
db: Optional[motor.motor_asyncio.AsyncIOMotorDatabase] = None

async def connect_to_mongo():
    """Connect to MongoDB Atlas on app startup"""
    global client, db
    
    try:
        print(f"[INFO] Connecting to MongoDB Atlas...")
        print(f"       URI: {settings.MONGODB_URI[:60]}...")
        
        # Initialize MongoDB client for Atlas
        client = motor.motor_asyncio.AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=20000,
            socketTimeoutMS=20000,
            retryWrites=True,
            w='majority'
        )
        db = client[settings.DATABASE_NAME]
        
        # Test connection
        await client.admin.command('ping')
        print("[OK] ✅ Connected to MongoDB Atlas successfully!")
        print(f"     Database: {settings.DATABASE_NAME}")
        
        # List collections
        collections = await db.list_collection_names()
        print(f"     Collections: {collections if collections else 'No collections yet'}")
        return True
            
    except Exception as e:
        print(f"[ERROR] ❌ MongoDB connection failed: {e}")
        # Still set db for lazy connection
        if client:
            db = client[settings.DATABASE_NAME]
        return False

async def close_mongo_connection():
    """Close MongoDB connection on app shutdown"""
    global client, db
    if client is not None:
        client.close()
        print("[OK] Closed MongoDB connection")

def get_database():
    """Get database instance - ALWAYS returns a valid database object"""
    global client, db
    
    # If db exists, return it
    if db is not None:
        return db
    
    # Otherwise, initialize it now
    print("[INFO] Initializing database connection on demand...")
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=20000,
            socketTimeoutMS=20000,
            retryWrites=True,
            w='majority'
        )
        db = client[settings.DATABASE_NAME]
        print("[OK] ✅ Database initialized successfully")
        return db
    except Exception as e:
        print(f"[ERROR] ❌ Database initialization failed: {e}")
        raise HTTPException(
            status_code=503, 
            detail=f"Cannot connect to MongoDB Atlas. Error: {str(e)}"
        )
