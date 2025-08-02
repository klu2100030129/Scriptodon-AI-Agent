from pydantic import BaseSettings
from typing import Optional, List
import os

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Scriptodon Test Automation Platform"
    
    # CORS - Support both development and production
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://*.vercel.app",  # Allow all Vercel domains
        "https://*.render.com",   # Allow Render domains
        "https://*.herokuapp.com", # Allow Heroku domains
        "https://scritodon.onrender.com",  # Specific Render domain
        "https://scritodon-backend.onrender.com"  # Specific Render domain
    ]
    
    # AI API Configuration
    OPENROUTER_API_KEY: Optional[str] = None
    OPENROUTER_SITE_URL: Optional[str] = "http://localhost:3000"
    OPENROUTER_SITE_NAME: Optional[str] = "Scriptodon Test Automation Platform"
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Database
    DATABASE_URL: str = "sqlite:///./scritodon.db"
    
    # Jira Configuration
    JIRA_SERVER_URL: Optional[str] = None
    JIRA_USERNAME: Optional[str] = None
    JIRA_API_TOKEN: Optional[str] = None
    
    # Environment
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"

settings = Settings()

# Create upload directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True) 