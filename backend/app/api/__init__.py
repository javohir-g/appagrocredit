# Import all routers for easy access
from .routes_auth import router as auth_router
from .routes_farmers import router as farmers_router
from .routes_bank import router as bank_router
from .routes_scoring import router as scoring_router

__all__ = ["auth_router", "farmers_router", "bank_router", "scoring_router"]
