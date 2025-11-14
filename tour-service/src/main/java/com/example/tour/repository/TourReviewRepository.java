package com.example.tour.repository;

import com.example.tour.model.TourReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface TourReviewRepository extends JpaRepository<TourReview, Long> {

    // Find reviews by tour ID and status
    List<TourReview> findByTourIdAndStatus(Long tourId, String status);

    // Find all reviews by tour ID
    List<TourReview> findByTourIdOrderByCreatedAtDesc(Long tourId);

    // Find reviews by user ID
    List<TourReview> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Find by status
    List<TourReview> findByStatusOrderByCreatedAtDesc(String status);

    // Find by user and tour (to prevent duplicates)
    Optional<TourReview> findByTourIdAndUserId(Long tourId, Long userId);

    // Check if user already reviewed a tour
    boolean existsByTourIdAndUserIdAndStatusNot(Long tourId, Long userId, String status);

    // Get average rating for a tour (only approved reviews)
    @Query("SELECT AVG(r.rating) FROM TourReview r WHERE r.tour.id = :tourId AND r.status = 'APPROVED'")
    BigDecimal getAverageRatingByTourId(@Param("tourId") Long tourId);

    // Count reviews by status for a tour
    long countByTourIdAndStatus(Long tourId, String status);

    // Get rating distribution for a tour
    @Query("SELECT FLOOR(r.rating) as rating, COUNT(r) as count " +
           "FROM TourReview r " +
           "WHERE r.tour.id = :tourId AND r.status = 'APPROVED' " +
           "GROUP BY FLOOR(r.rating)")
    List<Object[]> getRatingDistribution(@Param("tourId") Long tourId);

    // Find reviews by tour ID with filters
    @Query("SELECT r FROM TourReview r " +
           "WHERE r.tour.id = :tourId " +
           "AND (:status IS NULL OR r.status = :status) " +
           "AND (:minRating IS NULL OR r.rating >= :minRating) " +
           "ORDER BY r.createdAt DESC")
    List<TourReview> findByTourIdWithFilters(
            @Param("tourId") Long tourId,
            @Param("status") String status,
            @Param("minRating") BigDecimal minRating
    );

    // Find all reviews with filters (for admin)
    @Query("SELECT r FROM TourReview r " +
           "WHERE (:tourId IS NULL OR r.tour.id = :tourId) " +
           "AND (:status IS NULL OR r.status = :status) " +
           "AND (:minRating IS NULL OR r.rating >= :minRating) " +
           "ORDER BY r.createdAt DESC")
    List<TourReview> findAllWithFilters(
            @Param("tourId") Long tourId,
            @Param("status") String status,
            @Param("minRating") BigDecimal minRating
    );
}
