@echo off
REM ============================================
REM BookingTour - Database Import Script
REM Windows Batch Script
REM ============================================

echo.
echo ================================================
echo   BookingTour - Database Import Tool (Windows)
echo ================================================
echo.

REM Kiểm tra xem PostgreSQL psql client có cài đặt không
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PostgreSQL psql client không được tìm thấy!
    echo Vui lòng cài đặt PostgreSQL hoặc thêm vào PATH
    echo.
    pause
    exit /b 1
)

echo [✓] Đã tìm thấy PostgreSQL
echo.

set PGPASSWORD=postgres

:menu
echo Chọn cách import database:
echo.
echo 1. Import tất cả (Init + Seed Data)
echo 2. Import chỉ schema (Init)
echo 3. Import chỉ dữ liệu (Seed Data)
echo 4. Reset + Import (Drop + Create + Init + Seed)
echo 5. Kiểm tra kết nối
echo 6. Thoát
echo.

set /p choice="Nhập lựa chọn (1-6): "

if "%choice%"=="1" goto import_all
if "%choice%"=="2" goto import_init
if "%choice%"=="3" goto import_seed
if "%choice%"=="4" goto reset_import
if "%choice%"=="5" goto check_connection
if "%choice%"=="6" goto exit_script

echo [ERROR] Lựa chọn không hợp lệ!
echo.
goto menu

:import_all
echo.
echo [INFO] Đang import schema + dữ liệu...
echo.

echo [1/4] Importing init-databases.sql...
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-databases.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Lỗi khi import init-databases.sql!
    goto menu
)

echo [2/4] Importing init-booking-db.sql...
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-booking-db.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Lỗi khi import init-booking-db.sql!
    goto menu
)

echo [3/4] Importing init-payment-db.sql...
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-payment-db.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Lỗi khi import init-payment-db.sql!
    goto menu
)

echo [4/4] Importing script_data.sql...
psql -U postgres -h localhost -p 5432 -d userdb -f "sql-scripts\script_data.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Script_data.sql có thể không tồn tại hoặc có lỗi
)

echo.
echo [✓] Import hoàn tất!
goto menu

:import_init
echo.
echo [INFO] Đang import chỉ schema (Init)...
echo.

echo [1/3] Importing init-databases.sql...
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-databases.sql"
if %ERRORLEVEL% NEQ 0 goto menu

echo [2/3] Importing init-booking-db.sql...
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-booking-db.sql"
if %ERRORLEVEL% NEQ 0 goto menu

echo [3/3] Importing init-payment-db.sql...
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-payment-db.sql"
if %ERRORLEVEL% NEQ 0 goto menu

echo.
echo [✓] Import schema hoàn tát!
goto menu

:import_seed
echo.
echo [INFO] Đang import dữ liệu mẫu...
echo.

psql -U postgres -h localhost -p 5432 -d userdb -f "sql-scripts\script_data.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Lỗi khi import seed data!
    goto menu
)

echo.
echo [✓] Import seed data hoàn tất!
goto menu

:reset_import
echo.
echo [WARNING] Thao tác này sẽ XÓA tất cả databases và tạo lại!
echo.
set /p confirm="Bạn chắc chắn muốn tiếp tục? (Y/N): "

if /i "%confirm%"=="Y" (
    echo [INFO] Đang drop databases...
    psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS userdb CASCADE;"
    psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS tourdb CASCADE;"
    psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS bookingdb CASCADE;"
    psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS paymentdb CASCADE;"
    
    echo [INFO] Đang import schema...
    psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-databases.sql"
    psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-booking-db.sql"
    psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-payment-db.sql"
    
    echo [INFO] Đang import dữ liệu mẫu...
    psql -U postgres -h localhost -p 5432 -d userdb -f "sql-scripts\script_data.sql" 2>nul
    
    echo.
    echo [✓] Reset + Import hoàn tất!
) else (
    echo [CANCEL] Hủy bỏ thao tác
)
goto menu

:check_connection
echo.
echo [INFO] Đang kiểm tra kết nối...
echo.

psql -U postgres -h localhost -p 5432 -c "\l"
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [✓] Kết nối thành công!
) else (
    echo.
    echo [ERROR] Không thể kết nối tới PostgreSQL!
    echo Kiểm tra xem:
    echo   - PostgreSQL service đã start?
    echo   - Host: localhost, Port: 5432 có đúng?
    echo   - Username: postgres, Password: postgres có đúng?
)
echo.
goto menu

:exit_script
echo.
echo Tạm biệt!
pause
exit /b 0

