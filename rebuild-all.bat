@echo off
echo ========================================
echo   BOOKINGTOUR - REBUILD ALL SERVICES
echo ========================================
echo.

echo [1/6] Building tour-service with Maven...
cd "C:\Users\KIET\Desktop\New folder\BookingTour\tour-service"
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: tour-service build failed!
    pause
    exit /b 1
)
echo tour-service build SUCCESS!
echo.

echo [2/6] Building booking-service with Maven...
cd "C:\Users\KIET\Desktop\New folder\BookingTour\booking-service"
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: booking-service build failed!
    pause
    exit /b 1
)
echo booking-service build SUCCESS!
echo.

echo [3/6] Building payment-service with Maven...
cd "C:\Users\KIET\Desktop\New folder\BookingTour\payment-service"
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: payment-service build failed!
    pause
    exit /b 1
)
echo payment-service build SUCCESS!
echo.

echo [4/6] Building frontend (User)...
cd "C:\Users\KIET\Desktop\New folder\BookingTour\frontend"
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: frontend build failed!
    pause
    exit /b 1
)
echo frontend build SUCCESS!
echo.

echo [5/6] Building frontend-admin...
cd "C:\Users\KIET\Desktop\New folder\BookingTour\frontend-admin"
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: frontend-admin build failed!
    pause
    exit /b 1
)
echo frontend-admin build SUCCESS!
echo.

echo [6/6] Rebuilding Docker containers...
cd "C:\Users\KIET\Desktop\New folder\BookingTour"
echo Stopping all containers...
docker-compose down
echo.
echo Building all services (this may take several minutes)...
docker-compose build --no-cache
if %errorlevel% neq 0 (
    echo ERROR: Docker build failed!
    pause
    exit /b 1
)
echo.
echo Starting all containers...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: Docker start failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo   BUILD & DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Services are starting up...
echo Wait 30-60 seconds for all services to be ready.
echo.
echo Access points:
echo - Frontend User:  http://localhost:3000
echo - Frontend Admin: http://localhost:5174
echo - API Gateway:    http://localhost:8080
echo - Eureka:         http://localhost:8761
echo.
echo Check logs with: docker-compose logs -f [service-name]
echo.
pause
