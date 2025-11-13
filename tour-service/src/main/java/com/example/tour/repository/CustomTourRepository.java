package com.example.tour.repository;

import com.example.tour.model.CustomTour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomTourRepository extends JpaRepository<CustomTour, Long> {

    /**
     * Find all custom tours by user ID
     */
    List<CustomTour> findByUserId(Long userId);

    /**
     * Find all custom tours by user ID, ordered by creation date descending
     */
    @Query("SELECT c FROM CustomTour c WHERE c.userId = :userId ORDER BY c.createdAt DESC")
    List<CustomTour> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    /**
     * Find custom tours by status
     */
    List<CustomTour> findByStatus(CustomTour.CustomTourStatus status);

    /**
     * Find custom tours by status with pagination
     */
    Page<CustomTour> findByStatus(CustomTour.CustomTourStatus status, Pageable pageable);

    /**
     * Find all custom tours ordered by creation date descending
     */
    @Query("SELECT c FROM CustomTour c ORDER BY c.createdAt DESC")
    Page<CustomTour> findAllOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Find custom tours by status ordered by creation date descending
     */
    @Query("SELECT c FROM CustomTour c WHERE c.status = :status ORDER BY c.createdAt DESC")
    Page<CustomTour> findByStatusOrderByCreatedAtDesc(
        @Param("status") CustomTour.CustomTourStatus status,
        Pageable pageable);

    /**
     * Count custom tours by status
     */
    long countByStatus(CustomTour.CustomTourStatus status);

    /**
     * Count custom tours by user ID
     */
    long countByUserId(Long userId);

    /**
     * Find custom tours by multiple filters
     */
    @Query("""
        SELECT c FROM CustomTour c
        WHERE
        (:status IS NULL OR c.status = :status)
        AND (:userId IS NULL OR c.userId = :userId)
        AND (
            :keyword IS NULL OR :keyword = ''
            OR LOWER(c.destination) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(c.specialRequest) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        ORDER BY c.createdAt DESC
        """)
    Page<CustomTour> findByFilters(
        @Param("status") CustomTour.CustomTourStatus status,
        @Param("userId") Long userId,
        @Param("keyword") String keyword,
        Pageable pageable);
}
