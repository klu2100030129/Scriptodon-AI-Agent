from pydantic import BaseModel
from typing import Optional, List
import os

class Settings(BaseModel):
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

# Load settings from environment variables
def get_settings():
    return Settings(
        OPENROUTER_API_KEY=os.getenv("OPENROUTER_API_KEY"),
        OPENROUTER_SITE_URL=os.getenv("OPENROUTER_SITE_URL", "http://localhost:3000"),
        OPENROUTER_SITE_NAME=os.getenv("OPENROUTER_SITE_NAME", "Scriptodon Test Automation Platform"),
        DATABASE_URL=os.getenv("DATABASE_URL", "sqlite:///./scritodon.db"),
        JIRA_SERVER_URL=os.getenv("JIRA_SERVER_URL"),
        JIRA_USERNAME=os.getenv("JIRA_USERNAME"),
        JIRA_API_TOKEN=os.getenv("JIRA_API_TOKEN"),
        ENVIRONMENT=os.getenv("ENVIRONMENT", "development")
    )

settings = get_settings()

# Create upload directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True) 