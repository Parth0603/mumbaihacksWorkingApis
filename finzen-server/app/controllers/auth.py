from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config.settings import settings
from app.config.database import get_database
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, OTPRequest, OTPVerify
from bson import ObjectId

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mock OTP storage (in production, use Redis)
otp_storage = {}

class AuthController:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def create_access_token(user_id: str, email: str) -> str:
        """Create JWT token"""
        to_encode = {
            "sub": user_id,
            "email": email,
            "exp": datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
        }
        encoded_jwt = jwt.encode(
            to_encode,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )
        return encoded_jwt
    
    @staticmethod
    async def signup(user_data: UserCreate) -> dict:
        """Create new user"""
        db = get_database()
        
        # Check if user exists
        existing = await db.users.find_one({"email": user_data.email})
        if existing:
            return {"error": "Email already registered", "status": 400}
        
        # Create user
        hashed_password = AuthController.hash_password(user_data.password)
        user = User(
            email=user_data.email,
            phone=user_data.phone,
            password_hash=hashed_password,
            name=user_data.name,
            age=user_data.age,
            risk_profile=user_data.risk_profile
        )
        
        # Save to DB
        result = await db.users.insert_one(user.to_dict())
        user._id = result.inserted_id
        
        # Create token
        token = AuthController.create_access_token(str(user._id), user.email)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": UserResponse(**user.to_dict()),
            "status": 201
        }
    
    @staticmethod
    async def login(credentials: UserLogin) -> dict:
        """Login user"""
        db = get_database()
        
        # Find user
        user_doc = await db.users.find_one({"email": credentials.email})
        if not user_doc:
            return {"error": "Invalid email or password", "status": 401}
        
        # Verify password
        if not AuthController.verify_password(credentials.password, user_doc["password_hash"]):
            return {"error": "Invalid email or password", "status": 401}
        
        # Create token
        token = AuthController.create_access_token(
            str(user_doc["_id"]),
            user_doc["email"]
        )
        
        user_dict = user_doc.copy()
        user_dict["id"] = str(user_dict.pop("_id"))
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": UserResponse(**user_dict),
            "status": 200
        }
    
    @staticmethod
    async def send_otp(phone_request: OTPRequest) -> dict:
        """Send OTP (mock)"""
        phone = phone_request.phone
        
        # Generate mock OTP
        import random
        otp = str(random.randint(100000, 999999))
        
        # Store OTP (in production use Redis with expiry)
        otp_storage[phone] = {
            "otp": otp,
            "expires_at": datetime.utcnow() + timedelta(minutes=5)
        }
        
        print(f"🔐 OTP for {phone}: {otp}")  # Log for demo
        
        return {
            "message": f"OTP sent to +91-{phone}",
            "expires_in": 300,
            "status": 200
        }
    
    @staticmethod
    async def verify_otp(otp_data: OTPVerify) -> dict:
        """Verify OTP"""
        phone = otp_data.phone
        otp = otp_data.otp
        
        # Check OTP
        if phone not in otp_storage:
            return {"error": "OTP not requested", "status": 400}
        
        stored_otp = otp_storage[phone]
        
        # Check expiry
        if datetime.utcnow() > stored_otp["expires_at"]:
            del otp_storage[phone]
            return {"error": "OTP expired", "status": 400}
        
        # Check OTP match
        if stored_otp["otp"] != otp:
            return {"error": "Invalid OTP", "status": 400}
        
        # Update user KYC status
        db = get_database()
        await db.users.update_one(
            {"phone": phone},
            {"$set": {"kyc_verified": True, "updated_at": datetime.utcnow()}}
        )
        
        # Clean up OTP
        del otp_storage[phone]
        
        return {
            "kyc_verified": True,
            "message": "Phone verified successfully",
            "status": 200
        }
    
    @staticmethod
    async def get_profile(user_id: str) -> dict:
        """Get user profile"""
        db = get_database()
        
        try:
            user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
            if not user_doc:
                return {"error": "User not found", "status": 404}
            
            user_dict = user_doc.copy()
            user_dict["id"] = str(user_dict.pop("_id"))
            
            return {"user": UserResponse(**user_dict), "status": 200}
        except Exception as e:
            return {"error": str(e), "status": 500}