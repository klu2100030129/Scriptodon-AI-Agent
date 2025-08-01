from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

class TestCaseStatus(str, enum.Enum):
    PENDING = "pending"
    PASSED = "passed"
    FAILED = "failed"
    RUNNING = "running"

class TestCase(Base):
    __tablename__ = "test_cases"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    steps = Column(Text, nullable=False)
    expected_result = Column(Text, nullable=True)
    status = Column(Enum(TestCaseStatus), default=TestCaseStatus.PENDING)
    input_source_id = Column(Integer, ForeignKey("input_sources.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_automated = Column(Boolean, default=False)
    input_source = relationship("InputSource", back_populates="test_cases") 