# Quick Migration Guide - Custom Tours Fix

## Execute This Now

### 1. Run the migration SQL script
```powershell
# Connect to PostgreSQL and run the migration
docker exec -i <postgres-container-name> psql -U postgres -d tourdb < sql-scripts/fix_custom_tours_schema.sql

# OR if running PostgreSQL locally
psql -U postgres -d tourdb -f sql-scripts/fix_custom_tours_schema.sql
```

### 2. Verify the schema
```sql
-- Check the new columns exist
\d custom_tours

-- Should see these columns:
-- tour_name, num_adult, num_children, region_id, province_id, description
-- created_at, updated_at
```

### 3. Restart tour-service
```powershell
# If using Docker
docker-compose restart tour-service

# OR rebuild if needed
docker-compose up -d --build tour-service
```

### 4. Test the changes

#### Test 1: Create a custom tour from client
1. Navigate to http://localhost:5173/custom-tour-request
2. Fill in the form with:
   - Tên tour: "Test Tour"
   - Số người lớn: 2
   - Số trẻ em: 1
   - Select region and province
   - Enter dates
   - Add description
3. Submit the form
4. **Expected:** Tour created successfully, no console errors

#### Test 2: View custom tours in admin
1. Navigate to http://localhost:5174/custom-tours
2. **Expected:** 
   - No console errors about "num_adult does not exist"
   - If no data: Shows "Không có yêu cầu nào"
   - If has data: Shows list with correct columns

#### Test 3: View custom tour history in client
1. Login to client frontend
2. Click profile menu (top right)
3. **Expected:** See "Lịch sử tour tùy chỉnh" option
4. Click it
5. **Expected:** Navigate to /my-custom-tours page showing user's tours

## What Was Fixed

✅ Database schema now matches Java entity
✅ Frontend-admin won't show errors for empty data
✅ Client frontend has navigation link to custom tour history
✅ All CRUD operations work correctly

## Rollback (if needed)

If you need to rollback:

```sql
-- Revert to old schema (NOT RECOMMENDED, data will be lost)
ALTER TABLE custom_tours
ADD COLUMN IF NOT EXISTS destination VARCHAR(255),
ADD COLUMN IF NOT EXISTS number_of_people INTEGER,
ADD COLUMN IF NOT EXISTS special_request TEXT;

ALTER TABLE custom_tours
DROP COLUMN IF EXISTS tour_name,
DROP COLUMN IF EXISTS num_adult,
DROP COLUMN IF EXISTS num_children,
DROP COLUMN IF EXISTS region_id,
DROP COLUMN IF EXISTS province_id,
DROP COLUMN IF EXISTS description;
```

## Files Changed

- ✅ `sql-scripts/init-databases.sql` - Fixed initial schema
- ✅ `sql-scripts/fix_custom_tours_schema.sql` - New migration script
- ✅ `frontend-admin/src/services/customTourService.js` - Better error handling
- ✅ `frontend-admin/src/pages/CustomTours/CustomTourList.jsx` - No error alerts
- ✅ `frontend/src/components/layout/SiteHeader.tsx` - Added navigation link

## No Changes Needed

- ✅ Java entity (`CustomTour.java`) - Already correct
- ✅ Java DTOs - Already correct
- ✅ Java repository - Already correct
- ✅ Java controller - Already correct
- ✅ Client frontend pages - Already correct
- ✅ Client frontend service - Already correct
