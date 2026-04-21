from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from app.db.session import Base
import enum

class Priority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class Status(str, enum.Enum):
    pending = "pending"
    completed = "completed"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    priority = Column(String, default="low") # Storing as string but using enum in logic
    status = Column(String, default="pending")
    due_date = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))
