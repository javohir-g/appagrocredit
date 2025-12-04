from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..core.security import get_db, require_role, get_current_user
from ..models import User, UserRole, Farmer, Credit, CreditStatus, Card, Payment, PaymentStatus, Field, FieldStatus

router = APIRouter(prefix="/farmer", tags=["farmer-extended"])


# Pydantic models
class CreditOut(BaseModel):
    id: int
    amount: float
    remaining: float
    rate: float
    term_months: int
    due_date: datetime
    status: str
    paid: float
    progress: float
    next_payment: Optional[float]
    next_payment_date: Optional[datetime]
    purpose: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class CardOut(BaseModel):
    id: int
    card_number: str
    card_holder: str
    card_type: Optional[str]
    balance: float
    is_primary: bool

    class Config:
        from_attributes = True


class FarmerProfileOut(BaseModel):
    id: int
    full_name: str
    farming_experience: Optional[int]
    crop_type: Optional[str]
    land_size: Optional[float]
    location: Optional[str]
    ownership: str
    soil_type: Optional[str]
    income: Optional[float]
    expenses: Optional[float]
    existing_credit: float
    cards: List[CardOut]

    class Config:
        from_attributes = True


class PaymentCreate(BaseModel):
    card_id: int
    amount: float


class PaymentOut(BaseModel):
    id: int
    amount: float
    date: datetime
    status: str
    method: Optional[str]

    class Config:
        from_attributes = True


# Endpoints
@router.get("/profile", response_model=FarmerProfileOut)
def get_farmer_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer))
):
    """Get farmer profile with cards"""
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )
    
    return farmer


@router.get("/credits", response_model=List[CreditOut])
def get_farmer_credits(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer))
):
    """Get all credits for current farmer"""
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )
    
    credits = db.query(Credit).filter(Credit.farmer_id == farmer.id).all()
    return credits


@router.get("/credits/{credit_id}", response_model=CreditOut)
def get_credit_details(
    credit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer))
):
    """Get detailed information about a specific credit"""
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )
    
    credit = db.query(Credit).filter(
        Credit.id == credit_id,
        Credit.farmer_id == farmer.id
    ).first()
    
    if not credit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credit not found"
        )
    
    return credit


@router.post("/credits/{credit_id}/payment", response_model=PaymentOut)
def make_payment(
    credit_id: int,
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer))
):
    """Make a payment for a credit"""
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )
    
    # Get credit
    credit = db.query(Credit).filter(
        Credit.id == credit_id,
        Credit.farmer_id == farmer.id
    ).first()
    
    if not credit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credit not found"
        )
    
    # Get card
    card = db.query(Card).filter(
        Card.id == payment_data.card_id,
        Card.farmer_id == farmer.id
    ).first()
    
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )
    
    # Check if card has sufficient balance
    if card.balance < payment_data.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient funds on card"
        )
    
    # Create payment
    payment = Payment(
        credit_id=credit_id,
        amount=payment_data.amount,
        status=PaymentStatus.paid,
        method=f"{card.card_type} {card.card_number}",
        card_id=card.id
    )
    db.add(payment)
    
    # Update credit
    credit.remaining -= payment_data.amount
    credit.paid += payment_data.amount
    credit.progress = (credit.paid / credit.amount) * 100
    
    if credit.remaining <= 0:
        credit.status = CreditStatus.paid
        credit.remaining = 0
    
    # Update card balance
    card.balance -= payment_data.amount
    
    # Update farmer's existing credit
    farmer.existing_credit -= payment_data.amount
    
    db.commit()
    db.refresh(payment)
    
    return payment


@router.get("/credits/{credit_id}/payments", response_model=List[PaymentOut])
def get_credit_payments(
    credit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer))
):
    """Get payment history for a credit"""
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )
    
    credit = db.query(Credit).filter(
        Credit.id == credit_id,
        Credit.farmer_id == farmer.id
    ).first()
    
    if not credit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credit not found"
        )
    
    payments = db.query(Payment).filter(Payment.credit_id == credit_id).all()
    return payments


# Field endpoints
class FieldOut(BaseModel):
    id: int
    name: str
    crop_type: Optional[str]
    size_hectares: float
    location_description: Optional[str]
    coordinates: Optional[str]
    soil_type: Optional[str]
    health_score: int
    status: str
    ndvi_value: Optional[float]
    ai_recommendation: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("/fields", response_model=List[FieldOut])
def get_farmer_fields(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer))
):
    """Get all fields for current farmer"""
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )
    
    fields = db.query(Field).filter(Field.farmer_id == farmer.id).all()
    return fields


@router.get("/fields/{field_id}", response_model=FieldOut)
def get_field_details(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer))
):
    """Get detailed information about a specific field"""
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )
    
    field = db.query(Field).filter(
        Field.id == field_id,
        Field.farmer_id == farmer.id
    ).first()
    
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field not found"
        )
    
    return field


class AIRecommendationResponse(BaseModel):
    recommendation: str
    confidence: float
    actions: List[str]


@router.post("/fields/{field_id}/ai-recommendation", response_model=AIRecommendationResponse)
def get_ai_recommendation(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer))
):
    """Get AI recommendation for a specific field"""
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )
    
    field = db.query(Field).filter(
        Field.id == field_id,
        Field.farmer_id == farmer.id
    ).first()
    
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field not found"
        )
    
    # Generate AI recommendation based on field health and status
    if field.health_score >= 85:
        recommendation = f"Поле {field.name} в отличном состоянии. Продолжайте текущий режим ухода за культурой {field.crop_type}."
        actions = ["Поддерживать текущий график полива", "Мониторить состояние каждые 3-5 дней"]
    elif field.health_score >= 70:
        recommendation = f"Поле {field.name} в хорошем состоянии, но требует внимания. Рекомендуется профилактический уход."
        actions = ["Проверить уровень влажности почвы", "Рассмотреть внесение удобрений", "Увеличить частоту мониторинга"]
    else:
        recommendation = f"Поле {field.name} требует срочного вмешательства. Обнаружены признаки стресса растений."
        actions = ["Немедленно проверить систему полива", "Провести анализ почвы", "Рассмотреть обработку от вредителей", "Консультация с агрономом"]
    
    # Update field with new recommendation
    field.ai_recommendation = recommendation
    field.updated_at = datetime.utcnow()
    db.commit()
    
    return AIRecommendationResponse(
        recommendation=recommendation,
        confidence=0.85,
        actions=actions
    )

