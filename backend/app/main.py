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
        db = DatabaseManager("agrocredit.db")
        
        # Проверяем есть ли уже данные
        farmers = db.get_all_farmers()
        if len(farmers) > 0:
            print("✓ Database already has data, skipping seed")
            return
            
        print("📊 Seeding database with test data...")
        
        # Фермер 1: Успешный
        farmer1_id = db.add_farmer(
            farmer_id="farmer1@agrocredit.uz",
            age=45,
            education_level="высшее",
            farming_experience_years=20,
            number_of_loans=2,
            past_defaults=0,
            repayment_score=90
        )
        
        farm1_id = db.add_farm(
            farmer_id=farmer1_id,
            farm_size_acres=500.0,
            ownership_status="собственность",
            land_valuation_usd=800000,
            soil_quality_index=85,
            water_availability_score=90,
            irrigation_type="капельное",
            crop_rotation_history_years=10
        )
        
        db.add_crop(farm1_id, "пшеница", [40, 42, 41, 43, 45], 46.0, True, True)
        db.add_machinery(farm1_id, "Трактор", "John Deere 6M", 2018, "отличное")
        
        # Фермер 2: Средний
        farmer2_id = db.add_farmer(
            farmer_id="farmer2@agrocredit.uz",
            age=38,
            education_level="среднее",
            farming_experience_years=12,
            number_of_loans=1,
            past_defaults=0,
            repayment_score=75
        )
        
        farm2_id = db.add_farm(
            farmer_id=farmer2_id,
            farm_size_acres=200.0,
            ownership_status="собственность",
            land_valuation_usd=300000,
            soil_quality_index=70,
            water_availability_score=75,
            irrigation_type="арычное",
            crop_rotation_history_years=5
        )
        
        db.add_crop(farm2_id, "пшеница", [35, 37, 36], 38.0, True, True)
        
        # Фермер 3: Начинающий
        farmer3_id = db.add_farmer(
            farmer_id="farmer3@agrocredit.uz",
            age=28,
            education_level="среднее",
            farming_experience_years=3,
            number_of_loans=0,
            past_defaults=0,
            repayment_score=50
        )
        
        farm3_id = db.add_farm(
            farmer_id=farmer3_id,
            farm_size_acres=80.0,
            ownership_status="аренда",
            land_valuation_usd=150000,
            soil_quality_index=60,
            water_availability_score=55,
            irrigation_type="дождевание",
            crop_rotation_history_years=2
        )
        
        db.add_crop(farm3_id, "овощи", [25, 27], 28.0, False, True)
        
        print(f"✓ Created 3 test farmers")
        
        # Рассчитываем scoring для всех
        workflow = ScoringWorkflow("agrocredit.db")
        for fid in [farmer1_id, farmer2_id, farmer3_id]:
            result = workflow.calculate_farmer_scoring(fid, use_gpt=False, verbose=False)
            if result['success']:
                print(f"  ✓ Calculated scoring for farmer {fid}")
        
        print("✓ Database seeded successfully!")
        
    except Exception as e:
        print(f"⚠ Error seeding database: {e}")
        # Не падаем если seed не удался - приложение всё равно запустится

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

# Configure CORS - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить все домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],  # Добавлено для полной совместимости
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

