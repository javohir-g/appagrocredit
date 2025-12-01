from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
from model_dummy import compute_features, score_from_features


app = FastAPI(
    title="AgroCredit ML Service",
    description="Machine learning microservice for agricultural credit scoring",
    version="1.0.0"
)


class ScoreRequest(BaseModel):
    crop_type: str
    acreage: float
    geometry: Dict


class ScoreResponse(BaseModel):
    numeric_score: float
    risk_category: str
    factors: Dict


@app.post("/score", response_model=ScoreResponse)
def generate_score(request: ScoreRequest):
    """
    Generate credit score for a field based on agronomic features.
    
    For MVP, uses mock NDVI and weather data.
    In production, would integrate with Sentinel Hub and weather APIs.
    """
    # Extract features from field data
    features = compute_features(request.dict())
    
    # Generate score from features
    numeric_score, risk_category, factors = score_from_features(features)
    
    return ScoreResponse(
        numeric_score=numeric_score,
        risk_category=risk_category,
        factors=factors
    )


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "service": "AgroCredit ML Service",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
