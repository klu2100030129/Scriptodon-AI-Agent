from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

class ScriptType(str, enum.Enum):
    PLAYWRIGHT_PYTHON = "playwright_python"
    PLAYWRIGHT_SELENIUM = "playwright_selenium"

class Script(Base):
    __tablename__ = "scripts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    script_type = Column(Enum(ScriptType), nullable=False)
    content = Column(Text, nullable=False)
    file_path = Column(String(500), nullable=True)
    input_source_id = Column(Integer, ForeignKey("input_sources.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    input_source = relationship("InputSource", back_populates="scripts")
    
    def __repr__(self):
        return f"<Script(id={self.id}, name='{self.name}', type='{self.script_type}')>" 