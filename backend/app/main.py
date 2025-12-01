from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .db import init_db
from .api import auth_router, farmers_router, bank_router, scoring_router

# Initialize database tables
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-driven agricultural credit scoring platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(farmers_router)
app.include_router(bank_router)
app.include_router(scoring_router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "AgroCredit AI API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
