from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import httpx
import os
from ..core.security import get_db, require_role
from ..models.user import UserRole, User


router = APIRouter(prefix="/api/v1", tags=["scoring"])


class ScoreRequest(BaseModel):
    crop_type: str
    acreage: float
    geometry: dict


class ScoreResponse(BaseModel):
    numeric_score: float
    risk_category: str
    factors: dict


@router.post("/score", response_model=ScoreResponse)
async def score_field(
    request: ScoreRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.bank_officer))
):
    """
    Public API endpoint for bank systems to generate credit scores.
    Requires bank_officer authentication.
    """
    ml_url = os.getenv("ML_SERVICE_URL", "http://ml_service:8001/score")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(ml_url, json=request.dict(), timeout=20.0)
        response.raise_for_status()
        return response.json()
