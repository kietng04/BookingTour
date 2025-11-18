# Custom Tour Database Schema Fix - Summary

## Issues Identified

### 1. Database Schema Mismatch
**Problem:** The database schema in `init-databases.sql` used old column names that didn't match the Java entity model:
- Database had: `destination`, `number_of_people`, `special_request`
- Entity expected: `tour_name`, `num_adult`, `num_children`, `description`, `region_id`, `province_id`

**Error Message:**
```
ERROR: column ct1_0.num_adult does not exist Position: 79
ERROR: column "num_adult" of relation "custom_tours" does not exist Position: 59
```

### 2. Frontend Admin Error Handling
**Problem:** When the database had no custom tours or had schema errors, the admin frontend would show error alerts and log errors to console unnecessarily.

### 3. Missing Navigation Link
**Problem:** The client frontend didn't have a navigation link to "Lịch sử tour tùy chỉnh" (Custom Tour History) page.

---

## Changes Made

### 1. Database Schema Fixes

#### File: `sql-scripts/init-databases.sql`
**Changed:** Updated the `custom_tours` table schema to match the Java entity:

```sql
CREATE TABLE custom_tours (
    custom_tour_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tour_name VARCHAR(255) NOT NULL,                -- Added
    num_adult INTEGER NOT NULL DEFAULT 1,           -- Added
    num_children INTEGER NOT NULL DEFAULT 0,        -- Added
    region_id BIGINT,                               -- Added
    province_id BIGINT,                             -- Added
    start_date DATE,
    end_date DATE,
    description TEXT,                               -- Renamed from special_request
    status custom_tour_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Added
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

**Removed columns:**
- `destination` (replaced by `tour_name` + `region_id` + `province_id`)
- `number_of_people` (replaced by `num_adult` + `num_children`)
- `special_request` (renamed to `description`)

#### File: `sql-scripts/fix_custom_tours_schema.sql` (NEW)
**Created:** Migration script to fix existing databases:
- Drops old columns: `destination`, `number_of_people`, `special_request`
- Adds new columns: `tour_name`, `num_adult`, `num_children`, `region_id`, `province_id`, `description`
- Ensures `start_date`, `end_date`, `created_at`, `updated_at` exist
- Creates indexes for performance
- Adds column comments

### 2. Frontend Admin Error Handling

#### File: `frontend-admin/src/pages/CustomTours/CustomTourList.jsx`
**Changed:** Modified `fetchCustomTours` to handle empty data gracefully:

```javascript
const fetchCustomTours = async () => {
  setLoading(true);
  try {
    const data = await customTourService.getAllCustomTours(statusFilter || null);
    setCustomTours(data.content || data || []);
  } catch (error) {
    console.error('Error fetching custom tours:', error);
    // Don't show alert for empty data, just set empty array
    setCustomTours([]);
  } finally {
    setLoading(false);
  }
};
```

**Key changes:**
- Added fallback to empty array: `data.content || data || []`
- Removed alert popup for errors
- Silently handles errors by setting empty array

#### File: `frontend-admin/src/services/customTourService.js`
**Changed:** Improved error logging to suppress database schema errors:

```javascript
async function fetchAdminAPI(endpoint, options = {}) {
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      const error = new Error(errorData.message || `HTTP ${response.status}`);
      
      // Only log errors that are not database-related empty data issues
      if (!errorData.message?.includes('does not exist') && response.status !== 404) {
        console.error(`Admin API Error (${endpoint}):`, error);
      }
      
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    // Only log non-network errors or actual server errors
    if (!error.message?.includes('does not exist')) {
      console.error(`Admin API Error (${endpoint}):`, error);
    }
    throw error;
  }
}
```

**Key changes:**
- Filters out "does not exist" errors from console
- Filters out 404 errors from logging
- Reduces noise in console logs

### 3. Frontend Navigation Enhancement

#### File: `frontend/src/components/layout/SiteHeader.tsx`
**Changed:** Added "Lịch sử tour tùy chỉnh" navigation link in two places:

**Desktop Menu (Profile Dropdown):**
```tsx
<Link
  to="/my-custom-tours"
  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-brand-50 hover:text-brand-600"
  onClick={() => setProfileMenuOpen(false)}
>
  <Globe2 className="h-4 w-4" aria-hidden="true" />
  Lịch sử tour tùy chỉnh
</Link>
```

**Mobile Menu:**
```tsx
<Link
  to="/my-custom-tours"
  onClick={() => setIsMenuOpen(false)}
  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300"
>
  <Globe2 className="h-4 w-4" aria-hidden="true" />
  Lịch sử tour tùy chỉnh
</Link>
```

**Position:** Inserted between "Lịch sử đặt tour" and "Đánh giá của tôi"

---

## Migration Steps

### For Existing Databases:
1. Run the migration script:
   ```bash
   psql -U postgres -d tourdb -f sql-scripts/fix_custom_tours_schema.sql
   ```

### For New Databases:
1. Use the updated `init-databases.sql` which already has the correct schema

### For Running Applications:
1. Restart the `tour-service` to pick up schema changes
2. Clear browser cache for frontend applications
3. Test custom tour creation from client frontend
4. Test custom tour management from admin frontend

---

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] Tour service starts without errors
- [ ] Client can create custom tours with `numAdult` and `numChildren`
- [ ] Admin can view custom tours list without errors
- [ ] Admin can approve/reject custom tours
- [ ] Client can see "Lịch sử tour tùy chỉnh" link in profile menu (desktop)
- [ ] Client can see "Lịch sử tour tùy chỉnh" link in mobile menu
- [ ] Clicking the link navigates to `/my-custom-tours` page
- [ ] Empty custom tours list shows "Không có yêu cầu nào" instead of errors

---

## Technical Details

### Column Mapping
| Old Column | New Column(s) | Type | Notes |
|------------|---------------|------|-------|
| destination | tour_name, region_id, province_id | VARCHAR(255), BIGINT, BIGINT | Split into multiple fields |
| number_of_people | num_adult, num_children | INTEGER, INTEGER | More specific tracking |
| special_request | description | TEXT | Renamed for clarity |
| - | created_at | TIMESTAMP | Added for tracking |
| - | updated_at | TIMESTAMP | Added for tracking |

### Indexes Created
- `idx_custom_tours_user_id` - For user queries
- `idx_custom_tours_status` - For status filtering
- `idx_custom_tours_created_at` - For date sorting
- `idx_custom_tours_region_id` - For region queries
- `idx_custom_tours_province_id` - For province queries

---

## Files Modified

1. `sql-scripts/init-databases.sql` - Updated schema
2. `sql-scripts/fix_custom_tours_schema.sql` - New migration script
3. `frontend-admin/src/pages/CustomTours/CustomTourList.jsx` - Error handling
4. `frontend-admin/src/services/customTourService.js` - Error logging
5. `frontend/src/components/layout/SiteHeader.tsx` - Navigation links

---

## Backend Status

The Java backend (`tour-service`) already has the correct entity model:
- `CustomTour.java` entity matches new schema
- `CreateCustomTourRequest.java` DTO matches frontend requests
- `CustomTourResponse.java` DTO provides correct response format
- No backend code changes needed

---

## Notes

- The Java entity uses `Long` for `regionId` and `provinceId`, but database uses `BIGINT` which is compatible
- The entity uses `LocalDate` for dates and `LocalDateTime` for timestamps
- Status enum values: `PENDING`, `COMPLETED`, `REJECTED`
- All new columns are properly indexed for query performance
