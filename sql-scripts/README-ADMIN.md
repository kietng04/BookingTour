# Admin Account Setup

## Default Admin Credentials

**Email:** `admin@gmail.com`
**Username:** `admin`
**Password:** `admin`
**Phone:** `0900000000`

## Password Hash Details

- Algorithm: BCrypt
- Strength: 10 rounds
- Hash: `$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG`

## Ensuring Admin Account Exists

### Method 1: Run Data Script
The admin account is included in the main data initialization script:
```bash
psql -U postgres -f sql-scripts/script_data.sql
```

### Method 2: Run Dedicated Admin Script
To ensure admin exists (safe to run multiple times):
```bash
psql -U postgres -f sql-scripts/ensure-admin-user.sql
```

### Method 3: Manual SQL
```sql
\c tourdb;

INSERT INTO users (username, full_name, email, phone_number, password_hash, status)
VALUES ('admin', 'Quản Trị Viên', 'admin@gmail.com', '0900000000',
        '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ACTIVE')
ON CONFLICT (username) DO NOTHING;
```

## Authentication Behavior

### Special Admin Logic
The system has hardcoded logic in `AuthService.java` (line 94):
```java
boolean isAdmin = "admin".equalsIgnoreCase(user.getUsername()) ||
                  "admin@gmail.com".equalsIgnoreCase(user.getEmail());
```

Admin users bypass:
- Email verification requirement
- Account activation checks

### Backdoor Password (Development Only)
There is a backdoor password `"letmein"` in `AuthService.java` (line 89) that works for ANY user during development. **Remove this in production!**

## Login Endpoints

### Frontend Admin Login
- URL: `http://localhost:5174/login`
- API: `POST /api/auth/login`
- Body: `{"username": "admin@gmail.com", "password": "admin"}`

### Client Login
- URL: `http://localhost:5176/login`
- API: `POST /api/auth/login`
- Same credentials work (but admin should use admin portal)

## Troubleshooting

### Admin Cannot Login

1. **Check if user exists:**
   ```sql
   SELECT * FROM users WHERE username = 'admin' OR email = 'admin@gmail.com';
   ```

2. **Check password hash:**
   Should be: `$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG`

3. **Check account status:**
   Should be: `ACTIVE`

4. **Try backdoor password (dev only):**
   Use password `"letmein"` with any username

5. **Check API Gateway routing:**
   Ensure `/api/auth/**` route exists in `api-gateway/application.yml`

6. **Check services are running:**
   - API Gateway: `localhost:8080`
   - User Service: `localhost:8081`
   - Eureka Server: `localhost:8761`

### Reset Admin Password

```sql
\c tourdb;

UPDATE users
SET password_hash = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
    status = 'ACTIVE'
WHERE username = 'admin';
```

## Security Notes

⚠️ **Production Checklist:**
- [ ] Remove backdoor password `"letmein"` from AuthService.java
- [ ] Change admin password from default "admin"
- [ ] Consider adding role-based access control (RBAC)
- [ ] Enable email verification for all users
- [ ] Implement account lockout after failed login attempts
- [ ] Add audit logging for admin actions
