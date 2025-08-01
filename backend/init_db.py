#!/usr/bin/env python3
"""
Database initialization script
"""

from app.core.database import create_tables
from app.core.config import settings
import os

def init_database():
    """Initialize the database and create tables"""
    print("🗄️ Initializing database...")
    
    # Create upload directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    print(f"✅ Created upload directory: {settings.UPLOAD_DIR}")
    
    # Create database tables
    try:
        create_tables()
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"❌ Error creating database tables: {str(e)}")
        return False
    
    print("🎉 Database initialization completed!")
    return True

if __name__ == "__main__":
    init_database() 