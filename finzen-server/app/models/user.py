from datetime import datetime
from bson import ObjectId
from typing import Optional
from pydantic import BaseModel, EmailStr

class User:
    def __init__(
        self,
        email: str,
        phone: str,
        password_hash: str,
        name: str,
        age: int,
        risk_profile: str,  # conservative, moderate, aggressive
        kyc_verified: bool = False,
        investment_goal: float = 0.0,
        total_invested: float = 0.0,
        created_at: Optional[datetime] = None,
        _id: Optional[ObjectId] = None
    ):
        self._id = _id or ObjectId()
        self.email = email
        self.phone = phone
        self.password_hash = password_hash
        self.name = name
        self.age = age
        self.risk_profile = risk_profile
        self.kyc_verified = kyc_verified
        self.investment_goal = investment_goal
        self.total_invested = total_invested
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        return {
            "_id": str(self._id),
            "email": self.email,
            "phone": self.phone,
            "name": self.name,
            "age": self.age,
            "risk_profile": self.risk_profile,
            "kyc_verified": self.kyc_verified,
            "investment_goal": self.investment_goal,
            "total_invested": self.total_invested,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

    @staticmethod
    def from_dict(data: dict):
        """Convert MongoDB document to User object"""
        data.pop('_id', None)
        return User(**data)

# Pydantic models for API
class UserSignupRequest(BaseModel):
    email: EmailStr
    phone: str
    password: str
    name: str
    age: int
    risk_profile: str

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class SendOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str

class OTPResponse(BaseModel):
    message: str
    expires_in: int

class VerifyOTPResponse(BaseModel):
    kyc_verified: bool
    message: str

class UserProfileResponse(BaseModel):
    id: str
    email: str
    name: str
    age: int
    risk_profile: str
    kyc_verified: bool
    investment_goal: float
    total_invested: float
    created_at: datetime

class UserInfo(BaseModel):
    id: str
    email: str
    name: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserInfo

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    risk_profile: str
    kyc_verified: bool
    created_at: datetime