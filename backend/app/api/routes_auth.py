from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from ..core.security import get_db, get_password_hash, verify_password, create_access_token
from ..models.user import User, UserRole


router = APIRouter(prefix="/auth", tags=["authentication"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user (farmer or bank officer)"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        role=data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Generate access token
    access_token = create_access_token(data={"sub": user.id})
    
    return TokenResponse(access_token=access_token, role=user.role)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password"""
    # Find user
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Generate access token
    access_token = create_access_token(data={"sub": user.id})
    
    return TokenResponse(access_token=access_token, role=user.role)
