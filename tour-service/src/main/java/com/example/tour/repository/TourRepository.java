package com.example.tour.repository;

import com.example.tour.model.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

    // Filter by region
    Page<Tour> findByRegionId(Integer regionId, Pageable pageable);

    // Filter by province
    Page<Tour> findByProvinceId(Integer provinceId, Pageable pageable);

    // Filter by status
    Page<Tour> findByStatus(Tour.TourStatus status, Pageable pageable);

    
    // Search bằng keyword trong tourName hoặc description
    @Query("SELECT t FROM Tour t WHERE LOWER(t.tourName) LIKE CONCAT('%', LOWER(:keyword), '%') " +
           "OR LOWER(t.description) LIKE CONCAT('%', LOWER(:keyword), '%')")
    Page<Tour> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);


    // filter đa điều kiện dành cho catalog và search
       @Query("""
       SELECT DISTINCT t FROM Tour t
       WHERE
       (:regionId IS NULL OR t.regionId = :regionId)
       AND (:provinceId IS NULL OR t.provinceId = :provinceId)
       AND (
              :status IS NULL 
              OR t.status = :status
       )
       AND (
              :keyword IS NULL OR :keyword = ''
              OR LOWER(t.tourName) LIKE LOWER(CONCAT('%', :keyword, '%'))
              OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
       )
       ORDER BY t.createdAt DESC
       """)
       Page<Tour> findByFilters(
              @Param("regionId") Integer regionId,
              @Param("provinceId") Integer provinceId,
              @Param("status") Tour.TourStatus status,
              @Param("keyword") String keyword,
              Pageable pageable);

}

