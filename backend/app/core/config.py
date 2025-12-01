from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path

# Get the project root directory (3 levels up from this file)
# config.py -> core -> app -> backend -> PROJECT_ROOT
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
ENV_FILE = PROJECT_ROOT / ".env"

print(f"[CONFIG] Looking for .env file at: {ENV_FILE}")
print(f"[CONFIG] .env file exists: {ENV_FILE.exists()}")


class Settings(BaseSettings):
    PROJECT_NAME: str = "AgroCredit AI"
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"
    DATABASE_URL: str = "sqlite:///./agrocredit.db"
    JWT_SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Optional fields that may be in .env but not required
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    ML_SERVICE_URL: str = "http://localhost:8001/score"
    NEXT_PUBLIC_API_URL: str = "http://localhost:8000"
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",")]

    class Config:
        env_file = str(ENV_FILE) if ENV_FILE.exists() else ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in .env file


settings = Settings()

# Debug: Print loaded database URL (hide password)
db_url = settings.DATABASE_URL
if '@' in db_url:
    parts = db_url.split('@')
    masked = parts[0].rsplit(':', 1)[0] + ':****@' + parts[1]
    print(f"[CONFIG] Loaded DATABASE_URL: {masked}")
else:
    print(f"[CONFIG] Loaded DATABASE_URL: {db_url}")
