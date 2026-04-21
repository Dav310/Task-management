from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, asc, desc
from app.api import deps
from app.db.session import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import Task as TaskSchema, TaskCreate, TaskUpdate, TaskList, PriorityEnum, StatusEnum

router = APIRouter()

@router.get("/", response_model=TaskList)
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    status: Optional[StatusEnum] = None,
    priority: Optional[PriorityEnum] = None,
    sort_by: str = Query("created_at", pattern="^(due_date|priority|created_at)$"),
    order: str = Query("desc", pattern="^(asc|desc)$"),
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100)
) -> Any:
    query = db.query(Task).filter(Task.owner_id == current_user.id)
    
    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))
    
    if status:
        query = query.filter(Task.status == status.value)
    if priority:
        query = query.filter(Task.priority == priority.value)
        
    # Handling sorting
    sort_attr = getattr(Task, sort_by)
    if order == "asc":
        query = query.order_by(asc(sort_attr))
    else:
        query = query.order_by(desc(sort_attr))
        
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size
    }

@router.post("/", response_model=TaskSchema)
def create_task(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    task_in: TaskCreate
) -> Any:
    task = Task(
        **task_in.dict(),
        owner_id=current_user.id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/{id}", response_model=TaskSchema)
def get_task(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    task = db.query(Task).filter(Task.id == id, Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{id}", response_model=TaskSchema)
def update_task(
    id: int,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    task = db.query(Task).filter(Task.id == id, Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_in.dict(exclude_unset=True)
    for field in update_data:
        setattr(task, field, update_data[field])
        
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{id}", response_model=TaskSchema)
def delete_task(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    task = db.query(Task).filter(Task.id == id, Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return task
