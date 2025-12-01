# Supabase Configuration Guide

## Get Your Database Password

1. Go to your Supabase project: https://klscrplgugtclsxtvvto.supabase.co
2. Click on **Project Settings** (gear icon in sidebar)
3. Go to **Database** section
4. Find **Connection String** section
5. Click **URI** tab
6. Copy the password from the connection string (it's between `postgres:` and `@`)

## Configure Your .env File

Create a file named `.env` in `e:\agrocredit_ai\` with this content:

```env
# Database - Supabase
# Replace YOUR_DATABASE_PASSWORD with the password from step above
DATABASE_URL=postgresql+psycopg2://postgres.klscrplgugtclsxtvvto:YOUR_DATABASE_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Supabase Configuration
SUPABASE_URL=https://klscrplgugtclsxtvvto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsc2NycGxndWd0Y2xzeHR2dnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTc2ODIsImV4cCI6MjA4MDE5MzY4Mn0.psOA7hV_5lBLFe8uuqGD6YhKzcILTHhyjx56QoFptlA

# Backend
JWT_SECRET_KEY=agrocredit-secret-key-2024-change-in-production
JWT_ALGORITHM=HS256
BACKEND_CORS_ORIGINS=http://localhost:3000

# ML Service
ML_SERVICE_URL=http://localhost:8001/score

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## After Creating .env File

1. **Restart your backend service** (the one running in Terminal 1)
   - Press `Ctrl+C` to stop it
   - Run again: `uvicorn app.main:app --port 8000 --reload`

2. **The database tables will be created automatically** when the backend starts

3. **Verify connection**:
   - Go to http://localhost:8000/docs
   - You should see the API documentation without errors

## Alternative: Use Connection Pooler

If the above doesn't work, try the **Transaction** mode connection string:

```env
DATABASE_URL=postgresql+psycopg2://postgres.klscrplgugtclsxtvvto:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

Note: Change port from `6543` to `5432` for transaction mode.

## Troubleshooting

### Can't find password?
In Supabase dashboard:
- Project Settings → Database → Connection String → URI
- Or use "Reset Database Password" to create a new one

### Connection errors?
- Make sure you replaced `YOUR_DATABASE_PASSWORD` with actual password
- Check if there are any special characters that need URL encoding
- Try both connection pooler modes (port 6543 and 5432)

### Tables not created?
- Check backend terminal for errors
- The backend automatically creates tables on startup via SQLAlchemy
