from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class TestCaseStatus(str, Enum):
    PENDING = "pending"
    PASSED = "passed"
    FAILED = "failed"
    RUNNING = "running"

class TestCaseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    steps: str
    expected_result: Optional[str] = None
    input_source_id: int

class TestCaseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    steps: str
    expected_result: Optional[str] = None
    status: TestCaseStatus
    input_source_id: int
    created_at: datetime
    updated_at: datetime
    is_automated: bool

    class Config:
        from_attributes = True 