# Departure Management - Bug Fixes Report

## Date: 2025-11-13

## Summary
Fixed 9 critical bugs in the Departure Management system that were preventing proper CRUD operations and data display.

---

## Bug #1: Invalid Date Display in DepartureList
**File**: `frontend-admin/src/pages/Departures/DepartureList.jsx`
**Lines**: 175-262
**Severity**: High

### Issue
The departure list was showing "Unknown Tour", "Date not available", and "N/A" for all fields despite valid data existing in the database.

### Root Cause
The Table component's `render` function receives two parameters: `(value, row)`, but all column render functions in DepartureList were only accepting one parameter `(row)`. This caused them to receive the column value instead of the full row object.

### Fix
Updated all column render function signatures from:
```javascript
render: (row) => { /* ... */ }
```
To:
```javascript
render: (value, row) => { /* ... */ }
```

### Verification
✅ List now correctly displays tour names, dates, availability, and status.

---

## Bug #2: DepartureEdit - Wrong useEffect Dependency
**File**: `frontend-admin/src/pages/Departures/DepartureEdit.jsx`
**Line**: 63
**Severity**: Low

### Issue
The useEffect dependency array referenced `showToast` but the variable was actually named `toast`, causing potential stale closure issues.

### Fix
```javascript
// Before
}, [departureId, navigate, showToast]);

// After
}, [departureId, navigate, toast]);
```

### Verification
✅ No console warnings about missing dependencies.

---

## Bug #3: DepartureForm - tours.map is not a function
**File**: `frontend-admin/src/components/departures/DepartureForm.jsx`
**Lines**: 39-59
**Severity**: Critical

### Issue
```
TypeError: tours.map is not a function
```

### Root Cause
`toursAPI.getAll()` returns a paginated response object `{content: [...]}`, not a direct array.

### Fix
```javascript
// Before
const data = await toursAPI.getAll({ status: 'ACTIVE' });
setTours(data); // Error: data is not an array

// After
const data = await toursAPI.getAll({ status: 'ACTIVE' });
const toursArray = data.content || data || [];
const normalizedTours = toursArray.map(tour => ({
  ...tour,
  tourId: tour.id ?? tour.tourId,
  tourName: tour.tourName || tour.tour_name
}));
setTours(normalizedTours);
```

### Verification
✅ Tour dropdown loads correctly in create/edit forms.

---

## Bug #4: DepartureFilters - Same tours.map Issue
**File**: `frontend-admin/src/components/departures/DepartureFilters.jsx`
**Lines**: 12-32
**Severity**: Critical

### Issue
Same as Bug #3 - paginated response not being unwrapped.

### Fix
Applied same normalization fix as DepartureForm.

### Verification
✅ Filter dropdown loads correctly.

---

## Bug #5: DepartureList - Query Params Sending "undefined"
**File**: `frontend-admin/src/pages/Departures/DepartureList.jsx`
**Lines**: 46-50
**Severity**: Medium

### Issue
```
400 Bad Request: /api/tours/55/departures?from=undefined&to=undefined&status=undefined
```

### Root Cause
Query parameters were being set to the string "undefined" instead of being omitted.

### Fix
```javascript
// Before
const params = {
  from: appliedFilters.fromDate || undefined,
  to: appliedFilters.toDate || undefined,
  status: appliedFilters.status || undefined
};

// After
const params = {};
if (appliedFilters.fromDate) params.from = appliedFilters.fromDate;
if (appliedFilters.toDate) params.to = appliedFilters.toDate;
if (appliedFilters.status) params.status = appliedFilters.status;
```

### Verification
✅ API requests only include defined parameters.

---

## Bug #6: DeparturesAPI.getAll - Insufficient Error Handling
**File**: `frontend-admin/src/services/api.js`
**Lines**: 104-142
**Severity**: Medium

### Issue
No validation of response data structure, causing crashes when iterating over tours.

### Fix
Added robust error handling:
```javascript
if (!Array.isArray(tours)) {
  console.error('Tours data is not an array:', tours);
  return [];
}

// Added null checks before accessing properties
if (dep && typeof dep === 'object') {
  allDepartures.push({
    ...dep,
    departureId: dep.id ?? dep.departureId,
    tourName: tour.tourName || tour.tour_name,
    tourId,
  });
}
```

### Verification
✅ No crashes when API returns unexpected data structures.

---

## Bug #7: DepartureEdit - tours is not iterable
**File**: `frontend-admin/src/pages/Departures/DepartureEdit.jsx`
**Lines**: 23-47
**Severity**: Critical

### Issue
```
TypeError: tours is not iterable
```

### Root Cause
Same paginated response issue when fetching tours to find departure.

### Fix
```javascript
// Before
const tours = await toursAPI.getAll();
for (const tour of tours) { /* ... */ }

// After
const toursData = await toursAPI.getAll();
const tours = toursData.content || toursData || [];

for (const tour of tours) {
  const tourId = tour.id ?? tour.tourId;
  if (!tourId) continue;

  const departures = await departuresAPI.getByTour(tourId);
  const match = departures.find(d => (d.id || d.departureId) === parseInt(departureId));
  if (match) {
    foundDeparture = {
      ...match,
      departureId: match.id || match.departureId
    };
    foundTourId = tourId;
    break;
  }
}
```

### Verification
✅ Edit page loads successfully.

---

## Bug #8: DepartureForm - Tour Field Validation in Edit Mode
**File**: `frontend-admin/src/components/departures/DepartureForm.jsx`
**Lines**: 109-123
**Severity**: Medium

### Issue
Form validation was requiring tourId even in edit mode where the field is disabled.

### Fix
```javascript
// Before
{...register('tourId', { required: 'Tour is required' })}

// After
{...register('tourId', {
  required: mode === 'edit' ? false : 'Tour is required'
})}
```

Also ensured option values are strings:
```javascript
<option key={tour.tourId} value={String(tour.tourId)}>
  {tour.tourName}
</option>
```

And convert back to number on submit:
```javascript
const handleFormSubmit = (data) => {
  onSubmit({
    ...data,
    tourId: parseInt(data.tourId),
    totalSlots: parseInt(data.totalSlots)
  });
};
```

### Verification
✅ Update form submits successfully.

---

## Bug #9: api.js - tourId is not defined
**File**: `frontend-admin/src/services/api.js`
**Lines**: 114-136
**Severity**: Medium

### Issue
```
ReferenceError: tourId is not defined
at Object.getAll (api.js:134)
```

### Root Cause
The variable `tourId` was declared inside the try block but referenced in the catch block, causing a ReferenceError when an error occurred.

### Fix
```javascript
// Before
for (const tour of tours) {
  try {
    const tourId = tour.id ?? tour.tourId;  // Declared inside try
    if (!tourId) continue;
    // ... fetch departures
  } catch (err) {
    console.error(`Failed to fetch departures for tour ${tourId}:`, err);  // tourId out of scope!
  }
}

// After
for (const tour of tours) {
  const tourId = tour.id ?? tour.tourId;  // Declared outside try
  if (!tourId) continue;

  try {
    // ... fetch departures
  } catch (err) {
    console.error(`Failed to fetch departures for tour ${tourId}:`, err);  // Now in scope!
  }
}
```

### Verification
✅ Error handling works correctly without ReferenceError.

---

## CRUD Operations Test Results

### ✅ CREATE
- **Status**: PASSED
- **Test**: Created departure 77 for Tour 55 (Nov 20-23, 2025, 30 slots)
- **Database Verification**: ✅ Confirmed in database

### ✅ READ
- **Status**: PASSED
- **List View**: Shows all 3 departures with correct data
- **Detail View**: Shows full departure information correctly

### ✅ UPDATE
- **Status**: PASSED
- **Test**: Updated departure 77 end date from Nov 23 to Nov 25
- **Verification**: ✅ Change reflected in list view

### ✅ DELETE
- **Status**: PASSED
- **Test**: Deleted departure 77 from detail page
- **Verification**:
  - ✅ Success message displayed: "Departure deleted successfully"
  - ✅ Redirected to list page
  - ✅ List count decreased from 3 to 2 departures
  - ✅ Deleted departure no longer appears in list

### ✅ FILTERS
- **Status**: PASSED
- **Tests Performed**:
  1. **Filter by Tour** (Tour ID 22):
     - Result: ✅ Showed 1 departure (filtered from 2)
     - Active filter badge displayed correctly
  2. **Filter by Date Range** (From: 2025-11-14):
     - Result: ✅ Showed 0 departures (correct, all departures start on 2025-11-13)
     - Date filter badge displayed correctly
  3. **Filter by Status** (Full):
     - Result: ✅ Showed 0 departures (correct, all are "Available")
     - Status filter badge displayed correctly
  4. **Filter by Status** (Available):
     - Result: ✅ Showed 2 departures (all have "Available" status)
     - Status filter badge displayed correctly
  5. **Clear Filters**:
     - Result: ✅ Restored full list view
     - All filter badges removed correctly

---

## Files Modified

1. `frontend-admin/src/pages/Departures/DepartureList.jsx`
2. `frontend-admin/src/pages/Departures/DepartureEdit.jsx`
3. `frontend-admin/src/components/departures/DepartureForm.jsx`
4. `frontend-admin/src/components/departures/DepartureFilters.jsx`
5. `frontend-admin/src/services/api.js`

---

## Common Pattern Identified

**Paginated API Response Issue**: The Spring Boot backend returns paginated responses in the format:
```json
{
  "content": [...],
  "pageable": {...},
  "totalElements": 10,
  ...
}
```

But the frontend was expecting a direct array. This pattern was fixed across all components by:
1. Unwrapping: `const items = response.content || response || []`
2. Normalizing field names: `tourId: tour.id ?? tour.tourId`
3. Adding null safety checks

---

## Recommendations

1. **Create a utility function** for unwrapping paginated responses to avoid repeating this pattern
2. **Add TypeScript** to catch these type mismatches at compile time
3. **Implement PropTypes** or runtime validation for API responses
4. **Add unit tests** for data transformation logic
5. **Document API response formats** in a shared API documentation file

---

## Screenshots

1. `departure-list-fixed.png` - List view showing correct data after fixing Invalid Date bug
2. `departure-details-read.png` - Detail view showing full departure information
3. `departure-edit-form.png` - Edit form properly loaded with departure data
4. `departure-list-after-update.png` - List showing updated end date (Nov 23 → Nov 25)
5. `departure-filters-working.png` - Filters working correctly with Status: Available filter applied
