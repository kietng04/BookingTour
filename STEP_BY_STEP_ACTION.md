# 🎯 STEP-BY-STEP ACTION GUIDE - LÀM NGAY BÂY GIỜ!

## ⏱️ Thời gian: ~5 phút

---

## 📋 BƯỚC 1: Kiểm Tra Backend Services (30 giây)

### Chạy command:
```bash
docker-compose ps
```

### Kỳ vọng:
```
NAME                STATUS
postgres-db         Up (healthy)
booking-db          Up (healthy)
payment-db          Up (healthy)
eureka-server       Up (healthy)
api-gateway         Up (healthy)
user-service        Up (healthy)
tour-service        Up (healthy)
booking-service     Up (healthy)
payment-service     Up (healthy)
rabbitmq            Up (healthy)
frontend            Up
frontend-admin      Up
```

✅ **Nếu thấy:** Tất cả `Up` → Tiếp tục bước 2
❌ **Nếu thấy:** Có cái `Down` → Chạy `docker-compose up -d`

---

## 📋 BƯỚC 2: Verify Seed Data (1 phút)

### Chạy command kiểm tra tours:
```bash
docker-compose exec postgres-db psql -U postgres -d tourdb -c "SELECT COUNT(*) as tour_count FROM tours;"
```

### Kỳ vọng:
```
 tour_count 
------------
         18
(1 row)
```

✅ **Nếu = 18:** Dữ liệu đầy đủ → Tiếp tục bước 3
❌ **Nếu < 18:** Dữ liệu chưa đủ → Xem `SEED_DATA_IMPORT_SUCCESS.md`

---

## 🌐 BƯỚC 3: Refresh Frontend (1 phút)

### Mở Browser:
```
http://localhost:3000
```

### Hard Refresh (Rất Quan Trọng!):
```
Windows:  Ctrl + Shift + R
Mac:      Cmd + Shift + R
```

### Kỳ vọng Thấy:
```
✅ Tours page loaded
✅ 18 tours displayed (không phải 8!)
✅ Mỗi tour có hình ảnh
✅ Giá tiền hiển thị
```

✅ **Nếu thấy:** 18 tours → Tiếp tục bước 4
❌ **Nếu vẫn thấy:** 8 tours → Clear cache (xem troubleshooting)

---

## 🛠️ BƯỚC 4: Test Tours Page (1 phút)

### Kiểm Tra Chi Tiết:

1. **Scroll down** - Xem tất cả 18 tours
2. **Click vào 1 tour bất kỳ** - Check tour detail
3. **Verify thông tin:**
   - ✅ Tour name
   - ✅ Images (3-4 ảnh)
   - ✅ Description
   - ✅ Price (VND)
   - ✅ Days/Nights
   - ✅ Daily itinerary

### Expected URLs:
```
Tours List:  http://localhost:3000/tours
Tour Detail: http://localhost:3000/tours/1 (or any ID)
```

✅ **Nếu tất cả ok:** Tiếp tục bước 5
❌ **Nếu có lỗi:** Kiểm tra backend logs

---

## 💰 BƯỚC 5: Test Booking Flow (1 phút)

### Click "Đặt Tour" trên bất kỳ tour nào

### Verify:
```
✅ Multiple departure dates appear (4+)
✅ Each date shows available seats
✅ Price calculator works
✅ Guest info form displays
✅ Payment method options visible
```

### Expected Sections:
- Departure selection
- Guest information
- Price breakdown
- Payment options

✅ **Nếu form hiển thị:** Tiếp tục bước 6
❌ **Nếu form lỗi:** Restart frontend container

---

## 📊 BƯỚC 6: Check Admin Dashboard (1 phút)

### Mở:
```
http://localhost:5174
```

### Verify Dashboard Shows:
```
✅ Total Users: 26
✅ Total Bookings: 65
✅ Total Payments: 80
✅ Recent bookings list
✅ Revenue charts
✅ User management
```

### Navigate:
1. Click "Users" → See 26 users
2. Click "Bookings" → See 65 bookings
3. Click "Payments" → See 80 payments

✅ **Nếu tất cả data xuất hiện:** Hoàn thành! 🎉
❌ **Nếu data chưa update:** Hard refresh (Cmd+Shift+R)

---

## 📱 BƯỚC 7: Test API (Optional - 1 phút)

### Check API Gateway:
```bash
curl http://localhost:8080/actuator/health
```

### Expected Response:
```json
{
  "status":"UP"
}
```

### Get Tours via API:
```bash
curl http://localhost:8080/api/tours | head -50
```

### Expected:
```
✅ 18 tours in response
✅ Each tour has full details
✅ Images included
✅ Pricing data present
```

---

## ✅ COMPLETION CHECKLIST

Mark as you complete each step:

- [ ] **Step 1:** Docker containers all healthy ✅
- [ ] **Step 2:** Database has 18 tours ✅
- [ ] **Step 3:** Frontend refreshed ✅
- [ ] **Step 4:** Tours page shows 18 tours ✅
- [ ] **Step 5:** Tour details & booking flow works ✅
- [ ] **Step 6:** Admin dashboard shows all data ✅
- [ ] **Step 7:** API responding correctly ✅

---

## 🔧 TROUBLESHOOTING - If Something Goes Wrong

### ❌ Problem: Frontend vẫn thấy 8 tours

**Solution:**
```bash
# Option 1: Hard Refresh
Windows: Ctrl + Shift + R
Mac:     Cmd + Shift + R

# Option 2: Clear Browser Cache
F12 → Application → Cookies → Clear All
Then: Refresh page

# Option 3: Restart Container
docker-compose restart frontend
```

### ❌ Problem: Backend services Down

**Solution:**
```bash
# Check status
docker-compose ps

# Start everything
docker-compose up -d

# Wait 30 seconds
sleep 30

# Check again
docker-compose ps
```

### ❌ Problem: Database connection error

**Solution:**
```bash
# Check postgres-db logs
docker-compose logs postgres-db

# Restart if needed
docker-compose restart postgres-db booking-db payment-db

# Wait for healthy
docker-compose ps
```

### ❌ Problem: API not responding

**Solution:**
```bash
# Check api-gateway logs
docker-compose logs api-gateway

# Test connection
curl http://localhost:8080/actuator/health

# Restart if needed
docker-compose restart api-gateway
```

---

## 📞 If All Still Fails

### Check These Files:
1. `REFRESH_FRONTEND_NOW.md` - Refresh guide
2. `SEED_DATA_IMPORT_SUCCESS.md` - Data verification
3. `DATABASE_IMPORT_SUCCESS.md` - Database status

### View Logs:
```bash
# See all logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f tour-service
docker-compose logs -f frontend
docker-compose logs -f api-gateway
```

---

## 🎯 EXPECTED FINAL STATE

```
╔════════════════════════════════════════════╗
║       ✅ EVERYTHING SHOULD WORK!           ║
║                                            ║
║  Frontend (3000):        18 tours visible ║
║  Admin (5174):           All data shown   ║
║  API Gateway (8080):     Responding       ║
║  Services:               All Healthy      ║
║  Database:               500+ records     ║
║                                            ║
║  Status: READY FOR DEVELOPMENT ✨         ║
╚════════════════════════════════════════════╝
```

---

## 📝 Notes

- **Browser Refresh:** Always use **HARD REFRESH** (Ctrl+Shift+R), not just F5
- **First Load:** May take a few seconds due to image loading
- **Data Persistence:** All data is saved in Docker volumes
- **Container Restart:** `docker-compose restart` doesn't lose data

---

## 🎉 Next Steps After Completion

Once everything is working:

✅ **Frontend Development**
- Build new pages
- Improve UI/UX
- Add features

✅ **Backend Development**
- Create new APIs
- Implement business logic
- Add validations

✅ **Testing**
- Manual testing with real data
- API testing via Postman
- End-to-end scenarios

✅ **DevOps**
- Monitor container health
- Check logs
- Optimize performance

---

## ⏰ Time Estimate

| Step | Task | Time |
|------|------|------|
| 1 | Check containers | 30s |
| 2 | Verify database | 30s |
| 3 | Refresh frontend | 60s |
| 4 | Test tours page | 60s |
| 5 | Test booking flow | 60s |
| 6 | Check admin | 60s |
| 7 | Test API | 60s |
| **TOTAL** | **Complete setup** | **~5 min** |

---

## 🚀 LÀM NGAY!

**Start from Step 1 above ↑↑↑**

Good luck! 💪

---

**Questions?** Check the other documentation files in the root directory!

