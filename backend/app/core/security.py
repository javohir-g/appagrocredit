from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .config import settings
from ..db import SessionLocal
from ..models.user import User, UserRole


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


from fastapi import Header
from ..models.user import User, UserRole

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
    """Hash a password (kept for compatibility)"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password (kept for compatibility)"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a dummy token (kept for compatibility)"""
    return "dummy-token"


def get_current_user(
    x_role: Optional[str] = Header(None, alias="X-Role"),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current user based on X-Role header for v1.0 (No Auth).
    Creates a default user for the role if it doesn't exist.
    """
    if not x_role:
        # Default to farmer if no header
        role = UserRole.farmer
        email = MOCK_FARMER_EMAIL
    else:


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
