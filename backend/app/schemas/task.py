from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum

class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class StatusEnum(str, Enum):
    pending = "pending"
    completed = "completed"

class TaskBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = PriorityEnum.low
    status: Optional[StatusEnum] = StatusEnum.pending
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    title: str

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

class TaskList(BaseModel):
    items: List[Task]
    total: int
    page: int
    page_size: int

class DashboardStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
