#!/bin/bash

# ============================================
# BookingTour - Database Import Script
# Linux/Mac Bash Script
# ============================================

set -e

echo ""
echo "================================================"
echo "   BookingTour - Database Import Tool"
echo "================================================"
echo ""

# Kiểm tra xem psql có được cài đặt không
if ! command -v psql &> /dev/null; then
    echo "[ERROR] PostgreSQL psql client không được tìm thấy!"
    echo "Vui lòng cài đặt PostgreSQL"
    exit 1
fi

echo "[✓] Đã tìm thấy PostgreSQL"
echo ""

export PGPASSWORD="postgres"

menu() {
    echo "Chọn cách import database:"
    echo ""
    echo "1. Import tất cả (Init + Seed Data)"
    echo "2. Import chỉ schema (Init)"
    echo "3. Import chỉ dữ liệu (Seed Data)"
    echo "4. Reset + Import (Drop + Create + Init + Seed)"
    echo "5. Kiểm tra kết nối"
    echo "6. Thoát"
    echo ""
    
    read -p "Nhập lựa chọn (1-6): " choice
    
    case $choice in
        1) import_all ;;
        2) import_init ;;
        3) import_seed ;;
        4) reset_import ;;
        5) check_connection ;;
        6) exit_script ;;
        *) 
            echo "[ERROR] Lựa chọn không hợp lệ!"
            echo ""
            menu
            ;;
    esac
}

import_all() {
    echo ""
    echo "[INFO] Đang import schema + dữ liệu..."
    echo ""
    
    echo "[1/4] Importing init-databases.sql..."
    psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-databases.sql" || {
        echo "[ERROR] Lỗi khi import init-databases.sql!"
        menu
        return
    }
    
    echo "[2/4] Importing init-booking-db.sql..."
    psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-booking-db.sql" || {
        echo "[ERROR] Lỗi khi import init-booking-db.sql!"
        menu
        return
    }
    
    echo "[3/4] Importing init-payment-db.sql..."
    psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-payment-db.sql" || {
        echo "[ERROR] Lỗi khi import init-payment-db.sql!"
        menu
        return
    }
    
    echo "[4/4] Importing script_data.sql..."
    if [ -f "sql-scripts/script_data.sql" ]; then
        psql -U postgres -h localhost -p 5432 -d userdb -f "sql-scripts/script_data.sql" 2>/dev/null || {
            echo "[WARNING] Script_data.sql có thể không tồn tại hoặc có lỗi"
        }
    fi
    
    echo ""
    echo "[✓] Import hoàn tất!"
    menu
}

import_init() {
    echo ""
    echo "[INFO] Đang import chỉ schema (Init)..."
    echo ""
    
    echo "[1/3] Importing init-databases.sql..."
    psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-databases.sql" || {
        menu
        return
    }
    
    echo "[2/3] Importing init-booking-db.sql..."
    psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-booking-db.sql" || {
        menu
        return
    }
    
    echo "[3/3] Importing init-payment-db.sql..."
    psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-payment-db.sql" || {
        menu
        return
    }
    
    echo ""
    echo "[✓] Import schema hoàn tất!"
    menu
}

import_seed() {
    echo ""
    echo "[INFO] Đang import dữ liệu mẫu..."
    echo ""
    
    psql -U postgres -h localhost -p 5432 -d userdb -f "sql-scripts/script_data.sql" || {
        echo "[ERROR] Lỗi khi import seed data!"
        menu
        return
    }
    
    echo ""
    echo "[✓] Import seed data hoàn tất!"
    menu
}

reset_import() {
    echo ""
    echo "[WARNING] Thao tác này sẽ XÓA tất cả databases và tạo lại!"
    echo ""
    read -p "Bạn chắc chắn muốn tiếp tục? (Y/N): " confirm
    
    if [ "$confirm" == "Y" ] || [ "$confirm" == "y" ]; then
        echo "[INFO] Đang drop databases..."
        psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS userdb CASCADE;" 2>/dev/null || true
        psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS tourdb CASCADE;" 2>/dev/null || true
        psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS bookingdb CASCADE;" 2>/dev/null || true
        psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS paymentdb CASCADE;" 2>/dev/null || true
        
        echo "[INFO] Đang import schema..."
        psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-databases.sql"
        psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-booking-db.sql"
        psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-payment-db.sql"
        
        echo "[INFO] Đang import dữ liệu mẫu..."
        if [ -f "sql-scripts/script_data.sql" ]; then
            psql -U postgres -h localhost -p 5432 -d userdb -f "sql-scripts/script_data.sql" 2>/dev/null || true
        fi
        
        echo ""
        echo "[✓] Reset + Import hoàn tát!"
    else
        echo "[CANCEL] Hủy bỏ thao tác"
    fi
    menu
}

check_connection() {
    echo ""
    echo "[INFO] Đang kiểm tra kết nối..."
    echo ""
    
    if psql -U postgres -h localhost -p 5432 -c "\l" 2>/dev/null; then
        echo ""
        echo "[✓] Kết nối thành công!"
    else
        echo ""
        echo "[ERROR] Không thể kết nối tới PostgreSQL!"
        echo "Kiểm tra xem:"
        echo "  - PostgreSQL service đã start?"
        echo "  - Host: localhost, Port: 5432 có đúng?"
        echo "  - Username: postgres, Password: postgres có đúng?"
    fi
    echo ""
    menu
}

exit_script() {
    echo ""
    echo "Tạm biệt!"
    exit 0
}

# Chạy menu
menu

