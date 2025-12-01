from sqlalchemy import Column, Integer, ForeignKey, Float, String, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base


class Score(Base):
    __tablename__ = "scores"
    
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    numeric_score = Column(Float, nullable=False)
    risk_category = Column(String, nullable=False)  # Low, Medium, High
    factors = Column(JSON, nullable=False)  # Explanation factors
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    farm = relationship("Farm", back_populates="scores")
