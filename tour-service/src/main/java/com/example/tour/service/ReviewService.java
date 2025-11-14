package com.example.tour.service;

import com.example.tour.dto.*;
import com.example.tour.model.TourReview;

import java.math.BigDecimal;
import java.util.List;

public interface ReviewService {

    /**
     * Create a new review for a tour
     * @param tourId - Tour ID
     * @param userId - User ID (from JWT)
     * @param request - Review data
     * @return Created review
     */
    ReviewResponse createReview(Long tourId, Long userId, CreateReviewRequest request);

    /**
     * Update an existing review (user can only update their own reviews)
     * @param reviewId - Review ID
     * @param userId - User ID (from JWT)
     * @param request - Updated review data
     * @return Updated review
     */
    ReviewResponse updateReview(Long reviewId, Long userId, UpdateReviewRequest request);

    /**
     * Delete a review (user can only delete their own reviews)
     * @param reviewId - Review ID
     * @param userId - User ID (from JWT)
     */
    void deleteReview(Long reviewId, Long userId);

    /**
     * Get all approved reviews for a tour (public)
     * @param tourId - Tour ID
     * @param minRating - Optional minimum rating filter
     * @return List of approved reviews
     */
    List<ReviewResponse> getApprovedReviewsByTourId(Long tourId, BigDecimal minRating);

    /**
     * Get review summary/statistics for a tour (public)
     * @param tourId - Tour ID
     * @return Review summary (avg rating, distribution, total)
     */
    ReviewSummaryResponse getReviewSummary(Long tourId);

    /**
     * Get current user's reviews
     * @param userId - User ID (from JWT)
     * @return List of user's reviews
     */
    List<ReviewResponse> getMyReviews(Long userId);

    /**
     * Get all reviews with filters (admin only)
     * @param tourId - Optional tour ID filter
     * @param status - Optional status filter (PENDING, APPROVED, REJECTED)
     * @param minRating - Optional minimum rating filter
     * @return List of reviews
     */
    List<ReviewResponse> getAllReviews(Long tourId, String status, BigDecimal minRating);

    /**
     * Update review status (admin only)
     * @param reviewId - Review ID
     * @param status - New status (APPROVED, REJECTED)
     * @return Updated review
     */
    ReviewResponse updateReviewStatus(Long reviewId, String status);

    /**
     * Delete any review (admin only)
     * @param reviewId - Review ID
     */
    void deleteReviewAdmin(Long reviewId);
}
