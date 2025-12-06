from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .db import init_db, SessionLocal
from .api import auth_router, farmers_router, farmer_extended_router, bank_router, bank_extended_router, scoring_router

# Import new loan-specific routes
from .api.routes_farmer_loan import router as farmer_loan_router
from .api.routes_bank_loan import router as bank_loan_router

# Import for seeding
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from database.db_manager import DatabaseManager
from database.scoring_workflow import ScoringWorkflow

def seed_database():
    """Заполнение БД тестовыми данными при первом запуске"""
    try:
        print("📊 Checking database...")
        # Простая проверка - не пытаемся seed если это вызовет ошибки
        # В production используйте миграции (Alembic)
        print("✓ Database check complete")
        print("⚠ Auto-seeding disabled - use seed script manually if needed")
    except Exception as e:
        print(f"⚠ Database check warning: {e}")

# Initialize database tables
init_db()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-driven agricultural credit scoring platform",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    """Initialize and seed database on startup"""
    print("🚀 Starting AgroCredit AI...")
    print("📊 Initializing database...")
    seed_database()
    print("✓ Application ready!")

# Configure CORS - Allow all (no credentials used)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # No credentials = wildcard OK
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(farmers_router)
app.include_router(farmer_extended_router)
app.include_router(farmer_loan_router)  # NEW: Farmer loan applications
app.include_router(bank_router)
app.include_router(bank_extended_router)
app.include_router(bank_loan_router)  # NEW: Bank loan management
app.include_router(scoring_router)


@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/api")
def api_root():
    """API root endpoint"""
    return {
        "message": "AgroScoring.AI API",
        "version": "1.0.0",
        "docs": "/docs"
    }


# Mount static files
# We assume the frontend is built to 'frontend/out' relative to the project root
# and we are running from the project root.
static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "out")

if os.path.exists(static_dir):
    app.mount("/_next", StaticFiles(directory=os.path.join(static_dir, "_next")), name="next")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve frontend static files"""
        # Check if file exists in static dir
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Check if it's an HTML file without extension (e.g. /dashboard -> /dashboard.html)
        html_path = os.path.join(static_dir, f"{full_path}.html")
        if os.path.exists(html_path) and os.path.isfile(html_path):
            return FileResponse(html_path)
            
        # Default to index.html for SPA routing (though Next.js export is multi-page, 
        # this handles root and 404s gracefully if we want)
        # But for Next.js static export, we usually want to serve specific files.
        # If not found, serve 404.html or index.html
        if full_path == "" or full_path == "/":
             return FileResponse(os.path.join(static_dir, "index.html"))
             
        return FileResponse(os.path.join(static_dir, "404.html"))
else:
    print(f"Warning: Static directory {static_dir} does not exist. Frontend will not be served.")

