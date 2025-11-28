from motor import motor_asyncio
from app.config.settings import settings
from app.models.user import UserSignupRequest, UserResponse, UserLoginRequest, LoginResponse, UserInfo, SendOTPRequest, OTPResponse, VerifyOTPRequest, VerifyOTPResponse, UserProfileResponse
from datetime import datetime, timedelta
from bson import ObjectId
import bcrypt
import jwt
import random
from fastapi import HTTPException

class AuthService:
    def __init__(self):
        self.client = motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
        self.db = self.client[settings.DATABASE_NAME]
    
    async def signup_user(self, user_data: UserSignupRequest) -> UserResponse:
        # Check if email exists
        existing_user = await self.db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check if phone exists
        existing_phone = await self.db.users.find_one({"phone": user_data.phone})
        if existing_phone:
            raise HTTPException(status_code=400, detail="Phone already registered")
        
        # Hash password
        password_hash = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user document
        user_doc = {
            "email": user_data.email,
            "phone": user_data.phone,
            "password_hash": password_hash.decode('utf-8'),
            "name": user_data.name,
            "age": user_data.age,
            "risk_profile": user_data.risk_profile,
            "kyc_verified": False,
            "investment_goal": 0,
            "total_invested": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await self.db.users.insert_one(user_doc)
        
        return UserResponse(
            id=str(result.inserted_id),
            email=user_data.email,
            name=user_data.name,
            risk_profile=user_data.risk_profile,
            kyc_verified=False,
            created_at=user_doc["created_at"]
        )
    
    def create_access_token(self, user_id: str) -> str:
        payload = {
            "user_id": user_id,
            "exp": datetime.utcnow() + timedelta(days=7)
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    
    async def login_user(self, login_data: UserLoginRequest) -> LoginResponse:
        user = await self.db.users.find_one({"email": login_data.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not bcrypt.checkpw(login_data.password.encode('utf-8'), user["password_hash"].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        access_token = self.create_access_token(str(user["_id"]))
        
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserInfo(
                id=str(user["_id"]),
                email=user["email"],
                name=user["name"]
            )
        )
    
    async def send_otp(self, otp_data: SendOTPRequest) -> OTPResponse:
        # Generate 6-digit OTP
        otp = str(random.randint(100000, 999999))
        expires_at = datetime.utcnow() + timedelta(minutes=5)
        
        # Store OTP in database
        otp_doc = {
            "phone": otp_data.phone,
            "otp": otp,
            "expires_at": expires_at,
            "created_at": datetime.utcnow(),
            "verified": False
        }
        
        await self.db.otps.insert_one(otp_doc)
        
        print(f"OTP for {otp_data.phone}: {otp}")  # Debug only
        
        return OTPResponse(
            message=f"OTP sent to +91-{otp_data.phone}",
            expires_in=300
        )
    
    async def verify_otp(self, verify_data: VerifyOTPRequest) -> VerifyOTPResponse:
        # Find valid OTP
        otp_doc = await self.db.otps.find_one({
            "phone": verify_data.phone,
            "otp": verify_data.otp,
            "verified": False,
            "expires_at": {"$gt": datetime.utcnow()}
        })
        
        if not otp_doc:
            raise HTTPException(status_code=400, detail="Invalid OTP")
        
        # Mark OTP as verified
        await self.db.otps.update_one(
            {"_id": otp_doc["_id"]},
            {"$set": {"verified": True}}
        )
        
        # Update user KYC status
        await self.db.users.update_one(
            {"phone": verify_data.phone},
            {"$set": {"kyc_verified": True, "updated_at": datetime.utcnow()}}
        )
        
        return VerifyOTPResponse(
            kyc_verified=True,
            message="Phone verified successfully"
        )
    
    async def get_user_profile(self, user_id: str) -> UserProfileResponse:
        user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserProfileResponse(
            id=str(user["_id"]),
            email=user["email"],
            name=user["name"],
            age=user["age"],
            risk_profile=user["risk_profile"],
            kyc_verified=user["kyc_verified"],
            investment_goal=user["investment_goal"],
            total_invested=user["total_invested"],
            created_at=user["created_at"]
        )