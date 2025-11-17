# Hướng Dẫn Xem Danh Sách Ảnh Đã Upload

## 1. 🌐 Cloudinary Dashboard (Cloud Storage)

### Truy cập:
- URL: https://cloudinary.com/console
- Đăng nhập bằng tài khoản Cloudinary
- Vào **Media Library** > Folder **`tours`**

### Xem thông tin Cloudinary đang dùng:
```powershell
# Kiểm tra config Cloudinary trong tour-service
docker exec tour-service env | findstr CLOUDINARY
```

### Features:
- ✅ Xem thumbnail tất cả ảnh
- ✅ URL đầy đủ của ảnh
- ✅ Kích thước, format, dung lượng
- ✅ Ngày giờ upload
- ✅ Public ID (dùng để xóa ảnh)
- ✅ Quản lý, tìm kiếm, filter ảnh

---

## 2. 💾 Database PostgreSQL

### Kết nối vào database:
```powershell
# Vào PostgreSQL container
docker exec -it postgres-db psql -U postgres -d tourdb
```

### Các câu query hữu ích:

#### Xem tất cả ảnh (kèm tên tour):
```sql
SELECT 
    ti.image_id,
    ti.tour_id,
    t.tour_name,
    ti.image_url,
    ti.caption,
    ti.display_order,
    ti.created_at
FROM tour_images ti
JOIN tours t ON ti.tour_id = t.tour_id
ORDER BY ti.created_at DESC
LIMIT 50;
```

#### Xem ảnh của một tour cụ thể:
```sql
SELECT * FROM tour_images WHERE tour_id = 1;
```

#### Đếm số ảnh của mỗi tour:
```sql
SELECT 
    t.tour_id,
    t.tour_name,
    COUNT(ti.image_id) as total_images
FROM tours t
LEFT JOIN tour_images ti ON t.tour_id = ti.tour_id
GROUP BY t.tour_id, t.tour_name
ORDER BY total_images DESC;
```

#### Xem tour có nhiều ảnh nhất:
```sql
SELECT 
    t.tour_id,
    t.tour_name,
    COUNT(ti.image_id) as image_count
FROM tours t
LEFT JOIN tour_images ti ON t.tour_id = ti.tour_id
GROUP BY t.tour_id, t.tour_name
ORDER BY image_count DESC
LIMIT 10;
```

#### Xem tất cả ảnh upload trong 7 ngày gần đây:
```sql
SELECT 
    ti.*,
    t.tour_name
FROM tour_images ti
JOIN tours t ON ti.tour_id = t.tour_id
WHERE ti.created_at > NOW() - INTERVAL '7 days'
ORDER BY ti.created_at DESC;
```

#### Tìm ảnh bị duplicate URL:
```sql
SELECT image_url, COUNT(*) as count
FROM tour_images
GROUP BY image_url
HAVING COUNT(*) > 1;
```

---

## 3. 📱 Admin Dashboard (Web Interface)

### Truy cập:
- URL: http://localhost:5174
- Đăng nhập admin

### Xem ảnh:
1. Vào **Tours Management**
2. Click vào một tour
3. Tab **Images** hoặc phần **Gallery**
4. Có thể:
   - Xem tất cả ảnh của tour
   - Thêm ảnh mới
   - Xóa ảnh
   - Sắp xếp thứ tự hiển thị

---

## 4. 🔗 API Endpoints

### Lấy tất cả ảnh của một tour:
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/tours/1/images" -Method GET
```

### Lấy chi tiết tour (bao gồm ảnh):
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/tours/1" -Method GET
$response.Content | ConvertFrom-Json
```

### Lấy danh sách tất cả tours (có thể filter theo ảnh):
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/tours" -Method GET
```

---

## 5. 📊 Export Danh Sách Ảnh

### Export từ Database ra CSV:
```sql
-- Trong psql
\copy (SELECT ti.image_id, ti.tour_id, t.tour_name, ti.image_url, ti.caption, ti.created_at FROM tour_images ti JOIN tours t ON ti.tour_id = t.tour_id ORDER BY ti.created_at DESC) TO '/tmp/images.csv' WITH CSV HEADER;
```

Sau đó copy file ra ngoài:
```powershell
docker cp postgres-db:/tmp/images.csv ./images.csv
```

---

## 6. 🔍 Kiểm Tra Ảnh Có Tồn Tại

### Kiểm tra một URL ảnh có hoạt động không:
```powershell
# Ví dụ URL từ Cloudinary
$imageUrl = "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/tours/sample.jpg"
Invoke-WebRequest -Uri $imageUrl -Method HEAD
```

### Script kiểm tra tất cả ảnh:
```powershell
# Lấy tất cả URL từ database
$urls = docker exec postgres-db psql -U postgres -d tourdb -t -c "SELECT image_url FROM tour_images;"

foreach ($url in $urls) {
    $url = $url.Trim()
    if ($url) {
        try {
            $response = Invoke-WebRequest -Uri $url -Method HEAD -TimeoutSec 5
            Write-Host "✅ OK: $url" -ForegroundColor Green
        } catch {
            Write-Host "❌ FAILED: $url" -ForegroundColor Red
        }
    }
}
```

---

## 7. 🗑️ Xóa Ảnh Không Dùng

### Tìm ảnh không thuộc tour nào:
```sql
-- Ảnh trong DB nhưng tour đã bị xóa
SELECT ti.* 
FROM tour_images ti
LEFT JOIN tours t ON ti.tour_id = t.tour_id
WHERE t.tour_id IS NULL;
```

### Xóa ảnh qua API:
```powershell
$imageUrl = "https://res.cloudinary.com/..."
$token = "your-admin-token"

Invoke-WebRequest `
    -Uri "http://localhost:8080/api/upload/image?imageUrl=$imageUrl" `
    -Method DELETE `
    -Headers @{"Authorization"="Bearer $token"}
```

---

## 8. 📈 Thống Kê

### Tổng số ảnh trong hệ thống:
```sql
SELECT COUNT(*) as total_images FROM tour_images;
```

### Dung lượng ước tính (nếu lưu size):
```sql
SELECT 
    COUNT(*) as total_images,
    SUM(file_size)/1024/1024 as total_size_mb
FROM tour_images;
```

### Số ảnh upload theo tháng:
```sql
SELECT 
    TO_CHAR(created_at, 'YYYY-MM') as month,
    COUNT(*) as image_count
FROM tour_images
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY month DESC;
```

---

## Quick Commands

```powershell
# 1. Vào database
docker exec -it postgres-db psql -U postgres -d tourdb

# 2. Xem ảnh mới nhất
docker exec postgres-db psql -U postgres -d tourdb -c "SELECT * FROM tour_images ORDER BY created_at DESC LIMIT 10;"

# 3. Đếm tổng số ảnh
docker exec postgres-db psql -U postgres -d tourdb -c "SELECT COUNT(*) FROM tour_images;"

# 4. Xem Cloudinary config
docker exec tour-service env | findstr CLOUDINARY
```
