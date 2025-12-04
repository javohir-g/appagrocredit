from sqlalchemy import Column, Integer, String, Float, DateTime, Date
from datetime import datetime
from ..db import Base


class CropRecommendation(Base):
    __tablename__ = "crop_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    risk_frost = Column(Float, nullable=True)  # risk level 0-100
    risk_heatwave = Column(Float, nullable=True)  # risk level 0-100
    irrigation_recommendation = Column(String, nullable=True)
    fertilizer_recommendation = Column(String, nullable=True)
    pest_risk = Column(Float, nullable=True)  # risk level 0-100
    created_at = Column(DateTime, default=datetime.utcnow)
