from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Server Configuration
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    
    # Database Configuration
    MONGODB_URI: str = "mongodb+srv://finzen_admin:password@finzen-cluster.xxxxx.mongodb.net/finzen"
    DATABASE_NAME: str = "finzen"
    
    # JWT Configuration
    JWT_SECRET_KEY: str = "your_super_secret_key_change_in_production_immediately"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440
    
    # CORS Configuration
    FRONTEND_URL: str = "http://localhost:3000"
    
    # API Configuration
    API_PREFIX: str = "/api"
    
    # FIX: Pydantic v2 uses `model_config` for settings; keep env file configured
    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
    }

# Create singleton settings
settings = Settings()

# Validate on startup
if settings.JWT_SECRET_KEY == "your_super_secret_key_change_in_production_immediately":
    print("WARNING: Using default JWT_SECRET_KEY. Change in production!")

if not settings.MONGODB_URI.startswith("mongodb"):
    print("ERROR: Invalid MONGODB_URI in .env file")