from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

class InputSourceType(str, enum.Enum):
    SWAGGER = "swagger"
    JIRA = "jira"
    USER_PROMPT = "user_prompt"

class InputSource(Base):
    __tablename__ = "input_sources"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    source_type = Column(Enum(InputSourceType), nullable=False)
    content = Column(Text, nullable=False)
    file_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    jira_url = Column(String(500), nullable=True)
    jira_issue_key = Column(String(100), nullable=True)
    swagger_url = Column(String(500), nullable=True)
    test_cases = relationship("TestCase", back_populates="input_source")
    test_runs = relationship("TestRun", back_populates="input_source")
    scripts = relationship("Script", back_populates="input_source") 