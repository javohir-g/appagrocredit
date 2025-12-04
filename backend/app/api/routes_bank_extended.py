from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from ..core.security import get_db, require_role
from ..models import User, UserRole, Credit, Farmer, CreditStatus

router = APIRouter(prefix="/bank", tags=["bank-extended"])


class DashboardStats(BaseModel):
    total_credits: int
    total_amount_disbursed: float
    total_outstanding: float
    total_paid: float
    active_credits: int
    overdue_credits: int
    risk_distribution: Dict[str, int]
    monthly_disbursement: float


@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.bank_officer))
):
    """Get statistics for bank dashboard"""
    
    # Total credits
    total_credits = db.query(func.count(Credit.id)).scalar()
    
    # Total amount disbursed
    total_amount = db.query(func.sum(Credit.amount)).scalar() or 0
    
    # Total outstanding
    total_outstanding = db.query(func.sum(Credit.remaining)).scalar() or 0
    
    # Total paid
    total_paid = db.query(func.sum(Credit.paid)).scalar() or 0
    
    # Active credits
    active_credits = db.query(func.count(Credit.id)).filter(
        Credit.status == CreditStatus.active
    ).scalar()
    
    # Overdue credits
    overdue_credits = db.query(func.count(Credit.id)).filter(
        Credit.status == CreditStatus.overdue
    ).scalar()
    
    # Risk distribution (based on progress)
    low_risk = db.query(func.count(Credit.id)).filter(Credit.progress >= 70).scalar() or 0
    medium_risk = db.query(func.count(Credit.id)).filter(
        Credit.progress >= 30, Credit.progress < 70
    ).scalar() or 0
    high_risk = db.query(func.count(Credit.id)).filter(Credit.progress < 30).scalar() or 0
    
    # Monthly disbursement (sum of credits created this month)
    from datetime import datetime, timedelta
    this_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_disbursement = db.query(func.sum(Credit.amount)).filter(
        Credit.created_at >= this_month_start
    ).scalar() or 0
    
    return DashboardStats(
        total_credits=total_credits,
        total_amount_disbursed=total_amount,
        total_outstanding=total_outstanding,
        total_paid=total_paid,
        active_credits=active_credits,
        overdue_credits=overdue_credits,
        risk_distribution={
            "low": low_risk,
            "medium": medium_risk,
            "high": high_risk
        },
        monthly_disbursement=monthly_disbursement
    )


class FarmerCreditInfo(BaseModel):
    farmer_id: int
    farmer_name: str
    location: str
    total_credits: int
    total_amount: float
    total_outstanding: float
    average_progress: float
    risk_level: str

    class Config:
        from_attributes = True


@router.get("/farmers/credits", response_model=List[FarmerCreditInfo])
def get_farmers_credits(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.bank_officer))
):
    """Get aggregated credit information for all farmers"""
    
    farmers = db.query(Farmer).all()
    result = []
    
    for farmer in farmers:
        credits = db.query(Credit).filter(Credit.farmer_id == farmer.id).all()
        
        if not credits:
            continue
        
        total_amount = sum(c.amount for c in credits)
        total_outstanding = sum(c.remaining for c in credits)
        avg_progress = sum(c.progress for c in credits) / len(credits) if credits else 0
        
        # Determine risk level
        if avg_progress >= 70:
            risk_level = "low"
        elif avg_progress >= 30:
            risk_level = "medium"
        else:
            risk_level = "high"
        
        result.append(FarmerCreditInfo(
            farmer_id=farmer.id,
            farmer_name=farmer.full_name,
            location=farmer.location or "Не указано",
            total_credits=len(credits),
            total_amount=total_amount,
            total_outstanding=total_outstanding,
            average_progress=avg_progress,
            risk_level=risk_level
        ))
    
    return result
