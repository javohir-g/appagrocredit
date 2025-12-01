from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .core.config import settings

engine = create_engine(
    settings.DATABASE_URL, 
    future=True,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db():
    """Initialize database tables"""
    from .models import user, farm, score  # Import all models
    Base.metadata.create_all(bind=engine)
