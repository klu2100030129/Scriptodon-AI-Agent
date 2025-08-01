from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class TestRunStatus(str, Enum):
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class TestRunCreate(BaseModel):
    name: str
    input_source_id: int

class TestRunResponse(BaseModel):
    id: int
    name: str
    status: TestRunStatus
    total_tests: int
    passed_tests: int
    failed_tests: int
    input_source_id: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    results_summary: Optional[str] = None

    class Config:
        from_attributes = True 