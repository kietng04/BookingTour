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


    List<TourReview> findByTourIdAndStatus(Long tourId, String status);


    List<TourReview> findByTourIdOrderByCreatedAtDesc(Long tourId);


    List<TourReview> findByUserIdOrderByCreatedAtDesc(Long userId);


    List<TourReview> findByStatusOrderByCreatedAtDesc(String status);


    Optional<TourReview> findByTourIdAndUserId(Long tourId, Long userId);


    boolean existsByTourIdAndUserIdAndStatusNot(Long tourId, Long userId, String status);


    @Query("SELECT AVG(r.rating) FROM TourReview r WHERE r.tour.id = :tourId AND r.status = 'APPROVED'")
    BigDecimal getAverageRatingByTourId(@Param("tourId") Long tourId);


    long countByTourIdAndStatus(Long tourId, String status);


    @Query("SELECT FLOOR(r.rating) as rating, COUNT(r) as count " +
           "FROM TourReview r " +
           "WHERE r.tour.id = :tourId AND r.status = 'APPROVED' " +
           "GROUP BY FLOOR(r.rating)")
    List<Object[]> getRatingDistribution(@Param("tourId") Long tourId);


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
