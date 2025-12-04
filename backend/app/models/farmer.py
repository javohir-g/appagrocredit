from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base
import enum


class OwnershipType(str, enum.Enum):
    own = "own"
    rent = "rent"
    lease = "lease"
    other = "other"


class Farmer(Base):
    __tablename__ = "farmers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    full_name = Column(String, nullable=False)
    farming_experience = Column(Integer, nullable=True)  # years
    crop_type = Column(String, nullable=True)
    land_size = Column(Float, nullable=True)  # hectares
    location = Column(String, nullable=True)
    ownership = Column(Enum(OwnershipType), default=OwnershipType.own)
    soil_type = Column(String, nullable=True)
    income = Column(Float, nullable=True)  # monthly income
    expenses = Column(Float, nullable=True)  # monthly expenses
    existing_credit = Column(Float, default=0.0)  # total existing credit
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", backref="farmer_profile")
    credits = relationship("Credit", back_populates="farmer")
    cards = relationship("Card", back_populates="farmer")
    fields = relationship("Field", back_populates="farmer")
