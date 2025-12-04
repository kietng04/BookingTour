package com.example.tour.service;

import com.example.tour.dto.*;
import com.example.tour.model.TourReview;

import java.math.BigDecimal;
import java.util.List;

public interface ReviewService {


    ReviewResponse createReview(Long tourId, Long userId, CreateReviewRequest request);


    ReviewResponse updateReview(Long reviewId, Long userId, UpdateReviewRequest request);


    void deleteReview(Long reviewId, Long userId);


    List<ReviewResponse> getApprovedReviewsByTourId(Long tourId, BigDecimal minRating);


    ReviewSummaryResponse getReviewSummary(Long tourId);


    List<ReviewResponse> getMyReviews(Long userId);


    List<ReviewResponse> getAllReviews(Long tourId, String status, BigDecimal minRating);


    ReviewResponse updateReviewStatus(Long reviewId, String status);


    void deleteReviewAdmin(Long reviewId);
}
