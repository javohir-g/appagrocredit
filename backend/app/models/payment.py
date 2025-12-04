from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db import Base
import enum


class PaymentStatus(str, enum.Enum):
    paid = "paid"
    pending = "pending"
    failed = "failed"


class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    credit_id = Column(Integer, ForeignKey("credits.id"), nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.paid)
    method = Column(String, nullable=True)  # card, cash, etc.
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=True)
    
    # Relationships
    credit = relationship("Credit", back_populates="payments")
    card = relationship("Card", backref="payments")
