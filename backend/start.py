import uvicorn
import os
from app.core.database import create_tables

def main():
    print("Initializing Scriptodon Test Automation Platform...")
    create_tables()
    print("Database tables created successfully!")
    
    # Get port from environment (Render sets PORT env var)
    port = int(os.environ.get("PORT", 8000))
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )

if __name__ == "__main__":
    main() 