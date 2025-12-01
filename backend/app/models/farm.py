from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base


class Farm(Base):
    __tablename__ = "farms"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    crop_type = Column(String, nullable=False)
    acreage = Column(Float, nullable=False)
    geometry = Column(JSON, nullable=False)  # GeoJSON polygon
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    scores = relationship("Score", back_populates="farm")
