from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.routers.input_sources import router as input_sources_router
from app.routers.test_generation import router as test_generation_router
from app.routers.script_output import router as script_output_router
from app.routers.manual_testing import router as manual_testing_router
from app.core.config import settings

app = FastAPI(
    title="Scriptodon Test Automation Platform",
    description="AI-powered test automation platform with multiple input sources",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(input_sources_router, prefix="/api/input-sources", tags=["Input Sources"])
app.include_router(test_generation_router, prefix="/api/test-generation", tags=["Test Generation"])
app.include_router(script_output_router, prefix="/api/script-output", tags=["Script Output"])
app.include_router(manual_testing_router, prefix="/api/manual-testing", tags=["Manual Testing"])

@app.get("/")
async def root():
    return {"message": "Scriptodon Test Automation Platform API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Scriptodon API"}

if __name__ == "__main__":
    import uvicorn
    try:
        uvicorn.run(app, host="127.0.0.1", port=8000)
    except OSError:
        print("Port 8000 is busy, trying port 8001...")
        uvicorn.run(app, host="127.0.0.1", port=8001) 