from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base
import enum


class CreditStatus(str, enum.Enum):
    active = "active"
    paid = "paid"
    overdue = "overdue"
    pending = "pending"


class Credit(Base):
    __tablename__ = "credits"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    amount = Column(Float, nullable=False)  # total amount
    remaining = Column(Float, nullable=False)  # remaining amount
    rate = Column(Float, nullable=False)  # interest rate %
    term_months = Column(Integer, nullable=False)  # credit term in months
    due_date = Column(DateTime, nullable=False)
    status = Column(Enum(CreditStatus), default=CreditStatus.active)
    paid = Column(Float, default=0.0)  # total paid amount
    progress = Column(Float, default=0.0)  # payment progress %
    next_payment = Column(Float, nullable=True)  # next payment amount
    next_payment_date = Column(DateTime, nullable=True)
    purpose = Column(String, nullable=True)  # reason for credit
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    farmer = relationship("Farmer", back_populates="credits")
    payments = relationship("Payment", back_populates="credit")
