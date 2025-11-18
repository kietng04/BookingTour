# Troubleshooting Admin Login 403 Error

## Problem
Getting 403 Forbidden error when trying to login to admin panel.

## Common Issues

### 1. Wrong Port ❌
**ERROR:** Accessing `http://localhost:5177`
**CORRECT:** Access `http://localhost:5174`

Frontend-admin runs on port **5174**, NOT 5177!

### 2. Backend Services Not Running

Check if services are running:
```bash
# Check all required ports
lsof -i :8080 -i :8081 -i :8082 -i :8083 -i :8761

# Or using netstat
netstat -tuln | grep -E ":(8080|8081|8082|8083|8761)"
```

Required services:
- **8761**: Eureka Server (service discovery)
- **8080**: API Gateway (routes all /api requests)
- **8081**: User Service (handles authentication)
- **8082**: Tour Service (optional for login)
- **8083**: Booking Service (optional for login)

### 3. API Gateway Route Missing

Verify `/api/auth/**` route exists in API Gateway config:
```bash
cat api-gateway/src/main/resources/application.yml | grep -A 5 "api/auth"
```

Should show:
```yaml
- id: auth-service
  uri: lb://user-service
  predicates:
    - Path=/api/auth/**
  filters:
    - StripPrefix=1
```

### 4. Database Not Initialized

Admin account must exist in database:
```bash
psql -U postgres -c "\c tourdb; SELECT username, email FROM users WHERE username='admin';"
```

Should return:
```
 username |     email
----------+----------------
 admin    | admin@gmail.com
```

If not found, run:
```bash
psql -U postgres -f sql-scripts/ensure-admin-user.sql
```

## Step-by-Step Fix

### Step 1: Verify Correct URL
```
✅ CORRECT: http://localhost:5174/login
❌ WRONG:   http://localhost:5177/login
```

### Step 2: Start Backend Services

**Using Docker (Recommended):**
```bash
cd /home/user/BookingTour
docker-compose up -d

# Wait 30 seconds for services to start
sleep 30

# Verify all services are registered
curl http://localhost:8761/eureka/apps
```

**Without Docker:**
```bash
# Terminal 1: Eureka
cd eureka-server && mvn spring-boot:run

# Wait for Eureka to fully start (check for "Started EurekaApplication")

# Terminal 2: API Gateway
cd api-gateway && mvn spring-boot:run

# Terminal 3: User Service
cd user-service && mvn spring-boot:run

# Terminal 4: Tour Service (optional)
cd tour-service && mvn spring-boot:run

# Terminal 5: Booking Service (optional)
cd booking-service && mvn spring-boot:run
```

### Step 3: Start Frontend Admin
```bash
cd frontend-admin
npm run dev
```

Expected output:
```
VITE v7.2.2  ready in XXX ms

➜  Local:   http://localhost:5174/
```

### Step 4: Test Login Flow

**Manual API Test:**
```bash
# Test API Gateway is routing to user-service
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@gmail.com","password":"admin"}'
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "username": "admin",
  "email": "admin@gmail.com",
  "fullName": "Quản Trị Viên",
  "message": "Login successful!",
  "userId": 1
}
```

**Browser Test:**
1. Open `http://localhost:5174/login`
2. Enter email: `admin@gmail.com`
3. Enter password: `admin`
4. Click "Đăng nhập"

### Step 5: Check Browser Console

If still failing, open DevTools (F12) and check:

**Network Tab:**
- Request URL: Should be `http://localhost:5174/api/auth/login`
- Status: If 403, check Response tab for error message
- Request Headers: Should include `Content-Type: application/json`
- Request Payload: Should show `{username, password}`

**Console Tab:**
- Look for CORS errors
- Look for network errors
- Check for authentication errors

## Debug Checklist

- [ ] Accessing correct URL: `http://localhost:5174/login`
- [ ] Eureka Server running on port 8761
- [ ] API Gateway running on port 8080
- [ ] User Service running on port 8081
- [ ] Database has admin user (`SELECT * FROM users WHERE username='admin'`)
- [ ] Frontend-admin running on port 5174 (check `npm run dev` output)
- [ ] Browser console shows no CORS errors
- [ ] API Gateway routes configured correctly
- [ ] Using correct credentials: `admin@gmail.com` / `admin`

## Common Error Messages

### "Could not establish connection"
- This is a browser extension error, ignore it
- Not related to your 403 error

### "403 Forbidden"
- Backend services not running
- API Gateway can't reach user-service
- Wrong endpoint being called

### "Network Error" or "Failed to fetch"
- Backend not running at all
- Port mismatch
- CORS issue

## Quick Test Commands

```bash
# Test Eureka (should return XML with registered services)
curl http://localhost:8761/eureka/apps

# Test API Gateway health
curl http://localhost:8080/actuator/health

# Test User Service health
curl http://localhost:8081/actuator/health

# Test login endpoint directly on user-service (bypass gateway)
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@gmail.com","password":"admin"}'

# Test login through API Gateway
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@gmail.com","password":"admin"}'
```

## Still Not Working?

1. **Check API Gateway logs:**
   ```bash
   # If running with Maven
   # Look at the terminal where api-gateway is running

   # If running with Docker
   docker logs api-gateway
   ```

2. **Check User Service logs:**
   ```bash
   # If running with Maven
   # Look at the terminal where user-service is running

   # If running with Docker
   docker logs user-service
   ```

3. **Verify database connection:**
   ```bash
   psql -U postgres -c "\c tourdb; \dt"
   ```

4. **Restart everything:**
   ```bash
   # Kill all Java processes
   pkill -f java

   # Or stop Docker
   docker-compose down

   # Restart
   docker-compose up -d

   # Restart frontend
   cd frontend-admin
   npm run dev
   ```

## Security Notes

The system has a backdoor password `"letmein"` that works for ANY user (dev only).
If you can't login with `admin`/`admin`, try:
- Email: `admin@gmail.com`
- Password: `letmein`

**This backdoor should be removed in production!** (AuthService.java line 89)
