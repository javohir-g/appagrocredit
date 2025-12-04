# Import all models for easy access
from .user import User, UserRole
from .farm import Farm
from .score import Score
from .farmer import Farmer, OwnershipType
from .credit import Credit, CreditStatus
from .payment import Payment, PaymentStatus
from .card import Card
from .meteorology import Meteorology
from .crop_recommendation import CropRecommendation
from .field import Field, FieldStatus

__all__ = [
    "User", "UserRole", "Farm", "Score",
    "Farmer", "OwnershipType",
    "Credit", "CreditStatus",
    "Payment", "PaymentStatus",
    "Card", "Meteorology", "CropRecommendation",
    "Field", "FieldStatus"
]
