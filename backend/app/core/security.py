from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .config import settings
from ..db import SessionLocal
from ..models.user import User, UserRole


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Mock user data
MOCK_FARMER_EMAIL = "farmer@example.com"
MOCK_BANK_EMAIL = "bank@example.com"

def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_password_hash(password: str) -> str:
    """Hash a password - simplified for demo"""
    # Avoid bcrypt issues on deployment
    return f"hashed_{password}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password - simplified for demo"""
    return hashed_password == f"hashed_{plain_password}"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a dummy token (kept for compatibility)"""
    return "dummy-token"


def get_current_user(
    x_role: Optional[str] = Header(None, alias="X-Role"),
    db: Session = Depends(get_db)
) -> User:
    """
    Simplified mock auth - no bcrypt to avoid deployment issues
    """
    # Default to farmer role
    role = UserRole.farmer
    email = MOCK_FARMER_EMAIL
    
    if x_role:
        try:
            role = UserRole(x_role.lower())
            email = MOCK_FARMER_EMAIL if role == UserRole.farmer else MOCK_BANK_EMAIL
        except ValueError:
            # Invalid role, use default
            pass

    # Check if mock user exists
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Create mock user without bcrypt
        user = User(
            email=email,
            hashed_password=get_password_hash("mock"),  # Simple hash
            role=role
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return user


def require_role(*roles: UserRole):
    """Dependency to require specific user roles"""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker
