# FinZen Backend

AI-powered micro-investment platform backend using FastAPI and Python.

## Setup Instructions

### 1. Activate Virtual Environment
```bash
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
cp .env.example .env
# Update .env with your MongoDB URI
```

### 4. Run Development Server
```bash
python -m app.main
# or
uvicorn app.main:app --reload
```

## API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure
```
app/
├── config/          # Configuration files
├── models/          # Database models
├── schemas/         # Pydantic schemas
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── main.py          # FastAPI application
```

## Features
- JWT Authentication
- MongoDB Integration
- AI Investment Recommendations
- Micro-investment Round-up
- Gamification System
- Educational Modules