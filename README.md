# 🚀 Taskly - Modern Task Management Dashboard

Taskly is a full-stack task management application built with high-performance backend and a premium Neumorphism-inspired frontend.

## ✨ Features

- **JWT Authentication**: Secure login and registration.
- **Task Management**: Full CRUD operations with advanced filtering and sorting.
- **Dashboard Stats**: Real-time overview of your productivity (Total, Completed, Pending, Overdue).
- **Premium UI**: Modern Neumorphic design with smooth animations and responsive layout.
- **Dockerized**: Easy setup with Docker Compose.

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Chosen for its high performance, automatic documentation, and type safety.
- **SQLAlchemy**: Powerful ORM for PostgreSQL.
- **PostgreSQL**: Reliable relational database for persistent storage.
- **JWT**: Secure, stateless authentication.

### Frontend
- **React.js**: Industry-standard library for building interactive UIs.
- **Vite**: Ultra-fast build tool for a smooth development experience.
- **Axios**: Centralized API communication with interceptors.
- **Lucide-React**: Beautiful and consistent iconography.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local development)
- Python 3.10+ (for local development)

### Running with Docker (Recommended)
1. Clone the repository.
2. Navigate to the project root.
3. Run:
   ```bash
   docker-compose up --build
   ```
4. Open your browser at `http://localhost:3000`.

### Local Development Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate 
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📂 Folder Structure

```text
├── backend/
│   ├── app/
│   │   ├── api/          # API Endpoints & Dependencies
│   │   ├── core/         # Config & Security
│   │   ├── db/           # Session management
│   │   ├── models/       # SQLAlchemy Models
│   │   ├── schemas/      # Pydantic Schemas
│   │   └── main.py       # Entry point
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI elements
│   │   ├── context/      # Auth state management
│   │   ├── pages/        # Main route components
│   │   ├── services/     # API integration
│   │   └── index.css     # Neumorphism design system
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## 📝 API Documentation
- **Interactive Swagger UI**: `http://localhost:8000/docs`
- **Alternative ReDoc**: `http://localhost:8000/redoc`

## 🔮 Future Improvements
- [ ] Email notifications for overdue tasks.
- [ ] Team collaboration features.
- [ ] Dark/Light mode toggle.
- [ ] Drag-and-drop task reordering.
