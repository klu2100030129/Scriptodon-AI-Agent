from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class ScriptType(str, Enum):
    PLAYWRIGHT_PYTHON = "playwright_python"
    PLAYWRIGHT_SELENIUM = "playwright_selenium"

class ScriptCreate(BaseModel):
    name: str
    script_type: ScriptType
    content: str
    input_source_id: int

class ScriptResponse(BaseModel):
    id: int
    name: str
    script_type: ScriptType
    content: str
    file_path: Optional[str] = None
    input_source_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 