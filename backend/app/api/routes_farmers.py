from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
import httpx
import os
from ..core.security import get_db, require_role, get_current_user
from ..models.user import UserRole, User
from ..models.farm import Farm
from ..models.score import Score


router = APIRouter(prefix="/farmer", tags=["farmer"])


class FarmCreate(BaseModel):
    name: str
    crop_type: str
    acreage: float
    geometry: dict  # GeoJSON polygon


class ScoreOut(BaseModel):
    numeric_score: float
    risk_category: str
    factors: dict


class FarmOut(BaseModel):
    id: int
    name: str
    crop_type: str
    acreage: float
    geometry: dict
    score: Optional[ScoreOut] = None

    class Config:
        from_attributes = True


@router.post("/farms", response_model=FarmOut, status_code=status.HTTP_201_CREATED)
async def create_farm(
    data: FarmCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer))
):
    """Create a new farm and generate credit score"""
    # Create farm
    farm = Farm(
        owner_id=current_user.id,
        name=data.name,
        crop_type=data.crop_type,
        acreage=data.acreage,
        geometry=data.geometry
    )
    db.add(farm)
    db.commit()
    db.refresh(farm)
    
    # Call ML service for scoring
    ml_url = os.getenv("ML_SERVICE_URL", "http://ml_service:8001/score")
    payload = {
        "crop_type": farm.crop_type,
        "acreage": farm.acreage,
        "geometry": farm.geometry
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(ml_url, json=payload, timeout=20.0)
            response.raise_for_status()
            score_data = response.json()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"ML service unavailable: {str(e)}"
        )
    
    # Save score
    score = Score(
        farm_id=farm.id,
        numeric_score=score_data["numeric_score"],
        risk_category=score_data["risk_category"],
        factors=score_data["factors"]
    )
    db.add(score)
    db.commit()
    db.refresh(score)
    
    return FarmOut(
        id=farm.id,
        name=farm.name,
        crop_type=farm.crop_type,
        acreage=farm.acreage,
        geometry=farm.geometry,
        score=ScoreOut(
            numeric_score=score.numeric_score,
            risk_category=score.risk_category,
            factors=score.factors
        )
    )


@router.get("/farms", response_model=List[FarmOut])
def list_farms(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer))
):
    """List all farms owned by the current farmer"""
    farms = db.query(Farm).filter(Farm.owner_id == current_user.id).all()
    
    result = []
    for farm in farms:
        # Get latest score
        latest_score = db.query(Score).filter(Score.farm_id == farm.id).order_by(Score.created_at.desc()).first()
        
        score_out = None
        if latest_score:
            score_out = ScoreOut(
                numeric_score=latest_score.numeric_score,
                risk_category=latest_score.risk_category,
                factors=latest_score.factors
            )
        
        result.append(FarmOut(
            id=farm.id,
            name=farm.name,
            crop_type=farm.crop_type,
            acreage=farm.acreage,
            geometry=farm.geometry,
            score=score_out
        ))
    
    return result


@router.get("/farms/{farm_id}", response_model=FarmOut)
def get_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer))
):
    """Get detailed farm information with score"""
    farm = db.query(Farm).filter(
        Farm.id == farm_id,
        Farm.owner_id == current_user.id
    ).first()
    
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found"
        )
    
    # Get latest score
    latest_score = db.query(Score).filter(Score.farm_id == farm.id).order_by(Score.created_at.desc()).first()
    
    score_out = None
    if latest_score:
        score_out = ScoreOut(
            numeric_score=latest_score.numeric_score,
            risk_category=latest_score.risk_category,
            factors=latest_score.factors
        )
    
    return FarmOut(
        id=farm.id,
        name=farm.name,
        crop_type=farm.crop_type,
        acreage=farm.acreage,
        geometry=farm.geometry,
        score=score_out
    )
