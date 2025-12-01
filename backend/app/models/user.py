from sqlalchemy import Column, Integer, String, Enum
from ..db import Base
import enum


class UserRole(str, enum.Enum):
    farmer = "farmer"
    bank_officer = "bank_officer"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
