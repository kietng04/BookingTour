# Hướng dẫn Fix Lỗi Upload Ảnh

## Vấn đề
Frontend đang báo lỗi: "Server trả về HTML thay vì JSON"

## Nguyên nhân
- Browser đang cache JavaScript code cũ
- Frontend được build với API URL cũ

## Giải pháp

### Bước 1: Hard Refresh Browser (THỬ TRƯỚC)
1. Mở trang admin: http://localhost:5174
2. Nhấn **Ctrl + Shift + R** (Windows) hoặc **Cmd + Shift + R** (Mac)
3. Hoặc:
   - Mở DevTools (F12)
   - Tab Network > Check "Disable cache"
   - Refresh trang (F5)

### Bước 2: Kiểm tra Request (Debug)
1. Mở DevTools (F12) > Tab Network
2. Thử upload ảnh
3. Kiểm tra:
   - Request URL có phải `http://localhost:8080/api/upload/tour-image`?
   - Status code là bao nhiêu? (404, 500, ...?)
   - Response type là gì? (HTML hay JSON?)

### Bước 3: Rebuild Frontend (Nếu Bước 1 không hiệu quả)
```powershell
# Stop container
docker-compose stop frontend-admin

# Remove old container và image
docker rm frontend-admin
docker rmi bookingtour-frontend-admin

# Rebuild không cache
docker-compose build --no-cache frontend-admin

# Start lại
docker-compose up -d frontend-admin
```

### Bước 4: Kiểm tra API Gateway Logs
```powershell
# Xem logs khi upload
docker logs api-gateway -f
```

## Các Endpoint Cần Kiểm Tra

### Health Check
```bash
curl http://localhost:8080/api/upload/health
# Phải trả về: {"status":"UP","service":"File Upload Service"}
```

### Upload Single Image
```
POST http://localhost:8080/api/upload/tour-image
Content-Type: multipart/form-data
Header: Authorization: Bearer <token>
Body: file=<image_file>
```

### Upload Multiple Images
```
POST http://localhost:8080/api/upload/tour-images
Content-Type: multipart/form-data
Header: Authorization: Bearer <token>
Body: files=<image_files[]>
```

## Kiểm Tra Services Đang Chạy
```powershell
docker ps --filter "name=api-gateway" --filter "name=tour-service" --filter "name=frontend-admin"
```

Tất cả phải có status "Up" và healthy.
