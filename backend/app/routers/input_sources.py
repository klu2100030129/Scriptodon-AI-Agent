from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import os

from app.core.database import get_db
from app.schemas.input_source import InputSourceCreate, InputSourceResponse, InputSourceType
from app.services.swagger_service import SwaggerService
from app.services.jira_service import JiraService
from app.services.ai_service import AIService
from app.models.input_source import InputSource
from app.core.config import settings

router = APIRouter()
swagger_service = SwaggerService()
jira_service = JiraService()
ai_service = AIService()

@router.post("/swagger", response_model=InputSourceResponse)
async def create_swagger_source(
    file: UploadFile = File(...),
    name: str = Form(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.json'):
        raise HTTPException(status_code=400, detail="Only JSON files are allowed")
    
    try:
        content = await file.read()
        swagger_data = json.loads(content.decode())
        
        # Validate Swagger structure
        if not swagger_service.validate_swagger(swagger_data):
            raise HTTPException(status_code=400, detail="Invalid Swagger/OpenAPI specification")
        
        # Save file
        file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Create input source
        input_source = InputSource(
            name=name,
            source_type=InputSourceType.SWAGGER,
            content=content.decode(),
            file_path=file_path,
            swagger_url=None
        )
        
        db.add(input_source)
        db.commit()
        db.refresh(input_source)
        
        return input_source
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/swagger-url", response_model=InputSourceResponse)
async def create_swagger_source_from_url(
    name: str = Form(...),
    swagger_url: str = Form(...),
    db: Session = Depends(get_db)
):
    """Create input source from Swagger URL"""
    try:
        # Fetch and validate Swagger from URL
        swagger_data = swagger_service.fetch_swagger_from_url(swagger_url)
        
        # Convert to JSON string for storage
        content = json.dumps(swagger_data, indent=2)
        
        # Create input source
        input_source = InputSource(
            name=name,
            source_type=InputSourceType.SWAGGER,
            content=content,
            file_path=None,
            swagger_url=swagger_url
        )
        
        db.add(input_source)
        db.commit()
        db.refresh(input_source)
        
        return input_source
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/jira", response_model=InputSourceResponse)
async def create_jira_source(
    jira_url: str = Form(...),
    jira_issue_key: str = Form(...),
    name: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        # Fetch Jira issue content
        issue_content = await jira_service.fetch_jira_issue(jira_url, jira_issue_key)
        
        # Create input source
        input_source = InputSource(
            name=name,
            source_type=InputSourceType.JIRA,
            content=issue_content,
            jira_url=jira_url,
            jira_issue_key=jira_issue_key
        )
        
        db.add(input_source)
        db.commit()
        db.refresh(input_source)
        
        return input_source
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/user-prompt", response_model=InputSourceResponse)
async def create_user_prompt_source(
    input_source: InputSourceCreate,
    db: Session = Depends(get_db)
):
    try:
        db_input_source = InputSource(
            name=input_source.name,
            source_type=input_source.source_type,
            content=input_source.content,
            jira_url=input_source.jira_url,
            jira_issue_key=input_source.jira_issue_key,
            swagger_url=input_source.swagger_url
        )
        
        db.add(db_input_source)
        db.commit()
        db.refresh(db_input_source)
        
        return db_input_source
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[InputSourceResponse])
async def get_input_sources(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    input_sources = db.query(InputSource).offset(skip).limit(limit).all()
    return input_sources

@router.get("/{input_source_id}", response_model=InputSourceResponse)
async def get_input_source(
    input_source_id: int,
    db: Session = Depends(get_db)
):
    input_source = db.query(InputSource).filter(InputSource.id == input_source_id).first()
    if not input_source:
        raise HTTPException(status_code=404, detail="Input source not found")
    return input_source

@router.delete("/{input_source_id}")
async def delete_input_source(
    input_source_id: int,
    db: Session = Depends(get_db)
):
    input_source = db.query(InputSource).filter(InputSource.id == input_source_id).first()
    if not input_source:
        raise HTTPException(status_code=404, detail="Input source not found")
    
    db.delete(input_source)
    db.commit()
    return {"message": "Input source deleted successfully"} 