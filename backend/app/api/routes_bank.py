from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import join
from typing import List, Optional
from ..core.security import get_db, require_role
from ..models.user import UserRole, User
from ..models.farm import Farm
from ..models.score import Score


router = APIRouter(prefix="/bank", tags=["bank"])


class FarmerSummary(BaseModel):
    farm_id: int
    farm_name: str
    farmer_email: str
    crop_type: str
    acreage: float
    numeric_score: float
    risk_category: str

    class Config:
        from_attributes = True


class FarmDetail(BaseModel):
    id: int
    name: str
    crop_type: str
    acreage: float
    geometry: dict
    farmer_email: str
    score: dict
    indicators: dict

    class Config:
        from_attributes = True


@router.get("/farmers", response_model=List[FarmerSummary])
def list_all_farmers(
    risk_category: Optional[str] = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.bank_officer))
):
    """List all farms with scores for bank portfolio management"""
    # Join farms, scores, and users
    query = (
        db.query(Farm, Score, User)
        .join(Score, Score.farm_id == Farm.id)
        .join(User, User.id == Farm.owner_id)
        .order_by(Score.created_at.desc())
    )
    
    # Filter by risk category if provided
    if risk_category:
        query = query.filter(Score.risk_category == risk_category)
    
    results = []
    seen_farms = set()
    
    for farm, score, user in query.all():
        # Only include the latest score for each farm
        if farm.id not in seen_farms:
            seen_farms.add(farm.id)
            results.append(FarmerSummary(
                farm_id=farm.id,
                farm_name=farm.name,
                farmer_email=user.email,
                crop_type=farm.crop_type,
                acreage=farm.acreage,
                numeric_score=score.numeric_score,
                risk_category=score.risk_category
            ))
    
    return results


@router.get("/farms/{farm_id}", response_model=FarmDetail)
def get_farm_detail(
    farm_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.bank_officer))
):
    """Get detailed farm analysis for bank officers"""
    # Get farm with owner info
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found"
        )
    
    # Get owner
    owner = db.query(User).filter(User.id == farm.owner_id).first()
    
    # Get latest score
    latest_score = db.query(Score).filter(Score.farm_id == farm.id).order_by(Score.created_at.desc()).first()
    
    if not latest_score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No score available for this farm"
        )
    
    # Build indicators (mock data for MVP)
    indicators = {
        "field_health": "Good" if latest_score.numeric_score > 70 else "Moderate" if latest_score.numeric_score > 40 else "Poor",
        "drought_risk": "Low" if latest_score.numeric_score > 70 else "Medium" if latest_score.numeric_score > 40 else "High",
        "soil_condition": "Healthy",
        "weather_summary": {
            "avg_temperature": 25.5,
            "rainfall_30d": 45.2,
            "drought_index": 0.3
        }
    }
    
    return FarmDetail(
        id=farm.id,
        name=farm.name,
        crop_type=farm.crop_type,
        acreage=farm.acreage,
        geometry=farm.geometry,
        farmer_email=owner.email if owner else "unknown",
        score={
            "numeric_score": latest_score.numeric_score,
            "risk_category": latest_score.risk_category,
            "factors": latest_score.factors
        },
        indicators=indicators
    )
