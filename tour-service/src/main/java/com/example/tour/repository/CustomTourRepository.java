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


    List<CustomTour> findByUserId(Long userId);


    @Query("SELECT c FROM CustomTour c WHERE c.userId = :userId ORDER BY c.createdAt DESC")
    List<CustomTour> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);


    List<CustomTour> findByStatus(CustomTour.CustomTourStatus status);


    Page<CustomTour> findByStatus(CustomTour.CustomTourStatus status, Pageable pageable);


    @Query("SELECT c FROM CustomTour c ORDER BY c.createdAt DESC")
    Page<CustomTour> findAllOrderByCreatedAtDesc(Pageable pageable);


    @Query("SELECT c FROM CustomTour c WHERE c.status = :status ORDER BY c.createdAt DESC")
    Page<CustomTour> findByStatusOrderByCreatedAtDesc(
        @Param("status") CustomTour.CustomTourStatus status,
        Pageable pageable);


    long countByStatus(CustomTour.CustomTourStatus status);


    long countByUserId(Long userId);


    @Query("""
        SELECT c FROM CustomTour c
        WHERE
        (:status IS NULL OR c.status = :status)
        AND (:userId IS NULL OR c.userId = :userId)
        AND (
            :keyword IS NULL OR :keyword = ''
            OR LOWER(c.tourName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        ORDER BY c.createdAt DESC
        """)
    Page<CustomTour> findByFilters(
        @Param("status") CustomTour.CustomTourStatus status,
        @Param("userId") Long userId,
        @Param("keyword") String keyword,
        Pageable pageable);
}
