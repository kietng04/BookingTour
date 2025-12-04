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


    @GetMapping("/approved")
    public ResponseEntity<List<ReviewResponse>> getAllApprovedReviews(
            @RequestParam(required = false) BigDecimal minRating) {
        List<ReviewResponse> reviews = reviewService.getAllReviews(null, "APPROVED", minRating);
        return ResponseEntity.ok(reviews);
    }


    @GetMapping("/tours/{tourId}")
    public ResponseEntity<List<ReviewResponse>> getApprovedReviews(
            @PathVariable Long tourId,
            @RequestParam(required = false) BigDecimal minRating) {
        List<ReviewResponse> reviews = reviewService.getApprovedReviewsByTourId(tourId, minRating);
        return ResponseEntity.ok(reviews);
    }


    @GetMapping("/tours/{tourId}/summary")
    public ResponseEntity<ReviewSummaryResponse> getReviewSummary(@PathVariable Long tourId) {
        ReviewSummaryResponse summary = reviewService.getReviewSummary(tourId);
        return ResponseEntity.ok(summary);
    }


    @PostMapping("/tours/{tourId}")
    public ResponseEntity<?> createReview(
            @PathVariable Long tourId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody CreateReviewRequest request) {
        try {

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


    @GetMapping("/admin")
    public ResponseEntity<List<ReviewResponse>> getAllReviews(
            @RequestParam(required = false) Long tourId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal minRating) {
        List<ReviewResponse> reviews = reviewService.getAllReviews(tourId, status, minRating);
        return ResponseEntity.ok(reviews);
    }


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
