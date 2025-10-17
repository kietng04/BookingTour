package com.example.tour.repository;

import com.example.tour.model.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

    Page<Tour> findByRegionId(Integer regionId, Pageable pageable);

    Page<Tour> findByProvinceId(Integer provinceId, Pageable pageable);

    Page<Tour> findByStatus(Tour.TourStatus status, Pageable pageable);

    @Query("SELECT t FROM Tour t WHERE LOWER(t.tourName) LIKE CONCAT('%', LOWER(:keyword), '%') " +
           "OR LOWER(t.description) LIKE CONCAT('%', LOWER(:keyword), '%')")
    Page<Tour> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

       @Query("""
       SELECT t FROM Tour t
       WHERE (:regionId IS NULL OR t.regionId = :regionId)
       AND (:provinceId IS NULL OR t.provinceId = :provinceId)
       AND (:status IS NULL OR t.status = :status)
       AND (
              :keyword IS NULL
              OR LOWER(CAST(t.tourName AS text)) LIKE LOWER(CONCAT('%', :keyword, '%'))
              OR LOWER(CAST(t.description AS text)) LIKE LOWER(CONCAT('%', :keyword, '%'))
       )
       """)
       Page<Tour> findByFilters(
              @Param("regionId") Integer regionId,
              @Param("provinceId") Integer provinceId,
              @Param("status") Tour.TourStatus status,
              @Param("keyword") String keyword,
              Pageable pageable);
}

