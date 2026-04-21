@echo off
echo Starting FastAPI Backend...
cd backend
.\venv\Scripts\python -m uvicorn app.main:app --reload
pause
