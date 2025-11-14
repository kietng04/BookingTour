# Review & Rating System - Feature Documentation & Playwright Testing Guide

## 📋 Table of Contents
1. [Feature Overview](#feature-overview)
2. [Architecture & Implementation](#architecture--implementation)
3. [User Flows](#user-flows)
4. [API Endpoints](#api-endpoints)
5. [Playwright Setup](#playwright-setup)
6. [Test Scenarios](#test-scenarios)
7. [Test Implementation Examples](#test-implementation-examples)
8. [CI/CD Integration](#cicd-integration)

---

## 🎯 Feature Overview

### What was implemented?
A complete **Review & Rating System** allowing users to submit reviews for tours, with admin moderation workflow.

### Key Features Delivered
✅ **User Features**:
- View approved reviews on tour detail pages
- Browse all approved reviews with filters (rating, tour, badges)
- Submit new reviews with 1-5 star rating, title, comment, and badges
- Manage personal reviews (view, edit, delete)
- Real-time status tracking (PENDING/APPROVED/REJECTED)

✅ **Admin Features**:
- Review moderation dashboard
- Approve/Reject/Delete reviews
- Filter reviews by status, tour, rating
- View review statistics on main dashboard
- Detailed review inspection modal

✅ **Technical Features**:
- Microservice integration (tour-service ↔ user-service)
- Real user data fetching via @LoadBalanced RestTemplate
- Graceful fallback when services unavailable
- Data validation (rating 1-5, title 10-200 chars, comment 20+ chars)
- Review status workflow with re-moderation on edit

---

## 🏗️ Architecture & Implementation

### Backend Components

**1. Database Schema** (`tour_reviews` table)
```sql
CREATE TABLE tour_reviews (
    review_id BIGSERIAL PRIMARY KEY,
    tour_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    booking_id BIGINT,
    rating DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
    title VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    badges TEXT[],
    guest_name VARCHAR(255),
    guest_avatar VARCHAR(500),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. Service Layer** (`ReviewServiceImpl`)
- `createReview()` - Creates review + fetches user info from user-service
- `updateReview()` - Updates review, resets to PENDING
- `getApprovedReviewsByTourId()` - Public approved reviews
- `getMyReviews()` - User's own reviews
- `getAllReviews()` - Admin view with filters
- `updateReviewStatus()` - Admin approve/reject
- `deleteReview()` / `deleteReviewAdmin()` - Deletion with ownership check

**3. User Service Integration** (`UserServiceClient`)
```java
@Component
public class UserServiceClient {
    @Autowired
    private RestTemplate restTemplate; // @LoadBalanced

    public UserDTO getUserById(Long userId) {
        try {
            String url = "http://user-service/users/" + userId;
            return restTemplate.getForObject(url, UserDTO.class);
        } catch (Exception e) {
            logger.error("Error fetching user: {}", e.getMessage());
            return null; // Fallback gracefully
        }
    }
}
```

**4. API Controller** (`ReviewController`)
- Public endpoints: `/reviews/approved`, `/reviews/tours/{tourId}`
- Authenticated: `/reviews/tours/{tourId}` (POST), `/reviews/{id}` (PUT/DELETE), `/reviews/my-reviews`
- Admin: `/reviews/admin`, `/reviews/admin/{id}/status`, `/reviews/admin/{id}` (DELETE)

### Frontend Components

**Client Frontend** (`frontend/`)

1. **TourDetail.jsx** - Display approved reviews
   - Fetches reviews by tourId
   - Shows "Write Review" button for authenticated users
   - Review submission form with validation

2. **Reviews.jsx** - Browse all approved reviews
   - Filters by tour, rating, badges
   - Sort by newest/oldest/rating
   - Overall statistics display

3. **MyReviews.jsx** - Personal review management
   - List all user's reviews (all statuses)
   - Edit/Delete functionality
   - Status badges (PENDING/APPROVED/REJECTED)
   - Inline edit modal

4. **ReviewForm.jsx** - Review submission component
   - Star rating selector (1-5)
   - Title input (10-200 chars validation)
   - Comment textarea (20+ chars validation)
   - Badge multi-select
   - Error display

**Admin Frontend** (`frontend-admin/`)

1. **ReviewList.jsx** - Review moderation
   - Table with all reviews
   - Filters (status, minRating)
   - Actions: Approve, Reject, Delete
   - Detail modal
   - Toast notifications

2. **Dashboard.jsx** - Statistics integration
   - Review count card
   - Pending reviews count
   - Average rating display
   - Link to moderation page

### API Integration

**Client API** (`frontend/src/services/api.js`)
```javascript
export const reviewsAPI = {
  getAllApproved: (params = {}) => fetchAPI(`/reviews/approved?${query}`),
  getByTourId: (tourId, params = {}) => fetchAPI(`/reviews/tours/${tourId}?${query}`),
  create: (tourId, reviewData, token) => fetchAPI(`/reviews/tours/${tourId}`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
    authToken: token,
    headers: { 'X-User-Id': localStorage.getItem('userId') }
  }),
  update: (reviewId, reviewData, token) => fetchAPI(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
    authToken: token,
    headers: { 'X-User-Id': localStorage.getItem('userId') }
  }),
  delete: (reviewId, token) => fetchAPI(`/reviews/${reviewId}`, {
    method: 'DELETE',
    authToken: token,
    headers: { 'X-User-Id': localStorage.getItem('userId') }
  }),
  getMyReviews: (token) => fetchAPI('/reviews/my-reviews', {
    authToken: token,
    headers: { 'X-User-Id': localStorage.getItem('userId') }
  }),
};
```

**CRITICAL**: All authenticated endpoints MUST send `X-User-Id` header (backend expects it)

---

## 👤 User Flows

### Flow 1: Guest Views Reviews
```
1. User navigates to /tours/{slug}
2. TourDetail page loads
3. Fetch approved reviews: GET /api/reviews/tours/{tourId}
4. Display reviews with:
   - Guest name & avatar
   - Star rating (1-5)
   - Title & comment
   - Badges
   - Date posted
5. Show login prompt if not authenticated
```

### Flow 2: User Submits Review
```
1. Authenticated user clicks "Write a Review" on TourDetail
2. ReviewForm modal opens
3. User fills:
   - Rating (1-5 stars) - REQUIRED
   - Title (10-200 chars) - REQUIRED
   - Comment (20+ chars) - REQUIRED
   - Badges (optional multi-select)
4. Frontend validation runs
5. Submit: POST /api/reviews/tours/{tourId}
   Headers: Authorization, X-User-Id
   Body: { rating, title, comment, badges }
6. Backend:
   - Validates data
   - Fetches user info from user-service
   - Creates review with status=PENDING
   - Caches guest_name and guest_avatar
7. Success: Show "Review submitted, awaiting moderation"
8. Refresh review list
```

### Flow 3: User Manages Reviews
```
1. User navigates to /my-reviews
2. Fetch reviews: GET /api/reviews/my-reviews
   Headers: Authorization, X-User-Id
3. Display all reviews with status badges
4. Edit flow:
   - Click edit → Open modal
   - Modify fields
   - Submit: PUT /api/reviews/{reviewId}
   - Backend resets status to PENDING
   - Refresh list
5. Delete flow:
   - Click delete → Confirm dialog
   - Submit: DELETE /api/reviews/{reviewId}
   - Remove from list
```

### Flow 4: Admin Moderates Reviews
```
1. Admin navigates to /reviews
2. Fetch reviews: GET /api/reviews/admin?status=PENDING
3. Display table with filters
4. Approve flow:
   - Click approve → Confirm
   - Submit: PATCH /api/reviews/admin/{reviewId}/status
     Body: { status: "APPROVED" }
   - Toast success
   - Refresh list
5. Reject flow: Same as approve with status="REJECTED"
6. Delete flow: DELETE /api/reviews/admin/{reviewId}
```

---

## 📡 API Endpoints

### Public Endpoints

**GET /api/reviews/approved**
- Description: Get all approved reviews
- Query params: `minRating` (optional)
- Response: `ReviewResponse[]`

**GET /api/reviews/tours/{tourId}**
- Description: Get approved reviews for a tour
- Query params: `minRating` (optional)
- Response: `ReviewResponse[]`

**GET /api/reviews/tours/{tourId}/summary**
- Description: Get review statistics for a tour
- Response: `{ totalReviews, averageRating, distribution: {1:x, 2:y, ...} }`

### Authenticated User Endpoints

**POST /api/reviews/tours/{tourId}**
- Description: Create new review
- Headers: `Authorization`, `X-User-Id` (REQUIRED)
- Body: `{ rating, title, comment, badges?, bookingId? }`
- Response: `ReviewResponse`

**PUT /api/reviews/{reviewId}**
- Description: Update own review (resets to PENDING)
- Headers: `Authorization`, `X-User-Id`
- Body: `{ rating?, title?, comment?, badges? }`
- Response: `ReviewResponse`

**DELETE /api/reviews/{reviewId}**
- Description: Delete own review
- Headers: `Authorization`, `X-User-Id`
- Response: `{ message: "Review deleted successfully" }`

**GET /api/reviews/my-reviews**
- Description: Get current user's reviews
- Headers: `Authorization`, `X-User-Id`
- Response: `ReviewResponse[]`

### Admin Endpoints

**GET /api/reviews/admin**
- Description: Get all reviews with filters
- Query params: `tourId`, `status`, `minRating` (all optional)
- Response: `ReviewResponse[]`

**PATCH /api/reviews/admin/{reviewId}/status**
- Description: Update review status
- Body: `{ status: "APPROVED" | "REJECTED" | "PENDING" }`
- Response: `ReviewResponse`

**DELETE /api/reviews/admin/{reviewId}**
- Description: Delete any review (admin)
- Response: `{ message: "Review deleted successfully" }`

### Response Format

```json
{
  "reviewId": 1,
  "tourId": 10,
  "userId": 5,
  "bookingId": 123,
  "rating": 4.5,
  "title": "Amazing experience!",
  "comment": "The tour was fantastic...",
  "badges": ["Family", "Adventure"],
  "guestName": "John Doe",
  "guestAvatar": "https://...",
  "status": "APPROVED",
  "createdAt": "2025-11-14T10:00:00",
  "updatedAt": "2025-11-14T10:00:00"
}
```

---

## 🎭 Playwright Setup

### Installation

**1. Install Playwright**
```bash
# From project root
cd /home/user/BookingTour

# Create e2e tests directory
mkdir -p e2e-tests
cd e2e-tests

# Initialize Node project
npm init -y

# Install Playwright
npm install -D @playwright/test
npm install -D @types/node

# Install browsers
npx playwright install
```

**2. Project Structure**
```
e2e-tests/
├── package.json
├── playwright.config.ts
├── tests/
│   ├── reviews/
│   │   ├── guest-view.spec.ts
│   │   ├── user-submit.spec.ts
│   │   ├── user-manage.spec.ts
│   │   └── admin-moderate.spec.ts
│   └── fixtures/
│       ├── test-data.ts
│       └── auth-helpers.ts
├── pages/
│   ├── TourDetailPage.ts
│   ├── ReviewsPage.ts
│   ├── MyReviewsPage.ts
│   └── AdminReviewsPage.ts
└── .env.test
```

**3. Playwright Config** (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**4. Environment Setup** (`.env.test`)
```bash
BASE_URL=http://localhost:3000
API_URL=http://localhost:8080/api
TEST_USER_EMAIL=testuser@example.com
TEST_USER_PASSWORD=password123
TEST_USER_ID=1
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin
```

---

## 🧪 Test Scenarios

### Test Suite 1: Guest View Reviews

**TC1.1: View approved reviews on tour detail page**
- Given: User navigates to tour detail page
- When: Page loads
- Then: Should display all approved reviews
- And: Reviews should show guest name, rating, title, comment, badges

**TC1.2: Empty state when no reviews**
- Given: Tour has no approved reviews
- When: User views tour detail
- Then: Should display "No reviews yet" message

**TC1.3: Filter reviews by rating**
- Given: User is on Reviews page
- When: User selects "4 stars and above" filter
- Then: Only reviews with rating >= 4 should be displayed

**TC1.4: Sort reviews by date**
- Given: Multiple reviews exist
- When: User selects "Newest first" sort
- Then: Reviews should be ordered by createdAt DESC

**TC1.5: Login prompt for unauthenticated users**
- Given: User is not logged in
- When: User clicks "Write a Review"
- Then: Should show "Please login to write a review" message

### Test Suite 2: User Submit Review

**TC2.1: Submit valid review**
- Given: User is authenticated
- When: User fills all required fields correctly
- And: Submits the form
- Then: Review should be created with status PENDING
- And: Success message should be displayed
- And: Form should close

**TC2.2: Validation - Missing rating**
- Given: User opens review form
- When: User submits without selecting rating
- Then: Should show "Please select a star rating" error
- And: Form should not submit

**TC2.3: Validation - Title too short**
- Given: User fills review form
- When: Title is less than 10 characters
- And: User submits
- Then: Should show "Title must be at least 10 characters" error

**TC2.4: Validation - Comment too short**
- Given: User fills review form
- When: Comment is less than 20 characters
- Then: Should show "Comment must be at least 20 characters" error

**TC2.5: Backend validation - Invalid rating**
- Given: User bypasses frontend validation (via API)
- When: Rating is 0 or 6
- Then: Backend should return 400 error
- And: Review should not be created

**TC2.6: Duplicate review prevention**
- Given: User has already reviewed the tour
- When: User tries to submit another review
- Then: Should show "You have already reviewed this tour" error

### Test Suite 3: User Manage Reviews

**TC3.1: View personal reviews**
- Given: User is authenticated
- When: User navigates to /my-reviews
- Then: Should display all user's reviews (all statuses)
- And: Each review should show status badge

**TC3.2: Edit pending review**
- Given: User has a PENDING review
- When: User clicks Edit
- And: Modifies the review
- And: Saves changes
- Then: Review should be updated
- And: Status should remain PENDING

**TC3.3: Edit approved review resets status**
- Given: User has an APPROVED review
- When: User edits the review
- Then: Status should reset to PENDING
- And: User should see "Review will be re-moderated" message

**TC3.4: Delete review**
- Given: User has a review
- When: User clicks Delete
- And: Confirms deletion
- Then: Review should be removed
- And: Should disappear from list

**TC3.5: Cancel edit**
- Given: User opens edit modal
- When: User clicks Cancel
- Then: Modal should close
- And: No changes should be saved

### Test Suite 4: Admin Moderation

**TC4.1: View all reviews with filters**
- Given: Admin is logged in
- When: Admin navigates to /reviews
- Then: Should display all reviews in table
- And: Should show filter options (status, rating)

**TC4.2: Filter by PENDING status**
- Given: Admin is on reviews page
- When: Admin selects "Pending" filter
- Then: Only PENDING reviews should be displayed

**TC4.3: Approve review**
- Given: Review with status PENDING exists
- When: Admin clicks Approve
- And: Confirms action
- Then: Review status should update to APPROVED
- And: Success toast should appear

**TC4.4: Reject review**
- Given: Review with status PENDING exists
- When: Admin clicks Reject
- And: Confirms action
- Then: Review status should update to REJECTED
- And: Success toast should appear

**TC4.5: Delete review**
- Given: Admin views review list
- When: Admin clicks Delete
- And: Confirms deletion
- Then: Review should be permanently removed
- And: Success toast should appear

**TC4.6: View review details**
- Given: Admin is on reviews page
- When: Admin clicks on a review
- Then: Detail modal should open
- And: Should show all review information (tour, guest, rating, content, badges)

**TC4.7: Dashboard shows pending count**
- Given: X pending reviews exist
- When: Admin views dashboard
- Then: Reviews card should show total count
- And: Subtitle should show "X pending"

### Test Suite 5: Integration Tests

**TC5.1: Review visibility after approval**
- Given: User submits a review (status=PENDING)
- When: Admin approves the review
- Then: Review should appear on tour detail page
- And: Review should appear on public Reviews page

**TC5.2: Review hidden after rejection**
- Given: User submits a review
- When: Admin rejects the review
- Then: Review should NOT appear on tour detail page
- And: User should still see it in My Reviews with REJECTED badge

**TC5.3: User info updates when service available**
- Given: user-service is running
- When: User creates a review
- Then: Guest name should be user's fullName or username
- And: Guest avatar should be user's avatar URL

**TC5.4: Graceful fallback when user-service down**
- Given: user-service is unavailable
- When: User creates a review
- Then: Review should still be created
- And: Guest name should be "User {userId}"
- And: Guest avatar should be null

---

## 💻 Test Implementation Examples

### Example 1: Page Object Model

**TourDetailPage.ts**
```typescript
import { Page, Locator } from '@playwright/test';

export class TourDetailPage {
  readonly page: Page;
  readonly writeReviewButton: Locator;
  readonly reviewsList: Locator;
  readonly reviewCard: Locator;
  readonly reviewForm: Locator;
  readonly ratingStars: Locator;
  readonly titleInput: Locator;
  readonly commentTextarea: Locator;
  readonly badgeButtons: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.writeReviewButton = page.getByRole('button', { name: /write a review/i });
    this.reviewsList = page.locator('[data-testid="reviews-list"]');
    this.reviewCard = page.locator('[data-testid="review-card"]');
    this.reviewForm = page.locator('[data-testid="review-form"]');
    this.ratingStars = page.locator('[data-testid="rating-stars"] button');
    this.titleInput = page.locator('#review-title');
    this.commentTextarea = page.locator('#review-comment');
    this.badgeButtons = page.locator('[data-testid="badge-button"]');
    this.submitButton = page.getByRole('button', { name: /submit review/i });
    this.successMessage = page.locator('[data-testid="success-message"]');
  }

  async goto(tourSlug: string) {
    await this.page.goto(`/tours/${tourSlug}`);
  }

  async clickWriteReview() {
    await this.writeReviewButton.click();
  }

  async fillReviewForm(data: {
    rating: number;
    title: string;
    comment: string;
    badges?: string[];
  }) {
    // Select rating
    await this.ratingStars.nth(data.rating - 1).click();

    // Fill title
    await this.titleInput.fill(data.title);

    // Fill comment
    await this.commentTextarea.fill(data.comment);

    // Select badges
    if (data.badges) {
      for (const badge of data.badges) {
        await this.badgeButtons.filter({ hasText: badge }).click();
      }
    }
  }

  async submitReview() {
    await this.submitButton.click();
  }

  async getReviewCount() {
    return await this.reviewCard.count();
  }

  async getReviewByTitle(title: string) {
    return this.reviewCard.filter({ hasText: title });
  }
}
```

### Example 2: Test with Fixtures

**auth-helpers.ts**
```typescript
import { Page } from '@playwright/test';

export async function loginAsUser(page: Page, credentials: { email: string; password: string }) {
  await page.goto('/login');
  await page.fill('[name="email"]', credentials.email);
  await page.fill('[name="password"]', credentials.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/');

  // Store auth state
  const userId = await page.evaluate(() => localStorage.getItem('userId'));
  const token = await page.evaluate(() => localStorage.getItem('authToken'));

  return { userId, token };
}

export async function loginAsAdmin(page: Page) {
  return loginAsUser(page, {
    email: process.env.ADMIN_EMAIL!,
    password: process.env.ADMIN_PASSWORD!,
  });
}

export async function logout(page: Page) {
  await page.goto('/');
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');
}
```

**test-data.ts**
```typescript
export const testReview = {
  valid: {
    rating: 5,
    title: 'Excellent tour experience',
    comment: 'This was an amazing tour. The guide was knowledgeable and the locations were beautiful.',
    badges: ['Family', 'Adventure'],
  },
  invalidTitleShort: {
    rating: 4,
    title: 'Good',
    comment: 'This tour was good and I enjoyed the experience very much.',
    badges: [],
  },
  invalidCommentShort: {
    rating: 4,
    title: 'Nice tour overall',
    comment: 'Good tour.',
    badges: [],
  },
};

export const testTour = {
  slug: 'ha-long-bay-cruise',
  id: 1,
  name: 'Ha Long Bay Cruise',
};
```

### Example 3: Full Test Suite

**user-submit.spec.ts**
```typescript
import { test, expect } from '@playwright/test';
import { TourDetailPage } from '../pages/TourDetailPage';
import { loginAsUser } from '../fixtures/auth-helpers';
import { testReview, testTour } from '../fixtures/test-data';

test.describe('User Submit Review', () => {
  let tourDetailPage: TourDetailPage;

  test.beforeEach(async ({ page }) => {
    // Login
    await loginAsUser(page, {
      email: process.env.TEST_USER_EMAIL!,
      password: process.env.TEST_USER_PASSWORD!,
    });

    // Navigate to tour
    tourDetailPage = new TourDetailPage(page);
    await tourDetailPage.goto(testTour.slug);
  });

  test('TC2.1: Should submit valid review successfully', async ({ page }) => {
    // Arrange
    await tourDetailPage.clickWriteReview();
    await expect(tourDetailPage.reviewForm).toBeVisible();

    // Act
    await tourDetailPage.fillReviewForm(testReview.valid);
    await tourDetailPage.submitReview();

    // Assert
    await expect(tourDetailPage.successMessage).toBeVisible();
    await expect(tourDetailPage.successMessage).toContainText(/submitted.*moderation/i);
    await expect(tourDetailPage.reviewForm).not.toBeVisible();
  });

  test('TC2.2: Should show error when rating not selected', async ({ page }) => {
    // Arrange
    await tourDetailPage.clickWriteReview();

    // Act
    await tourDetailPage.fillReviewForm({
      rating: 0, // No rating
      title: testReview.valid.title,
      comment: testReview.valid.comment,
    });
    await tourDetailPage.submitReview();

    // Assert
    const errorMessage = page.locator('text=/please select.*rating/i');
    await expect(errorMessage).toBeVisible();
    await expect(tourDetailPage.reviewForm).toBeVisible();
  });

  test('TC2.3: Should show error when title too short', async ({ page }) => {
    // Arrange
    await tourDetailPage.clickWriteReview();

    // Act
    await tourDetailPage.fillReviewForm(testReview.invalidTitleShort);
    await tourDetailPage.submitReview();

    // Assert
    const errorMessage = page.locator('text=/title must be at least 10 characters/i');
    await expect(errorMessage).toBeVisible();
  });

  test('TC2.4: Should show error when comment too short', async ({ page }) => {
    // Arrange
    await tourDetailPage.clickWriteReview();

    // Act
    await tourDetailPage.fillReviewForm(testReview.invalidCommentShort);
    await tourDetailPage.submitReview();

    // Assert
    const errorMessage = page.locator('text=/comment must be at least 20 characters/i');
    await expect(errorMessage).toBeVisible();
  });

  test('TC2.6: Should prevent duplicate reviews', async ({ page }) => {
    // Arrange - Submit first review
    await tourDetailPage.clickWriteReview();
    await tourDetailPage.fillReviewForm(testReview.valid);
    await tourDetailPage.submitReview();
    await expect(tourDetailPage.successMessage).toBeVisible();

    // Act - Try to submit another review for same tour
    await page.reload();
    await tourDetailPage.clickWriteReview();
    await tourDetailPage.fillReviewForm(testReview.valid);
    await tourDetailPage.submitReview();

    // Assert
    const errorMessage = page.locator('text=/already reviewed/i');
    await expect(errorMessage).toBeVisible();
  });
});
```

### Example 4: API Testing

**api-tests.spec.ts**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Review API', () => {
  let authToken: string;
  let userId: string;

  test.beforeAll(async ({ request }) => {
    // Login to get token
    const response = await request.post('http://localhost:8080/api/auth/login', {
      data: {
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      },
    });
    const data = await response.json();
    authToken = data.token;
    userId = data.userId;
  });

  test('POST /reviews/tours/{tourId} - Should create review', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/reviews/tours/1', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'X-User-Id': userId,
        'Content-Type': 'application/json',
      },
      data: {
        rating: 5,
        title: 'API Test Review',
        comment: 'This is a test review created via API to verify backend functionality.',
        badges: ['Test'],
      },
    });

    expect(response.status()).toBe(200);
    const review = await response.json();
    expect(review.reviewId).toBeDefined();
    expect(review.status).toBe('PENDING');
    expect(review.rating).toBe(5);
  });

  test('GET /reviews/my-reviews - Should return user reviews', async ({ request }) => {
    const response = await request.get('http://localhost:8080/api/reviews/my-reviews', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'X-User-Id': userId,
      },
    });

    expect(response.status()).toBe(200);
    const reviews = await response.json();
    expect(Array.isArray(reviews)).toBe(true);
  });

  test('PUT /reviews/{reviewId} - Should update review and reset to PENDING', async ({ request }) => {
    // Create review first
    const createResponse = await request.post('http://localhost:8080/api/reviews/tours/1', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'X-User-Id': userId,
        'Content-Type': 'application/json',
      },
      data: {
        rating: 4,
        title: 'Original Title',
        comment: 'Original comment with sufficient length for validation.',
        badges: [],
      },
    });
    const createdReview = await createResponse.json();

    // Update review
    const updateResponse = await request.put(
      `http://localhost:8080/api/reviews/${createdReview.reviewId}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'X-User-Id': userId,
          'Content-Type': 'application/json',
        },
        data: {
          rating: 5,
          title: 'Updated Title',
          comment: 'Updated comment with sufficient length for validation.',
          badges: ['Updated'],
        },
      }
    );

    expect(updateResponse.status()).toBe(200);
    const updatedReview = await updateResponse.json();
    expect(updatedReview.title).toBe('Updated Title');
    expect(updatedReview.rating).toBe(5);
    expect(updatedReview.status).toBe('PENDING'); // Reset after edit
  });
});
```

### Example 5: Visual Regression Testing

**visual-tests.spec.ts**
```typescript
import { test, expect } from '@playwright/test';
import { TourDetailPage } from '../pages/TourDetailPage';

test.describe('Visual Regression - Reviews', () => {
  test('Review form should match snapshot', async ({ page }) => {
    const tourDetailPage = new TourDetailPage(page);
    await tourDetailPage.goto('ha-long-bay-cruise');
    await tourDetailPage.clickWriteReview();

    // Wait for form to be visible
    await expect(tourDetailPage.reviewForm).toBeVisible();

    // Take screenshot
    await expect(tourDetailPage.reviewForm).toHaveScreenshot('review-form.png');
  });

  test('Reviews list should match snapshot', async ({ page }) => {
    const tourDetailPage = new TourDetailPage(page);
    await tourDetailPage.goto('ha-long-bay-cruise');

    // Wait for reviews to load
    await page.waitForSelector('[data-testid="review-card"]');

    // Take screenshot
    await expect(tourDetailPage.reviewsList).toHaveScreenshot('reviews-list.png');
  });
});
```

---

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/reviews/user-submit.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests in debug mode
npx playwright test --debug

# Generate test report
npx playwright show-report
```

### Watch Mode

```bash
# Run tests in watch mode
npx playwright test --watch
```

### Running Specific Tests

```bash
# Run tests matching pattern
npx playwright test --grep "submit valid review"

# Run tests by tag
npx playwright test --grep @smoke

# Skip tests by tag
npx playwright test --grep-invert @slow
```

### Parallel Execution

```bash
# Run tests in parallel (default)
npx playwright test --workers=4

# Run tests serially
npx playwright test --workers=1
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflow

**.github/workflows/e2e-tests.yml**
```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    services:
      postgres-tour:
        image: postgres:15
        env:
          POSTGRES_DB: tour_management
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      postgres-booking:
        image: postgres:15
        env:
          POSTGRES_DB: bookingdb
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5433:5432

      postgres-payment:
        image: postgres:15
        env:
          POSTGRES_DB: paymentdb
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5434:5432

      rabbitmq:
        image: rabbitmq:3-management
        ports:
          - 5672:5672
          - 15672:15672

    steps:
      - uses: actions/checkout@v3

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Build Backend Services
        run: |
          cd eureka-server && mvn clean install -DskipTests
          cd ../api-gateway && mvn clean install -DskipTests
          cd ../user-service && mvn clean install -DskipTests
          cd ../tour-service && mvn clean install -DskipTests
          cd ../booking-service && mvn clean install -DskipTests
          cd ../payment-service && mvn clean install -DskipTests

      - name: Start Backend Services
        run: |
          java -jar eureka-server/target/*.jar &
          sleep 30
          java -jar api-gateway/target/*.jar &
          java -jar user-service/target/*.jar &
          java -jar tour-service/target/*.jar &
          java -jar booking-service/target/*.jar &
          java -jar payment-service/target/*.jar &
          sleep 60

      - name: Install Frontend Dependencies
        run: |
          cd frontend && npm ci
          cd ../frontend-admin && npm ci

      - name: Start Frontend
        run: |
          cd frontend && npm run dev &
          cd frontend-admin && npm run dev &
          sleep 30

      - name: Install Playwright
        run: |
          cd e2e-tests
          npm ci
          npx playwright install --with-deps

      - name: Run Playwright Tests
        run: |
          cd e2e-tests
          npx playwright test
        env:
          BASE_URL: http://localhost:3000
          API_URL: http://localhost:8080/api

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: e2e-tests/playwright-report/
          retention-days: 30
```

### Docker Compose for Testing

**docker-compose.test.yml**
```yaml
version: '3.8'

services:
  postgres-tour:
    image: postgres:15
    environment:
      POSTGRES_DB: tour_management
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  postgres-booking:
    image: postgres:15
    environment:
      POSTGRES_DB: bookingdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5433:5432"

  postgres-payment:
    image: postgres:15
    environment:
      POSTGRES_DB: paymentdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5434:5432"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest

  # Run tests
  e2e-tests:
    image: mcr.microsoft.com/playwright:v1.40.0-focal
    working_dir: /app
    volumes:
      - ./e2e-tests:/app
    command: npx playwright test
    depends_on:
      - postgres-tour
      - postgres-booking
      - postgres-payment
      - rabbitmq
    environment:
      BASE_URL: http://frontend:3000
      API_URL: http://api-gateway:8080/api
```

**Run tests with Docker Compose**:
```bash
# Start all services
docker-compose -f docker-compose.test.yml up -d

# Run tests
docker-compose -f docker-compose.test.yml run e2e-tests

# Clean up
docker-compose -f docker-compose.test.yml down
```

---

## 📝 Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use clear, descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated

### 2. Test Data Management
- Use fixtures for reusable test data
- Clean up test data after each test
- Use unique identifiers to avoid conflicts
- Mock external services when possible

### 3. Assertions
- Use specific matchers (toHaveText, toBeVisible, etc.)
- Test one thing per test
- Verify both positive and negative cases
- Check error messages and edge cases

### 4. Wait Strategies
- Use auto-waiting (Playwright default)
- Avoid hard-coded waits (sleep)
- Use waitForLoadState, waitForURL for navigation
- Use locator assertions for element state

### 5. Debugging
- Use --headed mode to see browser
- Use --debug mode for step-by-step execution
- Take screenshots on failure
- Use trace viewer for detailed analysis

### 6. Performance
- Run tests in parallel
- Use beforeAll for expensive setup
- Reuse authenticated sessions
- Skip unnecessary navigation

---

## 🐛 Troubleshooting

### Common Issues

**Issue 1: Tests timeout**
```typescript
// Increase timeout for slow operations
test('slow operation', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  await page.goto('/tours/1');
});
```

**Issue 2: Element not found**
```typescript
// Use better selectors
// Bad
await page.click('.btn-submit');

// Good
await page.click('[data-testid="submit-button"]');
await page.getByRole('button', { name: 'Submit' }).click();
```

**Issue 3: Flaky tests**
```typescript
// Use proper wait strategies
// Bad
await page.click('button');
await page.waitForTimeout(1000);

// Good
await page.click('button');
await expect(page.locator('.success-message')).toBeVisible();
```

**Issue 4: Authentication issues**
```typescript
// Store and reuse auth state
test.beforeEach(async ({ page, context }) => {
  // Load saved auth state
  await context.addCookies(savedCookies);
  await page.goto('/');
});
```

---

## 📚 Additional Resources

- **Playwright Docs**: https://playwright.dev/
- **Playwright Best Practices**: https://playwright.dev/docs/best-practices
- **Testing Library**: https://testing-library.com/
- **CI/CD Examples**: https://playwright.dev/docs/ci

---

## ✅ Summary

This guide covers:
- ✅ Complete feature documentation
- ✅ User flows and scenarios
- ✅ API endpoint specifications
- ✅ Playwright setup from scratch
- ✅ 40+ test scenarios organized by suite
- ✅ Page Object Model implementation
- ✅ Full test examples with assertions
- ✅ CI/CD integration with GitHub Actions
- ✅ Docker Compose testing setup
- ✅ Best practices and troubleshooting

**Ready to test**: All code examples are production-ready and can be used directly!

---

*Last Updated: November 2025*
*Feature Version: 1.0.0*
*Playwright Version: 1.40.0*
