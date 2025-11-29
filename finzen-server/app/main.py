from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config.settings import settings
from app.config.database import connect_to_mongo, close_mongo_connection

# Import routes
from app.routes import auth, investments, portfolio, education, gamification, ai

# Lifespan context for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("=" * 60)
    print("FinZen Backend Starting...")
    print("=" * 60)
    
    # Connect to MongoDB
    db_connected = await connect_to_mongo()
    if not db_connected:
        print("WARNING: Could not connect to MongoDB")
    
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"API Prefix: {settings.API_PREFIX}")
    print(f"Frontend URL: {settings.FRONTEND_URL}")
    print("=" * 60)
    
    yield
    
    # Shutdown
    print("\n" + "=" * 60)
    print("Shutting down FinZen Backend...")
    print("=" * 60)
    await close_mongo_connection()

# Create FastAPI app with lifespan
app = FastAPI(
    title="FinZen API",
    description="AI-powered micro-investment platform for beginners",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        settings.FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to FinZen API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "status": "ONLINE"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    from app.config.database import db, get_database
    
    db_status = "CONNECTED" if db is not None else "DISCONNECTED"
    
    # Try to ping database
    if db is not None:
        try:
            await db.command('ping')
            db_status = "CONNECTED"
        except:
            db_status = "ERROR"
    
    return {
        "status": "HEALTHY",
        "service": "FinZen Backend",
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "db_object": str(type(db)),
        "timestamp": str(__import__('datetime').datetime.utcnow())
    }

@app.get("/debug/db")
async def debug_db():
    """Debug database connection"""
    from app.config.database import db, client, get_database
    import inspect
    
    # Get the source of get_database function
    source = inspect.getsource(get_database)
    
    return {
        "db_is_none": db is None,
        "client_is_none": client is None,
        "db_type": str(type(db)),
        "get_database_source": source[:500]
    }

# Include all routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(investments.router, prefix="/api/investments", tags=["Investments"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(education.router, prefix="/api/education", tags=["Education"])
app.include_router(gamification.router, prefix="/api/gamification", tags=["Gamification"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True if settings.ENVIRONMENT == "development" else False
    )
 
