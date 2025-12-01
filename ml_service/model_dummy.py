"""
Mock NDVI and weather feature extraction for MVP.
In production, this would integrate with Sentinel Hub API and weather services.
"""
import random
from typing import Dict


def compute_features(payload: Dict) -> Dict:
    """
    Compute agronomic features from field data.
    For MVP, uses mock data. In production, would fetch real NDVI and weather data.
    
    Args:
        payload: Dict containing crop_type, acreage, and geometry
        
    Returns:
        Dict of computed features
    """
    acreage = payload.get("acreage", 1.0)
    crop_type = payload.get("crop_type", "unknown")
    
    # Mock NDVI data (in production, fetch from Sentinel Hub)
    # NDVI ranges from -1 to 1, with healthy vegetation typically 0.3-0.8
    base_ndvi = 0.6
    # Add some variation based on crop type
    crop_factors = {
        "wheat": 0.05,
        "corn": 0.08,
        "rice": 0.07,
        "soybean": 0.06,
        "cotton": 0.04
    }
    crop_bonus = crop_factors.get(crop_type.lower(), 0.0)
    mean_ndvi = min(0.85, base_ndvi + crop_bonus + random.uniform(-0.1, 0.1))
    
    # Mock weather data
    avg_temperature = 25.0 + random.uniform(-5, 5)
    rainfall_30d = 40.0 + random.uniform(-20, 30)
    drought_index = max(0, min(1, 0.3 + random.uniform(-0.2, 0.2)))
    
    return {
        "acreage": acreage,
        "crop_type": crop_type,
        "mean_ndvi": round(mean_ndvi, 3),
        "ndvi_variance": round(random.uniform(0.02, 0.08), 3),
        "avg_temperature": round(avg_temperature, 1),
        "rainfall_30d": round(rainfall_30d, 1),
        "drought_index": round(drought_index, 2)
    }


def score_from_features(features: Dict) -> tuple[float, str, Dict]:
    """
    Generate credit score from agronomic features.
    Uses a simple weighted formula for MVP. In production, would use trained ML model.
    
    Args:
        features: Dict of computed features
        
    Returns:
        Tuple of (numeric_score, risk_category, factors)
    """
    ndvi = features["mean_ndvi"]
    ndvi_variance = features["ndvi_variance"]
    acreage = features["acreage"]
    rainfall = features["rainfall_30d"]
    drought_index = features["drought_index"]
    
    # Scoring formula (0-100 scale)
    # NDVI contributes 50% (healthy vegetation = higher score)
    ndvi_score = ndvi * 50
    
    # Stability contributes 15% (lower variance = higher score)
    stability_score = max(0, (0.1 - ndvi_variance) / 0.1) * 15
    
    # Farm size contributes 10% (moderate size preferred)
    size_score = min(acreage / 20, 1.0) * 10
    
    # Rainfall contributes 15% (adequate rainfall = higher score)
    rainfall_score = min(rainfall / 50, 1.0) * 15
    
    # Drought risk contributes 10% (lower drought risk = higher score)
    drought_score = (1 - drought_index) * 10
    
    # Calculate total score
    numeric_score = ndvi_score + stability_score + size_score + rainfall_score + drought_score
    numeric_score = max(0, min(100, round(numeric_score, 2)))
    
    # Determine risk category
    if numeric_score >= 70:
        risk_category = "Low"
    elif numeric_score >= 40:
        risk_category = "Medium"
    else:
        risk_category = "High"
    
    # Build factor explanations
    factors = {
        "vegetation_health": {
            "value": round(ndvi, 3),
            "contribution": round(ndvi_score, 1),
            "description": "NDVI-based crop health indicator"
        },
        "field_stability": {
            "value": round(ndvi_variance, 3),
            "contribution": round(stability_score, 1),
            "description": "Consistency of vegetation across field"
        },
        "farm_size": {
            "value": round(acreage, 1),
            "contribution": round(size_score, 1),
            "description": "Field acreage assessment"
        },
        "rainfall_adequacy": {
            "value": round(rainfall, 1),
            "contribution": round(rainfall_score, 1),
            "description": "30-day rainfall in mm"
        },
        "drought_resilience": {
            "value": round(1 - drought_index, 2),
            "contribution": round(drought_score, 1),
            "description": "Resistance to drought conditions"
        }
    }
    
    return numeric_score, risk_category, factors
