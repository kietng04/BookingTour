package com.example.tour.service.impl;

import com.example.tour.client.UserServiceClient;
import com.example.tour.dto.*;
import com.example.tour.model.Tour;
import com.example.tour.model.TourReview;
import com.example.tour.repository.TourRepository;
import com.example.tour.repository.TourReviewRepository;
import com.example.tour.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private TourReviewRepository reviewRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    @Override
    @Transactional
    public ReviewResponse createReview(Long tourId, Long userId, CreateReviewRequest request) {

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found with ID: " + tourId));


        boolean alreadyReviewed = reviewRepository.existsByTourIdAndUserIdAndStatusNot(tourId, userId, "REJECTED");
        if (alreadyReviewed) {
            throw new RuntimeException("You have already reviewed this tour");
        }


        if (request.getRating() == null || request.getRating().compareTo(BigDecimal.ONE) < 0 ||
                request.getRating().compareTo(BigDecimal.valueOf(5)) > 0) {
            throw new RuntimeException("Rating must be between 1.0 and 5.0");
        }


        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Title is required");
        }
        if (request.getTitle().trim().length() < 10) {
            throw new RuntimeException("Title must be at least 10 characters");
        }
        if (request.getTitle().trim().length() > 200) {
            throw new RuntimeException("Title must not exceed 200 characters");
        }


        if (request.getComment() == null || request.getComment().trim().isEmpty()) {
            throw new RuntimeException("Comment is required");
        }
        if (request.getComment().trim().length() < 20) {
            throw new RuntimeException("Comment must be at least 20 characters");
        }


        TourReview review = new TourReview();
        review.setTour(tour);
        review.setUserId(userId);
        review.setBookingId(request.getBookingId());
        review.setRating(request.getRating().setScale(1, RoundingMode.HALF_UP));
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());
        review.setBadges(request.getBadges());
        review.setStatus("PENDING");


        UserDTO userInfo = userServiceClient.getUserById(userId);
        if (userInfo != null) {
            review.setGuestName(userInfo.getFullName() != null ? userInfo.getFullName() : userInfo.getUsername());
            review.setGuestAvatar(userInfo.getAvatar());
        } else {

            review.setGuestName("User " + userId);
            review.setGuestAvatar(null);
        }

        TourReview saved = reviewRepository.save(review);
        return new ReviewResponse(saved);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Long reviewId, Long userId, UpdateReviewRequest request) {
        TourReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));


        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("You can only update your own reviews");
        }


        if (request.getRating() != null) {
            if (request.getRating().compareTo(BigDecimal.ONE) < 0 ||
                    request.getRating().compareTo(BigDecimal.valueOf(5)) > 0) {
                throw new RuntimeException("Rating must be between 1.0 and 5.0");
            }
            review.setRating(request.getRating().setScale(1, RoundingMode.HALF_UP));
        }
        if (request.getTitle() != null) {

            if (request.getTitle().trim().length() < 10) {
                throw new RuntimeException("Title must be at least 10 characters");
            }
            if (request.getTitle().trim().length() > 200) {
                throw new RuntimeException("Title must not exceed 200 characters");
            }
            review.setTitle(request.getTitle());
        }
        if (request.getComment() != null) {

            if (request.getComment().trim().length() < 20) {
                throw new RuntimeException("Comment must be at least 20 characters");
            }
            review.setComment(request.getComment());
        }
        if (request.getBadges() != null) {
            review.setBadges(request.getBadges());
        }


        review.setStatus("PENDING");

        TourReview updated = reviewRepository.save(review);
        return new ReviewResponse(updated);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        TourReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));


        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    @Override
    public List<ReviewResponse> getApprovedReviewsByTourId(Long tourId, BigDecimal minRating) {
        List<TourReview> reviews = reviewRepository.findByTourIdWithFilters(tourId, "APPROVED", minRating);
        return reviews.stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewSummaryResponse getReviewSummary(Long tourId) {

        long totalReviews = reviewRepository.countByTourIdAndStatus(tourId, "APPROVED");


        BigDecimal avgRating = reviewRepository.getAverageRatingByTourId(tourId);
        if (avgRating == null) {
            avgRating = BigDecimal.ZERO;
        } else {
            avgRating = avgRating.setScale(1, RoundingMode.HALF_UP);
        }


        List<Object[]> distributionData = reviewRepository.getRatingDistribution(tourId);
        Map<Integer, Long> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, 0L);
        }
        for (Object[] row : distributionData) {
            Integer rating = ((Number) row[0]).intValue();
            Long count = ((Number) row[1]).longValue();
            distribution.put(rating, count);
        }

        return new ReviewSummaryResponse(totalReviews, avgRating, distribution);
    }

    @Override
    public List<ReviewResponse> getMyReviews(Long userId) {
        List<TourReview> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return reviews.stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getAllReviews(Long tourId, String status, BigDecimal minRating) {
        List<TourReview> reviews = reviewRepository.findAllWithFilters(tourId, status, minRating);
        return reviews.stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewResponse updateReviewStatus(Long reviewId, String status) {
        TourReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        if (!status.equals("APPROVED") && !status.equals("REJECTED") && !status.equals("PENDING")) {
            throw new RuntimeException("Invalid status. Must be APPROVED, REJECTED, or PENDING");
        }

        review.setStatus(status);
        TourReview updated = reviewRepository.save(review);
        return new ReviewResponse(updated);
    }

    @Override
    @Transactional
    public void deleteReviewAdmin(Long reviewId) {
        TourReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));
        reviewRepository.delete(review);
    }
}
