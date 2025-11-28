from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=10)
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2)
    age: int = Field(..., ge=18, le=100)
    risk_profile: str = Field(..., pattern="^(conservative|moderate|aggressive)$")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    age: int
    risk_profile: str
    kyc_verified: bool
    investment_goal: float
    total_invested: float
    created_at: datetime
    
    # FIX: Use pydantic v2 model_config to allow parsing from attributes
    model_config = {
        "from_attributes": True
    }

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class OTPRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=10)

class OTPVerify(BaseModel):
    phone: str
    otp: str

class OTPResponse(BaseModel):
    message: str
    expires_in: int

class VerifyOTPResponse(BaseModel):
    kyc_verified: bool
    message: str