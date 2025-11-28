from fastapi import APIRouter, HTTPException, status, Depends
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from bson import ObjectId
from app.config.settings import settings
from app.config.database import get_database
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, OTPRequest, OTPVerify
from app.utils.dependencies import get_current_user
import random

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mock OTP storage (use Redis in production)
otp_storage = {}



def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user_id: str, email: str) -> str:
    """Create JWT token"""
    to_encode = {
        "sub": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    }
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    """Register a new user"""
    try:
        db = get_database()
        
        # Check if email exists
        existing_email = await db.users.find_one({"email": user_data.email})
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if phone exists
        existing_phone = await db.users.find_one({"phone": user_data.phone})
        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered"
            )
        
        # Create user document
        user_doc = {
            "email": user_data.email,
            "phone": user_data.phone,
            "password_hash": hash_password(user_data.password),
            "name": user_data.name,
            "age": user_data.age,
            "risk_profile": user_data.risk_profile,
            "kyc_verified": False,
            "investment_goal": 0.0,
            "total_invested": 0.0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert into database
        result = await db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        # Create token
        token = create_access_token(user_id, user_data.email)
        
        # Prepare response
        user_response = UserResponse(
            id=user_id,
            email=user_data.email,
            name=user_data.name,
            age=user_data.age,
            risk_profile=user_data.risk_profile,
            kyc_verified=False,
            investment_goal=0.0,
            total_invested=0.0,
            created_at=user_doc["created_at"]
        )
        
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signup failed: {str(e)}"
        )
    


@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login(credentials: UserLogin):
    """Login user and return JWT token"""
    db = get_database()
    
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create token
    token = create_access_token(str(user["_id"]), user["email"])
    
    # Prepare response
    user_response = UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        age=user["age"],
        risk_profile=user["risk_profile"],
        kyc_verified=user.get("kyc_verified", False),
        investment_goal=user.get("investment_goal", 0.0),
        total_invested=user.get("total_invested", 0.0),
        created_at=user["created_at"]
    )
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user_response
    )

@router.post("/send-otp", status_code=status.HTTP_200_OK)
async def send_otp(phone_request: OTPRequest):
    """Send OTP to phone number"""
    phone = phone_request.phone
    
    # Generate mock OTP
    otp = str(random.randint(100000, 999999))
    
    # Store OTP with expiry
    otp_storage[phone] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=5)
    }
    
    # Log OTP (for demo)
    print(f"[OTP] Phone: {phone}, Code: {otp} (expires in 5 minutes)")
    
    return {
        "message": f"OTP sent to +91-{phone}",
        "expires_in": 300,
        "otp": otp  # Return for testing only, remove in production
    }

@router.post("/verify-otp", status_code=status.HTTP_200_OK)
async def verify_otp(otp_data: OTPVerify):
    """Verify OTP"""
    db = get_database()
    phone = otp_data.phone
    otp = otp_data.otp
    
    # Check if OTP exists
    if phone not in otp_storage:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP not requested for this phone"
        )
    
    stored_otp = otp_storage[phone]
    
    # Check expiry
    if datetime.utcnow() > stored_otp["expires_at"]:
        del otp_storage[phone]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired"
        )
    
    # Check OTP match
    if stored_otp["otp"] != otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )
    
    # Update user KYC status
    result = await db.users.update_one(
        {"phone": phone},
        {"$set": {"kyc_verified": True, "updated_at": datetime.utcnow()}}
    )
    
    # Clean up OTP
    del otp_storage[phone]
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "kyc_verified": True,
        "message": "Phone verified successfully"
    }

@router.get("/profile", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_profile(user_id: str = Depends(get_current_user)):
    """Get current user profile"""
    db = get_database()
    
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            name=user["name"],
            age=user["age"],
            risk_profile=user["risk_profile"],
            kyc_verified=user.get("kyc_verified", False),
            investment_goal=user.get("investment_goal", 0.0),
            total_invested=user.get("total_invested", 0.0),
            created_at=user["created_at"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching profile: {str(e)}"
        )