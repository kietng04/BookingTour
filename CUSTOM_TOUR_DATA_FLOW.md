# Custom Tour Data Flow Documentation

## Request Flow (Client → Backend → Database)

### 1. User Creates Custom Tour Request

**Frontend (CustomTourRequest.jsx):**
```javascript
const requestData = {
  tourName: "Phú Quốc 5N4Đ",
  numAdult: 2,              // ✅ Matches entity
  numChildren: 1,           // ✅ Matches entity  
  regionId: 1,              // ✅ Matches entity
  provinceId: 10,           // ✅ Matches entity
  startDate: "2025-12-01",  // ✅ Matches entity
  endDate: "2025-12-05",    // ✅ Matches entity
  description: "Tour gia đình" // ✅ Matches entity
};
```

**API Call:**
```
POST http://localhost:8080/api/custom-tours?userId=123
Content-Type: application/json
Authorization: Bearer <token>

{
  "tourName": "Phú Quốc 5N4Đ",
  "numAdult": 2,
  "numChildren": 1,
  "regionId": 1,
  "provinceId": 10,
  "startDate": "2025-12-01",
  "endDate": "2025-12-05",
  "description": "Tour gia đình"
}
```

**Backend (CustomTourController.java):**
```java
@PostMapping
public ResponseEntity<CustomTourResponse> createCustomTour(
    @RequestParam Long userId,
    @Valid @RequestBody CreateCustomTourRequest request // ✅ DTO matches frontend
) {
    // request.getNumAdult() → 2
    // request.getNumChildren() → 1
    CustomTourResponse response = customTourService.createCustomTour(userId, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

**Service (CustomTourServiceImpl.java):**
```java
CustomTour customTour = new CustomTour();
customTour.setUserId(userId);           // 123
customTour.setTourName(request.getTourName());     // "Phú Quốc 5N4Đ"
customTour.setNumAdult(request.getNumAdult());     // 2 ✅
customTour.setNumChildren(request.getNumChildren()); // 1 ✅
customTour.setRegionId(request.getRegionId());     // 1
customTour.setProvinceId(request.getProvinceId()); // 10
// ... more fields
```

**Database Insert:**
```sql
INSERT INTO custom_tours (
    user_id,
    tour_name,
    num_adult,      -- ✅ Column exists now
    num_children,   -- ✅ Column exists now
    region_id,      -- ✅ Column exists now
    province_id,    -- ✅ Column exists now
    start_date,
    end_date,
    description,
    status,
    created_at,
    updated_at
) VALUES (
    123,
    'Phú Quốc 5N4Đ',
    2,              -- ✅ Data stored correctly
    1,              -- ✅ Data stored correctly
    1,              -- ✅ Data stored correctly
    10,             -- ✅ Data stored correctly
    '2025-12-01',
    '2025-12-05',
    'Tour gia đình',
    'PENDING',
    NOW(),
    NOW()
) RETURNING custom_tour_id;
```

---

## Response Flow (Database → Backend → Frontend)

### 2. Admin Views Custom Tours List

**Database Query:**
```sql
SELECT 
    ct1_0.custom_tour_id,
    ct1_0.user_id,
    ct1_0.tour_name,
    ct1_0.num_adult,      -- ✅ Column found
    ct1_0.num_children,   -- ✅ Column found
    ct1_0.region_id,      -- ✅ Column found
    ct1_0.province_id,    -- ✅ Column found
    ct1_0.start_date,
    ct1_0.end_date,
    ct1_0.description,
    ct1_0.status,
    ct1_0.created_at,
    ct1_0.updated_at
FROM custom_tours ct1_0
ORDER BY ct1_0.created_at DESC
FETCH FIRST 20 ROWS ONLY;
```

**Backend (CustomTourRepository.java):**
```java
@Query("SELECT c FROM CustomTour c ORDER BY c.createdAt DESC")
Page<CustomTour> findAllOrderByCreatedAtDesc(Pageable pageable);
// JPA maps: c.numAdult → ct1_0.num_adult ✅
// JPA maps: c.numChildren → ct1_0.num_children ✅
```

**Entity → DTO Conversion:**
```java
public CustomTourResponse(CustomTour customTour) {
    this.id = customTour.getId();                     // 1
    this.userId = customTour.getUserId();             // 123
    this.tourName = customTour.getTourName();         // "Phú Quốc 5N4Đ"
    this.numAdult = customTour.getNumAdult();         // 2 ✅
    this.numChildren = customTour.getNumChildren();   // 1 ✅
    this.regionId = customTour.getRegionId();         // 1
    this.provinceId = customTour.getProvinceId();     // 10
    this.startDate = customTour.getStartDate();       // 2025-12-01
    this.endDate = customTour.getEndDate();           // 2025-12-05
    this.description = customTour.getDescription();   // "Tour gia đình"
    this.status = customTour.getStatus().name();      // "PENDING"
    this.createdAt = customTour.getCreatedAt();
    this.updatedAt = customTour.getUpdatedAt();
}
```

**API Response:**
```json
{
  "content": [
    {
      "id": 1,
      "userId": 123,
      "tourName": "Phú Quốc 5N4Đ",
      "numAdult": 2,
      "numChildren": 1,
      "regionId": 1,
      "provinceId": 10,
      "startDate": "2025-12-01",
      "endDate": "2025-12-05",
      "description": "Tour gia đình",
      "status": "PENDING",
      "createdAt": "2025-11-18T10:30:00",
      "updatedAt": "2025-11-18T10:30:00"
    }
  ],
  "pageable": { ... },
  "totalPages": 1,
  "totalElements": 1
}
```

**Frontend Admin Display:**
```jsx
<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
  {tour.numAdult} người lớn, {tour.numChildren} trẻ em
  {/* Displays: "2 người lớn, 1 trẻ em" ✅ */}
</td>
```

---

## Error Scenarios (Before Fix)

### ❌ Old Schema - Error on Insert

**Database Had:**
```sql
CREATE TABLE custom_tours (
    destination VARCHAR(255),        -- Wrong!
    number_of_people INTEGER,        -- Wrong!
    special_request TEXT             -- Wrong!
);
```

**Backend Tried to Insert:**
```sql
INSERT INTO custom_tours (..., num_adult, num_children, ...) -- Column doesn't exist!
```

**Error:**
```
ERROR: column "num_adult" of relation "custom_tours" does not exist
Position: 59
```

### ❌ Old Schema - Error on Select

**Backend Tried to Query:**
```sql
SELECT ct1_0.num_adult, ct1_0.num_children FROM custom_tours ct1_0
```

**Error:**
```
ERROR: column ct1_0.num_adult does not exist
Position: 79
```

---

## Fixed Schema

### ✅ New Schema - All Operations Work

**Database Now Has:**
```sql
CREATE TABLE custom_tours (
    custom_tour_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tour_name VARCHAR(255) NOT NULL,    -- ✅ Matches entity
    num_adult INTEGER NOT NULL,         -- ✅ Matches entity
    num_children INTEGER NOT NULL,      -- ✅ Matches entity
    region_id BIGINT,                   -- ✅ Matches entity
    province_id BIGINT,                 -- ✅ Matches entity
    start_date DATE,                    -- ✅ Matches entity
    end_date DATE,                      -- ✅ Matches entity
    description TEXT,                   -- ✅ Matches entity
    status custom_tour_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

**Result:** 
- ✅ All inserts work
- ✅ All queries work
- ✅ No console errors
- ✅ Data displays correctly

---

## Column Mapping Reference

| Frontend (camelCase) | Backend Entity | Database Column | Type |
|---------------------|---------------|-----------------|------|
| tourName | tourName | tour_name | VARCHAR(255) |
| numAdult | numAdult | num_adult | INTEGER |
| numChildren | numChildren | num_children | INTEGER |
| regionId | regionId | region_id | BIGINT |
| provinceId | provinceId | province_id | BIGINT |
| startDate | startDate | start_date | DATE |
| endDate | endDate | end_date | DATE |
| description | description | description | TEXT |
| status | status | status | ENUM |
| createdAt | createdAt | created_at | TIMESTAMP |
| updatedAt | updatedAt | updated_at | TIMESTAMP |

---

## Navigation Flow

### User Accesses Custom Tour History

**Step 1:** User clicks profile menu in header
```tsx
<Link to="/my-custom-tours">
  <Globe2 className="h-4 w-4" />
  Lịch sử tour tùy chỉnh  {/* ✅ New link added */}
</Link>
```

**Step 2:** React Router navigates to `/my-custom-tours`

**Step 3:** MyCustomTours component loads
```jsx
const fetchCustomTours = async () => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const data = await customTourAPI.getByUserId(userId, token);
  setCustomTours(data);
};
```

**Step 4:** API call
```
GET http://localhost:8080/api/custom-tours/user/123
Authorization: Bearer <token>
```

**Step 5:** Backend returns user's tours
```java
@GetMapping("/user/{userId}")
public ResponseEntity<List<CustomTourResponse>> getCustomToursByUserId(@PathVariable Long userId) {
    List<CustomTourResponse> customTours = customTourService.getCustomToursByUserId(userId);
    return ResponseEntity.ok(customTours);
}
```

**Step 6:** Frontend displays tours with correct data
```jsx
{tour.numAdult} người lớn{tour.numChildren > 0 && `, ${tour.numChildren} trẻ em`}
```

---

## Summary

✅ **Complete Data Flow Alignment:**
- Frontend sends: `numAdult`, `numChildren`, `regionId`, `provinceId`
- Backend receives: same field names via DTO
- Backend stores: `num_adult`, `num_children`, `region_id`, `province_id` (database columns)
- Backend retrieves: correctly mapped back to entity fields
- Frontend displays: original field names from API response

✅ **No More Errors:**
- Database has all required columns
- JPA mappings work correctly
- Frontend-backend contract matches
- Empty data handled gracefully
