from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..db import Base


class FieldStatus(str, enum.Enum):
    healthy = "healthy"
    warning = "warning"
    risk = "risk"


class Field(Base):
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    name = Column(String(100), nullable=False)
    crop_type = Column(String(100))
    size_hectares = Column(Float, nullable=False)
    location_description = Column(String(255))
    coordinates = Column(Text)  # Store as JSON string for polygon coordinates
    soil_type = Column(String(100))
    health_score = Column(Integer, default=0)  # 0-100 score
    status = Column(SQLEnum(FieldStatus), default=FieldStatus.healthy)
    ndvi_value = Column(Float)  # Normalized Difference Vegetation Index
    ai_recommendation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    farmer = relationship("Farmer", back_populates="fields")
