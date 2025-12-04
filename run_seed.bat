@echo off
echo ========================================
echo  AgroCredit AI - Database Seed Script
echo ========================================
echo.

cd backend

echo Running seed script...
python seed_db.py

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  SUCCESS! Database seeded.
    echo ========================================
    echo.
    echo Test credentials:
    echo - Farmer 1: farmer1@example.com / password123
    echo - Farmer 2: farmer2@example.com / password123
    echo - Farmer 3: farmer3@example.com / password123
    echo - Bank: bank@example.com / password123
    echo.
) else (
    echo.
    echo ERROR: Seed script failed!
    echo.
)

pause
