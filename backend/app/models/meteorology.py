from sqlalchemy import Column, Integer, String, Float, DateTime, Date
from datetime import datetime
from ..db import Base


class Meteorology(Base):
    __tablename__ = "meteorology"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    temperature = Column(Float, nullable=True)  # celsius
    humidity = Column(Float, nullable=True)  # percentage
    wind_speed = Column(Float, nullable=True)  # km/h
    precipitation = Column(Float, nullable=True)  # mm
    pressure = Column(Float, nullable=True)  # hPa
    description = Column(String, nullable=True)  # weather description
    location = Column(String, nullable=True)  # region/location
    created_at = Column(DateTime, default=datetime.utcnow)
