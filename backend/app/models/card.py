from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base


class Card(Base):
    __tablename__ = "cards"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    card_number = Column(String, nullable=False)  # last 4 digits or masked
    card_holder = Column(String, nullable=False)
    card_type = Column(String, nullable=True)  # Visa, MasterCard, etc.
    balance = Column(Float, default=0.0)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    farmer = relationship("Farmer", back_populates="cards")
