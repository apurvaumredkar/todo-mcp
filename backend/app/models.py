from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, JSON, Text
from sqlalchemy.sql import func
from datetime import datetime
import enum
from .database import Base


class TaskStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class TaskPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    tags = Column(JSON, default=list)  # Store as JSON array
    date_entered = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.pending)
    priority = Column(SQLEnum(TaskPriority), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())