from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.db.session import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import DashboardStats

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    now = datetime.utcnow()
    
    total = db.query(Task).filter(Task.owner_id == current_user.id).count()
    completed = db.query(Task).filter(Task.owner_id == current_user.id, Task.status == "completed").count()
    pending = db.query(Task).filter(Task.owner_id == current_user.id, Task.status == "pending").count()
    overdue = db.query(Task).filter(
        Task.owner_id == current_user.id, 
        Task.status == "pending", 
        Task.due_date < now
    ).count()
    
    return {
        "total_tasks": total,
        "completed_tasks": completed,
        "pending_tasks": pending,
        "overdue_tasks": overdue
    }
