# Review & Rating System - Implementation Guide

## 📖 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Backend API](#backend-api)
5. [Frontend Integration](#frontend-integration)
6. [Inter-Service Communication](#inter-service-communication)
7. [Usage Examples](#usage-examples)
8. [Testing](#testing)
9. [Future Enhancements](#future-enhancements)

---

## Overview

The Review & Rating System allows users to submit reviews for tours they've experienced. The system includes:
- ⭐ Star ratings (1-5 with 0.5 increments)
- 📝 Title and detailed comments
- 🏷️ Badge categorization (e.g., "Luxury", "Family", "Adventure")
- ✅ Admin moderation workflow (PENDING → APPROVED/REJECTED)
- 👤 User information integration from user-service

### Key Features
- **User Review Submission**: Authenticated users can create reviews
- **Admin Moderation**: Reviews require approval before public display
- **Real User Data**: Guest names and avatars fetched from user-service
- **Rich Filtering**: Filter by tour, rating, status, badges
- **Statistics**: Rating distribution, average rating, review counts
- **CRUD Operations**: Users can edit/delete their own reviews
- **Responsive UI**: Works on desktop and mobile

---

## Architecture

### Component Diagram
```
┌─────────────────┐
│  Client Frontend│
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐      ┌─────────────────┐
│  API Gateway    │      │ Admin Frontend  │
│   (Port 8080)   │      │   (Port 5174)   │
└────────┬────────┘      └────────┬────────┘
         │ /api/reviews/*          │
         ▼                         ▼
┌─────────────────────────────────────┐
│       Tour Service (Port 8082)       │
│  ┌───────────────────────────────┐  │
│  │   ReviewController            │  │
│  │   ReviewService               │  │
│  │   ReviewRepository            │  │
│  │   UserServiceClient ←─────────┼──┼──→ User Service
│  └───────────────────────────────┘  │      (Port 8081)
│              ▼                       │
│      tour_reviews table              │
└─────────────────────────────────────┘
```

### Technology Stack
- **Backend**: Java 17, Spring Boot 3.3.3, Spring Data JPA
- **Database**: PostgreSQL 15 (shared `tour_management` database)
- **Service Discovery**: Netflix Eureka, @LoadBalanced RestTemplate
- **Frontend**: React 18, TailwindCSS, Vite
- **API Gateway**: Spring Cloud Gateway

---

## Database Schema

### Table: `tour_reviews`

```sql
CREATE TABLE tour_reviews (
    review_id BIGSERIAL PRIMARY KEY,
    tour_id BIGINT NOT NULL REFERENCES tours(tour_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL,
    booking_id BIGINT,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    title VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    badges TEXT[],
    guest_name VARCHAR(255),
    guest_avatar VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tour_reviews_tour_id ON tour_reviews(tour_id);
CREATE INDEX idx_tour_reviews_user_id ON tour_reviews(user_id);
CREATE INDEX idx_tour_reviews_status ON tour_reviews(status);
CREATE INDEX idx_tour_reviews_rating ON tour_reviews(rating);
```

### Migration File
Location: `tour-service/src/main/resources/db/migration/V5__create_tour_reviews.sql`

### Field Descriptions
| Field | Type | Description |
|-------|------|-------------|
| review_id | BIGSERIAL | Primary key, auto-increment |
| tour_id | BIGINT | Foreign key to tours table |
| user_id | BIGINT | User ID (reference to user-service) |
| booking_id | BIGINT | Optional booking reference |
| rating | DECIMAL(2,1) | Star rating (1.0 to 5.0) |
| title | VARCHAR(200) | Review title/summary |
| comment | TEXT | Detailed review comment |
| badges | TEXT[] | Array of badge strings |
| guest_name | VARCHAR(255) | Cached user full name |
| guest_avatar | VARCHAR(500) | Cached user avatar URL |
| status | VARCHAR(20) | PENDING/APPROVED/REJECTED |
| created_at | TIMESTAMP | Review creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

---

## Backend API

### 1. ReviewController
Location: `tour-service/src/main/java/com/example/tour/controller/ReviewController.java`

#### Public Endpoints

**Get All Approved Reviews**
```http
GET /api/reviews/approved?minRating=4.0
```
Response:
```json
[
  {
    "reviewId": 1,
    "tourId": 10,
    "userId": 5,
    "rating": 4.5,
    "title": "Amazing experience!",
    "comment": "The tour was fantastic...",
    "badges": ["Luxury", "Family"],
    "guestName": "John Doe",
    "guestAvatar": "https://...",
    "status": "APPROVED",
    "createdAt": "2025-11-14T10:00:00"
  }
]
```

**Get Approved Reviews by Tour**
```http
GET /api/reviews/approved/tour/10?minRating=3.0
```

**Get Review Summary**
```http
GET /api/reviews/summary/10
```
Response:
```json
{
  "totalReviews": 42,
  "averageRating": 4.5,
  "distribution": {
    "1": 2,
    "2": 3,
    "3": 8,
    "4": 15,
    "5": 14
  }
}
```

#### Authenticated User Endpoints

**Create Review**
```http
POST /api/reviews/tour/10
Headers: X-User-Id: 5
Content-Type: application/json

{
  "rating": 4.5,
  "title": "Great tour!",
  "comment": "I really enjoyed this tour...",
  "badges": ["Family", "Adventure"],
  "bookingId": 123
}
```

**Get My Reviews**
```http
GET /api/reviews/my-reviews
Headers: X-User-Id: 5
```

**Update Review**
```http
PUT /api/reviews/1
Headers: X-User-Id: 5
Content-Type: application/json

{
  "rating": 5.0,
  "title": "Updated: Excellent tour!",
  "comment": "After reflection, this was even better...",
  "badges": ["Luxury"]
}
```

**Delete Review**
```http
DELETE /api/reviews/1
Headers: X-User-Id: 5
```

#### Admin Endpoints

**Get All Reviews (with filters)**
```http
GET /api/reviews/admin?status=PENDING&tourId=10&minRating=3.0
```

**Update Review Status**
```http
PATCH /api/reviews/admin/1/status
Content-Type: application/json

{
  "status": "APPROVED"
}
```

**Delete Any Review**
```http
DELETE /api/reviews/admin/1
```

### 2. ReviewService Implementation
Location: `tour-service/src/main/java/com/example/tour/service/impl/ReviewServiceImpl.java`

Key methods:
- `createReview()` - Creates review with user info from user-service
- `updateReview()` - Updates review (resets to PENDING)
- `deleteReview()` - Deletes user's own review
- `getApprovedReviewsByTourId()` - Fetches approved reviews
- `getReviewSummary()` - Calculates statistics
- `updateReviewStatus()` - Admin approval/rejection
- `getAllReviews()` - Admin view with filters

### 3. DTOs
Location: `tour-service/src/main/java/com/example/tour/dto/`

**CreateReviewRequest.java**
```java
public class CreateReviewRequest {
    private BigDecimal rating;
    private String title;
    private String comment;
    private List<String> badges;
    private Long bookingId;
}
```

**UpdateReviewRequest.java**
```java
public class UpdateReviewRequest {
    private BigDecimal rating;
    private String title;
    private String comment;
    private List<String> badges;
}
```

**ReviewResponse.java**
```java
public class ReviewResponse {
    private Long reviewId;
    private Long tourId;
    private Long userId;
    private Long bookingId;
    private BigDecimal rating;
    private String title;
    private String comment;
    private List<String> badges;
    private String guestName;
    private String guestAvatar;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

---

## Frontend Integration

### Client Frontend (User-facing)

#### 1. Tour Detail Page
Location: `frontend/src/pages/TourDetail.jsx`

Features:
- Displays approved reviews for the tour
- Shows rating summary (average, distribution)
- "Write Review" button for authenticated users
- Review form modal

Key Code:
```javascript
// Fetch reviews when tour loads
useEffect(() => {
  const fetchReviews = async () => {
    const data = await reviewsAPI.getByTourId(tour.tourId);
    setReviews(transformReviews(data));
  };
  fetchReviews();
}, [tour?.tourId]);

// Submit review
const handleSubmitReview = async (reviewData) => {
  await reviewsAPI.create(tour.tourId, reviewData, token);
  setShowReviewForm(false);
  setSubmitSuccess(true);
};
```

#### 2. Reviews Page
Location: `frontend/src/pages/Reviews.jsx`

Features:
- Browse all approved reviews across all tours
- Filter by tour, rating, badges
- Sort by newest, oldest, rating
- Review statistics summary

#### 3. My Reviews Page
Location: `frontend/src/pages/MyReviews.jsx`

Features:
- View user's own reviews (all statuses)
- Edit reviews (inline modal)
- Delete reviews (with confirmation)
- Status badges (PENDING, APPROVED, REJECTED)

#### 4. Review Form Component
Location: `frontend/src/components/reviews/ReviewForm.jsx`

Features:
- Star rating selector (1-5)
- Title input (10-200 chars)
- Comment textarea (20+ chars)
- Badge selection (multi-select)
- Validation with error messages

### Admin Frontend

#### 1. Reviews Management Page
Location: `frontend-admin/src/pages/Reviews/ReviewList.jsx`

Features:
- Table view of all reviews
- Filters: status, minRating
- Actions: Approve, Reject, Delete
- Review detail modal
- Toast notifications for all actions

Key Code:
```javascript
const handleApprove = async (reviewId) => {
  if (confirm('Approve this review?')) {
    await api.reviews.updateStatus(reviewId, 'APPROVED');
    fetchReviews();
    showToast('Review approved successfully');
  }
};
```

#### 2. Dashboard Integration
Location: `frontend-admin/src/pages/Dashboard.jsx`

Features:
- Review statistics card
- Shows total reviews and pending count
- Fetches data from `reviewsAPI.getOverallStats()`

---

## Inter-Service Communication

### UserServiceClient
Location: `tour-service/src/main/java/com/example/tour/client/UserServiceClient.java`

Purpose: Fetch user information from user-service to populate review guest data

**Configuration**:
```java
@Configuration
public class RestTemplateConfig {
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

**Client Usage**:
```java
@Component
public class UserServiceClient {
    @Autowired
    private RestTemplate restTemplate;

    public UserDTO getUserById(Long userId) {
        String url = "http://user-service/users/" + userId;
        return restTemplate.getForObject(url, UserDTO.class);
    }
}
```

**Integration in ReviewService**:
```java
// In createReview()
UserDTO userInfo = userServiceClient.getUserById(userId);
if (userInfo != null) {
    review.setGuestName(userInfo.getFullName() != null ?
        userInfo.getFullName() : userInfo.getUsername());
    review.setGuestAvatar(userInfo.getAvatar());
} else {
    // Fallback if user-service unavailable
    review.setGuestName("User " + userId);
    review.setGuestAvatar(null);
}
```

**Error Handling**:
- If user-service is down, falls back to placeholder
- Logs errors but doesn't fail review creation
- Guest info is cached, so subsequent calls aren't needed

---

## Usage Examples

### User Workflow

1. **Browse Tours**
   - User navigates to `/tours/:id`
   - Sees approved reviews and rating summary

2. **Submit Review**
   - Clicks "Write a Review" button (must be logged in)
   - Fills out form with rating, title, comment, badges
   - Submits → Status: PENDING
   - Sees success message

3. **Manage Reviews**
   - Navigates to `/my-reviews`
   - Sees all their reviews with status badges
   - Can edit (opens modal) or delete reviews
   - Editing resets status to PENDING

### Admin Workflow

1. **Review Moderation**
   - Admin navigates to `/reviews`
   - Sees table of all reviews
   - Filters by status (PENDING)
   - Clicks on review to see details

2. **Approve/Reject**
   - Clicks "Approve" or "Reject" button
   - Confirms action
   - Status updated in database
   - Toast notification shown

3. **Monitor Statistics**
   - Views dashboard at `/`
   - Sees review stats card (total, pending, avg rating)

---

## Testing

### Manual Testing Checklist

**Backend API**:
- [ ] Create review with valid data
- [ ] Create review with invalid rating (< 1 or > 5)
- [ ] Update review as owner
- [ ] Try to update someone else's review (should fail)
- [ ] Delete review as owner
- [ ] Admin approve/reject review
- [ ] Filter reviews by status, tour, rating
- [ ] Check review summary calculations

**Frontend Client**:
- [ ] View reviews on tour detail page
- [ ] Submit new review (logged in)
- [ ] See login prompt when not authenticated
- [ ] Edit review from My Reviews page
- [ ] Delete review with confirmation
- [ ] Filter reviews by various criteria
- [ ] Check responsive design on mobile

**Frontend Admin**:
- [ ] View all reviews in table
- [ ] Filter by status (PENDING, APPROVED, REJECTED)
- [ ] Approve a pending review
- [ ] Reject a pending review
- [ ] Delete a review
- [ ] View review details in modal
- [ ] Check dashboard review stats

**Integration**:
- [ ] Verify user info is fetched from user-service
- [ ] Test fallback when user-service is down
- [ ] Verify review status workflow (PENDING → APPROVED/REJECTED)
- [ ] Test update resets status to PENDING

### API Testing Examples

**Using curl**:
```bash
# Get approved reviews
curl http://localhost:8080/api/reviews/approved

# Get reviews for a tour
curl http://localhost:8080/api/reviews/approved/tour/1

# Create review
curl -X POST http://localhost:8080/api/reviews/tour/1 \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 5" \
  -d '{
    "rating": 4.5,
    "title": "Great tour!",
    "comment": "Amazing experience with wonderful guides",
    "badges": ["Family", "Adventure"]
  }'

# Admin approve review
curl -X PATCH http://localhost:8080/api/reviews/admin/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED"}'
```

---

## Future Enhancements

### Planned Features
1. **Review Analytics Dashboard**
   - Trend charts (reviews over time)
   - Sentiment analysis
   - Top reviewers leaderboard

2. **Enhanced User Interaction**
   - Helpful/Not Helpful voting
   - Comment replies from tour operators
   - Review verification badges (verified booking)

3. **Media Support**
   - Image uploads in reviews
   - Video testimonials
   - Gallery integration

4. **Notifications**
   - Email when review status changes
   - Push notifications for new reviews (admin)
   - Review reminders after tour completion

5. **Advanced Moderation**
   - Automated spam detection
   - Profanity filter
   - Review flagging by users
   - Bulk moderation actions

6. **SEO & Marketing**
   - Schema.org markup for reviews
   - Featured reviews on homepage
   - Social media sharing
   - Review widgets for embedding

7. **Performance**
   - Review caching with Redis
   - Pagination for large review lists
   - Lazy loading of images
   - CDN integration

---

## Troubleshooting

### Common Issues

**Reviews not showing on tour page**
- Check if reviews are APPROVED status
- Verify tour_id matches
- Check API Gateway routing for `/api/reviews/*`

**User info not populating**
- Ensure user-service is running and registered with Eureka
- Check RestTemplate @LoadBalanced configuration
- Verify UserServiceClient logs for errors
- Check fallback is working (should show "User {id}")

**Review creation fails**
- Verify X-User-Id header is present
- Check rating is between 1.0 and 5.0
- Ensure tour exists
- Check for duplicate review (user can only review tour once)

**Admin actions not working**
- Verify admin frontend API base URL
- Check CORS configuration in API Gateway
- Ensure reviewsAPI functions are correct
- Check browser console for errors

---

## Configuration Files

### API Gateway Routes
File: `api-gateway/src/main/resources/application.yml`

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: reviews-service
          uri: lb://tour-service
          predicates:
            - Path=/api/reviews/**
          filters:
            - StripPrefix=1
```

### Tour Service Dependencies
File: `tour-service/pom.xml`

Required dependencies:
- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-cloud-starter-netflix-eureka-client`
- `postgresql`

No additional dependencies needed for review system (uses existing stack).

---

## Code References

### Backend Files
- `tour-service/src/main/java/com/example/tour/controller/ReviewController.java` - API endpoints
- `tour-service/src/main/java/com/example/tour/service/ReviewService.java` - Service interface
- `tour-service/src/main/java/com/example/tour/service/impl/ReviewServiceImpl.java` - Service implementation
- `tour-service/src/main/java/com/example/tour/repository/TourReviewRepository.java` - Data access
- `tour-service/src/main/java/com/example/tour/client/UserServiceClient.java` - User service integration
- `tour-service/src/main/java/com/example/tour/config/RestTemplateConfig.java` - RestTemplate config
- `tour-service/src/main/resources/db/migration/V5__create_tour_reviews.sql` - Database migration

### Frontend Client Files
- `frontend/src/pages/TourDetail.jsx` - Tour detail with reviews
- `frontend/src/pages/Reviews.jsx` - Browse all reviews
- `frontend/src/pages/MyReviews.jsx` - User review management
- `frontend/src/components/reviews/ReviewForm.jsx` - Review submission form
- `frontend/src/components/reviews/ReviewList.jsx` - Review display
- `frontend/src/components/reviews/ReviewCard.jsx` - Individual review
- `frontend/src/components/reviews/ReviewFilters.jsx` - Filter controls
- `frontend/src/components/reviews/ReviewSummary.jsx` - Statistics display
- `frontend/src/services/api.js` - API client (reviewsAPI)

### Frontend Admin Files
- `frontend-admin/src/pages/Reviews/ReviewList.jsx` - Review moderation
- `frontend-admin/src/pages/Dashboard.jsx` - Dashboard with review stats
- `frontend-admin/src/services/api.js` - Admin API client
- `frontend-admin/src/layouts/AdminLayout.jsx` - Navigation

---

## Summary

The Review & Rating System is a comprehensive feature that:
- ✅ Allows users to share their tour experiences
- ✅ Provides social proof for potential customers
- ✅ Gives administrators control over content quality
- ✅ Integrates seamlessly with existing microservices architecture
- ✅ Follows best practices for error handling and resilience
- ✅ Provides rich filtering and statistics

**Status**: ✅ **FULLY IMPLEMENTED** and ready for production use.

For questions or issues, refer to the code references above or contact the development team.

---

*Last Updated: November 2025*
*Version: 1.0.0*
