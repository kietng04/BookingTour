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

    // Filter by region
    Page<Tour> findByRegionId(Integer regionId, Pageable pageable);

    // Filter by province
    Page<Tour> findByProvinceId(Integer provinceId, Pageable pageable);

    // Filter by status
    Page<Tour> findByStatus(Tour.TourStatus status, Pageable pageable);

    
    // Search by keyword in tourName or description (avoid LOWER on concatenated param to prevent Postgres lower(bytea))
    @Query("SELECT t FROM Tour t WHERE LOWER(t.tourName) LIKE CONCAT('%', LOWER(:keyword), '%') " +
           "OR LOWER(t.description) LIKE CONCAT('%', LOWER(:keyword), '%')")
    Page<Tour> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Complex filters
    // ktra ko có region, province sẽ tự động bỏ
    // ko truyền trạng thái thì sẽ lấy tất cả
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

