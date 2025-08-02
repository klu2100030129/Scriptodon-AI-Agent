from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class InputSourceType(str, Enum):
    SWAGGER = "swagger"
    JIRA = "jira"
    USER_PROMPT = "user_prompt"

class InputSourceCreate(BaseModel):
    name: str
    source_type: InputSourceType
    content: str
    jira_url: Optional[str] = None
    jira_issue_key: Optional[str] = None
    swagger_url: Optional[str] = None

class InputSourceResponse(BaseModel):
    id: int
    name: str
    source_type: InputSourceType
    content: str
    file_path: Optional[str] = None
    jira_url: Optional[str] = None
    jira_issue_key: Optional[str] = None
    swagger_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 