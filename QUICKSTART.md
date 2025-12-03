# AgroScoring.AI - Quick Start Guide

## Prerequisites
- Docker Desktop installed and running
- Git (optional, for version control)

## Setup Instructions

### 1. Environment Configuration
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit `.env` if needed (default values work for local development).

### 2. Start the Application
Run all services with Docker Compose:
```bash
docker-compose up --build
```

This will start:
- **PostgreSQL Database** (port 5432)
- **Backend API** (port 8000)
- **ML Service** (port 8001)
- **Frontend** (port 3000)

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs
- **ML Service**: http://localhost:8001/docs

### 4. Create Your First Account
1. Go to http://localhost:3000
2. Click "Register"
3. Choose your role:
   - **Farmer**: To register fields and get credit scores
   - **Bank Officer**: To view portfolio and analytics
4. Complete registration

## User Workflows

### For Farmers
1. Login to your account
2. Click "Add New Field"
3. Fill in field information (name, crop type, acreage)
4. The map shows a sample polygon (in production, you'd draw your actual field)
5. Click "Save & Generate Score"
6. View your AI-generated credit score and field health insights

### For Bank Officers
1. Login to your account
2. View portfolio overview with risk statistics
3. Filter farms by risk category (Low/Medium/High)
4. Click on any farm to view detailed analysis
5. Access agronomic indicators and score breakdowns

## Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### ML Service Development
```bash
cd ml_service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --port 8001 --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login

### Farmer Endpoints
- `GET /farmer/farms` - List your farms
- `POST /farmer/farms` - Create new farm
- `GET /farmer/farms/{id}` - Get farm details

### Bank Endpoints
- `GET /bank/farmers` - List all farms
- `GET /bank/farms/{id}` - Get detailed farm analysis

### Scoring API
- `POST /api/v1/score` - Generate credit score (bank officers only)

## Technology Stack
- **Backend**: FastAPI (Python)
- **ML Service**: Python with mock NDVI/weather data
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Database**: PostgreSQL + PostGIS
- **Maps**: Leaflet.js

## Troubleshooting

### Docker Issues
- Ensure Docker Desktop is running
- Try `docker-compose down` then `docker-compose up --build`

### Port Conflicts
If ports 3000, 8000, 8001, or 5432 are in use:
- Stop conflicting services
- Or modify ports in `docker-compose.yml`

### Database Connection
- Database initializes automatically on first run
- Tables are created via SQLAlchemy models

## Next Steps (v1.1)
- Real Sentinel Hub NDVI integration
- Weather API integration
- Enhanced ML model with more features
- PDF report generation
- Mobile applications

## Support
For issues or questions, check the main README.md or create a GitHub issue.
