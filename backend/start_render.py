#!/usr/bin/env python3
"""
Render-optimized startup script for Scriptodon backend
"""

import uvicorn
import os
from app.core.database import create_tables

def main():
    """Start the FastAPI server optimized for Render"""
    print("🚀 Starting Scriptodon Test Automation Platform on Render...")
    
    # Create database tables
    create_tables()
    print("✅ Database initialized successfully!")
    
    # Get port from environment (Render sets PORT env var)
    port = int(os.environ.get("PORT", 8000))
    
    print(f"📍 API will be available on port: {port}")
    print("📚 API Documentation: /docs")
    print("🔧 ReDoc Documentation: /redoc")
    
    # Start the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # Important for Render
        port=port,
        log_level="info"
    )

if __name__ == "__main__":
    main() 