import uvicorn
from app.core.database import create_tables
from app.models import InputSource, TestCase, TestRun, Script

def main():
    print("Initializing Scriptodon Test Automation Platform...")
    create_tables()
    print("Database tables created successfully!")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main() 