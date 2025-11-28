import asyncio
import motor.motor_asyncio
from app.config.settings import settings

async def test_connection():
    print(f"Testing MongoDB connection...")
    print(f"URI: {settings.MONGODB_URI}")
    print(f"Database: {settings.DATABASE_NAME}")
    
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
        db = client[settings.DATABASE_NAME]
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Test database operations
        result = await db.test_collection.insert_one({"test": "data"})
        print(f"✅ Insert test successful: {result.inserted_id}")
        
        # Clean up
        await db.test_collection.delete_one({"_id": result.inserted_id})
        print("✅ Cleanup successful")
        
        client.close()
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())