package com.example.tour.controller;

import com.example.tour.dto.*;
import com.example.tour.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    /**
     * Get all approved reviews (public endpoint for Reviews page)
     * GET /reviews/approved?minRating=4.0
     */
    @GetMapping("/approved")
    public ResponseEntity<List<ReviewResponse>> getAllApprovedReviews(
            @RequestParam(required = false) BigDecimal minRating) {
        List<ReviewResponse> reviews = reviewService.getAllReviews(null, "APPROVED", minRating);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get all approved reviews for a tour (public endpoint)
     * GET /tours/{tourId}/reviews?minRating=4.0
     */
    @GetMapping("/tours/{tourId}")
    public ResponseEntity<List<ReviewResponse>> getApprovedReviews(
            @PathVariable Long tourId,
            @RequestParam(required = false) BigDecimal minRating) {
        List<ReviewResponse> reviews = reviewService.getApprovedReviewsByTourId(tourId, minRating);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get review summary/statistics for a tour (public endpoint)
     * GET /reviews/tours/{tourId}/summary
     */
    @GetMapping("/tours/{tourId}/summary")
    public ResponseEntity<ReviewSummaryResponse> getReviewSummary(@PathVariable Long tourId) {
        ReviewSummaryResponse summary = reviewService.getReviewSummary(tourId);
        return ResponseEntity.ok(summary);
    }

    /**
     * Create a new review (authenticated endpoint)
     * POST /reviews/tours/{tourId}
     * Header: X-User-Id (for now, will use JWT in future)
     */
    @PostMapping("/tours/{tourId}")
    public ResponseEntity<?> createReview(
            @PathVariable Long tourId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody CreateReviewRequest request) {
        try {
            // TODO: Extract userId from JWT token instead of header
            if (userId == null) {
                return ResponseEntity.badRequest()
                        .body("{\"error\": \"User authentication required\"}");
            }

            ReviewResponse review = reviewService.createReview(tourId, userId, request);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Update own review (authenticated endpoint)
     * PUT /reviews/{reviewId}
     * Header: X-User-Id (for now, will use JWT in future)
     */
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody UpdateReviewRequest request) {
        try {
            if (userId == null) {
                return ResponseEntity.badRequest()
                        .body("{\"error\": \"User authentication required\"}");
            }

            ReviewResponse review = reviewService.updateReview(reviewId, userId, request);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Delete own review (authenticated endpoint)
     * DELETE /reviews/{reviewId}
     * Header: X-User-Id (for now, will use JWT in future)
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        try {
            if (userId == null) {
                return ResponseEntity.badRequest()
                        .body("{\"error\": \"User authentication required\"}");
            }

            reviewService.deleteReview(reviewId, userId);
            return ResponseEntity.ok().body("{\"message\": \"Review deleted successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Get current user's reviews (authenticated endpoint)
     * GET /reviews/my-reviews
     * Header: X-User-Id (for now, will use JWT in future)
     */
    @GetMapping("/my-reviews")
    public ResponseEntity<?> getMyReviews(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        try {
            if (userId == null) {
                return ResponseEntity.badRequest()
                        .body("{\"error\": \"User authentication required\"}");
            }

            List<ReviewResponse> reviews = reviewService.getMyReviews(userId);
            return ResponseEntity.ok(reviews);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Get all reviews with filters (admin endpoint)
     * GET /reviews/admin?tourId=1&status=PENDING&minRating=3.0
     */
    @GetMapping("/admin")
    public ResponseEntity<List<ReviewResponse>> getAllReviews(
            @RequestParam(required = false) Long tourId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal minRating) {
        List<ReviewResponse> reviews = reviewService.getAllReviews(tourId, status, minRating);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Update review status (admin endpoint)
     * PATCH /reviews/admin/{reviewId}/status
     */
    @PatchMapping("/admin/{reviewId}/status")
    public ResponseEntity<?> updateReviewStatus(
            @PathVariable Long reviewId,
            @RequestBody UpdateReviewStatusRequest request) {
        try {
            ReviewResponse review = reviewService.updateReviewStatus(reviewId, request.getStatus());
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Delete any review (admin endpoint)
     * DELETE /reviews/admin/{reviewId}
     */
    @DeleteMapping("/admin/{reviewId}")
    public ResponseEntity<?> deleteReviewAdmin(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReviewAdmin(reviewId);
            return ResponseEntity.ok().body("{\"message\": \"Review deleted successfully\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
