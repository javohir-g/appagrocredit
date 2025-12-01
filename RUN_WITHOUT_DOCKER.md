# Running AgroCredit AI Without Docker

## Prerequisites

1. **Python 3.11+** - [Download](https://www.python.org/downloads/)
2. **Node.js 18+** - [Download](https://nodejs.org/)
3. **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)

## Step 1: Setup PostgreSQL Database

### Option A: Install PostgreSQL Locally
1. Install PostgreSQL from the link above
2. Create a database:
```sql
CREATE DATABASE agrocredit;
```

### Option B: Use Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create a free account and new project
3. Get your connection string from Project Settings → Database
4. It will look like: `postgresql://postgres:[password]@[host]:5432/postgres`

## Step 2: Configure Environment

Create a `.env` file in the root directory:

```env
# Database (choose one)
# Local PostgreSQL:
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/agrocredit

# OR Supabase:
# DATABASE_URL=postgresql+psycopg2://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres

# Backend
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
BACKEND_CORS_ORIGINS=http://localhost:3000

# ML Service
ML_SERVICE_URL=http://localhost:8001/score

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Step 3: Start Backend Service

Open a **new terminal** window:

```bash
# Navigate to backend directory
cd e:\agrocredit_ai\backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
venv\Scripts\Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at: **http://localhost:8000**

## Step 4: Start ML Service

Open a **new terminal** window:

```bash
# Navigate to ML service directory
cd e:\agrocredit_ai\ml_service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
venv\Scripts\Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat

# Install dependencies
pip install -r requirements.txt

# Start ML service
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```

ML Service will be available at: **http://localhost:8001**

## Step 5: Start Frontend

Open a **new terminal** window:

```bash
# Navigate to frontend directory
cd e:\agrocredit_ai\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## Verify Installation

1. **Backend API**: Visit http://localhost:8000/docs - You should see the API documentation
2. **ML Service**: Visit http://localhost:8001/docs - You should see the ML service docs
3. **Frontend**: Visit http://localhost:3000 - You should see the landing page

## Troubleshooting

### Python Virtual Environment Issues
If `venv\Scripts\Activate.ps1` fails with execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### PostgreSQL Connection Issues
- Verify PostgreSQL is running
- Check connection string in `.env`
- For Supabase, ensure you're using the correct password and host

### Port Already in Use
If ports 3000, 8000, or 8001 are in use:
- Close other applications using those ports
- Or modify ports in the commands above

### Module Not Found Errors
Make sure you're in the correct directory and virtual environment is activated before running commands.

## Quick Start Commands (Summary)

**Terminal 1 - Backend:**
```bash
cd e:\agrocredit_ai\backend
venv\Scripts\Activate.ps1
uvicorn app.main:app --port 8000 --reload
```

**Terminal 2 - ML Service:**
```bash
cd e:\agrocredit_ai\ml_service
venv\Scripts\Activate.ps1
uvicorn app:app --port 8001 --reload
```

**Terminal 3 - Frontend:**
```bash
cd e:\agrocredit_ai\frontend
npm run dev
```

## Next Steps

Once all services are running:
1. Go to http://localhost:3000
2. Click "Register"
3. Create an account (farmer or bank officer)
4. Start using the platform!
