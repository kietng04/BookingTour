@echo off
echo ========================================
echo   QUICK DOCKER REBUILD
echo   (Only changed services)
echo ========================================
echo.

cd "C:\Users\KIET\Desktop\New folder\BookingTour"

echo Stopping containers...
docker-compose down
echo.

echo Rebuilding services...
docker-compose up -d --build tour-service booking-service payment-service frontend frontend-admin
echo.

echo ========================================
echo   REBUILD COMPLETE!
echo ========================================
echo.
echo Services are starting up...
echo Wait 30-60 seconds for all services to be ready.
echo.
echo Check status: docker-compose ps
echo Check logs: docker-compose logs -f [service-name]
echo.
pause
